/* ======= DANE ======= */
const WORDS = [

  // ===== ŁATWE =====
  "DOM","DRZEWO","KWIAT","SŁOŃCE","DESZCZ","KOT","PIES","RYBA","PTAK","AUTO",
  "ROWER","BUT","CZAPKA","STÓŁ","KRZESŁO","ŁÓŻKO","OKNO","DRZWI","MOST","DROGA",
  "LAS","PARK","PLAŻA","RZEKA","GÓRA","JEZIORO","CHMURA","GWIAZDA","KSIĘŻYC",
  "PIŁKA","MIŚ","LALKA","BALON","PREZENT","TORBA","PLECAK","ZEGAR","TELEFON",
  "KSIĄŻKA","DŁUGOPIS","OŁÓWEK","PAPIER","NOŻYCE","KUBEK","TALERZ","ŁYŻKA",
  "WIDELEC","JABŁKO","BANAN","CHLEB","SER","MLEKO","WODA","SOK","CIASTO",
  "LODY","KAWA","HERBATA","ŁAWKA","LATARNIA","ULICA","SKLEP","SZKOŁA","KINO",
  "PŁOT","BRAMA","SCHODY","WINDA","PODUSZKA","KOC","DYWAN","LUSTRO","OBRAZ",
  "RAMKA","ZABAWKA","FARBA","PĘDZEL","KREDKA","MAPA",

  // ===== ŚREDNIE =====
  "RADOŚĆ","SMUTEK","ZŁOŚĆ","STRACH","DUMA","WSTYD","NUDA","ODWAGA","NADZIEJA",
  "TĘSKNOTA","ENERGIA","ZMĘCZENIE","CIEKAWOŚĆ","POKUSA","TAJEMNICA","PAMIĘĆ",
  "MYŚL","SEN","KOSZMAR","SPOKÓJ","CHAOS","PORZĄDEK","CEL","PLAN","WYBÓR",
  "DECYZJA","RYZYKO","SZANSA","SUKCES","PORAŻKA","PODRÓŻ","PRZYGODA","CIEŃ",
  "BLASK","ISKRA","FALA","WIATR","BURZA","MGŁA","CISZA","HAŁAS","ŚLAD","ZNAK",
  "SYGNAŁ","DŹWIĘK","ECHO","RYTM","MELODIA","NUTA","MASKA","LABIRYNT","KLUCZ",
  "KORYTARZ","SCHRON","BARYKADA","GRANICA","HORYZONT","ŚWIATŁO","MROK",
  "ILUZJA","WRAŻENIE","OBECNOŚĆ","NIEOBECNOŚĆ","ZAMIAR","INTENCJA","WYSIŁEK",
  "CIERPLIWOŚĆ","LENISTWO","PRACOWITOŚĆ","KREATYWNOŚĆ","NOSTALGIA","WIARA",
  "ZAUFANIE","SAMOTNOŚĆ",

  // ===== TRUDNE =====
  "ABSTRAKCJA","PARADOKS","IRONIA","METAFORA","SYMBOL","ALUZJA","INTUICJA",
  "PERCEPCJA","ŚWIADOMOŚĆ","PODŚWIADOMOŚĆ","TOŻSAMOŚĆ","EGZYSTENCJA",
  "TRANSFORMACJA","INTERPRETACJA","DEFINICJA","KONCEPCJA","PERSPEKTYWA",
  "RELACJA","STRUKTURA","MECHANIZM","PROCES","SEKWENCJA","KOMPROMIS",
  "KONSEKWENCJA","ALTERNATYWA","HIPOTEZA","TEORIA","ANALIZA","SYNTEZA",
  "KONFLIKT","DYSONANS","RÓWNOWAGA","CHAOTYCZNOŚĆ","PRZECIWIEŃSTWO",
  "WZORZEC","ANOMALIA","ODCHYLENIE","PRZEZNACZENIE","PRZYPADKOWOŚĆ",
  "INTENCJONALNOŚĆ","DETERMINACJA","ILUZORYCZNOŚĆ","ZŁUDZENIE","NAPIĘCIE",
  "IMPULS","REAKCJA","ADAPTACJA","EWOLUCJA","DEGRADACJA","REGENERACJA",
  "KATALIZATOR","POTENCJAŁ","OGRANICZENIE","EKSTREMUM","ABSURD",
  "KONTRAST","ZESTAWIENIE","REZONANS","HARMONIA","DYSHARMONIA",
  "PRZENIKANIE","DEKONSTRUKCJA","INTERAKCJA","SYMULACJA","MANIPULACJA",
  "KONTEMPLACJA","REFLEKSJA","MEDYTACJA","INTROSPEKCJA","PROJEKCJA",
  "SUBTELNOŚĆ","AMBICJA","ASPIRACJA","FRUSTRACJA","SATYSFAKCJA",
  "ROZCZAROWANIE","ZOBOWIĄZANIE","ODPOWIEDZIALNOŚĆ","AUTONOMIA",
  "KONTROLA","BEZRADNOŚĆ","DOMINACJA","ULEGŁOŚĆ","RUTYNA","IMPAS",
  "STAGNACJA","PRZEŁOM","KRYZYS","ODNOWA","REWOLUCJA",

  // ===== DWUZNACZNE (BEZ DUPLIKATÓW) =====
  "ZAMEK","LIST","PISMO","BANK","KORONA","ZŁOTO","SREBRO","KRZYŻ","BLOK","PASEK",
  "DZWON","KOŁO","RAMA","ŁUK","KORZEŃ","PIERŚCIEŃ","ŁAŃCUCH","SIEĆ","RING","TOR",
  "PUNKT","LINIA","KARTA","DYSK","KRYSZTAŁ","KOMÓRKA","POLE","PŁYTA","HASŁO",
  "KLASA","TON","SKALA","POKÓJ","STACJA","BIEG","STRONA","KANAŁ","KLATKA",
  "ŁADUNEK","PRĄD","PLANETA","PAS","DÓŁ","SZCZYT","ŚRODEK","BOK","GRA","RUCH",
  "ZAKRĘT","CIĘŻAR","CIŚNIENIE","TEMPO","CZAS","FUNKCJA","FORMA","TREŚĆ",
  "MODEL","RAMY","POZIOM","SYSTEM","KOD","PŁYN","OGIEŃ","LÓD","PŁOMIEŃ",
  "CIEPŁO","ZIMNO","BALANS","CIĄG","SERIA","OBIEG","PRZEPŁYW","BLOKADA",
  "OTWARCIE","ZAMKNIĘCIE","POWIĄZANIE","WĘZEŁ","ŚCIEŻKA","FILTR",

  // ===== WŁASNE =====
  "IMPOSTOR","PODPOWIEDŹ","ŻYCINY","SYLWESTER","BASEN","NETFLIX",
  "NETFLIX & CHILL","RANDKA","TINDER","GTA VI","DOMEK","PYTANIE","TIKTOK","TACO HEMINGWAY",
  "BAMBI","BARBIE","FAGATA","67","LANA","BUDDA","PITBULL","WEEKEND","KONCERT","SHOT","WÓDECZKA :)",
  "RAP","TRAP",
  "LATARNIE","WSZĘDZIE","DAWNO","ZGASŁY",
  "GRAMY JESZCZE?","KRESKA","DUPA",

  // ===== PAŃSTWA =====
  "CHORWACJA","USA","KANADA","MEKSYK","BRAZYLIA","ARGENTYNA","BUŁGARIA",
  "GRECJA","TURCJA","SERBIA","SŁOWENIA","BOŚNIA","AUSTRIA","CZECHY",
  "SŁOWACJA","WĘGRY","NIEMCY","FRANCJA","HISZPANIA","WŁOCHY",
  "PORTUGALIA","HOLANDIA","BELGIA","SZWECJA","NORWEGIA"
];



