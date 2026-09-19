const STORAGE_KEY = "razem-shopping-items-v3";
const PREVIOUS_STORAGE_KEY = "razem-shopping-items-v2";
const THEME_KEY = "razem-theme";
const ACCENT_COLOR_KEY = "razem-accent-color";
const STORE_KEY = "razem-selected-store";
const APP_VERSION_KEY = "razem-app-version";
const INSTALL_PROMPT_DISMISSED_KEY = "razem-install-prompt-dismissed";
const INSTALL_PROMPT_RETRY_AFTER = 7 * 24 * 60 * 60 * 1000;
const DEFAULT_ACCENT_COLOR = "#00bda4";
const ACCENT_COLORS = [
  { value: "#00bda4", label: "Turkusowy" },
  { value: "#3b82f6", label: "Niebieski" },
  { value: "#8b5cf6", label: "Fioletowy" },
  { value: "#ec4899", label: "Różowy" },
  { value: "#f97316", label: "Pomarańczowy" },
  { value: "#ffffff", label: "Biały" }
];
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
  { id: createId(), name: "Mleko", quantity: 2, done: false, addedBy: "Ja", category: "Nabiał", store: "Biedronka" },
  { id: createId(), name: "Chleb żytni", quantity: 1, done: false, addedBy: "Ja", category: "Pieczywo", store: "Biedronka" },
  { id: createId(), name: "Pomidory", quantity: 4, done: false, addedBy: "Ja", category: "Warzywa i owoce", store: "Lidl" },
  { id: createId(), name: "Kawa", quantity: 1, done: true, addedBy: "Ja", category: "Spiżarnia", store: "Lidl" }
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
const selectedProductLabel = document.querySelector("#selectedProductLabel");
const addSelectedButton = document.querySelector("#addSelectedButton");
const syncStatus = document.querySelector("#syncStatus");
const updateNotice = document.querySelector("#updateNotice");
const updateNoticeText = document.querySelector("#updateNoticeText");
const updateButton = document.querySelector("#updateButton");
const adminView = document.querySelector("#adminView");
const adminList = document.querySelector("#adminList");
const adminMessage = document.querySelector("#adminMessage");
const adminModeButton = document.querySelector("#adminModeButton");
const eventLogMenuButton = document.querySelector("#eventLogMenuButton");
const eventLogView = document.querySelector("#eventLogView");
const eventLogBackButton = document.querySelector("#eventLogBackButton");
const eventLogDescription = document.querySelector("#eventLogDescription");
const eventLogSearch = document.querySelector("#eventLogSearch");
const eventLogRefreshButton = document.querySelector("#eventLogRefreshButton");
const eventLogCount = document.querySelector("#eventLogCount");
const eventLogMessage = document.querySelector("#eventLogMessage");
const eventLogList = document.querySelector("#eventLogList");
const listSelectionView = document.querySelector("#listSelectionView");
const listCards = document.querySelector("#listCards");
const listSelectionMessage = document.querySelector("#listSelectionMessage");
const listMembersManageMenuButton = document.querySelector("#listMembersManageMenuButton");
const listBackButton = document.querySelector("#listBackButton");
const createListMenuButton = document.querySelector("#createListMenuButton");
const createUserMenuButton = document.querySelector("#createUserMenuButton");
const assignUsersMenuButton = document.querySelector("#assignUsersMenuButton");
const renameListMenuButton = document.querySelector("#renameListMenuButton");
const changePasswordMenuButton = document.querySelector("#changePasswordMenuButton");
const accentColorMenuButton = document.querySelector("#accentColorMenuButton");
const notifyListButton = document.querySelector("#notifyListButton");
const pushFeedback = document.querySelector("#pushFeedback");
const installPromptBackdrop = document.querySelector("#installPromptBackdrop");
const installPromptAction = document.querySelector("#installPromptAction");
const installIosGuide = document.querySelector("#installIosGuide");
const installPromptDescription = document.querySelector("#installPromptDescription");

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
let pendingProduct = null;
let editingItemId = null;
let productSearchQuery = "";
let pendingCatalogPromotion = null;
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
const pendingItemUpdateIds = new Set();
const localItemMutations = new Map();
let remoteItemsRefreshDeferred = false;
let realtimeGeneration = 0;
let realtimeReconnectTimer = null;
let realtimeReconnectAttempts = 0;
let lastRealtimeConnectedAt = 0;
let lastDatabaseRefreshAt = 0;
let managementCatalog = { categories: [], products: [], stores: [] };
let adminDraft = null;
let adminTab = "categories";
let adminEditingItem = null;
let adminPendingDelete = null;
let currentUserIsAdmin = false;
let isAdminEditMode = false;
let isAdminSaving = false;
let adminPressState = null;
let adminDragState = null;
let adminSuppressClickUntil = 0;
let availableLists = [];
let currentList = null;
let currentProfile = null;
let listOpenInProgress = false;
let currentUserIsDev = false;
let eventLogEntries = [];
let eventLogListId = null;
const expandedEventIds = new Set();
let eventLogLoading = false;
let isEventLogOpen = false;
let manageableUsers = [];
let manageableMemberships = [];
let manageableLists = [];
let managedListMembers = [];
let deferredInstallPrompt = null;
let installPromptMode = null;
let installPromptPreview = false;
let pushFeedbackTimer = null;
let pushActionRunning = false;

function isAppInstalled() {
  return window.matchMedia("(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)").matches
    || window.navigator.standalone === true
    || document.referrer.startsWith("android-app://");
}

function isIosDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isIosSafari() {
  return isIosDevice() && /Safari/i.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(navigator.userAgent);
}

function isMobileDevice() {
  return isIosDevice() || /Android|Mobile/i.test(navigator.userAgent) || window.matchMedia("(max-width: 760px) and (pointer: coarse)").matches;
}

function canShowInstallPrompt() {
  if (isAppInstalled() || !isMobileDevice()) return false;
  const dismissedAt = Number(localStorage.getItem(INSTALL_PROMPT_DISMISSED_KEY));
  return !dismissedAt || Date.now() - dismissedAt >= INSTALL_PROMPT_RETRY_AFTER;
}

function showInstallPrompt(mode, preview = false) {
  if ((!preview && !canShowInstallPrompt()) || !installPromptBackdrop.classList.contains("is-hidden")) return;
  installPromptMode = mode;
  installPromptPreview = preview;
  const isIos = mode === "ios";
  installIosGuide.classList.toggle("is-hidden", !isIos);
  installPromptDescription.textContent = isIos && !preview && !isIosSafari()
    ? "Na iPhonie otwórz tę stronę w Safari, a następnie wykonaj poniższe kroki."
    : "Aplikacja będzie dostępna z ekranu głównego i otworzy się bez paska przeglądarki.";
  installPromptAction.textContent = isIos ? "Rozumiem" : "Zainstaluj aplikację";
  installPromptBackdrop.classList.remove("is-hidden");
  document.body.classList.add("install-prompt-open");
  window.setTimeout(() => installPromptAction.focus(), 50);
}

function closeInstallPrompt(remember = true) {
  installPromptBackdrop.classList.add("is-hidden");
  document.body.classList.remove("install-prompt-open");
  if (remember && !installPromptPreview) localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, String(Date.now()));
  installPromptPreview = false;
}

async function handleInstallPromptAction() {
  if (installPromptMode === "ios") {
    closeInstallPrompt();
    return;
  }
  if (!deferredInstallPrompt) {
    if (installPromptPreview) closeInstallPrompt(false);
    return;
  }
  installPromptAction.disabled = true;
  try {
    await deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    closeInstallPrompt(choice.outcome !== "accepted");
  } finally {
    deferredInstallPrompt = null;
    installPromptAction.disabled = false;
  }
}

function hasActiveUserInteraction() {
  const inputFocused = document.activeElement?.matches?.("input, select, textarea");
  return Boolean(listOpenInProgress || isAdminEditMode || adminDragState || adminPressState || dragState || pressState || inputFocused || !pickerSheet.classList.contains("is-hidden"));
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
  const themeColor = isAdminEditMode ? (theme === "dark" ? "#ef6b62" : "#d84a42") : (theme === "dark" ? "#151814" : "#f6f5f0");
  document.querySelector("#themeColorMeta")?.setAttribute("content", themeColor);
  document.querySelector("#appleStatusBarMeta")?.setAttribute("content", theme === "dark" ? "black-translucent" : "default");
  localStorage.setItem(THEME_KEY, theme);
}

function isAccentColor(value) {
  return /^#[0-9a-f]{6}$/i.test(value || "");
}

