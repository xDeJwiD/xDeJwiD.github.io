import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json"
};

function response(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return response(405, { error: "Niedozwolona metoda." });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
  const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");
  const vapidSubject = Deno.env.get("VAPID_SUBJECT") || "https://xdejwid.github.io";
  const authorization = request.headers.get("Authorization") || "";
  const accessToken = authorization.replace(/^Bearer\s+/i, "");

  if (!supabaseUrl || !serviceRoleKey) return response(500, { error: "Brak konfiguracji Supabase." });
  if (!vapidPublicKey || !vapidPrivateKey) return response(503, { error: "Powiadomienia nie zostały jeszcze skonfigurowane." });
  if (!accessToken) return response(401, { error: "Brak aktywnej sesji." });

  const service = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { data: callerData, error: callerError } = await service.auth.getUser(accessToken);
  if (callerError || !callerData.user) return response(401, { error: "Sesja wygasła. Zaloguj się ponownie." });

  let body: { action?: string; listId?: string };
  try {
    body = await request.json();
  } catch {
    return response(400, { error: "Nieprawidłowe dane żądania." });
  }

  if (body.action === "public-key") return response(200, { publicKey: vapidPublicKey });
  if (body.action !== "notify") return response(400, { error: "Nieprawidłowa operacja." });

  const listId = String(body.listId || "");
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(listId)) return response(400, { error: "Nieprawidłowa lista." });

  const callerId = callerData.user.id;
  const { data: membership, error: membershipError } = await service
    .from("members")
    .select("role")
    .eq("list_id", listId)
    .eq("user_id", callerId)
    .maybeSingle();
  if (membershipError) return response(500, { error: "Nie udało się sprawdzić dostępu do listy." });
  if (!membership) return response(403, { error: "Nie masz dostępu do tej listy." });

  const cooldownStart = new Date(Date.now() - 60_000).toISOString();
  const { data: recentNotification, error: cooldownError } = await service
    .from("push_notification_log")
    .select("sent_at")
    .eq("list_id", listId)
    .gte("sent_at", cooldownStart)
    .limit(1)
    .maybeSingle();
  if (cooldownError) return response(500, { error: "Nie udało się sprawdzić limitu powiadomień." });
  if (recentNotification) return response(429, { error: "Poczekaj minutę przed wysłaniem kolejnego powiadomienia." });

  const [listResult, profileResult, membersResult] = await Promise.all([
    service.from("shopping_lists").select("name").eq("id", listId).single(),
    service.from("profiles").select("display_name,username").eq("user_id", callerId).maybeSingle(),
    service.from("members").select("user_id").eq("list_id", listId).neq("user_id", callerId)
  ]);
  if (listResult.error || membersResult.error) return response(500, { error: "Nie udało się przygotować powiadomienia." });

  const recipientIds = (membersResult.data || []).map((member) => member.user_id);
  if (!recipientIds.length) return response(200, { sent: 0, failed: 0 });
  const { data: subscriptions, error: subscriptionsError } = await service
    .from("push_subscriptions")
    .select("id,endpoint,subscription")
    .in("user_id", recipientIds);
  if (subscriptionsError) return response(500, { error: "Nie udało się pobrać odbiorców." });
  if (!subscriptions?.length) return response(200, { sent: 0, failed: 0 });

  const { error: logError } = await service.from("push_notification_log").insert({ list_id: listId, sent_by: callerId });
  if (logError) return response(500, { error: "Nie udało się zapisać wysyłki powiadomienia." });
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
  const sender = profileResult.data?.display_name || profileResult.data?.username || "Ktoś";
  const payload = JSON.stringify({
    title: listResult.data.name,
    body: `${sender} wysyła przypomnienie o liście zakupów.`,
    tag: `shopping-list-${listId}`,
    url: `./?list=${listId}`
  });

  let sent = 0;
  let failed = 0;
  const staleSubscriptionIds: string[] = [];
  await Promise.all(subscriptions.map(async (entry) => {
    try {
      await webpush.sendNotification(entry.subscription, payload, { TTL: 300, urgency: "high" });
      sent += 1;
    } catch (error) {
      failed += 1;
      const statusCode = Number((error as { statusCode?: number }).statusCode || 0);
      if (statusCode === 404 || statusCode === 410) staleSubscriptionIds.push(entry.id);
    }
  }));

  if (staleSubscriptionIds.length) {
    await service.from("push_subscriptions").delete().in("id", staleSubscriptionIds);
  }
  return response(200, { sent, failed });
});