const ALL_WORDS = WORDS;

/* ======= STORAGE KEY ======= */
const STORAGE_KEY = "impostorParty_v10";

/* ======= AVATARY ======= */
/* Zmień rozszerzenie jeśli trzeba, np. ".webp" albo ".jpg" */
const AVATAR_PATH = "avatars/";
const AVATAR_EXT = ".webp";

const AVATAR_FILES = {
  adrian: "avatars/avatar_adi.webp",
  kuba: "avatars/avatar_kub.webp",
  wanessa: "avatars/avatar_wan.webp",
  jula: "avatars/avatar_jul.webp",
  dawid: "avatars/avatar_daw.webp",
  nikt: "avatars/avatar_nikt.webp",
  default: "avatars/avatar_nikt.webp",
};

/* ======= PRELOAD AVATARS ======= */
let avatarsPreloaded = false;

function preloadAvatarsInBackground() {
  if (avatarsPreloaded) return;

  avatarsPreloaded = true;

  Object.values(AVATAR_FILES).forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

function preloadAvatarsForPlayers(players) {
  const unique = [...new Set(
    players.map(p => p.avatar || AVATAR_FILES.nikt)
  )];

  return Promise.all(
    unique.map(src =>
      new Promise(resolve => {
        const img = new Image();
        img.src = src;
        img.onload = async () => {
          // kluczowe dla WebP
          if (img.decode) {
            try { await img.decode(); } catch {}
          }
          resolve();
        };
        img.onerror = resolve;
      })
    )
  );
}


function showAvatarLoader() {
  document.getElementById("avatar-loader")?.classList.remove("hidden");
}

function hideAvatarLoader() {
  document.getElementById("avatar-loader")?.classList.add("hidden");
}




const NICKS_ADRIAN = [
  "Adi",
  "Adik",
  "Adriano",
  "MokraPizda",
  "Agent A",
  "Pan A",
  "SpoconaCipka",
  "Sutonator",
  "RobieGałe",
  "Ruchammmmm",
  "WchodzeSobieTutajNajebany",
  "TwójStary",
  "RuchamMame",
  "JulkaEnjoyer",
  "LickDick",
  "DupaNibisz",
  "Najebanyyyy",
  "Ocena 6/10",
  "Gej'o'guesser",
];
const NICKS_KUBA = [
  "Qba",
  "Kubson",
  "Kubuś",
  "Kubix",
  "JebaćŻydów",
  "ŻydówJebanie",
  "Deeeeeeeeeeejjjjmmmmm",
  "IzraelBomber",
  "Murzynator",
  "MamTwójRower",
  "Czarnuch",
  "Chucko",
  "Fanta",
  "PokaSiura",
  "PanstwoIzrael",
  "TwójStary",
  "Lubie Piwo",
  "Jebać",
  "KochamWaneske",
  "MocnyStatement",
  "JestemCzarnuchem",
  "Niger - takie państwo",
];

/* dopasowanie po rdzeniach / wariacjach */
const NAME_HINTS = {
  wanessa: [
    "wanessa",
    "vanessa",
    "wanes",
    "vanes",
    "wane",
    "waneska",
    "vannes",
    "wan",
    "wa",
  ],
  jula: ["jula", "julia", "julka", "julcia", "jull", "jul", "dzjula", "ju"],
  dawid: ["dawid", "david", "dawcio", "daw", "dawo", "dawko", "da"],
  adrian: ["adrian", "adi", "adik", "adek", "adri", "adrix", "adriano", "ad"],
  kuba: [
    "kuba",
    "qba",
    "kub",
    "kubus",
    "kubuś",
    "kubson",
    "kubix",
    "kubon",
    "ku",
  ],
};
const norm = (s) => (s || "").toLowerCase().replace(/[^a-ząćęłńóśźż]/g, "");

/* ======= STAN ======= */
const state = {
  players: [],
  targetCount: 5,
  entryIndex: 0,
  word: "",
  impostorIndices: [],
  lastImpostorIndices: [],
  startIndex: 0,
  partyMode: false,
  usedWords: [],
  testMode: false,
  orderNames: [], // tryb z avatarami (przycisk „Test”)
};

/* ======= HELPERS ======= */
const el = (id) => document.getElementById(id);
const vibrate = (ms) => {
  if (navigator.vibrate)
    try {
      navigator.vibrate(ms);
    } catch (e) {}
};
const rand = (n) => Math.floor(Math.random() * n);
const escapeHtml = (s) =>
  s.replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[
        m
      ])
  );
