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

  function assertNoError(result) {
    if (result.error) throw result.error;
    return result.data;
  }

  async function loadCatalog() {
    const [storesResult, categoriesResult, productsResult, membersResult] = await Promise.all([
      client.from("stores").select("id,name,position").eq("is_active", true).order("position"),
      client.from("categories").select("id,name,icon,position").eq("is_active", true).order("position"),
      client.from("products").select("id,category_id,name,position").eq("is_active", true).order("position"),
      client.from("family_members").select("user_id,username,display_name,theme")
    ]);

    const stores = assertNoError(storesResult);
    const categories = assertNoError(categoriesResult);
    const products = assertNoError(productsResult);
    const members = assertNoError(membersResult);

    storeById = new Map(stores.map((store) => [store.id, store]));
    productById = new Map(products.map((product) => [product.id, product]));
    memberById = new Map(members.map((member) => [member.user_id, member]));
    categoryNameById = new Map(categories.map((category) => [category.id, category.name]));
    categoryById = new Map(categories.map((category) => [category.id, category]));

    const productIdByKey = new Map();
    const catalog = categories.map((category) => {
      const categoryProducts = products
        .filter((product) => product.category_id === category.id)
        .map((product) => {
          productIdByKey.set(`${category.name}|${product.name}`, product.id);
          return product.name;
        });
      return { id: category.id, name: category.name, icon: category.icon, products: categoryProducts };
    });

    return {
      catalog,
      stores: stores.map((store) => store.name),
      productIdByKey,
      storeIdByName: new Map(stores.map((store) => [store.name, store.id])),
      members
    };
  }

  async function loadItems() {
    const rows = assertNoError(await client
      .from("shopping_items")
      .select("id,product_id,store_id,quantity,is_purchased,position,added_by,created_at")
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
        addedBy: member?.display_name || member?.username || "Rodzina"
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

  async function addItem(item) {
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) throw userError || new Error("Brak sesji użytkownika.");
    assertNoError(await client.from("shopping_items").insert({
      product_id: item.productId,
      store_id: item.storeId,
      quantity: item.quantity,
      is_purchased: false,
      position: item.position,
      added_by: userData.user.id
    }));
  }

  async function updateItem(id, changes) {
    const save = async () => assertNoError(await client.from("shopping_items").update(changes).eq("id", id));
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
    const remove = async () => assertNoError(await client.from("shopping_items").delete().eq("id", id));
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
    assertNoError(await client.from("shopping_items").delete().eq("is_purchased", true));
  }

  async function addProduct(categoryId, name) {
    const positions = [...productById.values()]
      .filter((product) => product.category_id === categoryId)
      .map((product) => product.position || 0);
    const position = (positions.length ? Math.max(...positions) : 0) + 10;
    assertNoError(await client.from("products").insert({
      category_id: categoryId,
      name: name.trim(),
      position,
      is_active: true
    }));
  }

  async function addCategory(name, icon) {
    const positions = [...categoryById.values()].map((category) => category.position || 0);
    const position = (positions.length ? Math.max(...positions) : 0) + 10;
    assertNoError(await client.from("categories").insert({
      name: name.trim(),
      icon: icon.trim() || "🛒",
      position,
      is_active: true
    }));
  }

  async function addStore(name) {
    const positions = [...storeById.values()].map((store) => store.position || 0);
    const position = (positions.length ? Math.max(...positions) : 0) + 10;
    assertNoError(await client.from("stores").insert({
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
      .from("family_members")
      .update({ theme })
      .eq("user_id", userData.user.id));
  }

  async function updateOrder(changes) {
    await Promise.all(changes.map((change) => updateItem(change.id, {
      store_id: change.storeId,
      position: change.position
    })));
  }

  function subscribe(onChange, onStatus) {
    const itemsChannel = client
      .channel("family-shopping-items")
      .on("postgres_changes", { event: "*", schema: "public", table: "shopping_items" }, onChange)
      .subscribe((status) => onStatus?.(status));

    const catalogChannel = client
      .channel("family-shopping-catalog")
      .on("postgres_changes", { event: "*", schema: "public", table: "stores" }, onChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, onChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, onChange)
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
    getSession,
    refreshSession,
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
    updateOrder,
    subscribe
  };
})();
