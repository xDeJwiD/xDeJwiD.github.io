const STORAGE_KEY = "razem-shopping-items-v3";
const PREVIOUS_STORAGE_KEY = "razem-shopping-items-v2";
const THEME_KEY = "razem-theme";
const STORE_KEY = "razem-selected-store";
const APP_VERSION_KEY = "razem-app-version";
const createId = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;

// Dane demonstracyjne. Później zastąpimy je kategoriami i produktami z Supabase.
const DEMO_PRODUCT_CATALOG = [
  { id: "nabial", name: "Nabiał", icon: "🥛", products: ["Mleko", "Masło", "Jajka", "Ser żółty", "Jogurt naturalny"] },
  { id: "pieczywo", name: "Pieczywo", icon: "🥖", products: ["Chleb żytni", "Bułki", "Bagietka", "Tortilla"] },
  { id: "warzywa", name: "Warzywa i owoce", icon: "🥕", products: ["Pomidory", "Ogórki", "Ziemniaki", "Banany", "Jabłka"] },
  { id: "mieso", name: "Mięso i ryby", icon: "🥩", products: ["Pierś z kurczaka", "Mięso mielone", "Łosoś", "Szynka"] },
  { id: "spizarnia", name: "Spiżarnia", icon: "🥫", products: ["Makaron", "Ryż", "Kawa", "Herbata", "Oliwa"] },
  { id: "dom", name: "Dom i chemia", icon: "🧴", products: ["Płyn do naczyń", "Ręcznik papierowy", "Worki na śmieci", "Proszek do prania"] }
];

const DEMO_STORES = ["Biedronka", "Lidl", "Kaufland", "Carrefour", "Rossmann", "Inny sklep"];

const defaultItems = [
  { id: createId(), name: "Mleko", quantity: 2, done: false, addedBy: "Mama", category: "Nabiał", store: "Biedronka" },
  { id: createId(), name: "Chleb żytni", quantity: 1, done: false, addedBy: "Ja", category: "Pieczywo", store: "Biedronka" },
  { id: createId(), name: "Pomidory", quantity: 4, done: false, addedBy: "Tata", category: "Warzywa i owoce", store: "Lidl" },
  { id: createId(), name: "Kawa", quantity: 1, done: true, addedBy: "Mama", category: "Spiżarnia", store: "Lidl" }
];

const authView = document.querySelector("#authView");
const appView = document.querySelector("#appView");
const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");
const activeItems = document.querySelector("#activeItems");
const purchasedItems = document.querySelector("#purchasedItems");
const clearButton = document.querySelector("#clearButton");
const profilePopover = document.querySelector("#profilePopover");
const themeButton = document.querySelector("#themeButton");
const pickerBackdrop = document.querySelector("#pickerBackdrop");
const pickerSheet = document.querySelector("#pickerSheet");
const pickerTitle = document.querySelector("#pickerTitle");
const pickerContent = document.querySelector("#pickerContent");
const pickerBack = document.querySelector("#pickerBack");
const selectedStoreLabel = document.querySelector("#selectedStoreLabel");
const selectedProductLabel = document.querySelector("#selectedProductLabel");
const addSelectedButton = document.querySelector("#addSelectedButton");
const storeButton = document.querySelector("#storeButton");
const syncStatus = document.querySelector("#syncStatus");
const updateNotice = document.querySelector("#updateNotice");
const updateNoticeText = document.querySelector("#updateNoticeText");
const updateButton = document.querySelector("#updateButton");

let items = [];
let productCatalog = DEMO_PRODUCT_CATALOG;
let storeNames = DEMO_STORES;
let productIdByKey = new Map();
let storeIdByName = new Map();
let isDemoMode = false;
let currentSession = null;
let unsubscribeRealtime = null;
let realtimeRefreshTimer = null;
let realtimeNeedsCatalog = false;
let hasDefaultStore = Boolean(localStorage.getItem(STORE_KEY));
let selectedStore = localStorage.getItem(STORE_KEY) || storeNames[0];
let pickerMode = "categories";
let selectedCategory = null;
let selectedProduct = null;
let selectedQuantity = 1;
let pendingProductName = "";
let storeConfirmed = hasDefaultStore;
let dragState = null;
let pressState = null;
let suppressItemClickUntil = 0;
let pendingAppVersion = null;
let appUpdateCheckRunning = false;
let connectionState = "syncing";
let isReconnectRunning = false;
let deletionQueue = Promise.resolve();
let deletionFailureCount = 0;
const pendingDeletionIds = new Set();
let realtimeGeneration = 0;
let realtimeReconnectTimer = null;
let realtimeReconnectAttempts = 0;
let lastRealtimeConnectedAt = 0;

function hasActiveUserInteraction() {
  const inputFocused = document.activeElement?.matches?.("input, select, textarea");
  return Boolean(dragState || pressState || inputFocused || !pickerSheet.classList.contains("is-hidden"));
}

function reloadToUpdate() {
  if (!pendingAppVersion) return;
  localStorage.setItem(APP_VERSION_KEY, pendingAppVersion);
  updateNoticeText.textContent = "Aktualizuję aplikację…";
  updateButton.disabled = true;
  window.setTimeout(() => window.location.reload(), 180);
}

function announceAppUpdate(version) {
  pendingAppVersion = version;
  updateNotice.classList.remove("is-hidden");
  if (hasActiveUserInteraction()) {
    updateNoticeText.textContent = "Dostępna jest nowa wersja aplikacji.";
    updateButton.classList.remove("is-hidden");
    return;
  }
  updateNoticeText.textContent = "Dostępna jest nowa wersja. Aktualizuję…";
  updateButton.classList.add("is-hidden");
  window.setTimeout(() => {
    if (pendingAppVersion && !hasActiveUserInteraction()) reloadToUpdate();
    else {
      updateNoticeText.textContent = "Dostępna jest nowa wersja aplikacji.";
      updateButton.classList.remove("is-hidden");
    }
  }, 650);
}