function uuid() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  if (crypto?.getRandomValues) {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
  return "xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ---- HERO refs i meta do overlay-secret ----
function getHeroRefs() {
  return {
    heroCurrent: document.getElementById("hero-current"),
    heroNext: document.getElementById("hero-next"),
    heroBanner: document.getElementById("hero-banner"),
    heroNextName: document.getElementById("hero-next-name"),
  };
}
let nextHandoffName = null; // tekst „Przekaż telefon do…”
let heroAnimating = false; // blokada równoległych animacji

// bieżące info o sekwencji przekazywania
let currentSecretMeta = { pos: 0, total: 0 };

/* ======= IMPOSTOR UTILS ======= */
const isImpostor = (i) => state.impostorIndices.includes(i);

// 1%: wszyscy; 5%: dokładnie dwóch; reszta: jeden
function chooseImpostors(total) {
  const r = Math.random();
  if (r < 0.05) return Array.from({ length: total }, (_, i) => i);
  if (r < 0.013) {
    if (total < 2) return [0];
    let a = rand(total),
      b;
    do {
      b = rand(total);
    } while (b === a);
    return a < b ? [a, b] : [b, a];
  }
  return [rand(total)];
}

/* ======= AVATARY – przypisanie po nazwie ======= */
function guessAvatarForName(name) {
  const n = norm(name);
  for (const key of Object.keys(NAME_HINTS)) {
    if (NAME_HINTS[key].some((h) => n.includes(h))) {
      return AVATAR_FILES[key] || AVATAR_FILES.default;
    }
  }
  return null;
}

/* ======= SŁOWA – bez powtórek ======= */
function pickUniqueWord() {
  const used = new Set(state.usedWords || []);
  const pool = ALL_WORDS.filter((w) => !used.has(w));
  if (pool.length === 0) {
    state.usedWords = [];
    save();
    alert(
      "Skończyły się wszystkie hasła. Resetuję historię i zaczynam nowy cykl."
    );
    return pickUniqueWord();
  }
  const word = pool[rand(pool.length)];
  used.add(word);
  state.usedWords = Array.from(used);
  save();
  return word;
}

/* ======= storage ======= */
const save = () =>
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      players: state.players,
      startIndex: state.startIndex,
      lastImpostorIndices: state.lastImpostorIndices,
      partyMode: state.partyMode,
      usedWords: state.usedWords,
    })
  );
const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const d = JSON.parse(raw);
    if (!Array.isArray(d.players) || d.players.length < 1) return false;
    state.players = d.players;
    state.startIndex = Number.isInteger(d.startIndex)
      ? d.startIndex % state.players.length
      : 0;
    if (Array.isArray(d.lastImpostorIndices))
      state.lastImpostorIndices = d.lastImpostorIndices;
    else if (typeof d.lastImpostorIndex === "number")
      state.lastImpostorIndices = [d.lastImpostorIndex];
    else state.lastImpostorIndices = [];
    state.partyMode = !!d.partyMode;
    state.usedWords = Array.isArray(d.usedWords) ? d.usedWords : [];
    return true;
  } catch (e) {
    return false;
  }
};