function darkenAccentColor(hex, multiplier = .84) {
  const channels = [1, 3, 5].map((start) => Math.round(parseInt(hex.slice(start, start + 2), 16) * multiplier));
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function accentTextColor(hex) {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const luminance = channels.map((channel) => channel <= .03928 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4)
    .reduce((total, channel, index) => total + channel * [0.2126, 0.7152, 0.0722][index], 0);
  return luminance > .28 ? "#062e29" : "#ffffff";
}

function setAccentColor(color) {
  const accent = isAccentColor(color) ? color.toLowerCase() : DEFAULT_ACCENT_COLOR;
  const root = document.documentElement;
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--accent-dark", darkenAccentColor(accent));
  root.style.setProperty("--accent-soft", `color-mix(in srgb, ${accent} 15%, var(--paper))`);
  root.style.setProperty("--accent-contrast", accentTextColor(accent));
  localStorage.setItem(ACCENT_COLOR_KEY, accent);
}

function showApp({ render = true } = {}) {
  const wasHidden = appView.classList.contains("is-hidden");
  authView.classList.add("is-hidden");
  appView.classList.remove("is-hidden");
  document.title = "Lista zakupów";
  if (render) renderItems();
  if (wasHidden) window.scrollTo(0, 0);
}

function closeApp() {
  closeEventLog();
  closeAdminModeWithoutSaving();
  appView.classList.add("is-hidden");
  authView.classList.remove("is-hidden");
  profilePopover.classList.add("is-hidden");
  loginForm.reset();
  loginMessage.textContent = "";
  document.body.classList.remove("choosing-list");
  listSelectionView.classList.add("is-hidden");
  availableLists = [];
  currentList = null;
  currentProfile = null;
  currentUserIsDev = false;
  eventLogEntries = [];
  eventLogListId = null;
  expandedEventIds.clear();
  eventLogSearch.value = "";
  manageableUsers = [];
  createListMenuButton.classList.add("is-hidden");
  createUserMenuButton.classList.add("is-hidden");
  assignUsersMenuButton.classList.add("is-hidden");
  listMembersManageMenuButton.classList.add("is-hidden");
  eventLogMenuButton.classList.add("is-hidden");
  renameListMenuButton.classList.add("is-hidden");
  changePasswordMenuButton.classList.add("is-hidden");
  notifyListButton.classList.add("is-hidden");
  window.ShoppingDB?.setActiveList(null);
  document.title = "Lista zakupów";
}

function selectedStoreStorageKey() {
  return currentList && !isDemoMode ? `${STORE_KEY}:${currentList.id}` : STORE_KEY;
}

function renderListSelection() {
  listCards.innerHTML = availableLists.map((list) => `
    <button class="list-card" type="button" data-list-id="${escapeAttribute(list.id)}">
      <span class="list-card-icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7.5h14M7 4h10l1.5 16h-13L7 4Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 10.5v.1M15 10.5v.1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
      </span>
      <span class="list-card-copy">
        <strong>${escapeHtml(list.name)}</strong>
        <small>${list.role === "admin" ? "Administrator listy" : "Wspólna lista zakupów"}</small>
      </span>
      <svg class="list-card-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 5 7 7-7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>`).join("");
  listSelectionMessage.classList.toggle("is-hidden", availableLists.length > 0);
  listMembersManageMenuButton.classList.toggle("is-hidden", !currentUserIsDev || !availableLists.length);
}

function renderListMembersManager(listId) {
  const selectedListId = availableLists.some((list) => list.id === listId) ? listId : availableLists[0]?.id;
  const ownUserId = currentSession?.user?.id;
  pickerMode = "manage-list-members";
  pickerTitle.textContent = "Użytkownicy list";
  pickerBack.classList.add("is-hidden");
  pickerContent.innerHTML = `
    <div class="list-members-manager">
      <label for="listMembersList">Lista</label>
      <select id="listMembersList">
        ${availableLists.map((list) => `<option value="${escapeAttribute(list.id)}" ${list.id === selectedListId ? "selected" : ""}>${escapeHtml(list.name)}</option>`).join("")}
      </select>
      <div class="list-members-current">
        <span>Członkowie (${managedListMembers.length})</span>
        ${managedListMembers.map((member) => `
          <div class="list-member-row">
            <div><strong>${escapeHtml(member.display_name || member.username)}</strong><small>@${escapeHtml(member.username)} · ${member.role === "admin" ? "administrator" : "użytkownik"}</small></div>
            <div class="list-member-actions">
              <button class="list-member-password" type="button" data-picker-action="reset-member-password" data-user-id="${escapeAttribute(member.user_id)}">Hasło</button>
              <button class="list-member-remove" type="button" data-picker-action="remove-list-member" data-list-id="${escapeAttribute(selectedListId)}" data-user-id="${escapeAttribute(member.user_id)}">${member.user_id === ownUserId ? "Wypisz się" : "Usuń"}</button>
            </div>
          </div>`).join("") || '<div class="list-members-empty">Ta lista nie ma członków.</div>'}
      </div>
    </div>`;
}

async function openListMembersManager(listId = availableLists[0]?.id) {
  if (!currentUserIsDev || isDemoMode || !listId) return;
  profilePopover.classList.add("is-hidden");
  pickerMode = "manage-list-members-loading";
  pickerTitle.textContent = "Użytkownicy list";
  pickerBack.classList.add("is-hidden");
  pickerContent.innerHTML = '<div class="list-form-loading">Ładowanie użytkowników…</div>';
  pickerBackdrop.classList.remove("is-hidden");
  pickerSheet.classList.remove("is-hidden");
  document.body.classList.add("picker-open");
  try {
    managedListMembers = await window.ShoppingDB.loadListMembersForManagement(listId);
    renderListMembersManager(listId);
  } catch (error) {
    pickerContent.innerHTML = `<div class="list-form-error">${escapeHtml(error.message || "Nie udało się pobrać użytkowników listy.")}</div>`;
  }
}

async function removeManagedListMember(listId, userId) {
  const member = managedListMembers.find((entry) => entry.user_id === userId);
  const label = member?.display_name || member?.username || "tego użytkownika";
  if (!window.confirm(userId === currentSession?.user?.id ? `Wypisać się z listy „${availableLists.find((list) => list.id === listId)?.name || ""}”?` : `Usunąć ${label} z tej listy?`)) return;
  try {
    setConnectionStatus("syncing", "zapisywanie…");
    await window.ShoppingDB.removeListMember(listId, userId);
    if (userId === currentSession?.user?.id) availableLists = availableLists.filter((list) => list.id !== listId);
    const nextListId = availableLists.some((list) => list.id === listId) ? listId : availableLists[0]?.id;
    managedListMembers = nextListId ? await window.ShoppingDB.loadListMembersForManagement(nextListId) : [];
    renderListSelection();
    if (nextListId) renderListMembersManager(nextListId);
    else closePicker();
    setConnectionStatus("online", "połączono");
  } catch (error) {
    showPushFeedback(error.message || "Nie udało się zapisać zmian użytkowników.");
    setConnectionStatus("offline", "błąd zapisu");
  }
}

function openManagedPasswordReset(userId) {
  const member = managedListMembers.find((entry) => entry.user_id === userId);
  if (!member) return;
  pickerMode = "reset-member-password";
  pickerTitle.textContent = "Zmień hasło";
  pickerBack.classList.add("is-hidden");
  pickerContent.innerHTML = `
    <form class="list-create-form managed-password-form">
      <p class="list-form-note">Ustawiasz nowe hasło dla: <b>${escapeHtml(member.display_name || member.username)}</b>.</p>
      <input name="userId" type="hidden" value="${escapeAttribute(userId)}">
      <label for="managedNewPassword">Nowe hasło</label>
      <input id="managedNewPassword" name="password" type="password" minlength="8" maxlength="72" autocomplete="new-password" required>
      <label for="managedRepeatPassword">Powtórz nowe hasło</label>
      <input id="managedRepeatPassword" name="repeatPassword" type="password" minlength="8" maxlength="72" autocomplete="new-password" required>
      <p class="catalog-form-message" role="alert"></p>
      <button class="catalog-form-submit" type="submit">Zapisz nowe hasło</button>
    </form>`;
}

function updateListActivityTime(timestamp) {
  const element = document.querySelector("#listActivityTime");
  const date = new Date(timestamp);
  if (!timestamp || Number.isNaN(date.getTime())) {
    element.classList.add("is-hidden");
    element.removeAttribute("datetime");
    element.removeAttribute("title");
    element.textContent = "";
    return;
  }
  const now = new Date();
  const sameDay = date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
  const hour = new Intl.DateTimeFormat("pl-PL", { hour: "2-digit", minute: "2-digit" }).format(date);
  const label = sameDay
    ? hour
    : `${new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "2-digit" }).format(date)}, ${hour}`;
  const fullLabel = new Intl.DateTimeFormat("pl-PL", { dateStyle: "long", timeStyle: "short" }).format(date);
  element.dateTime = date.toISOString();
  element.title = `Ostatnia zmiana: ${fullLabel}`;
  element.setAttribute("aria-label", `Ostatnia zmiana: ${fullLabel}`);
  element.textContent = `Ostatnia zmiana: ${label}`;
  element.classList.remove("is-hidden");
}

function showPushFeedback(message) {
  window.clearTimeout(pushFeedbackTimer);
  pushFeedback.textContent = message;
  pushFeedback.classList.remove("is-hidden");
  pushFeedbackTimer = window.setTimeout(() => pushFeedback.classList.add("is-hidden"), 4200);
}

function supportsPushNotifications() {
  const apiAvailable = "serviceWorker" in navigator && "Notification" in window;
  return apiAvailable && (!isMobileDevice() || isAppInstalled());
}

async function refreshPushButton() {
  if (isDemoMode || !currentList) {
    notifyListButton.classList.add("is-hidden");
    return;
  }
  notifyListButton.classList.remove("is-hidden");
  if (!supportsPushNotifications()) {
    notifyListButton.classList.remove("is-enabled");
    const label = isMobileDevice() && !isAppInstalled()
      ? "Zainstaluj aplikację, aby włączyć powiadomienia"
      : "Powiadomienia nie są obsługiwane na tym urządzeniu";
    notifyListButton.setAttribute("aria-label", label);
    notifyListButton.title = label;
    return;
  }
  try {
    const enabled = Notification.permission === "granted" && Boolean(await window.ShoppingDB.getPushSubscription());
    notifyListButton.classList.toggle("is-enabled", enabled);
    const label = enabled ? "Wyślij powiadomienie do członków listy" : "Włącz powiadomienia na tym urządzeniu";
    notifyListButton.setAttribute("aria-label", label);
    notifyListButton.title = label;
  } catch {
    notifyListButton.classList.remove("is-enabled");
  }
}

async function handleNotifyList() {
  if (pushActionRunning || !currentList || isDemoMode) return;
  if (!supportsPushNotifications()) {
    if (isMobileDevice() && !isAppInstalled()) {
      showPushFeedback("Aby włączyć powiadomienia, zainstaluj aplikację i uruchom ją z ikony na ekranie głównym.");
      if (canShowInstallPrompt()) showInstallPrompt(isIosDevice() ? "ios" : "native");
    } else if (isIosDevice()) {
      showPushFeedback("Na iPhonie powiadomienia wymagają iOS 16.4 lub nowszego oraz uruchomienia aplikacji z ikony na ekranie głównym — nie w karcie Safari.");
    } else {
      showPushFeedback("Ta wersja systemu lub przeglądarki nie obsługuje powiadomień aplikacji.");
    }
    return;
  }
  pushActionRunning = true;
  notifyListButton.disabled = true;
  try {
    const wasEnabled = Notification.permission === "granted" && Boolean(await window.ShoppingDB.getPushSubscription());
    await window.ShoppingDB.enablePushNotifications();
    await refreshPushButton();
    if (!wasEnabled) {
      showPushFeedback("Powiadomienia są włączone na tym urządzeniu. Kliknij dzwonek ponownie, aby wysłać przypomnienie.");
      return;
    }
    const result = await window.ShoppingDB.sendListNotification(currentList.id);
    showPushFeedback(result.sent > 0
      ? `Powiadomienie wysłano na ${result.sent} ${result.sent === 1 ? "urządzenie" : "urządzenia"}.`
      : "Nikt z pozostałych członków tej listy nie włączył jeszcze powiadomień.");
  } catch (error) {
    console.error(error);
    showPushFeedback(error.message || "Nie udało się wysłać powiadomienia.");
  } finally {
    pushActionRunning = false;
    notifyListButton.disabled = false;
  }
}

async function showListSelection() {
  if (isDemoMode) return;
  closeAdminModeWithoutSaving();
  realtimeGeneration += 1;
  const stopSubscription = unsubscribeRealtime;
  unsubscribeRealtime = null;
  await stopSubscription?.();
  window.clearTimeout(realtimeRefreshTimer);
  currentList = null;
  window.ShoppingDB?.setActiveList(null);
  renameListMenuButton.classList.add("is-hidden");
  items = [];
  currentUserIsAdmin = false;
  adminModeButton.classList.add("is-hidden");
  eventLogMenuButton.classList.add("is-hidden");
  const displayName = currentProfile?.display_name || currentProfile?.username || "Użytkownik";
  document.querySelector("#profileMode").textContent = `${displayName}${currentUserIsDev ? " · Dev" : ""}`;
  document.querySelector("#profileDescription").textContent = "Wybierz listę zakupów.";
  profilePopover.classList.add("is-hidden");
  listBackButton.classList.add("is-hidden");
  document.querySelector("#listTitle").textContent = "Lista zakupów";
  updateListActivityTime(null);
  notifyListButton.classList.add("is-hidden");
  document.body.classList.add("choosing-list");
  listSelectionView.classList.remove("is-hidden");
  renderListSelection();
  setConnectionStatus("online", "połączono");
  document.title = "Wybierz listę";
  window.scrollTo(0, 0);
}

function setConnectionStatus(state, label) {
  connectionState = state;
  syncStatus.classList.remove("is-online", "is-syncing", "is-offline");
  syncStatus.classList.add(`is-${state}`);
  syncStatus.querySelector("span").textContent = label;
}

function rememberLocalItemMutation(itemId, isPurchased) {
  const previous = localItemMutations.get(itemId);
  window.clearTimeout(previous?.timer);
  const timer = window.setTimeout(() => localItemMutations.delete(itemId), 8000);
  localItemMutations.set(itemId, { isPurchased, timer });
}

function isOwnRealtimeItemMutation(payload) {
  if (payload.table !== "shopping_items" || payload.eventType !== "UPDATE") return false;
  const itemId = payload.new?.id;
  const mutation = itemId && localItemMutations.get(itemId);
  if (!mutation || payload.new?.is_purchased !== mutation.isPurchased) return false;
  window.clearTimeout(mutation.timer);
  localItemMutations.delete(itemId);
  return true;
}

function applyRemoteData(data, { preserveScroll = false } = {}) {
  const itemsChanged = itemCollectionSignature(items) !== itemCollectionSignature(data.items);
  items = data.items;
  productCatalog = data.catalog;
  storeNames = data.stores;
  productIdByKey = data.productIdByKey;
  storeIdByName = data.storeIdByName;
  managementCatalog = data.managementCatalog || managementCatalog;
  if (!storeNames.includes(selectedStore)) {
    selectedStore = storeNames[0] || "";
    hasDefaultStore = false;
    storeConfirmed = false;
  }
  if (itemsChanged) {
    if (preserveScroll) renderItemsPreservingScroll();
    else renderItems();
  }
  updateProductDraft();
}

async function refreshRemoteItems({ force = false } = {}) {
  if (isDemoMode || !currentList || !window.ShoppingDB) return;
  if (!force && pendingItemUpdateIds.size) {
    remoteItemsRefreshDeferred = true;
    return;
  }
  try {
    const remoteItems = await window.ShoppingDB.loadItems();
    const nextItems = remoteItems.filter((item) => !pendingDeletionIds.has(item.id));
    const changed = itemCollectionSignature(items) !== itemCollectionSignature(nextItems);
    items = nextItems;
    if (changed) renderItemsPreservingScroll();
    remoteItemsRefreshDeferred = false;
    lastDatabaseRefreshAt = Date.now();
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
  if (isDemoMode || !currentList || !window.ShoppingDB) return;
  try {
    const data = await window.ShoppingDB.loadInitialData();
    applyRemoteData(data, { preserveScroll: true });
    lastDatabaseRefreshAt = Date.now();
    setConnectionStatus("online", "połączono");
  } catch (error) {
    console.error(error);
    setConnectionStatus("offline", "błąd synchronizacji");
  }
}

async function startRealtimeForCurrentList() {
  const generation = ++realtimeGeneration;
  const stopPreviousSubscription = unsubscribeRealtime;
  unsubscribeRealtime = null;
  await stopPreviousSubscription?.();
  if (generation !== realtimeGeneration) return;
  unsubscribeRealtime = window.ShoppingDB.subscribe(
    (payload) => {
      if (generation !== realtimeGeneration) return;
      if (isOwnRealtimeItemMutation(payload)) return;
      if (payload.table === "shopping_lists") {
        const list = availableLists.find((entry) => entry.id === payload.new?.id);
        if (list) {
          list.name = payload.new.name || list.name;
          list.updated_at = payload.new.updated_at || list.updated_at;
          if (currentList?.id === list.id) updateListActivityTime(list.updated_at);
        }
        return;
      }
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

async function openShoppingList(list) {
  if (!list || listOpenInProgress || isDemoMode) return;
  listOpenInProgress = true;
  listCards.querySelectorAll("button").forEach((button) => { button.disabled = true; });
  listSelectionMessage.classList.add("is-hidden");
  const preserveViewport = !appView.classList.contains("is-hidden") && Boolean(currentList);
  setConnectionStatus("syncing", "ładowanie…");
  try {
    window.ShoppingDB.setActiveList(list.id);
    const savedStore = localStorage.getItem(`${STORE_KEY}:${list.id}`) || localStorage.getItem(STORE_KEY);
    selectedStore = savedStore || "";
    hasDefaultStore = Boolean(savedStore);
    storeConfirmed = hasDefaultStore;
    selectedProduct = null;
    selectedCategory = null;
    selectedQuantity = 1;
    pendingProduct = null;
    const data = await window.ShoppingDB.loadInitialData();
    currentList = list;
    currentUserIsAdmin = currentUserIsDev || list.role === "admin";
    renameListMenuButton.classList.toggle("is-hidden", !currentUserIsAdmin);
    adminModeButton.classList.toggle("is-hidden", !currentUserIsAdmin);
    eventLogMenuButton.classList.toggle("is-hidden", !currentUserIsDev);
    document.querySelector("#listTitle").textContent = list.name;
    updateListActivityTime(list.updated_at);
    listBackButton.classList.toggle("is-hidden", availableLists.length < 2);
    document.body.classList.remove("choosing-list");
    listSelectionView.classList.add("is-hidden");
    applyRemoteData(data, { preserveScroll: preserveViewport });
    const displayName = currentProfile?.display_name || currentProfile?.username || "Użytkownik";
    document.querySelector("#profileMode").textContent = `${displayName}${currentUserIsDev ? " · Dev" : (currentUserIsAdmin ? " · Admin" : "")}`;
    document.querySelector("#profileDescription").textContent = `Aktualna lista: „${list.name}”.`;
    setConnectionStatus("online", "połączono");
    showApp({ render: false });
    document.title = `${list.name} · Lista zakupów`;
    await startRealtimeForCurrentList();
    await refreshPushButton();
  } catch (error) {
    console.error(error);
    currentList = null;
    renameListMenuButton.classList.add("is-hidden");
    eventLogMenuButton.classList.add("is-hidden");
    notifyListButton.classList.add("is-hidden");
    window.ShoppingDB.setActiveList(null);
    document.body.classList.add("choosing-list");
    listSelectionView.classList.remove("is-hidden");
    listSelectionMessage.textContent = error.message || "Nie udało się otworzyć listy.";
    listSelectionMessage.classList.remove("is-hidden");
    setConnectionStatus("offline", "błąd listy");
    scheduleRealtimeReconnect();
  } finally {
    listOpenInProgress = false;
    listCards.querySelectorAll("button").forEach((button) => { button.disabled = false; });
  }
}

async function enterDatabaseMode(session) {
  const previousListId = currentList?.id;
  isDemoMode = false;
  currentSession = session;
  setConnectionStatus("syncing", "łączenie…");
  const context = await window.ShoppingDB.loadUserContext();
  if (!context.profile) throw new Error("Użytkownik nie ma profilu aplikacji.");
  currentProfile = context.profile;
  currentUserIsDev = currentProfile.role === "dev";
  createListMenuButton.classList.toggle("is-hidden", !currentUserIsDev);
  createUserMenuButton.classList.toggle("is-hidden", !currentUserIsDev);
  assignUsersMenuButton.classList.toggle("is-hidden", !currentUserIsDev);
  listMembersManageMenuButton.classList.toggle("is-hidden", !currentUserIsDev);
  eventLogMenuButton.classList.toggle("is-hidden", !currentUserIsDev);
  renameListMenuButton.classList.add("is-hidden");
  changePasswordMenuButton.classList.remove("is-hidden");
  availableLists = context.lists;
  if (!availableLists.length) throw new Error("Użytkownik nie jest przypisany do żadnej listy.");
  setTheme(currentProfile.theme || "light");
  setAccentColor(currentProfile.accent_color || localStorage.getItem(ACCENT_COLOR_KEY) || DEFAULT_ACCENT_COLOR);
  const username = session.user.email?.split("@")[0] || "U";
  const displayName = currentProfile.display_name || username.slice(0, 1).toUpperCase() + username.slice(1);
  document.querySelector("#profileButton").textContent = username.slice(0, 1).toUpperCase();
  document.querySelector("#profileMode").textContent = `${displayName}${currentUserIsDev ? " · Dev" : ""}`;
  document.querySelector("#profileDescription").textContent = "Wybierz listę zakupów.";
  lastDatabaseRefreshAt = Date.now();
  realtimeReconnectAttempts = 0;
  const requestedListId = new URLSearchParams(window.location.search).get("list");
  const requestedList = requestedListId && availableLists.find((list) => list.id === requestedListId);
  if (requestedListId) window.history.replaceState({}, "", window.location.pathname);
  const listToRestore = requestedList || (previousListId && availableLists.find((list) => list.id === previousListId));
  if (listToRestore) await openShoppingList(listToRestore);
  else if (availableLists.length === 1) await openShoppingList(availableLists[0]);
  else {
    showApp();
    await showListSelection();
  }
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
  const lastSuccessfulConnection = Math.max(lastRealtimeConnectedAt, lastDatabaseRefreshAt);
  const connectionIsStale = Date.now() - lastSuccessfulConnection > 30000;
  if (!currentList || connectionState === "offline" || connectionIsStale) void reconnectDatabase();
  else void refreshRemoteItems();
}

function showDatabaseRecovery(session) {
  isDemoMode = false;
  currentSession = session;
  currentUserIsAdmin = false;
  currentUserIsDev = false;
  adminModeButton.classList.add("is-hidden");
  createListMenuButton.classList.add("is-hidden");
  createUserMenuButton.classList.add("is-hidden");
  assignUsersMenuButton.classList.add("is-hidden");
  listMembersManageMenuButton.classList.add("is-hidden");
  eventLogMenuButton.classList.add("is-hidden");
  renameListMenuButton.classList.add("is-hidden");
  changePasswordMenuButton.classList.remove("is-hidden");
  notifyListButton.classList.add("is-hidden");
  syncStatus.disabled = false;
  const username = session.user.email?.split("@")[0] || "U";
  document.querySelector("#profileButton").textContent = username.slice(0, 1).toUpperCase();
  document.querySelector("#profileMode").textContent = username.slice(0, 1).toUpperCase() + username.slice(1);
  document.querySelector("#profileDescription").textContent = "Sesja jest zapisana. Aplikacja automatycznie odnawia połączenie.";
  document.body.classList.add("choosing-list");
  listSelectionView.classList.remove("is-hidden");
  listCards.innerHTML = "";
  listSelectionMessage.textContent = navigator.onLine
    ? "Odnawianie połączenia z listami…"
    : "Brak internetu. Listy pojawią się automatycznie po odzyskaniu połączenia.";
  listSelectionMessage.classList.remove("is-hidden");
  setConnectionStatus("offline", navigator.onLine ? "ponawianie…" : "offline");
  showApp();
  scheduleRealtimeReconnect();
}

async function reconnectDatabase() {
  if (isDemoMode || isReconnectRunning || !window.ShoppingDB) return;
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
  availableLists = [];
  currentList = { id: "demo", name: "Podgląd", role: "member" };
  currentProfile = null;
  window.ShoppingDB?.setActiveList(null);
  document.body.classList.remove("choosing-list");
  listSelectionView.classList.add("is-hidden");
  listBackButton.classList.add("is-hidden");
  document.querySelector("#listTitle").textContent = "Lista zakupów";
  updateListActivityTime(null);
  notifyListButton.classList.add("is-hidden");
  currentUserIsAdmin = false;
  currentUserIsDev = false;
  adminModeButton.classList.add("is-hidden");
  createListMenuButton.classList.add("is-hidden");
  createUserMenuButton.classList.add("is-hidden");
  assignUsersMenuButton.classList.add("is-hidden");
  listMembersManageMenuButton.classList.add("is-hidden");
  eventLogMenuButton.classList.add("is-hidden");
  renameListMenuButton.classList.add("is-hidden");
  changePasswordMenuButton.classList.add("is-hidden");
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
  element.textContent = String(text ?? "");
  return element.innerHTML;
}

function escapeAttribute(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function eventLogPresentation(type) {
  const presentations = {
    item_added: { tone: "added", icon: "+", label: "Dodano do listy" },
    item_deleted: { tone: "deleted", icon: "×", label: "Usunięto z listy" },
    item_purchased: { tone: "neutral", icon: "✓", label: "Oznaczono jako kupione" },
    item_restored: { tone: "neutral", icon: "↩", label: "Przywrócono do kupienia" },
    item_store_changed: { tone: "neutral", icon: "↔", label: "Przeniesiono do innego sklepu" },
    item_quantity_changed: { tone: "neutral", icon: "#", label: "Zmieniono ilość" }
  };
  return presentations[type] || { tone: "neutral", icon: "•", label: "Zmieniono pozycję" };
}

function eventLogCountLabel(count) {
  if (count === 1) return "1 zdarzenie";
  const lastTwo = count % 100;
  const last = count % 10;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${count} zdarzenia`;
  return `${count} zdarzeń`;
}

function eventLogDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { short: "", full: "" };
  return {
    short: new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(date),
    full: new Intl.DateTimeFormat("pl-PL", { dateStyle: "long", timeStyle: "medium" }).format(date)
  };
}

function eventLogSearchText(entry) {
  const presentation = eventLogPresentation(entry.event_type);
  return normalizeProductSearch([
    entry.item_name,
    entry.actor_name,
    entry.actor_username,
    entry.list_name,
    entry.event_type,
    presentation.label,
    entry.details?.store_name,
    entry.details?.previous_store_name
  ].filter(Boolean).join(" "));
}

function renderEventLog() {
  const query = normalizeProductSearch(eventLogSearch.value);
  const visibleEntries = query
    ? eventLogEntries.filter((entry) => eventLogSearchText(entry).includes(query))
    : eventLogEntries;
  eventLogCount.textContent = query
    ? `${eventLogCountLabel(visibleEntries.length)} z ${eventLogEntries.length}`
    : eventLogCountLabel(visibleEntries.length);

  if (!visibleEntries.length) {
    eventLogList.innerHTML = "";
    eventLogMessage.textContent = eventLogLoading
      ? "Pobieranie historii…"
      : (query ? "Brak zdarzeń pasujących do wyszukiwania." : "Historia jest jeszcze pusta.");
    return;
  }

  eventLogMessage.textContent = "";
  eventLogList.innerHTML = visibleEntries.map((entry) => {
    const presentation = eventLogPresentation(entry.event_type);
    const date = eventLogDate(entry.created_at);
    const actor = entry.actor_name || entry.actor_username || "System";
    const store = entry.details?.store_name;
    const quantity = entry.details?.quantity;
    const expanded = expandedEventIds.has(String(entry.id));
    return `
      <article class="event-log-entry is-${presentation.tone} ${expanded ? "is-expanded" : ""}" data-event-id="${escapeAttribute(entry.id)}">
        <button class="event-log-summary-button" type="button" data-event-log-action="toggle" aria-expanded="${expanded}">
          <span class="event-log-icon" aria-hidden="true">${presentation.icon}</span>
          <span class="event-log-copy">
            <strong>${escapeHtml(entry.item_name || "Nieznana pozycja")}</strong>
            <span>${escapeHtml(presentation.label)}</span>
          </span>
          <span class="event-log-side">
            <time datetime="${escapeAttribute(entry.created_at || "")}" title="${escapeAttribute(date.full)}">${escapeHtml(date.short)}</time>
            <small>${escapeHtml(actor)}</small>
          </span>
          <svg class="event-log-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 10 4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="event-log-details">
          ${store ? `<span>Sklep <b>${escapeHtml(store)}</b></span>` : ""}
          ${quantity ? `<span>Ilość <b>${escapeHtml(quantity)} szt.</b></span>` : ""}
          <span>Dokładnie <b>${escapeHtml(date.full)}</b></span>
        </div>
      </article>`;
  }).join("");
}

async function loadEventLog() {
  if (!currentUserIsDev || !currentList || isDemoMode || eventLogLoading || !window.ShoppingDB) return;
  eventLogLoading = true;
  eventLogRefreshButton.disabled = true;
  eventLogRefreshButton.classList.add("is-loading");
  eventLogMessage.textContent = "Pobieranie historii…";
  if (!eventLogEntries.length) eventLogList.innerHTML = "";
  try {
    eventLogEntries = await window.ShoppingDB.loadEventLog();
    renderEventLog();
  } catch (error) {
    console.error(error);
    eventLogMessage.textContent = /get_event_log|event_log/i.test(error.message || "")
      ? "Najpierw uruchom plik supabase-event-log.sql w Supabase SQL Editor."
      : (error.message || "Nie udało się pobrać historii zdarzeń.");
  } finally {
    eventLogLoading = false;
    eventLogRefreshButton.disabled = false;
    eventLogRefreshButton.classList.remove("is-loading");
  }
}

function closeEventLog() {
  if (!isEventLogOpen) return;
  isEventLogOpen = false;
  document.body.classList.remove("event-log-open");
  eventLogView.classList.add("is-hidden");
  eventLogSearch.blur();
  document.title = currentList ? `${currentList.name} · Lista zakupów` : "Wybierz listę";
}

function openEventLog() {
  if (!currentUserIsDev || !currentList || isDemoMode || isAdminEditMode) return;
  if (eventLogListId !== currentList.id) {
    eventLogEntries = [];
    eventLogListId = currentList.id;
    expandedEventIds.clear();
    eventLogSearch.value = "";
  }
  isEventLogOpen = true;
  profilePopover.classList.add("is-hidden");
  document.body.classList.add("event-log-open");
  eventLogView.classList.remove("is-hidden");
  eventLogDescription.textContent = `Historia zmian na liście „${currentList.name}”.`;
  document.title = `Event Log · ${currentList.name}`;
  window.scrollTo(0, 0);
  renderEventLog();
  void loadEventLog();
}

function adminActionIcon(action) {
  if (action === "edit") {
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 16.5-.8 3.3 3.3-.8L18 8.5 15.5 6 5 16.5Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="m13.8 7.7 2.5 2.5" stroke="currentColor" stroke-width="1.7"/></svg>';
  }
  return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>';
}

function renderAdminInlineForm(type, item) {
  const hasIcon = type === "categories" || type === "products";
  const isProduct = type === "products";
  const stores = adminDraft.stores.filter((store) => store.is_active).sort((a, b) => a.position - b.position);
  return `
    <form class="admin-inline-form ${hasIcon ? "has-icon" : ""}" data-admin-form="${type}" data-id="${item.id}">
      <input name="name" type="text" minlength="2" maxlength="60" value="${escapeAttribute(item.name)}" aria-label="Nowa nazwa" required>
      ${hasIcon ? `<input name="icon" type="text" maxlength="8" value="${escapeAttribute(item.icon)}" aria-label="Nowa ikonka">` : ""}
      ${isProduct ? `<select name="defaultStoreId" aria-label="Domyślny sklep" required>
        ${stores.map((store) => `<option value="${escapeAttribute(store.id)}" ${store.id === item.default_store_id ? "selected" : ""}>${escapeHtml(store.name)}</option>`).join("")}
      </select>` : ""}
      <span class="admin-inline-buttons">
        <button type="button" data-admin-action="cancel-edit">Anuluj</button>
        <button type="submit">OK</button>
      </span>
    </form>`;
}

function renderAdminRow(type, item, meta, icon = "") {
  if (adminEditingItem?.type === type && adminEditingItem.id === item.id) {
    return `<div class="admin-row">${renderAdminInlineForm(type, item)}</div>`;
  }

  const deletePending = adminPendingDelete?.type === type && adminPendingDelete.id === item.id;
  return `
    <div class="admin-row" data-admin-type="${type}" data-id="${item.id}">
      <span class="admin-drag-handle" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="7" r="1.35"/><circle cx="15" cy="7" r="1.35"/><circle cx="9" cy="12" r="1.35"/><circle cx="15" cy="12" r="1.35"/><circle cx="9" cy="17" r="1.35"/><circle cx="15" cy="17" r="1.35"/></svg>
      </span>
      <span class="admin-row-copy">
        <strong>${icon ? `${escapeHtml(icon)} ` : ""}${escapeHtml(item.name)}</strong>
        <small>${escapeHtml(meta)}</small>
      </span>
      <span class="admin-row-actions">
        <button type="button" data-admin-action="edit" aria-label="Edytuj ${escapeAttribute(item.name)}">${adminActionIcon("edit")}</button>
        <button class="admin-delete" type="button" data-admin-action="delete" aria-label="Usuń ${escapeAttribute(item.name)}">${adminActionIcon("delete")}</button>
      </span>
      ${deletePending ? `
        <span class="admin-delete-confirm">
          <span>${type === "categories" ? "Kategoria i jej produkty znikną z wyboru." : "Pozycja zniknie z wyboru."}</span>
          <button type="button" data-admin-action="cancel-delete">Anuluj</button>
          <button class="is-danger" type="button" data-admin-action="confirm-delete">Usuń</button>
        </span>` : ""}
    </div>`;
}

function renderAdminList() {
  if (!adminDraft) return;
  adminMessage.textContent = "";
  document.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.adminTab === adminTab);
  });

  if (adminTab === "categories") {
    const categories = adminDraft.categories.filter((category) => category.is_active).sort((a, b) => a.position - b.position);
    adminList.innerHTML = categories.length
      ? `<div class="admin-sort-list" data-admin-list="categories">${categories.map((category) => {
        const productCount = adminDraft.products.filter((product) => product.is_active && product.category_id === category.id).length;
        return renderAdminRow("categories", category, `${productCount} produktów`, category.icon);
      }).join("")}</div>`
      : '<div class="admin-empty">Brak aktywnych kategorii.</div>';
    return;
  }

  if (adminTab === "stores") {
    const stores = adminDraft.stores.filter((store) => store.is_active).sort((a, b) => a.position - b.position);
    adminList.innerHTML = stores.length
      ? `<div class="admin-sort-list" data-admin-list="stores">${stores.map((store) => renderAdminRow("stores", store, "Sklep")).join("")}</div>`
      : '<div class="admin-empty">Brak aktywnych sklepów.</div>';
    return;
  }

  const categories = adminDraft.categories.filter((category) => category.is_active).sort((a, b) => a.position - b.position);
  const groups = categories.map((category) => {
    const products = adminDraft.products
      .filter((product) => product.is_active && product.category_id === category.id)
      .sort((a, b) => a.position - b.position);
    if (!products.length) return "";
    return `
      <section class="admin-group">
        <h2 class="admin-group-title"><span>${escapeHtml(category.icon)}</span>${escapeHtml(category.name)}</h2>
        <div class="admin-sort-list" data-admin-list="products" data-category-id="${category.id}">${products.map((product) => {
          const store = adminDraft.stores.find((entry) => entry.id === product.default_store_id);
          return renderAdminRow("products", product, `${category.name} · ${store?.name || "brak domyślnego sklepu"}`, product.icon || category.icon);
        }).join("")}</div>
      </section>`;
  }).join("");
  adminList.innerHTML = groups || '<div class="admin-empty">Brak aktywnych produktów.</div>';
}

function markAdminItemDeleted(type, id) {
  const item = adminDraft[type].find((entry) => entry.id === id);
  if (!item) return;
  item.is_active = false;
  if (type === "categories") {
    adminDraft.products.forEach((product) => {
      if (product.category_id === id) product.is_active = false;
    });
  }
  adminPendingDelete = null;
  renderAdminList();
}

function validateAdminName(type, item, name) {
  const duplicate = adminDraft[type].some((entry) => {
    if (!entry.is_active || entry.id === item.id || entry.name.toLowerCase() !== name.toLowerCase()) return false;
    return type !== "products" || entry.category_id === item.category_id;
  });
  if (duplicate) throw new Error("Taka nazwa już istnieje.");
}

function normalizeAdminDraftPositions() {
  ["categories", "stores"].forEach((type) => {
    adminDraft[type]
      .filter((entry) => entry.is_active)
      .sort((a, b) => a.position - b.position)
      .forEach((entry, index) => { entry.position = (index + 1) * 10; });
  });
  adminDraft.categories.forEach((category) => {
    adminDraft.products
      .filter((product) => product.is_active && product.category_id === category.id)
      .sort((a, b) => a.position - b.position)
      .forEach((product, index) => { product.position = (index + 1) * 10; });
  });
}

function settleAdminListAnimations(list) {
  list?.querySelectorAll(".admin-row:not(.is-admin-dragging)").forEach((row) => {
    row.getAnimations?.()
      .filter((animation) => animation.id === "admin-list-shift")
      .forEach((animation) => animation.cancel());
  });
}

function animateAdminListShift(list, beforePositions) {
  list.querySelectorAll(".admin-row[data-id]:not(.is-admin-dragging)").forEach((row) => {
    const before = beforePositions.get(row.dataset.id);
    if (!before) return;
    const after = row.getBoundingClientRect();
    const deltaY = before.top - after.top;
    if (Math.abs(deltaY) < 1 || !row.animate) return;
    const animation = row.animate(
      [{ transform: `translate3d(0, ${deltaY}px, 0)` }, { transform: "translate3d(0, 0, 0)" }],
      { duration: 190, easing: "cubic-bezier(.2, .8, .2, 1)" }
    );
    animation.id = "admin-list-shift";
  });
}

function cancelAdminLongPress() {
  if (!adminPressState) return;
  clearTimeout(adminPressState.timer);
  adminPressState.row.classList.remove("is-admin-pressing");
  adminPressState = null;
}

function updateAdminDraftOrder(list) {
  if (!adminDraft) return;
  const type = list.dataset.adminList;
  [...list.querySelectorAll(".admin-row[data-id]")].forEach((row, index) => {
    const item = adminDraft[type]?.find((entry) => entry.id === row.dataset.id);
    if (item) item.position = (index + 1) * 10;
  });
}

function finishAdminDrag({ applyOrder = true } = {}) {
  if (!adminDragState) return;
  const { row, placeholder, list, scrollLock } = adminDragState;
  settleAdminListAnimations(list);
  if (placeholder.isConnected) placeholder.replaceWith(row);
  row.classList.remove("is-admin-dragging");
  row.removeAttribute("style");
  list.classList.remove("is-admin-sorting");
  document.body.classList.remove("admin-reordering");
  adminDragState = null;
  unlockPageScroll(scrollLock);
  adminSuppressClickUntil = Date.now() + 350;
  if (applyOrder) {
    updateAdminDraftOrder(list);
    renderAdminList();
  }
}

function startAdminDragFromPress() {
  if (!adminPressState || !adminDraft) return;
  const { row, pointerId, startX, startY, captureTarget } = adminPressState;
  const list = row.closest(".admin-sort-list");
  if (!list) return cancelAdminLongPress();
  const rect = row.getBoundingClientRect();
  const placeholder = document.createElement("div");
  placeholder.className = "admin-row-placeholder";
  placeholder.style.height = `${rect.height}px`;
  row.after(placeholder);

  try { captureTarget.setPointerCapture(pointerId); } catch { /* wskaźnik mógł zostać zwolniony */ }
  row.classList.remove("is-admin-pressing");
  row.classList.add("is-admin-dragging");
  list.classList.add("is-admin-sorting");
  document.body.classList.add("admin-reordering");
  const scrollLock = lockPageScroll();
  Object.assign(row.style, {
    position: "fixed",
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: "0",
    pointerEvents: "none",
    transform: "translate3d(0, 0, 0) scale(1.015)"
  });
  adminDragState = { row, list, placeholder, startX, startY, scrollLock, lastPlacement: "" };
  adminPressState = null;
  if (navigator.vibrate) navigator.vibrate(25);
}

function openAdminMode() {
  if (!currentUserIsAdmin || isDemoMode || isAdminEditMode) return;
  adminDraft = JSON.parse(JSON.stringify(managementCatalog));
  normalizeAdminDraftPositions();
  adminTab = "categories";
  adminEditingItem = null;
  adminPendingDelete = null;
  adminMessage.textContent = "";
  isAdminEditMode = true;
  document.body.classList.add("admin-editing");
  adminView.classList.remove("is-hidden");
  document.querySelector("#adminModeLabel").textContent = "Zapisz i wyjdź";
  document.querySelector("#themeColorMeta")?.setAttribute("content", "#d84a42");
  profilePopover.classList.add("is-hidden");
  renderAdminList();
  window.scrollTo(0, 0);
}

function closeAdminModeWithoutSaving() {
  cancelAdminLongPress();
  finishAdminDrag({ applyOrder: false });
  isAdminEditMode = false;
  isAdminSaving = false;
  adminDraft = null;
  adminEditingItem = null;
  adminPendingDelete = null;
  document.body.classList.remove("admin-editing");
  adminView.classList.add("is-hidden");
  adminModeButton.disabled = false;
  document.querySelector("#adminModeLabel").textContent = "Tryb edycji";
  setTheme(document.documentElement.dataset.theme || "light");
}

async function saveAndCloseAdminMode() {
  if (!isAdminEditMode || isAdminSaving || !adminDraft) return;
  if (adminEditingItem || adminPendingDelete) {
    adminMessage.textContent = "Najpierw zatwierdź albo anuluj otwartą zmianę.";
    profilePopover.classList.add("is-hidden");
    return;
  }
  isAdminSaving = true;
  profilePopover.classList.add("is-hidden");
  adminModeButton.disabled = true;
  document.querySelector("#adminModeLabel").textContent = "Zapisywanie…";
  setConnectionStatus("syncing", "zapisywanie…");
  try {
    await window.ShoppingDB.saveAdminCatalog(adminDraft);
    closeAdminModeWithoutSaving();
    await refreshRemoteData();
  } catch (error) {
    console.error(error);
    isAdminSaving = false;
    adminModeButton.disabled = false;
    document.querySelector("#adminModeLabel").textContent = "Spróbuj zapisać";
    adminMessage.textContent = error.code === "23505"
      ? "Nazwa kategorii, produktu lub sklepu już istnieje."
      : (error.message || "Nie udało się zapisać zmian.");
    setConnectionStatus("offline", "błąd zapisu");
    profilePopover.classList.add("is-hidden");
  }
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
      <span class="item-product-icon" aria-hidden="true">${escapeHtml(item.icon || "🛒")}</span>
      <div class="item-copy">
        <div class="item-main">
          <span class="item-name"><span>${escapeHtml(item.name)}</span></span>
          <span class="item-quantity">${item.quantity} szt.</span>
        </div>
        <span class="item-meta">${escapeHtml(item.category)} · dodał(a): ${escapeHtml(item.addedBy)}</span>
      </div>
      ${currentUserIsAdmin && item.custom ? `
        <button class="promote-product-button" type="button" aria-label="Dodaj ${escapeAttribute(item.name)} na stałe do katalogu" title="Dodaj do katalogu" data-action="promote-custom">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>` : ""}
      <button class="delete-button" type="button" aria-label="Usuń ${escapeAttribute(item.name)}" data-action="delete">
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
      <div class="items-list" data-store="${escapeAttribute(store)}">${storeItems.map(itemMarkup).join("")}</div>
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
  requestAnimationFrame(updateItemNameMarquees);
}

function updateItemNameMarquees() {
  document.querySelectorAll(".item-name").forEach((name) => {
    const label = name.firstElementChild;
    if (!label) return;
    const overflow = label.scrollWidth - name.clientWidth;
    name.classList.toggle("is-overflowing", overflow > 12);
    if (overflow > 12) label.style.setProperty("--marquee-offset", `${Math.ceil(overflow + 10)}px`);
    else label.style.removeProperty("--marquee-offset");
  });
}

function renderItemsPreservingScroll() {
  const scrollY = window.scrollY;
  renderItems();
  requestAnimationFrame(() => window.scrollTo(0, scrollY));
}

function itemCollectionSignature(collection) {
  return JSON.stringify(collection.map((item) => [
    item.id,
    item.productId,
    item.storeId,
    item.name,
    item.icon,
    item.category,
    item.store,
    item.addedBy,
    item.quantity,
    item.done,
    item.position,
    item.custom
  ]));
}

function updateItemSectionState() {
  const activeCount = items.filter((item) => !item.done).length;
  const purchasedCount = items.length - activeCount;
  document.querySelector("#activeCount").textContent = activeCount;
  document.querySelector("#purchasedCount").textContent = purchasedCount;
  document.querySelector("#activeEmpty").classList.toggle("is-hidden", activeCount > 0);
  document.querySelector("#purchasedEmpty").classList.toggle("is-hidden", purchasedCount > 0);
  clearButton.classList.toggle("is-hidden", purchasedCount === 0);
}

function getOrCreateStoreList(container, store) {
  const existing = [...container.querySelectorAll(".items-list")]
    .find((list) => list.dataset.store === store);
  if (existing) return existing;

  const group = document.createElement("div");
  group.className = "store-group";
  group.innerHTML = `
    <div class="store-heading"><i>${escapeHtml(store.slice(0, 1))}</i><h3>${escapeHtml(store)}</h3></div>
    <div class="items-list" data-store="${escapeAttribute(store)}"></div>`;
  container.append(group);
  return group.querySelector(".items-list");
}

function moveToggledItemWithoutRerender(item, element) {
  const scrollY = window.scrollY;
  const sourceGroup = element.closest(".store-group");
  const destinationContainer = item.done ? purchasedItems : activeItems;
  const destinationList = getOrCreateStoreList(destinationContainer, item.store);
  const nextItem = items
    .filter((entry) => entry.id !== item.id && entry.done === item.done && entry.store === item.store && entry.position > item.position)
    .sort((a, b) => a.position - b.position)[0];
  const nextElement = nextItem && destinationList.querySelector(`[data-id="${nextItem.id}"]`);

  element.classList.toggle("is-done", item.done);
  element.classList.add("is-section-moving");
  const checkButton = element.querySelector(".check-button");
  checkButton.blur();
  checkButton.setAttribute("aria-label", item.done ? "Przywróć do aktywnych" : "Oznacz jako kupione");
  checkButton.innerHTML = item.done
    ? '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6.5 12.5 3.5 3.5 7.5-8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    : "";
  if (nextElement) destinationList.insertBefore(element, nextElement);
  else destinationList.append(element);
  if (sourceGroup && !sourceGroup.querySelector(".item")) sourceGroup.remove();
  updateItemSectionState();
  requestAnimationFrame(() => {
    window.scrollTo(0, scrollY);
    element.classList.remove("is-section-moving");
  });
}

function optionArrow() {
  return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 5 7 7-7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function normalizedCatalogProduct(product, category) {
  return typeof product === "string"
    ? { id: null, key: product, name: product, icon: category.icon || "🛒" }
    : { ...product, key: product.id || product.name, icon: product.icon || category.icon || "🛒" };
}

function categoryOptionsMarkup() {
  return productCatalog.map((category) => `
    <button class="picker-option" type="button" data-picker-action="category" data-value="${category.id}">
      <span class="picker-option-icon">${escapeHtml(category.icon)}</span>
      <span class="picker-option-copy"><strong>${escapeHtml(category.name)}</strong><small>${category.products.length} produktów</small></span>
      ${optionArrow()}
    </button>`).join("");
}

function normalizeProductSearch(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pl-PL");
}

function productSearchResultsMarkup(query) {
  const normalizedQuery = normalizeProductSearch(query);
  if (!normalizedQuery) return `<div class="picker-options">${categoryOptionsMarkup()}</div>`;

  const matches = productCatalog.flatMap((category) => category.products
    .map((entry) => ({ category, product: normalizedCatalogProduct(entry, category) })))
    .filter(({ product }) => normalizeProductSearch(product.name).includes(normalizedQuery));
  const exactMatch = matches.some(({ product }) => normalizeProductSearch(product.name) === normalizedQuery);
  const saveToCatalogButton = currentUserIsAdmin
    ? `<button class="picker-custom-save" type="button" data-picker-action="save-custom-product" data-value="${escapeAttribute(query.trim())}" aria-label="Dodaj ${escapeAttribute(query.trim())} na stałe do katalogu" title="Dodaj na stałe do katalogu">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>`
    : "";
  const customOption = query.trim().length >= 2 && !exactMatch
    ? `<div class="picker-custom-row ${currentUserIsAdmin ? "has-save-action" : ""}">
        <button class="picker-option picker-option--custom" type="button" data-picker-action="custom-product" data-value="${escapeAttribute(query.trim())}">
          <span class="picker-option-icon">✏️</span>
          <span class="picker-option-copy"><strong>Dodaj „${escapeHtml(query.trim())}”</strong><small>Jednorazowo, bez zapisywania w katalogu</small></span>
          ${optionArrow()}
        </button>
        ${saveToCatalogButton}
      </div>`
    : "";
  const resultOptions = matches.map(({ category, product }) => `
    <button class="picker-option" type="button" data-picker-action="search-product" data-category-id="${category.id}" data-value="${escapeAttribute(product.key)}">
      <span class="picker-option-icon">${escapeHtml(product.icon)}</span>
      <span class="picker-option-copy"><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(category.name)}</small></span>
      ${optionArrow()}
    </button>`).join("");

  return `<div class="picker-options">${resultOptions}${customOption}</div>${!matches.length && !customOption ? '<div class="picker-search-empty">Wpisz co najmniej 2 znaki, aby dodać własny produkt.</div>' : ""}`;
}

function renderCategoryPicker(query = "") {
  pickerMode = "categories";
  selectedCategory = null;
  productSearchQuery = query;
  pickerTitle.textContent = "Wybierz produkt";
  pickerBack.classList.add("is-hidden");
  pickerContent.innerHTML = `
    <label class="product-search">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      <input id="productSearchInput" type="search" maxlength="60" placeholder="Szukaj lub wpisz własny produkt" value="${escapeAttribute(query)}" autocomplete="off" enterkeyhint="search">
    </label>
    <div id="productSearchResults">${productSearchResultsMarkup(query)}</div>`;
}

function renderProductPicker(category) {
  pickerMode = "products";
  selectedCategory = category;
  pickerTitle.textContent = category.name;
  pickerBack.classList.remove("is-hidden");
  pickerContent.innerHTML = `<div class="picker-options">${category.products.map((entry) => {
    const product = normalizedCatalogProduct(entry, category);
    return `
    <button class="picker-option" type="button" data-picker-action="product" data-value="${escapeAttribute(product.key)}">
      <span class="picker-option-icon">${escapeHtml(product.icon)}</span>
      <span class="picker-option-copy"><strong>${escapeHtml(product.name)}</strong><small>Wybierz produkt</small></span>
      ${optionArrow()}
    </button>`;
  }).join("")}</div>`;
}

function renderQuantityPicker(product) {
  pickerMode = "quantity";
  pendingProduct = product;
  selectedQuantity = 1;
  pickerTitle.textContent = product.name;
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

function openItemEditor(item) {
  if (!item || !storeNames.length) return;
  editingItemId = item.id;
  pickerMode = "edit-item";
  pickerTitle.textContent = "Edytuj pozycję";
  pickerBack.classList.add("is-hidden");
  pickerContent.innerHTML = `
    <form class="catalog-form item-edit-form" id="itemEditForm">
      <div class="item-edit-preview"><span>${escapeHtml(item.icon || "🛒")}</span><strong>${escapeHtml(item.name)}</strong></div>
      <label for="editItemQuantity">Ilość</label>
      <div class="quantity-control">
        <button type="button" data-picker-action="edit-quantity-decrease" aria-label="Zmniejsz ilość">−</button>
        <span class="quantity-value" id="editItemQuantityValue">${escapeHtml(item.quantity)} <small>szt.</small></span>
        <input id="editItemQuantity" name="quantity" type="hidden" value="${escapeAttribute(item.quantity)}">
        <button type="button" data-picker-action="edit-quantity-increase" aria-label="Zwiększ ilość">+</button>
      </div>
      <label for="editItemStore">Sklep</label>
      <select id="editItemStore" name="storeId" required>
        ${storeNames.map((store) => `<option value="${escapeAttribute(isDemoMode ? store : (storeIdByName.get(store) || ""))}" ${store === item.store ? "selected" : ""}>${escapeHtml(store)}</option>`).join("")}
      </select>
      <p class="catalog-form-message" role="alert"></p>
      <button class="catalog-form-submit" type="submit">Zapisz zmiany</button>
    </form>`;
  pickerBackdrop.classList.remove("is-hidden");
  pickerSheet.classList.remove("is-hidden");
  document.body.classList.add("picker-open");
}

function renderStorePicker() {
  pickerMode = "stores";
  selectedCategory = null;
  pickerTitle.textContent = "Wybierz sklep";
  pickerBack.classList.add("is-hidden");
  pickerContent.innerHTML = `<div class="picker-options">${storeNames.map((store) => `
    <button class="picker-option ${store === selectedStore ? "is-selected" : ""}" type="button" data-picker-action="store" data-value="${escapeAttribute(store)}">
      <span class="picker-option-icon">🏪</span>
      <span class="picker-option-copy"><strong>${escapeHtml(store)}</strong><small>${store === selectedStore ? "Aktualnie wybrany" : "Ustaw jako domyślny"}</small></span>
      ${store === selectedStore ? '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4 10-10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ""}
    </button>`).join("")}</div>`;
}

function openAccentColorPicker() {
  pickerMode = "accent-color";
  pickerTitle.textContent = "Kolor aplikacji";
  pickerBack.classList.add("is-hidden");
  const selected = localStorage.getItem(ACCENT_COLOR_KEY) || DEFAULT_ACCENT_COLOR;
  pickerContent.innerHTML = `
    <div class="accent-picker">
      <p>Ten kolor jest widoczny tylko w Twojej aplikacji.</p>
      <div class="accent-color-grid">
        ${ACCENT_COLORS.map((color) => `
          <button class="accent-color-option ${color.value === selected ? "is-selected" : ""}" type="button" data-picker-action="accent-color" data-value="${color.value}" style="--accent-option: ${color.value}" ${color.value === "#ffffff" ? 'data-light="true"' : ""} aria-label="${color.label}" aria-pressed="${color.value === selected}">
            ${color.value === selected ? '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4 10-10" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ""}
          </button>`).join("")}
      </div>
    </div>`;
  pickerBackdrop.classList.remove("is-hidden");
  pickerSheet.classList.remove("is-hidden");
  document.body.classList.add("picker-open");
}

async function saveAccentColor(color) {
  if (!isAccentColor(color)) return;
  setAccentColor(color);
  currentProfile = currentProfile ? { ...currentProfile, accent_color: color } : currentProfile;
  closePicker();
  if (isDemoMode || !window.ShoppingDB || !currentSession) return;
  try {
    setConnectionStatus("syncing", "zapisywanie…");
    await window.ShoppingDB.updateAccentColor(color);
    currentProfile = { ...currentProfile, accent_color: color };
    setConnectionStatus("online", "połączono");
  } catch (error) {
    console.error(error);
    setConnectionStatus("online", "połączono");
    showPushFeedback("Kolor zapisano lokalnie. Aby zsynchronizować go z kontem, uruchom ponownie SQL ustawień koloru w Supabase.");
  }
}

function renderAddProductForm(prefilledName = "", fromSearch = false) {
  pickerMode = fromSearch ? "add-product-from-search" : "add-product";
  pickerTitle.textContent = fromSearch ? "Dodaj do katalogu" : "Dodaj produkt";
  pickerBack.classList.toggle("is-hidden", !fromSearch);
  pickerContent.innerHTML = `
    <form class="catalog-form" id="addProductForm">
      <label for="newProductName">Nazwa produktu</label>
      <input id="newProductName" name="name" type="text" minlength="2" maxlength="60" placeholder="Np. Mozzarella" value="${escapeAttribute(prefilledName)}" autocomplete="off" required>
      <label for="newProductIcon">Ikonka</label>
      <input class="catalog-icon-input" id="newProductIcon" name="icon" type="text" maxlength="8" value="🛒" aria-label="Ikonka produktu">
      <label for="newProductCategory">Kategoria</label>
      <select id="newProductCategory" name="categoryId" required>
        ${productCatalog.map((category) => `<option value="${category.id}">${escapeHtml(category.name)}</option>`).join("")}
      </select>
      <label for="newProductStore">Domyślny sklep</label>
      <select id="newProductStore" name="defaultStoreId" required ${storeNames.length ? "" : "disabled"}>
        ${storeNames.length
          ? storeNames.map((store) => `<option value="${escapeAttribute(isDemoMode ? store : (storeIdByName.get(store) || ""))}">${escapeHtml(store)}</option>`).join("")
          : '<option>Najpierw dodaj sklep</option>'}
      </select>
      <p class="catalog-form-message" role="alert"></p>
      <button class="catalog-form-submit" type="submit">Zapisz produkt</button>
    </form>`;
  window.setTimeout(() => {
    const input = document.querySelector(fromSearch ? "#newProductIcon" : "#newProductName");
    input?.focus();
    input?.select();
  }, 50);
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

function renderCreateListForm() {
  pickerMode = "create-list";
  pickerTitle.textContent = "Utwórz listę";
  pickerBack.classList.add("is-hidden");
  const selectableUsers = manageableUsers.filter((user) => user.user_id !== currentSession?.user?.id);
  pickerContent.innerHTML = `
    <form class="list-create-form">
      <label for="newListName">Nazwa listy</label>
      <input id="newListName" name="name" type="text" minlength="2" maxlength="60" placeholder="Np. Znajomi" autocomplete="off" required>
      <fieldset class="list-members-fieldset">
        <legend>Dodaj użytkowników</legend>
        <p>Ty zostaniesz administratorem. Pozostałe osoby możesz zaznaczyć poniżej.</p>
        <div class="list-member-options">
          ${selectableUsers.length ? selectableUsers.map((user) => `
            <label class="list-member-option">
              <input type="checkbox" name="memberIds" value="${escapeAttribute(user.user_id)}">
              <span><strong>${escapeHtml(user.display_name)}</strong><small>@${escapeHtml(user.username)}</small></span>
            </label>`).join("") : '<span class="list-members-empty">Brak innych użytkowników do dodania.</span>'}
        </div>
      </fieldset>
      <p class="catalog-form-message" role="alert"></p>
      <button class="catalog-form-submit" type="submit">Utwórz listę</button>
    </form>`;
  window.setTimeout(() => document.querySelector("#newListName")?.focus(), 50);
}

async function openCreateListForm() {
  if (!currentUserIsDev || isDemoMode) return;
  profilePopover.classList.add("is-hidden");
  pickerMode = "create-list-loading";
  pickerTitle.textContent = "Utwórz listę";
  pickerBack.classList.add("is-hidden");
  pickerContent.innerHTML = '<div class="list-form-loading">Ładowanie użytkowników…</div>';
  pickerBackdrop.classList.remove("is-hidden");
  pickerSheet.classList.remove("is-hidden");
  document.body.classList.add("picker-open");
  try {
    manageableUsers = await window.ShoppingDB.loadManageableUsers();
    renderCreateListForm();
  } catch (error) {
    console.error(error);
    pickerContent.innerHTML = `<div class="list-form-error">${escapeHtml(error.message || "Nie udało się pobrać użytkowników.")}</div>`;
  }
}

function managedListLabel(list) {
  const listPool = manageableLists.length ? manageableLists : availableLists;
  const duplicateName = listPool.some((entry) => entry.id !== list.id && entry.name === list.name);
  return duplicateName ? `${list.name} · ${list.id.slice(0, 4)}` : list.name;
}

function renderAssignUsersForm(listId = manageableLists[0]?.id, role = "member") {
  pickerMode = "assign-users";
  pickerTitle.textContent = "Przypisz do listy";
  pickerBack.classList.add("is-hidden");
  const lists = manageableLists.length ? manageableLists : availableLists;
  const selectedListId = lists.some((list) => list.id === listId) ? listId : lists[0]?.id;
  const existingUserIds = new Set(manageableMemberships
    .filter((membership) => membership.list_id === selectedListId)
    .map((membership) => membership.user_id));
  const selectableUsers = manageableUsers.filter((user) => !existingUserIds.has(user.user_id));
  pickerContent.innerHTML = `
    <form class="list-create-form assign-users-form">
      <label for="assignUsersList">Lista</label>
      <select id="assignUsersList" name="listId" required>
        ${lists.map((list) => `<option value="${list.id}" ${list.id === selectedListId ? "selected" : ""}>${escapeHtml(managedListLabel(list))}</option>`).join("")}
      </select>
      <label for="assignUsersRole">Rola na liście</label>
      <select id="assignUsersRole" name="role">
        <option value="member" ${role === "member" ? "selected" : ""}>Użytkownik</option>
        <option value="admin" ${role === "admin" ? "selected" : ""}>Administrator katalogu</option>
      </select>
      <fieldset class="list-members-fieldset">
        <legend>Istniejący użytkownicy</legend>
        <p>Wyświetlane są tylko osoby, które nie należą jeszcze do wybranej listy.</p>
        <div class="list-member-options">
          ${selectableUsers.length ? selectableUsers.map((user) => `
            <label class="list-member-option">
              <input type="checkbox" name="userIds" value="${escapeAttribute(user.user_id)}">
              <span><strong>${escapeHtml(user.display_name)}</strong><small>@${escapeHtml(user.username)}</small></span>
            </label>`).join("") : '<span class="list-members-empty">Wszyscy istniejący użytkownicy są już przypisani do tej listy.</span>'}
        </div>
      </fieldset>
      <p class="catalog-form-message" role="alert"></p>
      <button class="catalog-form-submit" type="submit" ${selectableUsers.length ? "" : "disabled"}>Dodaj do listy</button>
    </form>`;
}

async function openAssignUsersForm() {
  if (!currentUserIsDev || isDemoMode) return;
  profilePopover.classList.add("is-hidden");
  pickerMode = "assign-users-loading";
  pickerTitle.textContent = "Przypisz do listy";
  pickerBack.classList.add("is-hidden");
  pickerContent.innerHTML = '<div class="list-form-loading">Ładowanie użytkowników i list…</div>';
  pickerBackdrop.classList.remove("is-hidden");
  pickerSheet.classList.remove("is-hidden");
  document.body.classList.add("picker-open");
  try {
    [manageableUsers, manageableMemberships, manageableLists] = await Promise.all([
      window.ShoppingDB.loadManageableUsers(),
      window.ShoppingDB.loadManageableMemberships(),
      window.ShoppingDB.loadManageableShoppingLists()
    ]);
    renderAssignUsersForm(currentList?.id || manageableLists[0]?.id);
  } catch (error) {
    console.error(error);
    pickerContent.innerHTML = `<div class="list-form-error">${escapeHtml(error.message || "Nie udało się pobrać przypisań użytkowników.")}</div>`;
  }
}

function renderCreateUserForm() {
  pickerMode = "create-user";
  pickerTitle.textContent = "Dodaj użytkownika";
  pickerBack.classList.add("is-hidden");
  pickerContent.innerHTML = `
    <form class="list-create-form user-create-form">
      <label for="newUserDisplayName">Nazwa użytkownika</label>
      <input id="newUserDisplayName" name="displayName" type="text" minlength="2" maxlength="60" placeholder="Np. Patryk" autocomplete="off" required>
      <label for="newUserLogin">Login</label>
      <input id="newUserLogin" name="login" type="text" minlength="2" maxlength="30" pattern="[a-zA-Z0-9_-]+" placeholder="Np. patryk" autocapitalize="none" autocomplete="off" required>
      <label for="newUserPassword">Hasło startowe</label>
      <input id="newUserPassword" name="password" type="password" minlength="8" maxlength="72" placeholder="Minimum 8 znaków" autocomplete="new-password" required>
      <label for="newUserListRole">Rola na wybranych listach</label>
      <select id="newUserListRole" name="listRole">
        <option value="member">Użytkownik</option>
        <option value="admin">Administrator katalogu</option>
      </select>
      <fieldset class="list-members-fieldset">
        <legend>Przypisz do list</legend>
        <p>Użytkownik od razu otrzyma dostęp do wszystkich zaznaczonych list.</p>
        <div class="list-member-options">
          ${availableLists.map((list) => `
            <label class="list-member-option">
              <input type="checkbox" name="listIds" value="${escapeAttribute(list.id)}" ${list.id === currentList?.id ? "checked" : ""}>
              <span><strong>${escapeHtml(list.name)}</strong><small>Dostęp do listy zakupów</small></span>
            </label>`).join("")}
        </div>
      </fieldset>
      <p class="catalog-form-message" role="alert"></p>
      <button class="catalog-form-submit" type="submit">Utwórz użytkownika</button>
    </form>`;
  window.setTimeout(() => document.querySelector("#newUserDisplayName")?.focus(), 50);
}

function openCreateUserForm() {
  if (!currentUserIsDev || isDemoMode) return;
  profilePopover.classList.add("is-hidden");
  renderCreateUserForm();
  pickerBackdrop.classList.remove("is-hidden");
  pickerSheet.classList.remove("is-hidden");
  document.body.classList.add("picker-open");
}

function openRenameListForm() {
  if (!currentUserIsAdmin || !currentList || isDemoMode) return;
  profilePopover.classList.add("is-hidden");
  pickerMode = "rename-list";
  pickerTitle.textContent = "Zmień nazwę listy";
  pickerBack.classList.add("is-hidden");
  pickerContent.innerHTML = `
    <form class="list-create-form rename-list-form">
      <label for="renamedListName">Nowa nazwa</label>
      <input id="renamedListName" name="name" type="text" minlength="2" maxlength="60" value="${escapeAttribute(currentList.name)}" autocomplete="off" required>
      <p class="catalog-form-message" role="alert"></p>
      <button class="catalog-form-submit" type="submit">Zapisz nazwę</button>
    </form>`;
  pickerBackdrop.classList.remove("is-hidden");
  pickerSheet.classList.remove("is-hidden");
  document.body.classList.add("picker-open");
  window.setTimeout(() => {
    const input = document.querySelector("#renamedListName");
    input?.focus();
    input?.select();
  }, 50);
}

function openChangePasswordForm() {
  if (isDemoMode || !currentSession) return;
  profilePopover.classList.add("is-hidden");
  pickerMode = "change-password";
  pickerTitle.textContent = "Zmień hasło";
  pickerBack.classList.add("is-hidden");
  pickerContent.innerHTML = `
    <form class="list-create-form password-change-form">
      <label for="newPassword">Nowe hasło</label>
      <input id="newPassword" name="newPassword" type="password" minlength="8" maxlength="72" autocomplete="new-password" required>
      <label for="repeatPassword">Powtórz nowe hasło</label>
      <input id="repeatPassword" name="repeatPassword" type="password" minlength="8" maxlength="72" autocomplete="new-password" required>
      <p class="catalog-form-message" role="alert"></p>
      <button class="catalog-form-submit" type="submit">Zapisz nowe hasło</button>
    </form>`;
  pickerBackdrop.classList.remove("is-hidden");
  pickerSheet.classList.remove("is-hidden");
  document.body.classList.add("picker-open");
  window.setTimeout(() => document.querySelector("#newPassword")?.focus(), 50);
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

function openPromoteCustomProductForm(item) {
  if (!currentUserIsAdmin || !item?.custom || isDemoMode) return;
  pendingCatalogPromotion = { itemId: item.id, name: item.name };
  renderAddProductForm(item.name, true);
  pickerMode = "promote-custom-product";
  pickerTitle.textContent = "Dodaj do katalogu";
  pickerBack.classList.add("is-hidden");
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

function updatePickerViewport() {
  const viewport = window.visualViewport;
  const visibleHeight = viewport?.height || window.innerHeight;
  const offsetTop = viewport?.offsetTop || 0;
  const layoutHeight = Math.max(window.innerHeight, document.documentElement.clientHeight, visibleHeight);
  const keyboardInset = Math.max(0, layoutHeight - visibleHeight - offsetTop);
  const focusedElement = document.activeElement;
  const keyboardActive = pickerSheet.contains(focusedElement)
    && focusedElement?.matches?.("input, textarea, select");
  pickerSheet.style.setProperty("--picker-visible-height", `${Math.max(260, visibleHeight)}px`);
  pickerSheet.style.setProperty("--picker-keyboard-inset", `${keyboardInset}px`);
  pickerSheet.classList.toggle("is-keyboard-active", keyboardActive);
}

function closePicker() {
  if (pickerMode === "promote-custom-product") pendingCatalogPromotion = null;
  if (pickerMode === "edit-item") editingItemId = null;
  pickerBackdrop.classList.add("is-hidden");
  pickerSheet.classList.add("is-hidden");
  pickerSheet.classList.remove("is-keyboard-active");
  document.body.classList.remove("picker-open");
}

function updateProductDraft() {
  selectedProductLabel.textContent = selectedProduct
    ? `${selectedProduct.name} · ${selectedProduct.quantity} szt. · ${selectedProduct.store || "brak sklepu"}`
    : "Wybierz produkt";
  addSelectedButton.disabled = !selectedProduct || !selectedProduct.storeId;
}

function confirmProductDraft() {
  if (!pendingProduct) return;
  const fallbackStore = storeNames[0] || "";
  const store = pendingProduct.defaultStoreName || fallbackStore;
  const storeId = pendingProduct.defaultStoreId || storeIdByName.get(store) || (isDemoMode ? store : null);
  selectedProduct = {
    productId: pendingProduct.id || null,
    name: pendingProduct.name,
    icon: pendingProduct.icon || "🛒",
    custom: Boolean(pendingProduct.custom),
    quantity: selectedQuantity,
    category: pendingProduct.custom ? "Własny produkt" : (selectedCategory?.name || "Inne"),
    store,
    storeId
  };
  updateProductDraft();
  closePicker();
}

async function addSelectedProduct() {
  if (!selectedProduct) return;
  if (isDemoMode) {
    items.unshift({
      id: createId(),
      name: selectedProduct.name,
      icon: selectedProduct.icon,
      custom: selectedProduct.custom,
      quantity: selectedProduct.quantity,
      done: false,
      addedBy: "Ja",
      category: selectedProduct.category,
      store: selectedProduct.store
    });
    saveItems();
    renderItems();
  } else {
    const storeId = selectedProduct.storeId;
    if ((!selectedProduct.productId && !selectedProduct.custom) || !storeId) return;
    try {
      setConnectionStatus("syncing", "zapisywanie…");
      const nextPosition = items.reduce((max, item) => Math.max(max, item.position || 0), 0) + 10;
      await window.ShoppingDB.addItem({
        productId: selectedProduct.productId,
        customName: selectedProduct.custom ? selectedProduct.name : null,
        customIcon: selectedProduct.custom ? selectedProduct.icon : null,
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
  pendingProduct = null;
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
  const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return { scrollY, maxScrollY };
}

function unlockPageScroll(lock) {
  if (!lock) return;
  window.scrollTo(0, lock.scrollY);
}

function dragViewportBounds() {
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const headerBottom = document.querySelector(".app-header")?.getBoundingClientRect().bottom || 0;
  const composerTop = document.querySelector(".composer-shell")?.getBoundingClientRect().top || viewportHeight;
  return {
    top: Math.max(0, headerBottom),
    bottom: Math.min(viewportHeight, composerTop)
  };
}

function dragAutoScrollVelocity(clientY) {
  const bounds = dragViewportBounds();
  const edgeSize = Math.min(100, (bounds.bottom - bounds.top) * .2);
  if (clientY < bounds.top + edgeSize) {
    const strength = Math.min(1, (bounds.top + edgeSize - clientY) / edgeSize);
    return -10 * strength * strength;
  }
  if (clientY > bounds.bottom - edgeSize) {
    const strength = Math.min(1, (clientY - (bounds.bottom - edgeSize)) / edgeSize);
    return 10 * strength * strength;
  }
  return 0;
}

function updateDraggedItemPosition(clientX, clientY) {
  if (!dragState) return;
  const { item, placeholder, startX, startY, container } = dragState;
  item.style.transform = `translate3d(${clientX - startX}px, ${clientY - startY}px, 0) scale(1.015)`;

  const bounds = dragViewportBounds();
  const hitTestY = Math.max(bounds.top + 2, Math.min(bounds.bottom - 2, clientY));
  const elementsAtPoint = document.elementsFromPoint(clientX, hitTestY);
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
    return hitTestY < rect.top + rect.height / 2;
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
}

function continueDragAutoScroll() {
  if (!dragState || dragState.autoScrollFrame !== null) return;
  dragState.autoScrollFrame = requestAnimationFrame(function scrollStep() {
    if (!dragState) return;
    dragState.autoScrollFrame = null;
    const velocity = dragAutoScrollVelocity(dragState.pointerY);
    if (!velocity) return;

    const lock = dragState.scrollLock;
    const nextScrollY = Math.max(0, Math.min(lock.maxScrollY, lock.scrollY + velocity));
    if (nextScrollY === lock.scrollY) return;
    lock.scrollY = nextScrollY;
    window.scrollTo(0, nextScrollY);
    updateDraggedItemPosition(dragState.pointerX, dragState.pointerY);
    dragState.autoScrollFrame = requestAnimationFrame(scrollStep);
  });
}

function endDrag() {
  if (!dragState) return;
  const { item, placeholder, touchedLists, scrollLock, autoScrollFrame } = dragState;
  if (autoScrollFrame !== null) cancelAnimationFrame(autoScrollFrame);
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

  if (Math.abs(currentX) >= 72) {
    item.classList.remove("is-swiping");
    item.classList.remove("is-delete-ready");
    item.classList.add("is-swipe-removing");
    const removalDirection = currentX < 0 ? -110 : 110;
    item.style.transform = `translate3d(${removalDirection}vw, 0, 0)`;
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
    pointerX: startX,
    pointerY: startY,
    autoScrollFrame: null,
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
      loginMessage.textContent = "Nieprawidłowy login lub hasło albo brak dostępu do aplikacji.";
      await window.ShoppingDB.signOut().catch(() => {});
    }
  } finally {
    submitButton.disabled = false;
  }
});

document.querySelector("#demoButton").addEventListener("click", enterDemoMode);
listCards.addEventListener("click", (event) => {
  const button = event.target.closest("[data-list-id]");
  if (!button) return;
  const list = availableLists.find((entry) => entry.id === button.dataset.listId);
  if (list) void openShoppingList(list);
});
listBackButton.addEventListener("click", async () => {
  if (isDemoMode || availableLists.length < 2) return;
  listBackButton.disabled = true;
  if (pendingDeletionIds.size) setConnectionStatus("syncing", "kończenie zapisu…");
  await deletionQueue;
  await showListSelection();
  listBackButton.disabled = false;
});
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
addSelectedButton.addEventListener("click", addSelectedProduct);
document.querySelector("#pickerClose").addEventListener("click", closePicker);
pickerBackdrop.addEventListener("click", closePicker);
pickerBack.addEventListener("click", () => {
  if (pickerMode === "quantity" && selectedCategory) renderProductPicker(selectedCategory);
  else renderCategoryPicker(productSearchQuery);
});

pickerContent.addEventListener("input", (event) => {
  if (event.target.id !== "productSearchInput") return;
  productSearchQuery = event.target.value;
  const results = document.querySelector("#productSearchResults");
  if (results) results.innerHTML = productSearchResultsMarkup(productSearchQuery);
});

pickerContent.addEventListener("change", (event) => {
  if (event.target.id === "assignUsersList") {
    const role = document.querySelector("#assignUsersRole")?.value || "member";
    renderAssignUsersForm(event.target.value, role);
  }
  if (event.target.id === "listMembersList") void openListMembersManager(event.target.value);
});

pickerContent.addEventListener("focusin", (event) => {
  const keepFocusedFieldVisible = () => {
    updatePickerViewport();
    event.target.scrollIntoView({ block: "nearest" });
  };
  window.setTimeout(keepFocusedFieldVisible, 80);
  window.setTimeout(keepFocusedFieldVisible, 260);
});
pickerContent.addEventListener("focusout", () => window.setTimeout(updatePickerViewport, 180));
window.visualViewport?.addEventListener("resize", updatePickerViewport);
window.visualViewport?.addEventListener("scroll", updatePickerViewport);
window.addEventListener("resize", updatePickerViewport);

pickerContent.addEventListener("click", (event) => {
  const option = event.target.closest("[data-picker-action]");
  if (!option) return;
  const { pickerAction, value } = option.dataset;
  if (pickerAction === "close") {
    closePicker();
    return;
  }
  if (pickerAction === "category") {
    const category = productCatalog.find((item) => item.id === value);
    if (category) renderProductPicker(category);
  }
  if (pickerAction === "product" && selectedCategory) {
    const product = selectedCategory.products
      .map((entry) => normalizedCatalogProduct(entry, selectedCategory))
      .find((entry) => entry.key === value);
    if (product) renderQuantityPicker(product);
  }
  if (pickerAction === "search-product") {
    const category = productCatalog.find((entry) => entry.id === option.dataset.categoryId);
    const product = category?.products
      .map((entry) => normalizedCatalogProduct(entry, category))
      .find((entry) => entry.key === value);
    if (category && product) {
      selectedCategory = category;
      renderQuantityPicker(product);
    }
  }
  if (pickerAction === "custom-product") {
    selectedCategory = null;
    renderQuantityPicker({ id: null, name: value, icon: "✏️", custom: true });
  }
  if (pickerAction === "save-custom-product" && currentUserIsAdmin) {
    productSearchQuery = value;
    renderAddProductForm(value, true);
  }
  if (pickerAction === "quantity-decrease") {
    selectedQuantity = Math.max(1, selectedQuantity - 1);
    document.querySelector("#quantityValue").innerHTML = `${selectedQuantity} <small>szt.</small>`;
  }
  if (pickerAction === "quantity-increase") {
    selectedQuantity = Math.min(99, selectedQuantity + 1);
    document.querySelector("#quantityValue").innerHTML = `${selectedQuantity} <small>szt.</small>`;
  }
  if (pickerAction === "edit-quantity-decrease" || pickerAction === "edit-quantity-increase") {
    const input = document.querySelector("#editItemQuantity");
    const value = Math.min(99, Math.max(1, Number(input?.value || 1) + (pickerAction === "edit-quantity-increase" ? 1 : -1)));
    if (input) input.value = String(value);
    const display = document.querySelector("#editItemQuantityValue");
    if (display) display.innerHTML = `${value} <small>szt.</small>`;
  }
  if (pickerAction === "accent-color") void saveAccentColor(value);
  if (pickerAction === "remove-list-member") void removeManagedListMember(option.dataset.listId, option.dataset.userId);
  if (pickerAction === "reset-member-password") openManagedPasswordReset(option.dataset.userId);
  if (pickerAction === "quantity-confirm") confirmProductDraft();
  if (pickerAction === "store") {
    selectedStore = value;
    hasDefaultStore = true;
    storeConfirmed = true;
    localStorage.setItem(selectedStoreStorageKey(), value);
    updateProductDraft();
    closePicker();
  }
});

pickerContent.addEventListener("submit", async (event) => {
  const itemEditForm = event.target.closest(".item-edit-form");
  if (itemEditForm) {
    event.preventDefault();
    if (!itemEditForm.checkValidity()) {
      itemEditForm.reportValidity();
      return;
    }
    const item = items.find((entry) => entry.id === editingItemId);
    if (!item) {
      closePicker();
      return;
    }
    const quantity = Number(itemEditForm.elements.quantity.value);
    const storeId = itemEditForm.elements.storeId.value;
    const store = isDemoMode
      ? storeId
      : storeNames.find((name) => storeIdByName.get(name) === storeId);
    const message = itemEditForm.querySelector(".catalog-form-message");
    const submitButton = itemEditForm.querySelector("button[type='submit']");
    if (!store || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      message.textContent = "Wybierz poprawną ilość i sklep.";
      return;
    }
    if (item.quantity === quantity && item.store === store) {
      closePicker();
      return;
    }
    const previous = { quantity: item.quantity, store: item.store, storeId: item.storeId };
    item.quantity = quantity;
    item.store = store;
    item.storeId = storeId;
    saveItems();
    renderItemsPreservingScroll();
    closePicker();
    if (isDemoMode) return;
    submitButton.disabled = true;
    try {
      setConnectionStatus("syncing", "zapisywanie…");
      await window.ShoppingDB.updateItem(item.id, { quantity, store_id: storeId });
      setConnectionStatus("online", "połączono");
    } catch (error) {
      console.error(error);
      const current = items.find((entry) => entry.id === item.id);
      if (current) Object.assign(current, previous);
      renderItemsPreservingScroll();
      setConnectionStatus("offline", "błąd zapisu");
    }
    return;
  }

  const managedPasswordForm = event.target.closest(".managed-password-form");
  if (managedPasswordForm) {
    event.preventDefault();
    if (!managedPasswordForm.checkValidity()) {
      managedPasswordForm.reportValidity();
      return;
    }
    const message = managedPasswordForm.querySelector(".catalog-form-message");
    const submitButton = managedPasswordForm.querySelector("button[type='submit']");
    const password = managedPasswordForm.elements.password.value;
    if (password !== managedPasswordForm.elements.repeatPassword.value) {
      message.textContent = "Hasła nie są takie same.";
      return;
    }
    submitButton.disabled = true;
    try {
      setConnectionStatus("syncing", "zmiana hasła…");
      await window.ShoppingDB.resetUserPassword(managedPasswordForm.elements.userId.value, password);
      pickerTitle.textContent = "Hasło zmienione";
      pickerContent.innerHTML = '<div class="user-create-success"><span>✓</span><strong>Gotowe</strong><p>Nowe hasło użytkownika zostało zapisane.</p><button class="catalog-form-submit" type="button" data-picker-action="close">Zamknij</button></div>';
      setConnectionStatus("online", "połączono");
    } catch (error) {
      message.textContent = error.message || "Nie udało się zmienić hasła.";
      setConnectionStatus("offline", "błąd zapisu");
      submitButton.disabled = false;
    }
    return;
  }

  const passwordForm = event.target.closest(".password-change-form");
  if (passwordForm) {
    event.preventDefault();
    if (!passwordForm.checkValidity()) {
      passwordForm.reportValidity();
      return;
    }
    const message = passwordForm.querySelector(".catalog-form-message");
    const submitButton = passwordForm.querySelector("button[type='submit']");
    const newPassword = passwordForm.elements.newPassword.value;
    const repeatPassword = passwordForm.elements.repeatPassword.value;
    if (newPassword !== repeatPassword) {
      message.textContent = "Nowe hasła nie są takie same.";
      return;
    }
    submitButton.disabled = true;
    message.textContent = "";
    try {
      setConnectionStatus("syncing", "zmiana hasła…");
      currentSession = await window.ShoppingDB.changePassword(newPassword);
      pickerTitle.textContent = "Hasło zmienione";
      pickerContent.innerHTML = `
        <div class="user-create-success">
          <span>✓</span>
          <strong>Gotowe</strong>
          <p>Nowe hasło zostało zapisane. Nadal jesteś zalogowany na tym urządzeniu.</p>
          <button class="catalog-form-submit" type="button" data-picker-action="close">Zamknij</button>
        </div>`;
      setConnectionStatus("online", "połączono");
    } catch (error) {
      console.error(error);
      message.textContent = error.message || "Nie udało się zmienić hasła.";
      setConnectionStatus("online", "połączono");
    } finally {
      submitButton.disabled = false;
    }
    return;
  }

  const renameForm = event.target.closest(".rename-list-form");
  if (renameForm) {
    event.preventDefault();
    if (!renameForm.checkValidity()) {
      renameForm.reportValidity();
      return;
    }
    const message = renameForm.querySelector(".catalog-form-message");
    const submitButton = renameForm.querySelector("button[type='submit']");
    const name = renameForm.elements.name.value.trim();
    submitButton.disabled = true;
    message.textContent = "";
    try {
      setConnectionStatus("syncing", "zmiana nazwy…");
      await window.ShoppingDB.renameShoppingList(currentList.id, name);
      const listEntry = availableLists.find((list) => list.id === currentList.id);
      if (listEntry) listEntry.name = name;
      if (listEntry) listEntry.updated_at = new Date().toISOString();
      currentList.name = name;
      currentList.updated_at = listEntry?.updated_at || new Date().toISOString();
      document.querySelector("#listTitle").textContent = name;
      updateListActivityTime(currentList.updated_at);
      document.querySelector("#profileDescription").textContent = `Aktualna lista: „${name}”.`;
      document.title = `${name} · Lista zakupów`;
      closePicker();
      setConnectionStatus("online", "połączono");
    } catch (error) {
      console.error(error);
      message.textContent = error.message || "Nie udało się zmienić nazwy listy.";
      setConnectionStatus("offline", "błąd zapisu");
    } finally {
      submitButton.disabled = false;
    }
    return;
  }

  const assignUsersForm = event.target.closest(".assign-users-form");
  if (assignUsersForm) {
    event.preventDefault();
    const message = assignUsersForm.querySelector(".catalog-form-message");
    const submitButton = assignUsersForm.querySelector("button[type='submit']");
    const listId = assignUsersForm.elements.listId.value;
    const role = assignUsersForm.elements.role.value;
    const userIds = [...assignUsersForm.querySelectorAll("input[name='userIds']:checked")].map((input) => input.value);
    if (!userIds.length) {
      message.textContent = "Wybierz przynajmniej jednego użytkownika.";
      return;
    }
    submitButton.disabled = true;
    message.textContent = "";
    try {
      setConnectionStatus("syncing", "przypisywanie…");
      const addedCount = await window.ShoppingDB.addExistingUsersToList(listId, userIds, role);
      manageableMemberships = await window.ShoppingDB.loadManageableMemberships();
      if (currentList?.id === listId) await refreshRemoteData();
      pickerTitle.textContent = "Użytkownicy dodani";
      pickerContent.innerHTML = `
        <div class="user-create-success">
          <span>✓</span>
          <strong>Gotowe</strong>
          <p>Liczba dodanych kont: ${Number(addedCount)}.</p>
          <button class="catalog-form-submit" type="button" data-picker-action="close">Zamknij</button>
        </div>`;
      setConnectionStatus("online", "połączono");
    } catch (error) {
      console.error(error);
      message.textContent = error.message || "Nie udało się przypisać użytkowników.";
      setConnectionStatus("offline", "błąd zapisu");
      submitButton.disabled = false;
    }
    return;
  }

  const userForm = event.target.closest(".user-create-form");
  if (userForm) {
    event.preventDefault();
    if (!userForm.checkValidity()) {
      userForm.reportValidity();
      return;
    }
    const message = userForm.querySelector(".catalog-form-message");
    const submitButton = userForm.querySelector("button[type='submit']");
    const listIds = [...userForm.querySelectorAll("input[name='listIds']:checked")].map((input) => input.value);
    if (!listIds.length) {
      message.textContent = "Wybierz przynajmniej jedną listę.";
      return;
    }
    const login = userForm.elements.login.value.trim().toLowerCase();
    const displayName = userForm.elements.displayName.value.trim();
    const password = userForm.elements.password.value;
    const listRole = userForm.elements.listRole.value;
    submitButton.disabled = true;
    message.textContent = "";
    try {
      setConnectionStatus("syncing", "tworzenie konta…");
      await window.ShoppingDB.createUser({ login, displayName, password, listIds, listRole });
      manageableUsers = [];
      pickerTitle.textContent = "Użytkownik dodany";
      pickerContent.innerHTML = `
        <div class="user-create-success">
          <span>✓</span>
          <strong>${escapeHtml(displayName)}</strong>
          <p>Nowe konto może zalogować się loginem <b>${escapeHtml(login)}</b> i ustawionym hasłem.</p>
          <button class="catalog-form-submit" type="button" data-picker-action="close">Gotowe</button>
        </div>`;
      setConnectionStatus("online", "połączono");
    } catch (error) {
      console.error(error);
      message.textContent = error.message || "Nie udało się utworzyć użytkownika.";
      setConnectionStatus("offline", "błąd zapisu");
    } finally {
      submitButton.disabled = false;
    }
    return;
  }

  const listForm = event.target.closest(".list-create-form");
  if (listForm) {
    event.preventDefault();
    if (!listForm.checkValidity()) {
      listForm.reportValidity();
      return;
    }
    const message = listForm.querySelector(".catalog-form-message");
    const submitButton = listForm.querySelector("button[type='submit']");
    const name = listForm.elements.name.value.trim();
    const memberIds = [...listForm.querySelectorAll("input[name='memberIds']:checked")].map((input) => input.value);
    submitButton.disabled = true;
    message.textContent = "";
    try {
      setConnectionStatus("syncing", "tworzenie listy…");
      const newListId = await window.ShoppingDB.createShoppingList(name, memberIds);
      const context = await window.ShoppingDB.loadUserContext();
      currentProfile = context.profile;
      availableLists = context.lists;
      closePicker();
      await showListSelection();
      const newList = availableLists.find((list) => list.id === newListId);
      if (!newList) throw new Error("Lista powstała, ale nie udało się jej od razu otworzyć. Odśwież połączenie.");
      await openShoppingList(newList);
    } catch (error) {
      console.error(error);
      message.textContent = error.message || "Nie udało się utworzyć listy.";
      setConnectionStatus("offline", "błąd zapisu");
    } finally {
      submitButton.disabled = false;
    }
    return;
  }

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
    if (pickerMode === "promote-custom-product") {
      if (!pendingCatalogPromotion) throw new Error("Nie znaleziono produktu do zapisania.");
      const categoryId = form.elements.categoryId.value;
      const icon = form.elements.icon.value.trim() || "🛒";
      const category = productCatalog.find((entry) => entry.id === categoryId);
      if (!category) throw new Error("Nie znaleziono wybranej kategorii.");
      setConnectionStatus("syncing", "zapisywanie…");
      await window.ShoppingDB.promoteCustomItem(pendingCatalogPromotion.itemId, categoryId, name, icon);
      pendingCatalogPromotion = null;
      await refreshRemoteData();
    } else if (pickerMode === "add-category") {
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
    } else if (pickerMode === "add-product" || pickerMode === "add-product-from-search") {
      const addFromSearch = pickerMode === "add-product-from-search";
      const categoryId = form.elements.categoryId.value;
      const defaultStoreId = form.elements.defaultStoreId.value;
      const icon = form.elements.icon.value.trim() || "🛒";
      const category = productCatalog.find((entry) => entry.id === categoryId);
      if (!category) throw new Error("Nie znaleziono wybranej kategorii.");
      if (!defaultStoreId) throw new Error("Najpierw wybierz domyślny sklep produktu.");
      if (category.products.some((product) => normalizedCatalogProduct(product, category).name.toLowerCase() === name.toLowerCase())) {
        throw new Error("Taki produkt już istnieje w tej kategorii.");
      }
      if (isDemoMode) category.products.push({ id: createId(), name, icon, defaultStoreId, defaultStoreName: storeNames.includes(defaultStoreId) ? defaultStoreId : storeNames[0] });
      else {
        setConnectionStatus("syncing", "zapisywanie…");
        await window.ShoppingDB.addProduct(categoryId, name, icon, defaultStoreId);
        await refreshRemoteData();
      }
      if (addFromSearch) {
        const savedCategory = productCatalog.find((entry) => entry.id === categoryId);
        const savedProduct = savedCategory?.products
          .map((entry) => normalizedCatalogProduct(entry, savedCategory))
          .find((product) => normalizeProductSearch(product.name) === normalizeProductSearch(name));
        if (!savedCategory || !savedProduct) throw new Error("Produkt zapisano, ale nie udało się go od razu wybrać.");
        selectedCategory = savedCategory;
        renderQuantityPicker(savedProduct);
        return;
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
  const itemElement = event.target.closest("[data-id]");
  if (!itemElement) return;
  const index = items.findIndex((item) => item.id === itemElement.dataset.id);
  if (index < 0) return;
  const button = event.target.closest("button[data-action]");
  if (!button) {
    if (!event.target.closest("button, a, input, select, textarea")) openItemEditor(items[index]);
    return;
  }
  if (button.dataset.action === "promote-custom") {
    openPromoteCustomProductForm(items[index]);
    return;
  }
  const itemId = items[index].id;
  if (button.dataset.action === "delete") {
    items.splice(index, 1);
    saveItems();
    renderItemsPreservingScroll();
    if (!isDemoMode) queueItemDeletion(itemId);
    return;
  }
  if (button.dataset.action !== "toggle" || pendingItemUpdateIds.has(itemId)) return;

  const item = items[index];
  const previousDone = item.done;
  const nextDone = !previousDone;
  item.done = nextDone;
  saveItems();
  moveToggledItemWithoutRerender(item, itemElement);
  if (isDemoMode) return;

  pendingItemUpdateIds.add(itemId);
  rememberLocalItemMutation(itemId, nextDone);
  button.disabled = true;
  setConnectionStatus("syncing", pendingItemUpdateIds.size > 1 ? `zapisywanie (${pendingItemUpdateIds.size})…` : "zapisywanie…");
  let saveSucceeded = false;
  try {
    await window.ShoppingDB.updateItem(itemId, { is_purchased: nextDone });
    saveSucceeded = true;
  } catch (error) {
    console.error(error);
    const mutation = localItemMutations.get(itemId);
    window.clearTimeout(mutation?.timer);
    localItemMutations.delete(itemId);
    const currentItem = items.find((entry) => entry.id === itemId);
    const currentElement = document.querySelector(`.item[data-id="${itemId}"]`);
    if (currentItem && currentElement && currentItem.done === nextDone) {
      currentItem.done = previousDone;
      moveToggledItemWithoutRerender(currentItem, currentElement);
    }
    setConnectionStatus("offline", "błąd zapisu");
    scheduleRealtimeReconnect();
  } finally {
    pendingItemUpdateIds.delete(itemId);
    document.querySelector(`.item[data-id="${itemId}"] .check-button`)?.removeAttribute("disabled");
    if (pendingItemUpdateIds.size) {
      setConnectionStatus("syncing", `zapisywanie (${pendingItemUpdateIds.size})…`);
    } else if (remoteItemsRefreshDeferred) {
      void refreshRemoteItems();
    } else if (saveSucceeded) {
      setConnectionStatus("online", "połączono");
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
    if (pressState.swiping || (pressState.canSwipe && Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY))) {
      event.preventDefault();
      clearTimeout(pressState.timer);
      pressState.swiping = true;
      pressState.currentX = Math.max(-105, Math.min(105, deltaX));
      const swipeProgress = Math.min(1, Math.abs(pressState.currentX) / 90);
      pressState.item.classList.remove("is-pressing");
      pressState.item.classList.add("is-swiping");
      pressState.item.classList.toggle("is-delete-ready", Math.abs(pressState.currentX) >= 72);
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
  dragState.pointerX = event.clientX;
  dragState.pointerY = event.clientY;
  updateDraggedItemPosition(event.clientX, event.clientY);
  continueDragAutoScroll();
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
  if (dragState || adminDragState) event.preventDefault();
}, { passive: false });

clearButton.addEventListener("click", async () => {
  items = items.filter((item) => !item.done);
  saveItems();
  renderItemsPreservingScroll();
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

document.querySelector(".admin-tabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-admin-tab]");
  if (!button || !isAdminEditMode) return;
  if (adminEditingItem || adminPendingDelete) {
    adminMessage.textContent = "Najpierw zatwierdź albo anuluj otwartą zmianę.";
    return;
  }
  adminTab = button.dataset.adminTab;
  renderAdminList();
});

adminList.addEventListener("click", (event) => {
  if (Date.now() < adminSuppressClickUntil && event.target.closest(".admin-row")) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  const actionButton = event.target.closest("[data-admin-action]");
  if (!actionButton || !adminDraft) return;
  const action = actionButton.dataset.adminAction;

  if (action === "cancel-edit") {
    adminEditingItem = null;
    renderAdminList();
    return;
  }

  const row = actionButton.closest("[data-admin-type]");
  if (!row) return;
  const type = row.dataset.adminType;
  const id = row.dataset.id;

  if (action === "edit") {
    adminPendingDelete = null;
    adminEditingItem = { type, id };
    renderAdminList();
    window.setTimeout(() => adminList.querySelector(".admin-inline-form input[name='name']")?.focus(), 20);
  }
  if (action === "delete") {
    adminEditingItem = null;
    adminPendingDelete = { type, id };
    renderAdminList();
  }
  if (action === "cancel-delete") {
    adminPendingDelete = null;
    renderAdminList();
  }
  if (action === "confirm-delete") markAdminItemDeleted(type, id);
});

adminList.addEventListener("pointerdown", (event) => {
  const row = event.target.closest(".admin-row[data-admin-type]");
  if (!row || event.button !== 0 || !adminDraft || adminEditingItem || adminPendingDelete) return;
  if (event.target.closest("button, input, select, textarea, a, .admin-row-actions, .admin-delete-confirm, .admin-inline-form")) return;
  cancelAdminLongPress();
  try { row.setPointerCapture(event.pointerId); } catch { /* starsza przeglądarka */ }
  row.classList.add("is-admin-pressing");
  adminPressState = {
    row,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    captureTarget: row,
    timer: setTimeout(startAdminDragFromPress, 380)
  };
});

adminList.addEventListener("pointermove", (event) => {
  if (!adminDragState && adminPressState) {
    const distance = Math.hypot(
      event.clientX - adminPressState.startX,
      event.clientY - adminPressState.startY
    );
    if (distance > 9) cancelAdminLongPress();
    return;
  }
  if (!adminDragState) return;
  event.preventDefault();
  const { row, list, placeholder, startX, startY } = adminDragState;
  row.style.transform = `translate3d(${event.clientX - startX}px, ${event.clientY - startY}px, 0) scale(1.015)`;

  const targetList = document.elementsFromPoint(event.clientX, event.clientY)
    .map((element) => element.closest?.(".admin-sort-list"))
    .find(Boolean);
  if (targetList !== list) return;

  settleAdminListAnimations(list);
  const siblings = [...list.querySelectorAll(".admin-row[data-id]:not(.is-admin-dragging)")];
  const insertBefore = siblings.find((element) => {
    const rect = element.getBoundingClientRect();
    return event.clientY < rect.top + rect.height / 2;
  });
  const placementKey = insertBefore?.dataset.id || "end";
  if (placementKey === adminDragState.lastPlacement) return;

  const beforePositions = new Map();
  siblings.forEach((element) => beforePositions.set(element.dataset.id, element.getBoundingClientRect()));
  if (insertBefore) insertBefore.before(placeholder);
  else list.append(placeholder);
  adminDragState.lastPlacement = placementKey;
  animateAdminListShift(list, beforePositions);
});

adminList.addEventListener("pointerup", () => {
  if (adminDragState) finishAdminDrag();
  else cancelAdminLongPress();
});

adminList.addEventListener("pointercancel", () => {
  if (adminDragState) finishAdminDrag();
  else cancelAdminLongPress();
});

adminList.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-admin-form]");
  if (!form || !adminDraft) return;
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const type = form.dataset.adminForm;
  const item = adminDraft[type].find((entry) => entry.id === form.dataset.id);
  if (!item) return;
  const name = form.elements.name.value.trim();
  try {
    validateAdminName(type, item, name);
    item.name = name;
    if (type === "categories" || type === "products") item.icon = form.elements.icon.value.trim() || "🛒";
    if (type === "products") item.default_store_id = form.elements.defaultStoreId.value || null;
    adminEditingItem = null;
    renderAdminList();
  } catch (error) {
    adminMessage.textContent = error.message;
  }
});

adminModeButton.addEventListener("click", () => {
  if (isAdminEditMode) void saveAndCloseAdminMode();
  else openAdminMode();
});
eventLogMenuButton.addEventListener("click", openEventLog);
eventLogBackButton.addEventListener("click", closeEventLog);
eventLogRefreshButton.addEventListener("click", () => void loadEventLog());
eventLogSearch.addEventListener("input", renderEventLog);
eventLogList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-event-log-action='toggle']");
  const entry = button?.closest("[data-event-id]");
  if (!entry) return;
  const id = entry.dataset.eventId;
  if (expandedEventIds.has(id)) expandedEventIds.delete(id);
  else expandedEventIds.add(id);
  renderEventLog();
});

document.querySelector("#profileButton").addEventListener("click", () => profilePopover.classList.toggle("is-hidden"));
document.querySelector("#addProductMenuButton").addEventListener("click", () => openCatalogEditor("product"));
document.querySelector("#addCategoryMenuButton").addEventListener("click", () => openCatalogEditor("category"));
document.querySelector("#addStoreMenuButton").addEventListener("click", () => openCatalogEditor("store"));
listMembersManageMenuButton.addEventListener("click", () => void openListMembersManager());
createListMenuButton.addEventListener("click", () => void openCreateListForm());
createUserMenuButton.addEventListener("click", openCreateUserForm);
assignUsersMenuButton.addEventListener("click", () => void openAssignUsersForm());
renameListMenuButton.addEventListener("click", openRenameListForm);
changePasswordMenuButton.addEventListener("click", openChangePasswordForm);
accentColorMenuButton.addEventListener("click", openAccentColorPicker);
notifyListButton.addEventListener("click", () => void handleNotifyList());
document.addEventListener("click", (event) => {
  if (!event.target.closest("#profileButton") && !event.target.closest("#profilePopover")) profilePopover.classList.add("is-hidden");
});

window.addEventListener("beforeunload", (event) => {
  if (!isAdminEditMode || isAdminSaving) return;
  event.preventDefault();
  event.returnValue = "";
});

const savedTheme = localStorage.getItem(THEME_KEY);
setTheme(savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
setAccentColor(localStorage.getItem(ACCENT_COLOR_KEY) || DEFAULT_ACCENT_COLOR);
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
installPromptAction.addEventListener("click", () => void handleInstallPromptAction());
document.querySelector("#installPromptClose").addEventListener("click", () => closeInstallPrompt());
document.querySelector("#installPromptLater").addEventListener("click", () => closeInstallPrompt());
installPromptBackdrop.addEventListener("click", (event) => {
  if (event.target === installPromptBackdrop) closeInstallPrompt();
});
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  window.setTimeout(() => showInstallPrompt("native"), 1200);
});
window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  closeInstallPrompt(false);
  localStorage.removeItem(INSTALL_PROMPT_DISMISSED_KEY);
  void refreshPushButton();
});
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
  const installPreview = new URLSearchParams(window.location.search).get("install-preview");
  if (installPreview === "android" || installPreview === "ios") {
    window.setTimeout(() => showInstallPrompt(installPreview === "ios" ? "ios" : "native", true), 350);
  } else if (isIosDevice() && canShowInstallPrompt()) {
    window.setTimeout(() => showInstallPrompt("ios"), 1800);
  }
});
window.setInterval(() => {
  if (document.visibilityState === "visible") void checkForAppUpdate();
}, 15 * 60 * 1000);
window.setInterval(() => {
  if (document.visibilityState === "visible" && !isDemoMode && currentSession && currentList && navigator.onLine && connectionState !== "syncing") {
    void refreshRemoteItems();
  }
}, 60 * 1000);

async function restoreDatabaseSession(session) {
  let activeSession = session;
  let lastError = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      if (navigator.onLine) activeSession = await window.ShoppingDB.refreshSession() || activeSession;
      await enterDatabaseMode(activeSession);
      return activeSession;
    } catch (error) {
      lastError = error;
      if (!navigator.onLine || attempt === 1) break;
      await new Promise((resolve) => window.setTimeout(resolve, 350 * (attempt + 1)));
    }
  }
  throw lastError || new Error("Nie udało się odnowić zapisanej sesji.");
}

(async function restoreSession() {
  if (!window.ShoppingDB) {
    document.body.classList.remove("session-loading");
    return;
  }
  try {
    const session = await window.ShoppingDB.getSession();
    if (!session) return;
    try {
      await restoreDatabaseSession(session);
    } catch (error) {
      console.error(error);
      showDatabaseRecovery(session);
    }
  } catch (error) {
    console.error(error);
    loginMessage.textContent = "Nie udało się sprawdzić zapisanej sesji. Spróbuj ponownie po odzyskaniu internetu.";
  } finally {
    document.body.classList.remove("session-loading");
  }
})();