async function checkForAppUpdate() {
  if (appUpdateCheckRunning || !navigator.onLine) return;
  appUpdateCheckRunning = true;
  try {
    const response = await fetch(`version.json?time=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;
    const { version } = await response.json();
    if (!version) return;
    const currentVersion = localStorage.getItem(APP_VERSION_KEY);
    if (!currentVersion) localStorage.setItem(APP_VERSION_KEY, version);
    else if (currentVersion !== version) announceAppUpdate(version);
  } catch {
    // Brak połączenia nie blokuje działania aplikacji z lokalnej pamięci PWA.
  } finally {
    appUpdateCheckRunning = false;
  }
}

async function registerAppWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.register("sw.js", { scope: "./" });
    await registration.update();
  } catch (error) {
    console.warn("Nie udało się uruchomić trybu PWA.", error);
  }
}

function loadItems() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem(PREVIOUS_STORAGE_KEY));
    if (!Array.isArray(stored)) return defaultItems;
    return stored.map((item) => ({
      ...item,
      category: item.category || "Inne",
      store: item.store || "Bez sklepu",
      quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1
    }));
  } catch {
    return defaultItems;
  }
}

function saveItems() {
  if (isDemoMode) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.setAttribute("aria-pressed", String(theme === "dark"));
  themeButton.setAttribute("aria-label", theme === "dark" ? "Włącz tryb jasny" : "Włącz tryb ciemny");
  document.querySelector("#themeColorMeta")?.setAttribute("content", theme === "dark" ? "#151814" : "#f6f5f0");
  document.querySelector("#appleStatusBarMeta")?.setAttribute("content", theme === "dark" ? "black-translucent" : "default");
  localStorage.setItem(THEME_KEY, theme);
}

function showApp() {
  authView.classList.add("is-hidden");
  appView.classList.remove("is-hidden");
  document.title = "Lista zakupów";
  renderItems();
  window.scrollTo(0, 0);
}

function closeApp() {
  appView.classList.add("is-hidden");
  authView.classList.remove("is-hidden");
  profilePopover.classList.add("is-hidden");
  loginForm.reset();
  loginMessage.textContent = "";
  document.title = "Lista zakupów";
}

function setConnectionStatus(state, label) {
  connectionState = state;
  syncStatus.classList.remove("is-online", "is-syncing", "is-offline");
  syncStatus.classList.add(`is-${state}`);
  syncStatus.querySelector("span").textContent = label;
}

function applyRemoteData(data) {
  items = data.items;
  productCatalog = data.catalog;
  storeNames = data.stores;
  productIdByKey = data.productIdByKey;
  storeIdByName = data.storeIdByName;
  if (!storeNames.includes(selectedStore)) {
    selectedStore = storeNames[0] || "";
    hasDefaultStore = false;
    storeConfirmed = false;
  }
  renderItems();
  updateProductDraft();
}

async function refreshRemoteItems() {
  if (isDemoMode || !window.ShoppingDB) return;
  try {
    const remoteItems = await window.ShoppingDB.loadItems();
    items = remoteItems.filter((item) => !pendingDeletionIds.has(item.id));
    renderItems();
    if (pendingDeletionIds.size) setConnectionStatus("syncing", "usuwanie…");
    else setConnectionStatus("online", "połączono");
  } catch (error) {
    console.error(error);
    setConnectionStatus("offline", "błąd synchronizacji");
  }
}

function queueItemDeletion(itemId) {
  if (isDemoMode || pendingDeletionIds.has(itemId)) return;
  pendingDeletionIds.add(itemId);
  setConnectionStatus("syncing", "usuwanie…");

  deletionQueue = deletionQueue
    .then(() => window.ShoppingDB.deleteItem(itemId))
    .catch((error) => {
      deletionFailureCount += 1;
      console.error(error);
    })
    .then(async () => {
      pendingDeletionIds.delete(itemId);
      if (pendingDeletionIds.size) {
        setConnectionStatus("syncing", `usuwanie (${pendingDeletionIds.size})…`);
        return;
      }

      const hadFailure = deletionFailureCount > 0;
      deletionFailureCount = 0;
      await refreshRemoteItems();
      if (hadFailure) setConnectionStatus("offline", "błąd zapisu");
    });
}

async function refreshRemoteData() {
  if (isDemoMode || !window.ShoppingDB) return;
  try {
    const data = await window.ShoppingDB.loadInitialData();
    applyRemoteData(data);
    setConnectionStatus("online", "połączono");
  } catch (error) {
    console.error(error);
    setConnectionStatus("offline", "błąd synchronizacji");
  }
}

async function enterDatabaseMode(session) {
  isDemoMode = false;
  currentSession = session;
  setConnectionStatus("syncing", "łączenie…");
  const data = await window.ShoppingDB.loadInitialData();
  const currentMember = data.members.find((member) => member.user_id === session.user.id);
  if (!currentMember) {
    throw new Error("Użytkownik nie należy do rodziny.");
  }
  setTheme(currentMember.theme || "light");
  applyRemoteData(data);
  const username = session.user.email?.split("@")[0] || "U";
  document.querySelector("#profileButton").textContent = username.slice(0, 1).toUpperCase();
  document.querySelector("#profileMode").textContent = currentMember.display_name || username.slice(0, 1).toUpperCase() + username.slice(1);
  document.querySelector("#profileDescription").textContent = "Lista jest synchronizowana z Supabase.";
  setConnectionStatus("online", "połączono");
  showApp();
  const generation = ++realtimeGeneration;
  const stopPreviousSubscription = unsubscribeRealtime;
  unsubscribeRealtime = null;
  await stopPreviousSubscription?.();
  if (generation !== realtimeGeneration) return;
  unsubscribeRealtime = window.ShoppingDB.subscribe(
    (payload) => {
      if (generation !== realtimeGeneration) return;
      if (payload.table !== "shopping_items") realtimeNeedsCatalog = true;
      window.clearTimeout(realtimeRefreshTimer);
      realtimeRefreshTimer = window.setTimeout(() => {
        if (realtimeNeedsCatalog) void refreshRemoteData();
        else void refreshRemoteItems();
        realtimeNeedsCatalog = false;
      }, 140);
    },
    (status) => {
      if (generation !== realtimeGeneration) return;
      if (status === "SUBSCRIBED") {
        lastRealtimeConnectedAt = Date.now();
        realtimeReconnectAttempts = 0;
        window.clearTimeout(realtimeReconnectTimer);
        realtimeReconnectTimer = null;
        setConnectionStatus("online", "połączono");
      }
      if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(status)) {
        setConnectionStatus("offline", "łączenie utracone");
        scheduleRealtimeReconnect();
      }
    }
  );
  syncStatus.disabled = isReconnectRunning;
}

function scheduleRealtimeReconnect() {
  if (realtimeReconnectTimer || !currentSession || isDemoMode) return;
  const delay = Math.min(30000, 1200 * (2 ** realtimeReconnectAttempts));
  realtimeReconnectAttempts += 1;
  realtimeReconnectTimer = window.setTimeout(() => {
    realtimeReconnectTimer = null;
    if (navigator.onLine && document.visibilityState === "visible") void reconnectDatabase();
    else scheduleRealtimeReconnect();
  }, delay);
}

function refreshConnectionAfterResume() {
  if (isDemoMode || !currentSession || !navigator.onLine || document.visibilityState !== "visible") return;
  const connectionIsStale = Date.now() - lastRealtimeConnectedAt > 30000;
  if (connectionState === "offline" || connectionIsStale) void reconnectDatabase();
  else void refreshRemoteItems();
}

function showDatabaseRecovery(session) {
  isDemoMode = false;
  currentSession = session;
  syncStatus.disabled = false;
  const username = session.user.email?.split("@")[0] || "U";
  document.querySelector("#profileButton").textContent = username.slice(0, 1).toUpperCase();
  document.querySelector("#profileMode").textContent = username.slice(0, 1).toUpperCase() + username.slice(1);
  document.querySelector("#profileDescription").textContent = "Sesja jest zapisana. Odśwież połączenie z bazą.";
  setConnectionStatus("offline", "odśwież");
  showApp();
}

async function reconnectDatabase() {
  if (isDemoMode || isReconnectRunning || connectionState === "syncing" || !window.ShoppingDB) return;
  isReconnectRunning = true;
  syncStatus.disabled = true;
  setConnectionStatus("syncing", "łączenie…");
  try {
    const session = await window.ShoppingDB.refreshSession();
    if (!session) throw new Error("Brak zapisanej sesji użytkownika.");
    await enterDatabaseMode(session);
  } catch (error) {
    console.error(error);
    setConnectionStatus("offline", navigator.onLine ? "spróbuj ponownie" : "offline");
    scheduleRealtimeReconnect();
  } finally {
    isReconnectRunning = false;
    syncStatus.disabled = false;
  }
}

function enterDemoMode() {
  isDemoMode = true;
  currentSession = null;
  syncStatus.disabled = true;
  productCatalog = DEMO_PRODUCT_CATALOG;
  storeNames = DEMO_STORES;
  productIdByKey = new Map();
  storeIdByName = new Map();
  items = loadItems();
  setConnectionStatus("syncing", "lokalnie");
  document.querySelector("#profileButton").textContent = "D";
  document.querySelector("#profileMode").textContent = "Tryb demonstracyjny";
  document.querySelector("#profileDescription").textContent = "Dane są zapisane tylko na tym urządzeniu.";
  showApp();
}

function escapeHtml(text) {
  const element = document.createElement("div");
  element.textContent = text;
  return element.innerHTML;
}

function itemMarkup(item) {
  return `
    <article class="item ${item.done ? "is-done" : ""}" data-id="${item.id}">
      <button class="drag-handle" type="button" aria-label="Przeciągnij, aby zmienić kolejność">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="7" r="1.3"/><circle cx="15" cy="7" r="1.3"/><circle cx="9" cy="12" r="1.3"/><circle cx="15" cy="12" r="1.3"/><circle cx="9" cy="17" r="1.3"/><circle cx="15" cy="17" r="1.3"/></svg>
      </button>
      <button class="check-button" type="button" aria-label="${item.done ? "Przywróć do aktywnych" : "Oznacz jako kupione"}" data-action="toggle">
        ${item.done ? '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6.5 12.5 3.5 3.5 7.5-8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ""}
      </button>
      <div class="item-copy">
        <div class="item-main">
          <span class="item-name">${escapeHtml(item.name)}</span>
          <span class="item-quantity">${item.quantity} szt.</span>
        </div>
        <span class="item-meta">${escapeHtml(item.category)} · dodał(a): ${escapeHtml(item.addedBy)}</span>
      </div>
      <button class="delete-button" type="button" aria-label="Usuń ${escapeHtml(item.name)}" data-action="delete">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7h14M9 7V4h6v3m2 0-1 13H8L7 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </article>`;
}

function groupedItemsMarkup(list) {
  const groups = new Map();
  list.forEach((item) => {
    if (!groups.has(item.store)) groups.set(item.store, []);
    groups.get(item.store).push(item);
  });
  return [...groups.entries()].map(([store, storeItems]) => `
    <div class="store-group">
      <div class="store-heading"><i>${escapeHtml(store.slice(0, 1))}</i><h3>${escapeHtml(store)}</h3></div>
      <div class="items-list" data-store="${escapeHtml(store)}">${storeItems.map(itemMarkup).join("")}</div>
    </div>
  `).join("");
}

function renderItems() {
  const active = items.filter((item) => !item.done);
  const purchased = items.filter((item) => item.done);
  activeItems.innerHTML = groupedItemsMarkup(active);
  purchasedItems.innerHTML = groupedItemsMarkup(purchased);
  document.querySelector("#activeCount").textContent = active.length;
  document.querySelector("#purchasedCount").textContent = purchased.length;
  document.querySelector("#activeEmpty").classList.toggle("is-hidden", active.length > 0);
  document.querySelector("#purchasedEmpty").classList.toggle("is-hidden", purchased.length > 0);
  clearButton.classList.toggle("is-hidden", purchased.length === 0);
}

function optionArrow() {
  return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 5 7 7-7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function renderCategoryPicker() {
  pickerMode = "categories";
  selectedCategory = null;
  pickerTitle.textContent = "Wybierz kategorię";
  pickerBack.classList.add("is-hidden");
  pickerContent.innerHTML = `<div class="picker-options">${productCatalog.map((category) => `
    <button class="picker-option" type="button" data-picker-action="category" data-value="${category.id}">
      <span class="picker-option-icon">${escapeHtml(category.icon)}</span>
      <span class="picker-option-copy"><strong>${escapeHtml(category.name)}</strong><small>${category.products.length} produktów</small></span>
      ${optionArrow()}
    </button>`).join("")}</div>`;
}

function renderProductPicker(category) {
  pickerMode = "products";
  selectedCategory = category;
  pickerTitle.textContent = category.name;
  pickerBack.classList.remove("is-hidden");
  pickerContent.innerHTML = `<div class="picker-options">${category.products.map((product) => `
    <button class="picker-option" type="button" data-picker-action="product" data-value="${escapeHtml(product)}">
      <span class="picker-option-icon">${escapeHtml(category.icon)}</span>
      <span class="picker-option-copy"><strong>${escapeHtml(product)}</strong><small>Wybierz produkt</small></span>
      ${optionArrow()}
    </button>`).join("")}</div>`;
}

function renderQuantityPicker(productName) {
  pickerMode = "quantity";
  pendingProductName = productName;
  selectedQuantity = 1;
  pickerTitle.textContent = productName;
  pickerBack.classList.remove("is-hidden");
  pickerContent.innerHTML = `
    <div class="quantity-picker">
      <p>Wybierz ilość produktu</p>
      <div class="quantity-control">
        <button type="button" data-picker-action="quantity-decrease" aria-label="Zmniejsz ilość">−</button>
        <span class="quantity-value" id="quantityValue">1 <small>szt.</small></span>
        <button type="button" data-picker-action="quantity-increase" aria-label="Zwiększ ilość">+</button>
      </div>
      <button class="quantity-confirm" type="button" data-picker-action="quantity-confirm">Zatwierdź wybór</button>
    </div>`;
}

function renderStorePicker() {
  pickerMode = "stores";
  selectedCategory = null;
  pickerTitle.textContent = "Wybierz sklep";
  pickerBack.classList.add("is-hidden");
  pickerContent.innerHTML = `<div class="picker-options">${storeNames.map((store) => `
    <button class="picker-option ${store === selectedStore ? "is-selected" : ""}" type="button" data-picker-action="store" data-value="${escapeHtml(store)}">
      <span class="picker-option-icon">🏪</span>
      <span class="picker-option-copy"><strong>${escapeHtml(store)}</strong><small>${store === selectedStore ? "Aktualnie wybrany" : "Ustaw jako domyślny"}</small></span>
      ${store === selectedStore ? '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4 10-10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ""}
    </button>`).join("")}</div>`;
}

function renderAddProductForm() {
  pickerMode = "add-product";
  pickerTitle.textContent = "Dodaj produkt";
  pickerBack.classList.add("is-hidden");
  pickerContent.innerHTML = `
    <form class="catalog-form" id="addProductForm">
      <label for="newProductName">Nazwa produktu</label>
      <input id="newProductName" name="name" type="text" minlength="2" maxlength="60" placeholder="Np. Mozzarella" autocomplete="off" required>
      <label for="newProductCategory">Kategoria</label>
      <select id="newProductCategory" name="categoryId" required>
        ${productCatalog.map((category) => `<option value="${category.id}">${escapeHtml(category.name)}</option>`).join("")}
      </select>
      <p class="catalog-form-message" role="alert"></p>
      <button class="catalog-form-submit" type="submit">Zapisz produkt</button>
    </form>`;
  window.setTimeout(() => document.querySelector("#newProductName")?.focus(), 50);
}

function renderAddStoreForm() {
  pickerMode = "add-store";
  pickerTitle.textContent = "Dodaj sklep";
  pickerBack.classList.add("is-hidden");
  pickerContent.innerHTML = `
    <form class="catalog-form" id="addStoreForm">
      <label for="newStoreName">Nazwa sklepu</label>
      <input id="newStoreName" name="name" type="text" minlength="2" maxlength="60" placeholder="Np. Auchan" autocomplete="off" required>
      <p class="catalog-form-message" role="alert"></p>
      <button class="catalog-form-submit" type="submit">Zapisz sklep</button>
    </form>`;
  window.setTimeout(() => document.querySelector("#newStoreName")?.focus(), 50);
}

function renderAddCategoryForm() {
  pickerMode = "add-category";
  pickerTitle.textContent = "Dodaj kategorię";
  pickerBack.classList.add("is-hidden");
  pickerContent.innerHTML = `
    <form class="catalog-form" id="addCategoryForm">
      <label for="newCategoryName">Nazwa kategorii</label>
      <input id="newCategoryName" name="name" type="text" minlength="2" maxlength="60" placeholder="Np. Mrożonki" autocomplete="off" required>
      <label for="newCategoryIcon">Ikonka lub emoji</label>
      <input id="newCategoryIcon" name="icon" class="catalog-icon-input" type="text" maxlength="8" placeholder="🛒" autocomplete="off">
      <p class="catalog-form-message" role="alert"></p>
      <button class="catalog-form-submit" type="submit">Zapisz kategorię</button>
    </form>`;
  window.setTimeout(() => document.querySelector("#newCategoryName")?.focus(), 50);
}

function openCatalogEditor(type) {
  profilePopover.classList.add("is-hidden");
  if (type === "product") renderAddProductForm();
  else if (type === "category") renderAddCategoryForm();
  else renderAddStoreForm();
  pickerBackdrop.classList.remove("is-hidden");
  pickerSheet.classList.remove("is-hidden");
  document.body.classList.add("picker-open");
}

function openPicker(mode) {
  if (mode === "stores") renderStorePicker();
  else renderCategoryPicker();
  pickerBackdrop.classList.remove("is-hidden");
  pickerSheet.classList.remove("is-hidden");
  document.body.classList.add("picker-open");
}

function closePicker() {
  pickerBackdrop.classList.add("is-hidden");
  pickerSheet.classList.add("is-hidden");
  document.body.classList.remove("picker-open");
}

function updateProductDraft() {
  selectedProductLabel.textContent = selectedProduct
    ? `${selectedProduct.name} · ${selectedProduct.quantity} szt.`
    : "Wybierz produkt";
  selectedStoreLabel.textContent = hasDefaultStore ? selectedStore : "Wybierz sklep";
  storeButton.disabled = !selectedProduct;
  addSelectedButton.disabled = !selectedProduct || !storeConfirmed;
}

function confirmProductDraft() {
  selectedProduct = {
    name: pendingProductName,
    quantity: selectedQuantity,
    category: selectedCategory?.name || "Inne"
  };
  storeConfirmed = hasDefaultStore;
  updateProductDraft();
  closePicker();
}

async function addSelectedProduct() {
  if (!selectedProduct) return;
  if (isDemoMode) {
    items.unshift({
      id: createId(),
      name: selectedProduct.name,
      quantity: selectedProduct.quantity,
      done: false,
      addedBy: "Ja",
      category: selectedProduct.category,
      store: selectedStore
    });
    saveItems();
    renderItems();
  } else {
    const productId = productIdByKey.get(`${selectedProduct.category}|${selectedProduct.name}`);
    const storeId = storeIdByName.get(selectedStore);
    if (!productId || !storeId) return;
    try {
      setConnectionStatus("syncing", "zapisywanie…");
      const nextPosition = items.reduce((max, item) => Math.max(max, item.position || 0), 0) + 10;
      await window.ShoppingDB.addItem({
        productId,
        storeId,
        quantity: selectedProduct.quantity,
        position: nextPosition
      });
      await refreshRemoteItems();
    } catch (error) {
      console.error(error);
      setConnectionStatus("offline", "błąd zapisu");
      return;
    }
  }
  selectedProduct = null;
  selectedQuantity = 1;
  pendingProductName = "";
  storeConfirmed = hasDefaultStore;
  updateProductDraft();
}

function animateListShift(list, beforePositions) {
  list.querySelectorAll(".item:not(.is-dragging)").forEach((item) => {
    const before = beforePositions.get(item.dataset.id);
    if (!before) return;
    const after = item.getBoundingClientRect();
    const deltaY = before.top - after.top;
    if (Math.abs(deltaY) < 1) return;
    if (!item.animate) return;
    const animation = item.animate(
      [{ transform: `translate3d(0, ${deltaY}px, 0)` }, { transform: "translate3d(0, 0, 0)" }],
      { duration: 190, easing: "cubic-bezier(.2, .8, .2, 1)" }
    );
    animation.id = "shopping-list-shift";
  });
}

function settleListAnimations(lists) {
  lists.forEach((list) => {
    list.querySelectorAll(".item:not(.is-dragging)").forEach((item) => {
      item.getAnimations?.()
        .filter((animation) => animation.id === "shopping-list-shift")
        .forEach((animation) => animation.cancel());
    });
  });
}

function updateStoredOrder() {
  const itemById = new Map(items.map((item) => [item.id, item]));
  const orderedElements = [...activeItems.querySelectorAll(".item"), ...purchasedItems.querySelectorAll(".item")];
  items = orderedElements.map((element, index) => {
    const item = itemById.get(element.dataset.id);
    if (!item) return null;
    item.store = element.closest(".items-list")?.dataset.store || item.store;
    item.storeId = storeIdByName.get(item.store) || item.storeId;
    item.position = (index + 1) * 10;
    return item;
  }).filter(Boolean);
  saveItems();
  if (!isDemoMode) {
    setConnectionStatus("syncing", "zapisywanie…");
    window.ShoppingDB.updateOrder(items.map((item) => ({
      id: item.id,
      storeId: item.storeId,
      position: item.position
    }))).then(
      () => setConnectionStatus("online", "połączono"),
      (error) => {
        console.error(error);
        setConnectionStatus("offline", "błąd zapisu");
        void refreshRemoteItems();
      }
    );
  }
}

function lockPageScroll() {
  const scrollY = window.scrollY;
  const previous = {
    position: document.body.style.position,
    top: document.body.style.top,
    left: document.body.style.left,
    right: document.body.style.right,
    width: document.body.style.width
  };
  Object.assign(document.body.style, {
    position: "fixed",
    top: `-${scrollY}px`,
    left: "0",
    right: "0",
    width: "100%"
  });
  return { scrollY, previous };
}

function unlockPageScroll(lock) {
  if (!lock) return;
  Object.assign(document.body.style, lock.previous);
  window.scrollTo(0, lock.scrollY);
}

function endDrag() {
  if (!dragState) return;
  const { item, placeholder, touchedLists, scrollLock } = dragState;
  placeholder.replaceWith(item);
  item.classList.remove("is-dragging");
  item.removeAttribute("style");
  touchedLists.forEach((list) => list.classList.remove("is-sorting"));
  document.body.classList.remove("is-reordering");
  dragState = null;
  unlockPageScroll(scrollLock);
  suppressItemClickUntil = Date.now() + 350;
  updateStoredOrder();
  document.querySelectorAll(".store-group").forEach((group) => {
    if (!group.querySelector(".item")) group.remove();
  });
}

function cancelLongPress() {
  if (!pressState) return;
  clearTimeout(pressState.timer);
  pressState.item.classList.remove("is-pressing");
  pressState.item.classList.remove("is-swiping");
  pressState.item.classList.remove("is-delete-ready");
  pressState.item.style.transform = "";
  pressState.item.style.removeProperty("--swipe-strength");
  pressState = null;
}

function finishSwipe() {
  if (!pressState?.swiping) return;
  const { item, currentX } = pressState;
  const itemId = item.dataset.id;
  clearTimeout(pressState.timer);
  pressState = null;
  suppressItemClickUntil = Date.now() + 400;

  if (currentX <= -72) {
    item.classList.remove("is-swiping");
    item.classList.remove("is-delete-ready");
    item.classList.add("is-swipe-removing");
    item.style.transform = "translate3d(-110vw, 0, 0)";
    window.setTimeout(async () => {
      items = items.filter((entry) => entry.id !== itemId);
      saveItems();
      renderItems();
      if (!isDemoMode) queueItemDeletion(itemId);
    }, 220);
    return;
  }

  item.classList.remove("is-swiping");
  item.classList.remove("is-delete-ready");
  item.style.transition = "transform .18s ease";
  item.style.transform = "translate3d(0, 0, 0)";
  window.setTimeout(() => item.removeAttribute("style"), 190);
}

function startDragFromPress() {
  if (!pressState) return;
  const { item, pointerId, startX, startY, captureTarget } = pressState;
  const list = item.closest(".items-list");
  const rect = item.getBoundingClientRect();
  const placeholder = document.createElement("div");
  placeholder.className = "item-placeholder";
  placeholder.style.height = `${rect.height}px`;
  item.after(placeholder);

  try { captureTarget.setPointerCapture(pointerId); } catch { /* wskaźnik mógł już zostać zwolniony */ }
  item.classList.remove("is-pressing");
  item.classList.add("is-dragging");
  list.classList.add("is-sorting");
  document.body.classList.add("is-reordering");
  const scrollLock = lockPageScroll();
  Object.assign(item.style, {
    position: "fixed",
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: "0",
    pointerEvents: "none",
    transform: "translate3d(0, 0, 0) scale(1.015)"
  });
  dragState = {
    id: item.dataset.id,
    item,
    list,
    container: item.closest("#activeItems, #purchasedItems"),
    touchedLists: new Set([list]),
    placeholder,
    startX,
    startY,
    scrollLock,
    lastPlacement: ""
  };
  pressState = null;
  if (navigator.vibrate) navigator.vibrate(25);
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!loginForm.checkValidity()) {
    loginForm.reportValidity();
    return;
  }
  if (!window.ShoppingDB) {
    loginMessage.textContent = "Nie udało się załadować połączenia z Supabase.";
    return;
  }
  const submitButton = loginForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  loginMessage.textContent = "";
  let signedInSession = null;
  try {
    const result = await window.ShoppingDB.signIn(
      document.querySelector("#username").value,
      document.querySelector("#password").value
    );
    signedInSession = result.session;
    await enterDatabaseMode(result.session);
  } catch (error) {
    console.error(error);
    if (signedInSession) showDatabaseRecovery(signedInSession);
    else {
      loginMessage.textContent = "Nieprawidłowy login lub hasło albo brak dostępu do rodziny.";
      await window.ShoppingDB.signOut().catch(() => {});
    }
  } finally {
    submitButton.disabled = false;
  }
});

document.querySelector("#demoButton").addEventListener("click", enterDemoMode);
document.querySelector("#logoutButton").addEventListener("click", async () => {
  realtimeGeneration += 1;
  unsubscribeRealtime?.();
  unsubscribeRealtime = null;
  window.clearTimeout(realtimeRefreshTimer);
  window.clearTimeout(realtimeReconnectTimer);
  realtimeReconnectTimer = null;
  if (!isDemoMode && window.ShoppingDB) await window.ShoppingDB.signOut().catch(console.error);
  currentSession = null;
  closeApp();
});

themeButton.addEventListener("click", async () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(theme);
  if (!isDemoMode && window.ShoppingDB && currentSession) {
    try {
      setConnectionStatus("syncing", "zapisywanie…");
      await window.ShoppingDB.updateTheme(theme);
      setConnectionStatus("online", "połączono");
    } catch (error) {
      console.error(error);
      setConnectionStatus("offline", "błąd zapisu");
    }
  }
});

document.querySelector("#categoryButton").addEventListener("click", () => openPicker("categories"));
storeButton.addEventListener("click", () => openPicker("stores"));
addSelectedButton.addEventListener("click", addSelectedProduct);
document.querySelector("#pickerClose").addEventListener("click", closePicker);
pickerBackdrop.addEventListener("click", closePicker);
pickerBack.addEventListener("click", () => {
  if (pickerMode === "quantity" && selectedCategory) renderProductPicker(selectedCategory);
  else renderCategoryPicker();
});

pickerContent.addEventListener("click", (event) => {
  const option = event.target.closest("[data-picker-action]");
  if (!option) return;
  const { pickerAction, value } = option.dataset;
  if (pickerAction === "category") {
    const category = productCatalog.find((item) => item.id === value);
    if (category) renderProductPicker(category);
  }
  if (pickerAction === "product") renderQuantityPicker(value);
  if (pickerAction === "quantity-decrease") {
    selectedQuantity = Math.max(1, selectedQuantity - 1);
    document.querySelector("#quantityValue").innerHTML = `${selectedQuantity} <small>szt.</small>`;
  }
  if (pickerAction === "quantity-increase") {
    selectedQuantity = Math.min(99, selectedQuantity + 1);
    document.querySelector("#quantityValue").innerHTML = `${selectedQuantity} <small>szt.</small>`;
  }
  if (pickerAction === "quantity-confirm") confirmProductDraft();
  if (pickerAction === "store") {
    selectedStore = value;
    hasDefaultStore = true;
    storeConfirmed = true;
    localStorage.setItem(STORE_KEY, value);
    updateProductDraft();
    closePicker();
  }
});

pickerContent.addEventListener("submit", async (event) => {
  const form = event.target.closest(".catalog-form");
  if (!form) return;
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const name = form.elements.name.value.trim();
  const message = form.querySelector(".catalog-form-message");
  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  message.textContent = "";

  try {
    if (pickerMode === "add-category") {
      const icon = form.elements.icon.value.trim() || "🛒";
      if (productCatalog.some((category) => category.name.toLowerCase() === name.toLowerCase())) {
        throw new Error("Taka kategoria już istnieje.");
      }
      if (isDemoMode) {
        productCatalog.push({ id: createId(), name, icon, products: [] });
      } else {
        setConnectionStatus("syncing", "zapisywanie…");
        await window.ShoppingDB.addCategory(name, icon);
        await refreshRemoteData();
      }
    } else if (pickerMode === "add-product") {
      const categoryId = form.elements.categoryId.value;
      const category = productCatalog.find((entry) => entry.id === categoryId);
      if (!category) throw new Error("Nie znaleziono wybranej kategorii.");
      if (category.products.some((product) => product.toLowerCase() === name.toLowerCase())) {
        throw new Error("Taki produkt już istnieje w tej kategorii.");
      }
      if (isDemoMode) category.products.push(name);
      else {
        setConnectionStatus("syncing", "zapisywanie…");
        await window.ShoppingDB.addProduct(categoryId, name);
        await refreshRemoteData();
      }
    } else if (pickerMode === "add-store") {
      if (storeNames.some((store) => store.toLowerCase() === name.toLowerCase())) {
        throw new Error("Taki sklep już istnieje.");
      }
      if (isDemoMode) storeNames.push(name);
      else {
        setConnectionStatus("syncing", "zapisywanie…");
        await window.ShoppingDB.addStore(name);
        await refreshRemoteData();
      }
    }
    closePicker();
  } catch (error) {
    console.error(error);
    message.textContent = error.code === "23505" ? "Taka pozycja już istnieje." : (error.message || "Nie udało się zapisać.");
    if (!isDemoMode) setConnectionStatus("offline", "błąd zapisu");
  } finally {
    submitButton.disabled = false;
  }
});

document.querySelector(".app-content").addEventListener("click", async (event) => {
  if (Date.now() < suppressItemClickUntil && event.target.closest(".item")) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  const button = event.target.closest("button[data-action]");
  const itemElement = event.target.closest("[data-id]");
  if (!button || !itemElement) return;
  const index = items.findIndex((item) => item.id === itemElement.dataset.id);
  if (index < 0) return;
  const itemId = items[index].id;
  const nextDone = !items[index].done;
  if (button.dataset.action === "toggle") items[index].done = nextDone;
  if (button.dataset.action === "delete") items.splice(index, 1);
  saveItems();
  renderItems();
  if (!isDemoMode) {
    if (button.dataset.action === "delete") {
      queueItemDeletion(itemId);
      return;
    }
    try {
      setConnectionStatus("syncing", "zapisywanie…");
      await window.ShoppingDB.updateItem(itemId, { is_purchased: nextDone });
      setConnectionStatus("online", "połączono");
    } catch (error) {
      console.error(error);
      setConnectionStatus("offline", "błąd zapisu");
      await refreshRemoteItems();
    }
  }
});

document.querySelector(".app-content").addEventListener("pointerdown", (event) => {
  const item = event.target.closest(".item");
  if (!item || event.button !== 0) return;
  if (event.target.closest("button:not(.drag-handle), input, select, textarea, a")) return;
  cancelLongPress();
  try { item.setPointerCapture(event.pointerId); } catch { /* starsza przeglądarka */ }
  item.classList.add("is-pressing");
  pressState = {
    item,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    captureTarget: item,
    currentX: 0,
    swiping: false,
    canSwipe: matchMedia("(max-width: 560px)").matches && event.pointerType !== "mouse",
    timer: setTimeout(startDragFromPress, 380)
  };
});

document.querySelector(".app-content").addEventListener("pointermove", (event) => {
  if (!dragState && pressState) {
    const deltaX = event.clientX - pressState.startX;
    const deltaY = event.clientY - pressState.startY;
    if (pressState.swiping || (pressState.canSwipe && deltaX < -8 && Math.abs(deltaX) > Math.abs(deltaY))) {
      event.preventDefault();
      clearTimeout(pressState.timer);
      pressState.swiping = true;
      pressState.currentX = Math.max(-105, Math.min(0, deltaX));
      const swipeProgress = Math.min(1, Math.abs(pressState.currentX) / 90);
      pressState.item.classList.remove("is-pressing");
      pressState.item.classList.add("is-swiping");
      pressState.item.classList.toggle("is-delete-ready", pressState.currentX <= -72);
      pressState.item.style.setProperty("--swipe-strength", String(swipeProgress * .58));
      pressState.item.style.transform = `translate3d(${pressState.currentX}px, 0, 0)`;
      return;
    }
    const distance = Math.hypot(deltaX, deltaY);
    if (distance > 9) cancelLongPress();
    return;
  }
  if (!dragState) return;
  event.preventDefault();
  const { item, placeholder, startX, startY, container } = dragState;
  item.style.transform = `translate3d(${event.clientX - startX}px, ${event.clientY - startY}px, 0) scale(1.015)`;

  const elementsAtPoint = document.elementsFromPoint(event.clientX, event.clientY);
  const targetGroup = elementsAtPoint
    .map((element) => element.closest?.(".store-group"))
    .find((group) => group && group.closest("#activeItems, #purchasedItems") === container);
  const targetList = targetGroup?.querySelector(".items-list");
  if (!targetList) return;

  const sourceList = placeholder.closest(".items-list");
  const affectedLists = new Set([sourceList, targetList]);
  settleListAnimations(affectedLists);

  const siblings = [...targetList.querySelectorAll(".item:not(.is-dragging)")];
  const insertBefore = siblings.find((element) => {
    const rect = element.getBoundingClientRect();
    return event.clientY < rect.top + rect.height / 2;
  });
  const placementKey = `${targetList.dataset.store}-${insertBefore?.dataset.id || "end"}`;
  if (placementKey === dragState.lastPlacement) return;

  const beforePositions = new Map();
  affectedLists.forEach((list) => {
    list.querySelectorAll(".item:not(.is-dragging)").forEach((element) => {
      beforePositions.set(element.dataset.id, element.getBoundingClientRect());
    });
  });
  if (insertBefore) insertBefore.before(placeholder);
  else targetList.append(placeholder);
  targetList.classList.add("is-sorting");
  dragState.touchedLists.add(targetList);
  dragState.list = targetList;
  dragState.lastPlacement = placementKey;
  affectedLists.forEach((list) => animateListShift(list, beforePositions));
});

document.querySelector(".app-content").addEventListener("pointerup", () => {
  if (dragState) endDrag();
  else if (pressState?.swiping) finishSwipe();
  else cancelLongPress();
});
document.querySelector(".app-content").addEventListener("pointercancel", () => {
  if (dragState) endDrag();
  else cancelLongPress();
});

document.querySelectorAll(".section-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const section = button.closest(".list-section");
    const collapsed = section.classList.toggle("is-collapsed");
    button.setAttribute("aria-expanded", String(!collapsed));
  });
});

document.addEventListener("touchmove", (event) => {
  if (dragState) event.preventDefault();
}, { passive: false });

clearButton.addEventListener("click", async () => {
  items = items.filter((item) => !item.done);
  saveItems();
  renderItems();
  if (!isDemoMode) {
    try {
      setConnectionStatus("syncing", "usuwanie…");
      await window.ShoppingDB.clearPurchased();
      setConnectionStatus("online", "połączono");
    } catch (error) {
      console.error(error);
      setConnectionStatus("offline", "błąd zapisu");
      await refreshRemoteItems();
    }
  }
});

document.querySelector("#profileButton").addEventListener("click", () => profilePopover.classList.toggle("is-hidden"));
document.querySelector("#addProductMenuButton").addEventListener("click", () => openCatalogEditor("product"));
document.querySelector("#addCategoryMenuButton").addEventListener("click", () => openCatalogEditor("category"));
document.querySelector("#addStoreMenuButton").addEventListener("click", () => openCatalogEditor("store"));
document.addEventListener("click", (event) => {
  if (!event.target.closest("#profileButton") && !event.target.closest("#profilePopover")) profilePopover.classList.add("is-hidden");
});

const savedTheme = localStorage.getItem(THEME_KEY);
setTheme(savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
updateProductDraft();

window.addEventListener("offline", () => {
  if (!isDemoMode && !authView.classList.contains("is-hidden")) return;
  if (!isDemoMode) setConnectionStatus("offline", "offline");
});
window.addEventListener("online", () => {
  if (!isDemoMode && !appView.classList.contains("is-hidden")) void reconnectDatabase();
  void checkForAppUpdate();
});

syncStatus.addEventListener("click", () => {
  if (!isDemoMode) void reconnectDatabase();
});
updateButton.addEventListener("click", reloadToUpdate);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    void checkForAppUpdate();
    refreshConnectionAfterResume();
  }
});
window.addEventListener("pageshow", () => {
  void checkForAppUpdate();
  refreshConnectionAfterResume();
});
window.addEventListener("load", () => {
  void registerAppWorker();
  void checkForAppUpdate();
});
window.setInterval(() => {
  if (document.visibilityState === "visible") void checkForAppUpdate();
}, 15 * 60 * 1000);
window.setInterval(() => {
  if (document.visibilityState === "visible" && !isDemoMode && currentSession && navigator.onLine && connectionState !== "syncing") {
    void refreshRemoteItems();
  }
}, 60 * 1000);

(async function restoreSession() {
  if (!window.ShoppingDB) return;
  try {
    const session = await window.ShoppingDB.getSession();
    if (!session) return;
    try {
      await enterDatabaseMode(session);
    } catch (error) {
      console.error(error);
      showDatabaseRecovery(session);
    }
  } catch (error) {
    console.error(error);
    loginMessage.textContent = "Nie udało się sprawdzić zapisanej sesji. Spróbuj ponownie po odzyskaniu internetu.";
  }
})();