function show(id) {
  for (const s of [
    "view-menu",
    "view-setup",
    "view-entry",
    "view-start",
    "view-lobby",
    "view-manage",
  ]) {
    const v = el(s);
    if (v) v.style.display = s === id ? "" : "none";
  }
}
function showOverlay(id, on = true) {
  const ov = el(id);
  if (on) {
    document.body.classList.add("lock-scroll");
    ov.classList.add("show");
    requestAnimationFrame(() => window.scrollTo(0, 0));
  } else {
    ov.classList.remove("show");
    document.body.classList.remove("lock-scroll");
  }
}

/* ======= MENU ======= */
function initMenu() {
  const ok = load();
  el("btn-continue").disabled = !ok;
  el("partyMode").checked = state.partyMode;
  // NIE wyłączamy testMode tutaj; włączasz go przyciskiem „Test”
  show("view-menu");
}


window.addEventListener("load", () => {
  initMenu();

  // preload w tle – bez czekania
  // preloadAvatarsInBackground();
});




el("partyMode").addEventListener("change", (e) => {
  state.partyMode = e.target.checked;
  save();
  renderStats();
});

/* NOWA GRA – normalny tryb */
el("btn-new").addEventListener("click", () => {
  state.testMode = false;
  state.targetCount = Math.min(
    12,
    Math.max(3, parseInt(el("playerCount").value) || 5)
  );
  el("playerCount").value = state.targetCount;
  show("view-setup");
});

/* TEST – tryb z avatarami (specjalne UI) */
const btnTest = document.getElementById("btn-test");
if (btnTest) {
  btnTest.addEventListener("click", () => {
    state.testMode = true;
    state.targetCount = Math.min(
      12,
      Math.max(3, parseInt(el("playerCount").value) || 5)
    );
    el("playerCount").value = state.targetCount;
    show("view-setup");
  });
}

el("back-to-menu").addEventListener("click", initMenu);

el("btn-begin-entry").addEventListener("click", () => {
  state.targetCount = Math.min(
    12,
    Math.max(3, parseInt(el("playerCount").value) || 5)
  );
  state.orderNames = [];
  openOrderView();
});

function confirmOrder() {
  const inputs = [...document.querySelectorAll("[data-order]")];
  const names = inputs.map((i) => i.value.trim());

  if (names.some((n) => !n)) return alert("Uzupełnij wszystkie imiona.");
  if (new Set(names.map((n) => n.toLowerCase())).size !== names.length)
    return alert("Imiona muszą być unikalne.");

  state.orderNames = names;

  state.players = names.map((orderName, idx) => ({
    id: uuid(),
    orderName,
    name: "",
    points: 0,
    shots: 0,
    avatar:
      idx >= 5
        ? AVATAR_FILES.nikt
        : guessAvatarForName(orderName) || AVATAR_FILES.nikt,
  }));



// ===== 🔥 LOADER START =====
showAvatarLoader();

document.getElementById("view-order").remove();

state.entryIndex = 0;
state.word = pickUniqueWord();
state.impostorIndices = chooseImpostors(state.targetCount);
state.lastImpostorIndices = [...state.impostorIndices];

el("entry-index").textContent = "1";
el("entry-total").textContent = String(state.targetCount);
el("entry-name").value = "";


preloadAvatarsForPlayers(state.players).then(async () => {
  renderEntryList();

  // 🔥 CZEKAJ AŻ <img> W DOM SIĘ ZDEKODUJĄ
  const imgs = document.querySelectorAll(".entry-avatar");
  await Promise.all(
    [...imgs].map(img => img.decode?.().catch(() => {}))
  );

  show("view-entry");
  hideAvatarLoader();

  updateNickButtonsVisibility();
  setTimeout(() => el("entry-name").focus(), 80);
});


}



/* ======= DYNAMICZNE PRZYCISKI: Losuj nick Adrian/Kuba ======= */
// function ensureNickButtons() {
//   if (document.getElementById("btn-nick-adrian")) return;

//   const row = document.createElement("div");
//   row.className = "row nick-buttons";

//   row.innerHTML = `
//     <button class="btn secondary" id="btn-nick-adrian">Losuj nick Adrian</button>
//     <button class="btn secondary" id="btn-nick-kuba">Losuj nick Kuba</button>
//   `;

//   const entrySection = document.getElementById("view-entry");
//   const firstBlock = entrySection.querySelector(".row");
//   firstBlock.insertAdjacentElement("afterend", row);

//   const input = el("entry-name");

//   el("btn-nick-adrian").onclick = () =>
//     (input.value = NICKS_ADRIAN[rand(NICKS_ADRIAN.length)]);

//   el("btn-nick-kuba").onclick = () =>
//     (input.value = NICKS_KUBA[rand(NICKS_KUBA.length)]);
// }

