import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
  const loginDomain = Deno.env.get("SHOPPING_LOGIN_DOMAIN") || "family-shopping.invalid";
  const authorization = request.headers.get("Authorization") || "";
  const accessToken = authorization.replace(/^Bearer\s+/i, "");

  if (!supabaseUrl || !serviceRoleKey) return response(500, { error: "Brak konfiguracji funkcji Supabase." });
  if (!accessToken) return response(401, { error: "Brak aktywnej sesji." });

  const service = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data: callerData, error: callerError } = await service.auth.getUser(accessToken);
  if (callerError || !callerData.user) return response(401, { error: "Sesja wygasła. Zaloguj się ponownie." });

  const { data: callerProfile, error: profileError } = await service
    .from("profiles")
    .select("role")
    .eq("user_id", callerData.user.id)
    .maybeSingle();
  if (profileError) return response(500, { error: "Nie udało się sprawdzić uprawnień." });
  if (callerProfile?.role !== "dev") return response(403, { error: "Tylko dev może tworzyć użytkowników." });

  let body: { login?: string; displayName?: string; password?: string; listIds?: string[]; listRole?: string };
  try {
    body = await request.json();
  } catch {
    return response(400, { error: "Nieprawidłowe dane formularza." });
  }

  const login = String(body.login || "").trim().toLowerCase();
  const displayName = String(body.displayName || "").trim();
  const password = String(body.password || "");
  const listRole = String(body.listRole || "member");
  const listIds = [...new Set(Array.isArray(body.listIds) ? body.listIds.map(String) : [])];
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!/^[a-z0-9_-]{2,30}$/.test(login)) return response(400, { error: "Login może zawierać małe litery, cyfry, _ i -." });
  if (displayName.length < 2 || displayName.length > 60) return response(400, { error: "Nazwa musi mieć od 2 do 60 znaków." });
  if (password.length < 8 || password.length > 72) return response(400, { error: "Hasło startowe musi mieć od 8 do 72 znaków." });
  if (!["member", "admin"].includes(listRole)) return response(400, { error: "Nieprawidłowa rola na liście." });
  if (!listIds.length || listIds.length > 30 || listIds.some((id) => !uuidPattern.test(id))) {
    return response(400, { error: "Wybierz od 1 do 30 prawidłowych list." });
  }

  const { data: existingLists, error: listsError } = await service
    .from("shopping_lists")
    .select("id")
    .in("id", listIds);
  if (listsError || existingLists.length !== listIds.length) return response(400, { error: "Co najmniej jedna lista nie istnieje." });

  const email = `${login}@${loginDomain}`;
  const { data: created, error: createError } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName }
  });
  if (createError || !created.user) {
    const duplicate = /already|registered|exists/i.test(createError?.message || "");
    return response(duplicate ? 409 : 400, { error: duplicate ? "Taki login już istnieje." : "Nie udało się utworzyć konta." });
  }

  const userId = created.user.id;
  const { error: insertProfileError } = await service.from("profiles").insert({
    user_id: userId,
    username: login,
    display_name: displayName,
    role: "member",
    theme: "light"
  });
  const { error: insertMembersError } = insertProfileError
    ? { error: insertProfileError }
    : await service.from("members").insert(listIds.map((listId) => ({
      list_id: listId,
      user_id: userId,
      role: listRole
    })));

  if (insertProfileError || insertMembersError) {
    await service.auth.admin.deleteUser(userId);
    return response(500, { error: "Nie udało się przypisać użytkownika do list. Konto zostało wycofane." });
  }

  return response(201, { userId, login, displayName });
});
