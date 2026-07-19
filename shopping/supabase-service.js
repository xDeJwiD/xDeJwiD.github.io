(function () {
  const config = window.SHOPPING_SUPABASE;
  if (!config || !window.supabase?.createClient) {
    window.ShoppingDB = null;
    return;
  }

  const client = window.supabase.createClient(config.url, config.publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  });

  let productById = new Map();
  let storeById = new Map();
  let memberById = new Map();
  let categoryNameById = new Map();
  let categoryById = new Map();
  let activeListId = null;

  function assertNoError(result) {
    if (result.error) throw result.error;
    return result.data;
  }

  function requireActiveList() {
    if (!activeListId) throw new Error("Najpierw wybierz listę zakupów.");
    return activeListId;
  }

  function setActiveList(listId) {
    activeListId = listId || null;
    productById = new Map();
    storeById = new Map();
    memberById = new Map();
    categoryNameById = new Map();
    categoryById = new Map();
  }

  async function loadUserContext() {
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) throw userError || new Error("Brak sesji użytkownika.");
    const userId = userData.user.id;
    const [profileResult, initialListsResult, membershipsResult] = await Promise.all([
      client.from("profiles").select("user_id,username,display_name,theme,role").eq("user_id", userId).maybeSingle(),
      client.from("shopping_lists").select("id,name,position,created_at,updated_at").order("position").order("created_at"),
      client.from("members").select("list_id,role").eq("user_id", userId)
    ]);
    let listsResult = initialListsResult;
    if (listsResult.error?.code === "42703" || /updated_at/i.test(listsResult.error?.message || "")) {
      listsResult = await client.from("shopping_lists").select("id,name,position,created_at").order("position").order("created_at");
    }
    const profile = assertNoError(profileResult);
    const memberships = assertNoError(membershipsResult);
    const roleByListId = new Map(memberships.map((membership) => [membership.list_id, membership.role]));
    const lists = assertNoError(listsResult)
      .filter((list) => roleByListId.has(list.id))
      .map((list) => ({ ...list, role: roleByListId.get(list.id) || "member" }));
    return { profile, lists };
  }

  async function loadCatalog() {
    const listId = requireActiveList();
    const [storesResult, categoriesResult, productsResult, membershipsResult] = await Promise.all([
      client.from("stores").select("id,name,position,is_active").eq("list_id", listId).order("position"),
      client.from("categories").select("id,name,icon,position,is_active").eq("list_id", listId).order("position"),
      client.from("products").select("id,category_id,name,position,is_active").eq("list_id", listId).order("position"),
      client.from("members").select("user_id,role").eq("list_id", listId)
    ]);

    const stores = assertNoError(storesResult);
    const categories = assertNoError(categoriesResult);
    const products = assertNoError(productsResult);
    const memberships = assertNoError(membershipsResult);
    const memberIds = memberships.map((membership) => membership.user_id);
    const membersResult = memberIds.length
      ? await client.from("profiles").select("user_id,username,display_name,theme").in("user_id", memberIds)
      : { data: [], error: null };
    const memberRoles = new Map(memberships.map((member) => [member.user_id, member.role]));
    const members = assertNoError(membersResult).map((member) => ({
      ...member,
      role: memberRoles.get(member.user_id) || "member"
    }));

    storeById = new Map(stores.map((store) => [store.id, store]));
    productById = new Map(products.map((product) => [product.id, product]));
    memberById = new Map(members.map((member) => [member.user_id, member]));
    categoryNameById = new Map(categories.map((category) => [category.id, category.name]));
    categoryById = new Map(categories.map((category) => [category.id, category]));

    const activeStores = stores.filter((store) => store.is_active);
    const activeCategories = categories.filter((category) => category.is_active);
    const activeCategoryIds = new Set(activeCategories.map((category) => category.id));
    const activeProducts = products.filter((product) => product.is_active && activeCategoryIds.has(product.category_id));
    const productIdByKey = new Map();
    const catalog = activeCategories.map((category) => {
      const categoryProducts = products
        .filter((product) => product.is_active && product.category_id === category.id)
        .map((product) => {
          productIdByKey.set(`${category.name}|${product.name}`, product.id);
          return product.name;
        });
      return { id: category.id, name: category.name, icon: category.icon, products: categoryProducts };
    });

    return {
      catalog,
      stores: activeStores.map((store) => store.name),
      productIdByKey,
      storeIdByName: new Map(activeStores.map((store) => [store.name, store.id])),
      members,
      managementCatalog: {
        categories: activeCategories.map((category) => ({ ...category })),
        products: activeProducts.map((product) => ({ ...product })),
        stores: activeStores.map((store) => ({ ...store }))
      }
    };
  }

  async function loadItems() {
    const listId = requireActiveList();
    const rows = assertNoError(await client
      .from("shopping_items")
      .select("id,product_id,store_id,quantity,is_purchased,position,added_by,created_at")
      .eq("list_id", listId)
      .order("is_purchased")
      .order("position"));

    return rows.map((row) => {
      const product = productById.get(row.product_id);
      const store = storeById.get(row.store_id);
      const member = memberById.get(row.added_by);
      return {
        id: row.id,
        productId: row.product_id,
        storeId: row.store_id,
        name: product?.name || "Usunięty produkt",
        categoryId: product?.category_id || null,
        category: categoryNameById.get(product?.category_id) || "Inne",
        store: store?.name || "Nieznany sklep",
        quantity: row.quantity,
        done: row.is_purchased,
        position: row.position,
        addedBy: member?.display_name || member?.username || "Grupa"
      };
    });
  }

  async function loadInitialData() {
    const catalogData = await loadCatalog();
    const items = await loadItems();
    return { ...catalogData, items };
  }

  async function signIn(username, password) {
    const normalized = username.trim().toLowerCase();
    if (!/^[a-z0-9_-]{2,30}$/.test(normalized)) {
      throw new Error("Nieprawidłowy login.");
    }
    return assertNoError(await client.auth.signInWithPassword({
      email: `${normalized}@${config.loginDomain}`,
      password
    }));
  }

  async function getSession() {
    return assertNoError(await client.auth.getSession()).session;
  }

  async function refreshSession() {
    return assertNoError(await client.auth.refreshSession()).session;
  }

  async function signOut() {
    assertNoError(await client.auth.signOut());
  }

  async function changePassword(newPassword) {
    const session = await getSession();
    if (!session?.user?.email) throw new Error("Brak aktywnej sesji użytkownika.");

    assertNoError(await client.auth.updateUser({ password: newPassword }));

    // Zmiana hasła może unieważnić poprzednią sesję. Natychmiast tworzymy nową,
    // aby użytkownik pozostał zalogowany na tym urządzeniu.
    return assertNoError(await client.auth.signInWithPassword({
      email: session.user.email,
      password: newPassword
    })).session;
  }

  function decodePushKey(value) {
    const padding = "=".repeat((4 - value.length % 4) % 4);
    const base64 = (value + padding).replaceAll("-", "+").replaceAll("_", "/");
    return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
  }

  async function invokeNotificationFunction(body) {
    const { data, error } = await client.functions.invoke("shopping-notifications", { body });
    if (error) {
      let message = error.message || "Nie udało się obsłużyć powiadomień.";
      try {
        const details = await error.context?.json?.();
        if (details?.error) message = details.error;
      } catch { /* odpowiedź bez JSON */ }
      throw new Error(message);
    }
    if (data?.error) throw new Error(data.error);
    return data;
  }

  async function getPushSubscription() {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) return null;
    const registration = await navigator.serviceWorker.ready;
    if (!registration.pushManager) return null;
    return registration.pushManager.getSubscription();
  }

  async function enablePushNotifications() {
    if (!("serviceWorker" in navigator) || !("Notification" in window)) {
      throw new Error("To urządzenie lub przeglądarka nie obsługuje powiadomień aplikacji.");
    }
    const permission = await Notification.requestPermission();
    if (permission !== "granted") throw new Error("Nie udzielono zgody na powiadomienia.");
    const registration = await navigator.serviceWorker.ready;
    if (!registration.pushManager) {
      throw new Error("System nie udostępnił obsługi Web Push dla tej instalacji aplikacji.");
    }
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      const { publicKey } = await invokeNotificationFunction({ action: "public-key" });
      if (!publicKey) throw new Error("Brak konfiguracji powiadomień na serwerze.");
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: decodePushKey(publicKey)
      });
    }
    assertNoError(await client.rpc("save_push_subscription", { p_subscription: subscription.toJSON() }));
    return subscription;
  }

  async function sendListNotification(listId) {
    return invokeNotificationFunction({ action: "notify", listId });
  }

  async function addItem(item) {
    const listId = requireActiveList();
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) throw userError || new Error("Brak sesji użytkownika.");
    assertNoError(await client.from("shopping_items").insert({
      list_id: listId,
      product_id: item.productId,
      store_id: item.storeId,
      quantity: item.quantity,
      is_purchased: false,
      position: item.position,
      added_by: userData.user.id
    }));
  }

  async function updateItem(id, changes) {
    const listId = requireActiveList();
    const save = async () => assertNoError(await client.from("shopping_items").update(changes).eq("id", id).eq("list_id", listId));
    try {
      await save();
    } catch (firstError) {
      if (!navigator.onLine) throw firstError;
      await client.auth.refreshSession().catch(() => {});
      await new Promise((resolve) => setTimeout(resolve, 300));
      await save();
    }
  }

  async function deleteItem(id) {
    const listId = requireActiveList();
    const remove = async () => assertNoError(await client.from("shopping_items").delete().eq("id", id).eq("list_id", listId));
    try {
      await remove();
    } catch (firstError) {
      if (!navigator.onLine) throw firstError;
      await client.auth.refreshSession().catch(() => {});
      await new Promise((resolve) => setTimeout(resolve, 300));
      await remove();
    }
  }

  async function clearPurchased() {
    const listId = requireActiveList();
    assertNoError(await client.from("shopping_items").delete().eq("list_id", listId).eq("is_purchased", true));
  }

  async function addProduct(categoryId, name) {
    const listId = requireActiveList();
    const positions = [...productById.values()]
      .filter((product) => product.category_id === categoryId)
      .map((product) => product.position || 0);
    const position = (positions.length ? Math.max(...positions) : 0) + 10;
    assertNoError(await client.from("products").insert({
      list_id: listId,
      category_id: categoryId,
      name: name.trim(),
      position,
      is_active: true
    }));
  }

  async function addCategory(name, icon) {
    const listId = requireActiveList();
    const positions = [...categoryById.values()].map((category) => category.position || 0);
    const position = (positions.length ? Math.max(...positions) : 0) + 10;
    assertNoError(await client.from("categories").insert({
      list_id: listId,
      name: name.trim(),
      icon: icon.trim() || "🛒",
      position,
      is_active: true
    }));
  }

  async function addStore(name) {
    const listId = requireActiveList();
    const positions = [...storeById.values()].map((store) => store.position || 0);
    const position = (positions.length ? Math.max(...positions) : 0) + 10;
    assertNoError(await client.from("stores").insert({
      list_id: listId,
      name: name.trim(),
      position,
      is_active: true
    }));
  }

  async function updateTheme(theme) {
    if (!['light', 'dark'].includes(theme)) throw new Error("Nieprawidłowy motyw.");
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) throw userError || new Error("Brak sesji użytkownika.");
    assertNoError(await client
      .from("profiles")
      .update({ theme })
      .eq("user_id", userData.user.id));
  }

  async function loadManageableUsers() {
    return assertNoError(await client.rpc("get_manageable_users"));
  }

  async function createShoppingList(name, memberIds) {
    return assertNoError(await client.rpc("create_shopping_list", {
      p_name: name.trim(),
      p_member_ids: memberIds
    }));
  }

  async function renameShoppingList(listId, name) {
    assertNoError(await client.rpc("rename_shopping_list", {
      p_list_id: listId,
      p_name: name.trim()
    }));
  }

  async function createUser({ login, displayName, password, listIds, listRole }) {
    const { data, error } = await client.functions.invoke("create-shopping-user", {
      body: { login, displayName, password, listIds, listRole }
    });
    if (error) {
      let message = error.message || "Nie udało się utworzyć użytkownika.";
      try {
        const details = await error.context?.json?.();
        if (details?.error) message = details.error;
      } catch { /* odpowiedź bez JSON */ }
      throw new Error(message);
    }
    if (data?.error) throw new Error(data.error);
    return data;
  }

  async function saveAdminCatalog(managementCatalog) {
    const listId = requireActiveList();
    assertNoError(await client.rpc("save_catalog_admin_changes", {
      p_list_id: listId,
      p_categories: managementCatalog.categories.map((category) => ({
        id: category.id,
        name: category.name.trim(),
        icon: category.icon.trim() || "🛒",
        position: category.position,
        is_active: category.is_active
      })),
      p_products: managementCatalog.products.map((product) => ({
        id: product.id,
        name: product.name.trim(),
        position: product.position,
        is_active: product.is_active
      })),
      p_stores: managementCatalog.stores.map((store) => ({
        id: store.id,
        name: store.name.trim(),
        position: store.position,
        is_active: store.is_active
      }))
    }));
  }

  async function updateOrder(changes) {
    await Promise.all(changes.map((change) => updateItem(change.id, {
      store_id: change.storeId,
      position: change.position
    })));
  }

  function subscribe(onChange, onStatus) {
    const listId = requireActiveList();
    const filter = `list_id=eq.${listId}`;
    const itemsChannel = client
      .channel(`shopping-items-${listId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "shopping_items", filter }, onChange)
      .subscribe((status) => onStatus?.(status));

    const catalogChannel = client
      .channel(`shopping-catalog-${listId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "shopping_lists", filter: `id=eq.${listId}` }, onChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "stores", filter }, onChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "categories", filter }, onChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "products", filter }, onChange)
      .subscribe();

    return () => Promise.all([
      client.removeChannel(itemsChannel),
      client.removeChannel(catalogChannel)
    ]);
  }

  window.ShoppingDB = {
    client,
    signIn,
    signOut,
    changePassword,
    getPushSubscription,
    enablePushNotifications,
    sendListNotification,
    getSession,
    refreshSession,
    loadUserContext,
    setActiveList,
    loadInitialData,
    loadItems,
    addItem,
    updateItem,
    deleteItem,
    clearPurchased,
    addCategory,
    addProduct,
    addStore,
    updateTheme,
    loadManageableUsers,
    createShoppingList,
    renameShoppingList,
    createUser,
    saveAdminCatalog,
    updateOrder,
    subscribe
  };
})();