function updateNickButtonsVisibility() {
  const p = state.players[state.entryIndex];
  const container = document.querySelector(".nick-buttons");
  if (!p || !container) return;

  const n = norm(p.orderName);

  const isAdrian = NAME_HINTS.adrian.some((h) => n.includes(h));
  const isKuba = NAME_HINTS.kuba.some((h) => n.includes(h));

  // el("btn-nick-adrian").style.display = isAdrian ? "" : "none";
  // el("btn-nick-kuba").style.display = isKuba ? "" : "none";

  container.style.display = isAdrian || isKuba ? "flex" : "none";
}

function openOrderView() {
  const sec = document.createElement("section");
  sec.id = "view-order";
  sec.className = "card screen";

  let html = `
    <h2 class="title">Kolejność osób</h2>
    <p class="muted">Wpisz imiona w kolejności przekazywania telefonu</p>
    <div id="order-list" class="list">
  `;

  for (let i = 0; i < state.targetCount; i++) {
    html += `
      <div class="rowcard" style="padding:10px">
        <label>Osoba ${i + 1}</label>
        <input type="text" data-order="${i}" placeholder="Imię">
      </div>
    `;
  }

  html += `
    </div>
    <div class="row" style="margin-top:0px">
      <button class="btn full" id="order-confirm">Zatwierdź kolejność</button>
    </div>
  `;

  sec.innerHTML = html;
  document.querySelector(".wrap").appendChild(sec);
  show("view-order");

  el("order-confirm").onclick = confirmOrder;
}

/* ======= ENTRY FLOW ======= */
function renderEntryList() {
  const box = el("entry-list");
  box.innerHTML = "";

  state.players.forEach((p, i) => {
    const d = document.createElement("div");
    d.className = "rowcard";

    d.innerHTML = `
      <div class="entry-player">
        <img class="entry-avatar" src="${escapeHtml(
          p.avatar || AVATAR_FILES.nikt
        )}" alt="">
        <span class="chip entry-chip">${i + 1}</span>
        <strong class="${p.name ? "" : "entry-empty"}">
          ${escapeHtml(p.name || "—")}
        </strong>
      </div>
    `;

    box.appendChild(d);
  });
}

el("entry-confirm").addEventListener("click", () => {
  const name = el("entry-name").value.trim();
  if (!name) return alert("Podaj imię.");
  if (state.players.some((p) => p.name.toLowerCase() === name.toLowerCase()))
    return alert("To imię już jest na liście.");

  const idx = state.entryIndex;

  // priorytety avataru:
  // 1) jeśli kliknięto losowanie nicku – użyj forcedAvatar,
  // 2) jeśli to 6. i dalszy gracz -> nikt,
  // 3) dopasowanie po nazwie (wan/jul/daw/adrian/kuba),
  // 4) domyślnie nikt.

  state.players[idx].name = name;

  const isImp = isImpostor(idx);
  el("entry-name").blur();
  const nextName =
    idx + 1 < state.targetCount
      ? state.players[idx + 1]?.name ?? "Gracz " + (idx + 2)
      : null;
  openSecret({
    playerName: name,
    text: isImp ? null : state.word,
    isImp,
    pos: idx,
    total: state.targetCount,
    nextName,
  });
  const once = () => {
    el("secret-hide").removeEventListener("click", once);
    state.entryIndex++;
    el("entry-name").value = "";
    renderEntryList();
    updateNickButtonsVisibility();
    if (state.entryIndex < state.targetCount) {
      el("entry-index").textContent = String(state.entryIndex + 1);
    } else {
      save();
      startAnimation(true); /* w trybie test zostaje aktywny do końca sesji */
    }
  };
  el("secret-hide").addEventListener("click", once);
});
el("entry-name").addEventListener("keydown", (e) => {
  if (e.key === "Enter") el("entry-confirm").click();
});

/* ======= SECRET OVERLAY ======= */

function openSecret({ playerName, text, isImp, pos, total, nextName }) {
  const { heroCurrent, heroNext, heroBanner, heroNextName } = getHeroRefs();

  // meta do późniejszej animacji
  currentSecretMeta = { pos, total };
  nextHandoffName = nextName || null;
  heroAnimating = false;

  // ustaw „bieżący” avatar
  const currAvatar = state.players[pos]?.avatar || AVATAR_FILES.nikt;
  heroCurrent.src = currAvatar;
  heroCurrent.className = "hero-img is-current";

  // przygotuj next jako ukryty placeholder (żeby nie było złamanego obrazka)
  heroNext.src = AVATAR_FILES.nikt;
  heroNext.className = "hero-img";
  heroNext.setAttribute("aria-hidden", "true");
  heroBanner.setAttribute("aria-hidden", "true");
  heroNextName.textContent = "";

  // UI overlayu
  el("secret-player").textContent = playerName;
  el("secret-pos").textContent = `${pos + 1} / ${total}`;
  el("secret-value").style.display = "none";
  el("secret-imp-hint").style.display = "none";
  el("secret-instruction").style.display = "";
  el("secret-show").style.display = "";
  el("secret-hide").style.display = "none";
  el("handoff-inline").style.display = "none";
  el("secret-show").style.setProperty("--holdp", 0);
  el("secret-value").textContent = isImp ? "—" : text;
  el("secret-value").dataset.imp = isImp ? "1" : "0";
  holdProgress = 0;
  updateHoldFill(0);
  showOverlay("overlay-secret", true);
}

const HOLD_FILL_MS = 900,
  HOLD_DECAY_MS = 350;
let holdProgress = 0,
  holdRAF = null,
  holding = false,
  lastTs = 0;
function updateHoldFill(p) {
  el("secret-show").style.setProperty("--holdp", Math.round(p * 100));
}
function holdLoop(ts) {
  if (!lastTs) lastTs = ts;
  const dt = ts - lastTs;
  lastTs = ts;
  if (holding) {
    holdProgress = Math.min(1, holdProgress + dt / HOLD_FILL_MS);
    if (holdProgress >= 1) {
      revealSecret();
      stopHold();
      return;
    }
  } else {
    holdProgress = Math.max(0, holdProgress - dt / HOLD_DECAY_MS);
    if (holdProgress === 0) {
      stopHold();
      updateHoldFill(holdProgress);
      return;
    }
  }
  updateHoldFill(holdProgress);
  holdRAF = requestAnimationFrame(holdLoop);
}
function startHold() {
  if (holdRAF) cancelAnimationFrame(holdRAF);
  holding = true;
  lastTs = 0;
  holdRAF = requestAnimationFrame(holdLoop);
}
function stopHold() {
  if (holdRAF) cancelAnimationFrame(holdRAF);
  holdRAF = null;
  holding = false;
  lastTs = 0;
}
const HERO_HANDOFF_DELAY = 1200; // ms – po odsłonięciu hasła

function revealSecret() {
  // UI hasła
  el("secret-instruction").style.display = "none";
  el("secret-value").style.display = "";
  el("secret-show").style.display = "none";
  el("secret-hide").style.display = "";
  if (el("secret-value").dataset.imp === "1") {
    el("secret-imp-hint").style.display = "block";
  }
  vibrate(15);

  const { heroCurrent, heroNext, heroBanner, heroNextName } = getHeroRefs();
  const { pos, total } = currentSecretMeta;
  if (heroAnimating || pos + 1 >= total) return;

  heroAnimating = true;

  const nextIdx  = pos + 1;
  const nextAva  = state.players[nextIdx]?.avatar || AVATAR_FILES.nikt;
  const nextName =
    state.players[nextIdx]?.name ||
    nextHandoffName ||
    `Gracz ${pos + 2}`;

  /* ============================
     1. Przygotuj NEXT (PO PRAWEJ)
  ============================ */
  heroNext.style.transition = "none";
  heroNext.src = nextAva;
  heroNextName.textContent = nextName;
  heroNext.className = "hero-img from-right";
  heroNext.style.opacity = "1";
  heroNext.removeAttribute("aria-hidden");

  // wymuś zapis stanu (bez animacji)
  heroNext.offsetHeight;

  heroNext.style.transition = "";

  /* ============================
     2. OPÓŹNIENIE HANDOFFU
  ============================ */
  setTimeout(() => {
    heroBanner.setAttribute("aria-hidden", "false");

    heroCurrent.classList.add("to-left");
    heroNext.classList.add("enter");

    const onDone = (e) => {
      if (e.target !== heroNext || e.propertyName !== "transform") return;

      /* ============================
         3. FINALNY STAN (bez animacji)
      ============================ */
      heroCurrent.style.transition = "none";
      heroCurrent.className = "hero-img";
      heroCurrent.setAttribute("aria-hidden", "true");

      heroNext.style.transition = "none";
      heroNext.className = "hero-img is-current";

      // wymuś zapis
      heroNext.offsetHeight;

      heroCurrent.style.transition = "";
      heroNext.style.transition = "";

      heroAnimating = false;
    };

    heroNext.addEventListener("transitionend", onDone, { once: true });
  }, HERO_HANDOFF_DELAY);
}



el("secret-show").addEventListener("pointerdown", (e) => {
  e.preventDefault();
  startHold();
});
el("secret-show").addEventListener("pointerup", () => {
  holding = false;
  if (!holdRAF) holdRAF = requestAnimationFrame(holdLoop);
});
el("secret-show").addEventListener("pointerleave", () => {
  holding = false;
  if (!holdRAF) holdRAF = requestAnimationFrame(holdLoop);
});
el("secret-hide").addEventListener("click", () =>
  showOverlay("overlay-secret", false)
);

/* ======= START – animacja ~3s ======= */
function startAnimation(isFirst = false) {
  if (isFirst) state.startIndex = rand(state.players.length);
  const wheel = el("start-wheel");
  wheel.innerHTML = "";
  // w trybie test – bąble z AVATARAMI, w normalnym – same imiona
  state.players.forEach((p, i) => {
    const d = document.createElement("div");
    d.className = "p";
    d.innerHTML = `
  <div class="start-player">
    <img class="start-avatar" src="${escapeHtml(
      p.avatar || AVATAR_FILES.nikt
    )}" alt="">
    <span class="n">${escapeHtml(p.name)}</span>
  </div>
`;

    d.dataset.i = i;
    wheel.appendChild(d);
  });

  show("view-start");
  animateWheelTo(state.startIndex, () => {
    el("starter-name").textContent = state.players[state.startIndex].name;
    renderStats();
    setTimeout(() => show("view-lobby"), 300);
  });
}
function animateWheelTo(targetIndex, done) {
  const items = [...el("start-wheel").children],
    len = items.length;
  let pos = rand(len);
  const baseSpins = 2,
    offset = (targetIndex - (pos % len) + len) % len,
    total = baseSpins * len + offset;
  const targetMs = 3000;
  let startDelay = 20;
  let k = (2 * (targetMs - total * startDelay)) / (total * (total - 1));
  if (k < 0) {
    k = 0;
    startDelay = Math.max(10, targetMs / total - 1);
  }
  let step = 0,
    delay = startDelay;
  el("start-hint").textContent = state.testMode
    ? "Losowanie avatara kto zaczyna…"
    : "Trwa losowanie…";
  (function tick() {
    items.forEach((n) => n.classList.remove("active"));
    items[pos % len].classList.add("active");
    pos++;
    step++;
    if (step < total) {
      delay = startDelay + k * step;
      setTimeout(tick, delay);
    } else {
      items.forEach((n) => n.classList.remove("active"));
      items[targetIndex].classList.add("active");
      const winnerName = state.players[targetIndex].name;
      el("start-hint").textContent = state.testMode
        ? "Zaczyna: " + winnerName
        : "Zaczyna: " + winnerName;
      vibrate(30);
      if (done) done();
    }
  })();
}

/* ======= LOBBY / STATYSTYKI ======= */
function renderStats() {
  const head = el("stats-head");
  head.innerHTML = state.partyMode
    ? '<tr><th>Gracz</th><th>Punkty</th><th class="shots-col">Shoty</th></tr>'
    : "<tr><th>Gracz</th><th>Punkty</th></tr>";

  const body = el("stats-body"); // ← TEGO BRAKOWAŁO
  body.innerHTML = "";

  state.players.forEach((p) => {
    const tr = document.createElement("tr");
    tr.className = "rowcard";
    const avatar = p.avatar || AVATAR_FILES.nikt;
    const nameCell = `<div class="player">
        <img class="stat-ava" src="${escapeHtml(avatar)}" alt="">
        <span class="name">${escapeHtml(p.name)}</span>
      </div>`;
    tr.innerHTML = state.partyMode
      ? `<td>${nameCell}</td><td>${p.points || 0}</td><td class="shots-col">${
          p.shots || 0
        }</td>`
      : `<td>${nameCell}</td><td>${p.points || 0}</td>`;
    body.appendChild(tr);
  });
  save();
}



/* Nowa gra → pytanie o WŁAŚNIE ZAKOŃCZONĄ grę */
el("btn-new-round").addEventListener("click", () =>
  showOverlay("overlay-result", true)
);
el("res-yes").addEventListener("click", () => {
  applyPreviousResult(true);
  showOverlay("overlay-result", false);
  dealNewRound();
});
el("res-no").addEventListener("click", () => {
  applyPreviousResult(false);
  showOverlay("overlay-result", false);
  dealNewRound();
});

/* PUNKTACJA (wielu impostorów) */
function applyPreviousResult(impostorWon) {
  const imps = new Set(state.lastImpostorIndices || []);
  if (imps.size === 0) return;

  if (impostorWon) {
    state.players.forEach((p, i) => {
      if (imps.has(i)) p.points = (p.points || 0) + 1;
    });
    if (state.partyMode) {
      state.players.forEach((p, i) => {
        if (!imps.has(i)) p.shots = (p.shots || 0) + 1;
      });
    }
  } else {
    state.players.forEach((p, i) => {
      if (!imps.has(i)) p.points = (p.points || 0) + 1;
    });
    if (state.partyMode) {
      state.players.forEach((p, i) => {
        if (imps.has(i)) p.shots = (p.shots || 0) + 2;
      });
    }
  }
  renderStats();
}

/* Rozdanie nowej rundy + sekwencyjne ujawnianie */
function dealNewRound() {
  state.startIndex = (state.startIndex + 1) % state.players.length;
  state.word = pickUniqueWord();
  state.impostorIndices = chooseImpostors(state.players.length);
  state.lastImpostorIndices = [...state.impostorIndices];
  save();
  revealSequence(0);
}
function revealSequence(i) {
  const total = state.players.length,
    p = state.players[i],
    isImp = isImpostor(i);
  const nextName = i + 1 < total ? state.players[i + 1].name : null;
  openSecret({
    playerName: p.name,
    text: isImp ? null : state.word,
    isImp,
    pos: i,
    total,
    nextName,
  });
  const once = () => {
    el("secret-hide").removeEventListener("click", once);
    if (i < total - 1) revealSequence(i + 1);
    else startAnimation(false);
  };
  el("secret-hide").addEventListener("click", once);
}

/* ======= ZARZĄDZANIE (kompakt) ======= */
const manageHTML = (p, i) => `
  <div class="rowcard" style="display:flex;align-items:center;gap:8px;padding:10px">
    <div class="chip">${i + 1}</div>
    <img class="manage-avatar" src="${escapeHtml(
      p.avatar || AVATAR_FILES.nikt
    )}" alt="">
    <input type="text" data-name="${i}" value="${escapeHtml(p.name)}"
      style="flex:1;min-width:100px;background:var(--input);border:1px solid var(--hairline);
      border-radius:10px;padding:10px;color:var(--text);font-size:16px"/>
    <button class="icon" data-up="${i}" title="Wyżej">↑</button>
    <button class="icon" data-down="${i}" title="Niżej">↓</button>
    <button class="icon danger" data-del="${i}" title="Usuń">✕</button>
  </div>`;
const styleIcon = document.createElement("style");
styleIcon.textContent = `.icon{appearance:none;border:1px solid rgba(255,255,255,.15);background:var(--secondary);color:#fff;border-radius:10px;min-width:36px;height:36px;font-size:16px;line-height:1;cursor:pointer}
.icon:active{transform:translateY(1px)} .icon.danger{border-color:rgba(255,107,107,.35);color:#ffb3b3}`;
document.head.appendChild(styleIcon);

const manageSec = (function () {
  const sec = document.createElement("section");
  sec.id = "view-manage";
  sec.className = "card screen";
  sec.style.display = "none";
  sec.innerHTML = `<h2 class="title">Gracze</h2><div id="manage-list" class="list"></div>
<div class="row"><input id="manage-name" type="text" placeholder="Dodaj nowego gracza" style="flex:1"/>
<button class="btn" id="manage-add">Dodaj</button></div><div class="divider"></div>
<div class="row">
  <button class="btn full" id="manage-save">Zapisz i wróć</button>
  <button class="btn ghost full" id="manage-cancel">Anuluj</button>
  <button class="btn secondary full" id="reset-stats">Wyzeruj statystyki</button>
  <button class="btn secondary full" id="reset-words">Wyczyść historię haseł</button>
</div>`;
  document.querySelector(".wrap").appendChild(sec);
  return sec;
})();

el("btn-manage").addEventListener("click", () => {
  renderManage();
  show("view-manage");
});
function renderManage() {
  const box = el("manage-list");
  box.innerHTML = "";
  state.players.forEach((p, i) =>
    box.insertAdjacentHTML("beforeend", manageHTML(p, i))
  );
}
document.addEventListener("input", (e) => {
  if (e.target?.dataset?.name !== undefined) {
    const i = +e.target.dataset.name;
    state.players[i].name = e.target.value.trim();
  }
});
document.addEventListener("click", (e) => {
  const d = e.target?.dataset || {};
  if (d.up !== undefined) {
    const i = +d.up;
    if (i > 0) {
      [state.players[i - 1], state.players[i]] = [
        state.players[i],
        state.players[i - 1],
      ];
      renderManage();
    }
  }
  if (d.down !== undefined) {
    const i = +d.down;
    if (i < state.players.length - 1) {
      [state.players[i + 1], state.players[i]] = [
        state.players[i],
        state.players[i + 1],
      ];
      renderManage();
    }
  }
  if (d.del !== undefined) {
    const i = +d.del;
    if (confirm(`Usunąć gracza ${state.players[i].name}?`)) {
      state.players.splice(i, 1);
      if (state.players.length < 3) {
        alert("Co najmniej 3 graczy.");
      }
      renderManage();
    }
  }
  if (e.target?.id === "manage-add") {
    const name = el("manage-name").value.trim();
    if (!name) return;
    if (state.players.some((p) => p.name.toLowerCase() === name.toLowerCase()))
      return alert("To imię już istnieje.");
    if (state.players.length >= 12) return alert("Maksymalnie 12 graczy.");
    const idx = state.players.length;
    const avatar =
      idx >= 5
        ? AVATAR_FILES.nikt
        : guessAvatarForName(name) || AVATAR_FILES.nikt;
    state.players.push({ id: uuid(), name, points: 0, shots: 0, avatar });
    el("manage-name").value = "";
    renderManage();
  }
  if (e.target?.id === "manage-save") {
    if (state.players.length < 3)
      return alert("Potrzeba co najmniej 3 graczy.");
    state.startIndex = state.startIndex % state.players.length;
    save();
    renderStats();
    show("view-lobby");
  }
  if (e.target?.id === "manage-cancel") {
    show("view-lobby");
  }
  if (e.target?.id === "reset-stats") {
    if (!confirm("Wyzerować punkty i shoty?")) return;
    state.players.forEach((p) => {
      p.points = 0;
      p.shots = 0;
    });
    save();
    renderManage();
  }
  if (e.target?.id === "reset-words") {
    if (!confirm("Wyczyścić historię użytych haseł?")) return;
    state.usedWords = [];
    save();
    alert(
      "Historia haseł wyczyszczona. Następne rundy znów będą korzystały z nieużytych słów."
    );
  }
});

/* ======= KONTYNUUJ ======= */
el("btn-continue").addEventListener("click", () => {
  el("starter-name").textContent = state.players[state.startIndex]?.name ?? "–";
  renderStats();
  show("view-lobby");
});
