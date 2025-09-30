/* ======= DANE ======= */
const WORDS = [
  "ZIMNY","CIEPŁY","GORĄCY","LEKKI","CIĘŻKI","SZYBKI","WOLNY","CICHY","GŁOŚNY","MIĘKKI","TWARDY",
  "KOLOROWY","CZARNY","BIAŁY","SZARY","ZIELONY","NIEBIESKI","ŻÓŁTY","CZERWONY","FIOLETOWY","POMARAŃCZOWY","RÓŻOWY",
  "DŁUGI","KRÓTKI","WĄSKI","SZEROKI","WYSOKI","NISKI","GŁĘBOKI","PŁYTKI",

  "RADOŚĆ","SMUTEK","STRACH","ZASKOCZENIE","ZŁOŚĆ","ODWAGA","CIERPLIWOŚĆ","LENISTWO","PRACOWITOŚĆ","NADZIEJA","TĘSKNOTA",
  "ZMĘCZENIE","ENERGIA","CHAOS","PORZĄDEK","PRZYSZŁOŚĆ","PRZESZŁOŚĆ","CHWILA","WIECZNOŚĆ","SZCZĘŚCIE","KREATYWNOŚĆ",
  "NOSTALGIA","CIEKAWOŚĆ","NUDA","WSTYD","POKUSA","TAJEMNICA","PAMIĘĆ","MYŚL","WIARA","SEN","KOSZMAR",

  "PARK","LAS","PLAŻA","GÓRY","PUSTYNIA","DŻUNGLA","WULKAN","WYSPA","PÓŁWYSEP","MIASTO","WIEŚ","ULICA","SKWER",
  "MOST","TUNEL","PORT","LOTNISKO","STACJA","DWORZEC","MUZEUM","TEATR","KINO","STADION","BASEN","BIBLIOTEKA",
  "SZKOŁA","SZPITAL","PRZYCHODNIA","KATEDRA","ZAMEK","PAŁAC","WIEŻA","RUINY","KOPALNIA","FABRYKA","SKLEP","TARG",
  "GALERIA","BAR","KAWIARNIA","RESTAURACJA","KLUB","KASINO","PARKING","PLAC","WARSZTAT","BIURO","LABORATORIUM",

  "LAMPA","ŻARÓWKA","KRZESŁO","STÓŁ","BIURKO","SOFA","ŁÓŻKO","SZAFA","SZUFLADA","PODUSZKA","KOC","ZASŁONA","DYWAN",
  "TELEWIZOR","PILOT","KLAWIATURA","MYSZKA","MONITOR","KAMERA","APARAT","DRON","MIKROFON","GŁOŚNIK","SŁUCHAWKI",
  "LAPTOP","KOMPUTER","TABLET","TELEFON","ŁADOWARKA","BATERIA","KABEL","ROUTER","DRUKARKA","SKANER","EKRAN",
  "PARASOL","PORTFEL","TORBA","WALIZKA","MAPA","KSIĄŻKA","NOTATNIK","DŁUGOPIS","OŁÓWEK","LINIJKA","KUBEK","SZKLANKA",
  "BUTELKA","TALERZ","MISA","ŁYŻKA","NÓŻ","WIDELEC","NOŻYCE","LUSTRO","OBRAZ","RAMKA","KLUCZ","KŁÓDKA","ZAMEK",

  "MŁOTEK","ŚRUBOKRĘT","KLUCZ","PIŁA","WIERTARKA","TAŚMA","POZIOMICA","DRABINA","ŁOPATA","MIOTŁA","SZUFELKA","WIADRO",
  "PĘDZEL","WAŁEK","GWOŹDZIE","PILA","IMADŁO","PIASEK","CEMENT",

  "PIŁKA","BRAMKA","SIATKA","KIJ","RAKIETA","NARTY","ŁYŻWY","KASK","HANTEL","BOKS","TENIS","KOSZYKÓWKA","SIATKÓWKA",
  "SZERMIERKA","ŁUCZNICTWO","WSPINACZKA","ŻEGLARSTWO","NURKOWANIE","GOLF","RUGBY","HOCKEY","KRĘGLE","BILARD","DART",

  "PIES","KOT","KROWA","KOZA","OWCA","ŚWINIA","KOŃ","OSIOŁ","KURA","KOGUT","INDYK","GĘŚ","KACZKA","ŁABĘDŹ","GOŁĄB",
  "WRÓBEL","SOWA","JASKÓŁKA","ORZEŁ","JASTRZĄB","RYŚ","LIS","WILK","NIEDŹWIEDŹ","ŁOŚ","JELEŃ","SARNA","BÓBR","ZAJĄC",
  "KRÓLIK","WIEWIÓRKA","JEŻ","MYSZ","SZCZUR","REKIN","DELFIN","WIELORYB","OŚMIORNICA","PINGWIN","ŻÓŁW","KROKODYL",
  "FLAMING","PANDA","TYGRYS","LEW","SŁOŃ","ŻYRAFA","HIPOPOTAM","MAŁPA","GORYL","KANGUR","KOALA","ZEBRA","STRUŚ",

  "PIZZA","BURGER","SAŁATKA","ZUPA","ROSÓŁ","BIGOS","NALEŚNIK","PIEROGI","CIASTO","TORT","CZEKOLADA","LIZAK","GUMA",
  "JOGURT","SER","MASŁO","CHLEB","BUŁKA","BAGIETKA","KIEŁBASA","PARÓWKA","BEKON","JAJKO","OMLET","SZYNKA","OGÓREK",
  "POMIDOR","PAPRYKA","CEBULA","CZOSNEK","MARCHEWKA","ZIEMNIAK","KALAFIOR","BROKUŁ","BAKŁAŻAN","AWOKADO","BANAN",
  "JABŁKO","GRUSZKA","TRUSKAWKA","MALINA","BORÓWKA","WIŚNIA","ŚLIWKA","ANANAS","KIWI","MANGO","SUSHI","KEBAB","FRYTKI",
  "HOTDOG","CIASTECZKO","LODY","KAWA","HERBATA","SOK","MLEKO","KOKTAJL","COLA",

  "DESZCZ","ŚNIEG","GRAD","MGŁA","WIATR","CHMURA","NIEBO","SŁOŃCE","KSIĘŻYC","GWIAZDA","TĘCZA","BURZA","HURAGAN",
  "TORNADO","ZORZA","TRZĘSIENIE","TSUNAMI","BAŁTYK","GÓRA","DOLINA","RZEKA","JEZIORO","OCEAN","FALA","LÓD","OGIEŃ",
  "CIEŃ","CISZA","HAŁAS","PYŁ","SMOG","ISKRA",

  "GŁOWA","TWARZ","OKO","NOS","USTA","JĘZYK","UCHO","ZĄB","SZYJA","BARK","RĘKA","DŁOŃ","PALEC","KCIUK","BRZUCH",
  "PLECY","NOGA","KOLANO","STOPA","PIĘTA","SERCE","MÓZG","PŁUCO","KOŚĆ","SKÓRA","KREW",

  "KOSZULA","SPODNIE","SPÓDNICA","SUKIENKA","SWETER","BLUZA","KURTKA","PŁASZCZ","MARYNARKA","PASEK","BUTY","KAPCIE",
  "SKARPETA","CZAPKA","KAPELUSZ","RĘKAWICZKA","SZALIK","KRAWAT","TOREBKA",

  "SAMOCHÓD","ROWER","MOTOCYKL","AUTOBUS","TRAMWAJ","POCIĄG","METRO","STATEK","PROM","ŁÓDŹ","KAJAK","HULAJNOGA",
  "SKUTER","HELIKOPTER","SAMOLOT","BALON","RAKIETA","SATELITA","DRON",

  "LEKARZ","PIELĘGNIARKA","NAUCZYCIEL","KELNER","KUCHARZ","PRAWNIK","POLICJANT","STRAŻAK","MUZYK","AKTOR","REŻYSER",
  "MALARZ","PISARZ","POETA","DZIENNIKARZ","FOTOGRAF","ARCHITEKT","INŻYNIER","OGRODNIK","STOLARZ","PROGRAMISTA",
  "YOUTUBER","STREAMER","SPORTOWIEC","TRENER","MECHANIK","ELEKTRYK","KRÓL","KRÓLOWA","ŻOŁNIERZ","DETEKTYW","SZPIEG",
  "KAPITAN","PILOT","NAWIGATOR","ASTRONAUTA","MAG","RYCERZ","PIRAT",

  "APLIKACJA","HASŁO","KOD","PLIK","FOLDER","SYSTEM","SERWER","SIEĆ","WIFI","PORTAL","STRONA","PRZEGLĄDARKA","GRA",
  "KONSOLA","JOYSTICK","PIKSEL","ROBOT","ALGORRYTM","CIp","AI","CYFRA","CHIP",

  // sporo słów dwuznacznych
  "KLUCZ","ZAMEK","FALA","PIŁKA","PISMO","LIST","KORONA","BANK","ZŁOTO","SREBRO","MONETA","ZNAK","GWIAZDA","KRZYŻ",
  "OKNO","DRZWI","BLOK","PASEK","OKRĄG","KRĄG","OBRAZ","PLAN","MAPA","DZWON","KOŁO","RAMA","ŁÓŻKO","ŁUK","KORZEŃ",
  "PIERŚCIEŃ","ŁAŃCUCH","SIEĆ","MASKA","CIEŃ","OPERA","RING","TOR","PUNKT","LINIA","KARTA","DYSK","KRYSZTAŁ",
  "KOMÓRKA","POLE","PŁYTA","NOTA","HASŁO","KLASA","STÓŁ","OPŁATA","FARBA","TON","SKALA","POKÓJ","STACJA","BIEG",
  "STRONA","OKRĘT","BASEN","KANAŁ","KLATKA","ZGRZYT","FALA","DZWON","ŁADUNEK","PRĄD","KORONA","PODŁOGA","PLANETA",
  "KLUB","RANKING","PUNKT","PAS","DÓŁ","SZCZYT","ŚRODEK","BOK","NUTA"
];

const ALL_WORDS = WORDS;

/* ======= STORAGE KEY ======= */
const STORAGE_KEY = "impostorParty_v10";

/* ======= AVATARY ======= */
/* Zmień rozszerzenie jeśli trzeba, np. ".webp" albo ".jpg" */
const AVATAR_PATH = "avatars/";
const AVATAR_EXT  = ".png";

const AVATAR_FILES = {
  adrian: 'avatars/avatar_adi.png',
  kuba:   'avatars/avatar_kub.png',
  wanessa:'avatars/avatar_wan.png',
  jula:   'avatars/avatar_jul.png',
  dawid:  'avatars/avatar_daw.png',
  nikt:   'avatars/avatar_nikt.png',
  default:'avatars/avatar_nikt.png'
};


const NICKS_ADRIAN = ["Adi","Adik","Adriano","MokraPizda","Agent A","Pan A","SpoconaCipka","Sutonator","RobieGałe","Ruchammmmm","WchodzeSobieTutajNajebany","TwójStary","RuchamMame","JulkaEnjoyer","LickDick","DupaNibisz","Najebanyyyy","Ocena 6/10","Gej'o'guesser"];
const NICKS_KUBA   = ["Qba","Kubson","Kubuś","Kubix","JebaćŻydów","ŻydówJebanie","Deeeeeeeeeeejjjjmmmmm","IzraelBomber","Murzynator","MamTwójRower","Czarnuch","Chucko","Fanta","PokaSiura","PanstwoIzrael","TwójStary","Lubie Piwo","Jebać","KochamWaneske","MocnyStatement","JestemCzarnuchem","Niger - takie państwo"];

/* dopasowanie po rdzeniach / wariacjach */
const NAME_HINTS = {
  wanessa: ["wanessa","vanessa","wanes","vanes","wane","waneska","vannes","wan","wa"],
  jula:    ["jula","julia","julka","julcia","jull","jul","dzjula","ju"],
  dawid:   ["dawid","david","dawcio","daw","dawo","dawko","da"],
  adrian:  ["adrian","adi","adik","adek","adri","adrix","adriano","ad"],
  kuba:    ["kuba","qba","kub","kubus","kubuś","kubson","kubix","kubon","ku"]
};
const norm = s => (s||"").toLowerCase().replace(/[^a-ząćęłńóśźż]/g,"");

/* ======= STAN ======= */
const state = {
  players:[],
  targetCount:5,
  entryIndex:0,
  word:"",
  impostorIndices:[],
  lastImpostorIndices:[],
  startIndex:0,
  partyMode:false,
  usedWords:[],
  testMode:false   // tryb z avatarami (przycisk „Test”)
};

/* „Wymuszony” avatar po kliknięciu przycisku losowania – trzyma się do zatwierdzenia gracza */
let forcedAvatar = null;

/* ======= HELPERS ======= */
const el=id=>document.getElementById(id);
const vibrate=ms=>{ if(navigator.vibrate) try{ navigator.vibrate(ms);}catch(e){} };
const rand=n=>Math.floor(Math.random()*n);
const escapeHtml=s=>s.replace(/[&<>"']/g,m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m]));
function uuid(){ if(crypto?.randomUUID) return crypto.randomUUID();
  if(crypto?.getRandomValues){ return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c/4).toString(16)); }
  return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&0x3|0x8);return v.toString(16);});}


  // ---- HERO refs i meta do overlay-secret ----
function getHeroRefs(){
  return {
    heroCurrent: document.getElementById("hero-current"),
    heroNext:    document.getElementById("hero-next"),
    heroBanner:  document.getElementById("hero-banner"),
    heroNextName:document.getElementById("hero-next-name")
  };
}
let nextHandoffName = null;   // tekst „Przekaż telefon do…”
let heroAnimating   = false;  // blokada równoległych animacji


// bieżące info o sekwencji przekazywania
let currentSecretMeta = { pos:0, total:0 };



/* ======= IMPOSTOR UTILS ======= */
const isImpostor = (i) => state.impostorIndices.includes(i);

// 1%: wszyscy; 5%: dokładnie dwóch; reszta: jeden
function chooseImpostors(total){
  const r = Math.random();
  if (r < 0.05) return Array.from({length: total}, (_,i)=>i);
  if (r < 0.013) {
    if (total < 2) return [0];
    let a = rand(total), b; do { b = rand(total); } while (b === a);
    return a < b ? [a,b] : [b,a];
  }
  return [rand(total)];
}

/* ======= AVATARY – przypisanie po nazwie ======= */
function guessAvatarForName(name){
  const n = norm(name);
  for(const key of Object.keys(NAME_HINTS)){
    if (NAME_HINTS[key].some(h => n.includes(h))) {
      return AVATAR_FILES[key] || AVATAR_FILES.default;
    }
  }
  return null;
}

/* ======= SŁOWA – bez powtórek ======= */
function pickUniqueWord(){
  const used = new Set(state.usedWords || []);
  const pool = ALL_WORDS.filter(w => !used.has(w));
  if (pool.length === 0){
    state.usedWords = [];
    save();
    alert("Skończyły się wszystkie hasła. Resetuję historię i zaczynam nowy cykl.");
    return pickUniqueWord();
  }
  const word = pool[rand(pool.length)];
  used.add(word);
  state.usedWords = Array.from(used);
  save();
  return word;
}

/* ======= storage ======= */
const save=()=>localStorage.setItem(STORAGE_KEY,JSON.stringify({
  players:state.players,
  startIndex:state.startIndex,
  lastImpostorIndices:state.lastImpostorIndices,
  partyMode:state.partyMode,
  usedWords:state.usedWords
}));
const load=()=>{ try{
  const raw=localStorage.getItem(STORAGE_KEY); if(!raw) return false;
  const d=JSON.parse(raw); if(!Array.isArray(d.players)||d.players.length<1) return false;
  state.players=d.players;
  state.startIndex=(Number.isInteger(d.startIndex)? d.startIndex % state.players.length:0);
  if(Array.isArray(d.lastImpostorIndices)) state.lastImpostorIndices=d.lastImpostorIndices;
  else if(typeof d.lastImpostorIndex==="number") state.lastImpostorIndices=[d.lastImpostorIndex];
  else state.lastImpostorIndices=[];
  state.partyMode=!!d.partyMode;
  state.usedWords = Array.isArray(d.usedWords) ? d.usedWords : [];
  return true;
}catch(e){return false;}};

function show(id){
  for(const s of ["view-menu","view-setup","view-entry","view-start","view-lobby","view-manage"]){
    const v=el(s); if(v) v.style.display=(s===id)?"":"none";
  }
}
function showOverlay(id,on=true){
  const ov=el(id);
  if(on){ document.body.classList.add('lock-scroll'); ov.classList.add('show'); requestAnimationFrame(()=>window.scrollTo(0,0)); }
  else  { ov.classList.remove('show'); document.body.classList.remove('lock-scroll'); }
}

/* ======= MENU ======= */
function initMenu(){
  const ok=load();
  el("btn-continue").disabled=!ok;
  el("partyMode").checked = state.partyMode;
  // NIE wyłączamy testMode tutaj; włączasz go przyciskiem „Test”
  show("view-menu");
}
window.addEventListener("load", initMenu);
el("partyMode").addEventListener("change", (e)=>{ state.partyMode = e.target.checked; save(); renderStats(); });

/* NOWA GRA – normalny tryb */
el("btn-new").addEventListener("click",()=>{
  state.testMode=false;
  state.targetCount=Math.min(12,Math.max(3,parseInt(el("playerCount").value)||5));
  el("playerCount").value=state.targetCount; show("view-setup");
});

/* TEST – tryb z avatarami (specjalne UI) */
const btnTest = document.getElementById("btn-test");
if (btnTest){
  btnTest.addEventListener("click",()=>{
    state.testMode=true;
    state.targetCount=Math.min(12,Math.max(3,parseInt(el("playerCount").value)||5));
    el("playerCount").value=state.targetCount; show("view-setup");
  });
}

el("back-to-menu").addEventListener("click", initMenu);

el("btn-begin-entry").addEventListener("click", ()=>{
  state.targetCount=Math.min(12,Math.max(3,parseInt(el("playerCount").value)||5));
  state.players=[]; state.entryIndex=0; state.word=pickUniqueWord();
  state.impostorIndices = chooseImpostors(state.targetCount);
  state.lastImpostorIndices = [...state.impostorIndices];
  el("entry-index").textContent="1"; el("entry-total").textContent=String(state.targetCount);
  el("entry-name").value=""; renderEntryList(); show("view-entry"); setTimeout(()=>el("entry-name").focus(),120);
  if (state.testMode) ensureNickButtons();
});

/* ======= DYNAMICZNE PRZYCISKI: Losuj nick Adrian/Kuba ======= */
function ensureNickButtons(){
  if (document.getElementById("btn-nick-adrian")) return;
  const row = document.createElement("div");
  row.className = "row";
  row.style.marginTop = "6px";
  row.innerHTML = `
    <button class="btn secondary" id="btn-nick-adrian">Losuj nick Adrian</button>
    <button class="btn secondary" id="btn-nick-kuba">Losuj nick Kuba</button>
  `;
  const entrySection = document.getElementById("view-entry");
  const firstBlock = entrySection.querySelector(".row");
  firstBlock.insertAdjacentElement("afterend", row);

  const input = el("entry-name");

  el("btn-nick-adrian").addEventListener("click", ()=>{
    const nick = NICKS_ADRIAN[rand(NICKS_ADRIAN.length)];
    input.value = nick;
    forcedAvatar = AVATAR_FILES.adrian; // trzyma się aż do zatwierdzenia
  });
  el("btn-nick-kuba").addEventListener("click", ()=>{
    const nick = NICKS_KUBA[rand(NICKS_KUBA.length)];
    input.value = nick;
    forcedAvatar = AVATAR_FILES.kuba;
  });
}

/* ======= ENTRY FLOW ======= */
function renderEntryList(){
  const box=el("entry-list"); box.innerHTML="";
  state.players.forEach((p,i)=>{
    const d=document.createElement("div"); d.className="rowcard"; d.style.padding="12px 14px";
    d.innerHTML=`<div style="display:flex;align-items:center;gap:10px">
      <img src="${escapeHtml(p.avatar||AVATAR_FILES.nikt)}" alt="" style="width:28px;height:28px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,255,255,.15)">
      <span class="chip" style="margin-right:8px">${i+1}</span><strong>${escapeHtml(p.name)}</strong>
    </div>`;
    box.appendChild(d);
  });
}

el("entry-confirm").addEventListener("click",()=>{
  const name=el("entry-name").value.trim(); if(!name) return alert("Podaj imię.");
  if(state.players.some(p=>p.name.toLowerCase()===name.toLowerCase())) return alert("To imię już jest na liście.");

  const idx = state.entryIndex;

  // priorytety avataru:
  // 1) jeśli kliknięto losowanie nicku – użyj forcedAvatar,
  // 2) jeśli to 6. i dalszy gracz -> nikt,
  // 3) dopasowanie po nazwie (wan/jul/daw/adrian/kuba),
  // 4) domyślnie nikt.
  let avatar = forcedAvatar
            || (idx>=5 ? AVATAR_FILES.nikt : (guessAvatarForName(name) || AVATAR_FILES.nikt));

  state.players.push({id:uuid(),name,points:0,shots:0,avatar});
  forcedAvatar = null;

  const isImp=isImpostor(idx);
  el("entry-name").blur();
  const nextName = (idx+1<state.targetCount)? state.players[idx+1]?.name ?? ("Gracz "+(idx+2)) : null;
  openSecret({playerName:name, text:isImp?null:state.word, isImp, pos:idx, total:state.targetCount, nextName});
  const once=()=>{ el("secret-hide").removeEventListener("click",once);
    state.entryIndex++; el("entry-name").value=""; renderEntryList();
    if(state.entryIndex<state.targetCount){ el("entry-index").textContent=String(state.entryIndex+1); }
    else{ save(); startAnimation(true); /* w trybie test zostaje aktywny do końca sesji */ }
  };
  el("secret-hide").addEventListener("click", once);
});
el("entry-name").addEventListener("keydown",e=>{ if(e.key==="Enter") el("entry-confirm").click(); });

/* ======= SECRET OVERLAY ======= */

function openSecret({playerName,text,isImp,pos,total,nextName}){
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
  heroNext.setAttribute("aria-hidden","true");
  heroBanner.setAttribute("aria-hidden","true");
  heroNextName.textContent = "";

  // UI overlayu
  el("secret-player").textContent=playerName;
  el("secret-pos").textContent=`${pos+1} / ${total}`;
  el("secret-value").style.display="none";
  el("secret-imp-hint").style.display="none";
  el("secret-instruction").style.display="";
  el("secret-show").style.display="";
  el("secret-hide").style.display="none";
  el("handoff-inline").style.display="none";
  el("secret-show").style.setProperty('--holdp',0);
  el("secret-value").textContent = isImp? "—" : text;
  el("secret-value").dataset.imp = isImp? "1":"0";
  holdProgress=0; updateHoldFill(0);
  showOverlay("overlay-secret", true);
}


const HOLD_FILL_MS=900, HOLD_DECAY_MS=350;
let holdProgress=0, holdRAF=null, holding=false, lastTs=0;
function updateHoldFill(p){ el("secret-show").style.setProperty('--holdp', Math.round(p*100)); }
function holdLoop(ts){
  if(!lastTs) lastTs=ts; const dt=ts-lastTs; lastTs=ts;
  if(holding){ holdProgress=Math.min(1,holdProgress+dt/HOLD_FILL_MS); if(holdProgress>=1){ revealSecret(); stopHold(); return; } }
  else{ holdProgress=Math.max(0,holdProgress-dt/HOLD_DECAY_MS); if(holdProgress===0){ stopHold(); updateHoldFill(holdProgress); return; } }
  updateHoldFill(holdProgress); holdRAF=requestAnimationFrame(holdLoop);
}
function startHold(){ if(holdRAF) cancelAnimationFrame(holdRAF); holding=true; lastTs=0; holdRAF=requestAnimationFrame(holdLoop); }
function stopHold(){ if(holdRAF) cancelAnimationFrame(holdRAF); holdRAF=null; holding=false; lastTs=0; }
function revealSecret(){
  // pokaż treść
  el("secret-instruction").style.display="none";
  el("secret-value").style.display="";
  el("secret-show").style.display="none";
  el("secret-hide").style.display="";
  if(el("secret-value").dataset.imp==="1") el("secret-imp-hint").style.display="block";
  vibrate(15);

  const { heroCurrent, heroNext, heroBanner, heroNextName } = getHeroRefs();
  const { pos, total } = currentSecretMeta;
  const hasNext = (pos + 1) < total;
  if (!hasNext || heroAnimating) return;

  heroAnimating = true;

  const nextIdx   = pos + 1;
  const nextAva   = state.players[nextIdx]?.avatar || AVATAR_FILES.nikt;
  const fallback  = nextHandoffName || `Gracz ${pos+2}`;
  const nextName  = state.players[nextIdx]?.name || fallback;

  // przygotuj „next” poza ekranem
  heroNext.src = nextAva;
  heroNext.className = "hero-img from-right";
  heroNext.removeAttribute("aria-hidden");
  heroNextName.textContent = nextName;

  setTimeout(()=>{                 // 1.5 s po odsłonięciu
    heroBanner.setAttribute("aria-hidden","false");

    // reflow i start animacji
    void heroNext.offsetWidth;
    heroCurrent.classList.add("to-left");
    heroNext.classList.add("enter");

    const onDone = (e)=>{
      if (e.target !== heroNext || e.propertyName !== "transform") return; // tylko raz
      heroCurrent.src = nextAva;
      heroCurrent.className = "hero-img is-current";
      heroNext.className = "hero-img";
      heroNext.setAttribute("aria-hidden","true");
      heroAnimating = false;
    };
    heroNext.addEventListener("transitionend", onDone, { once:true });
  }, 1500);
}

el("secret-show").addEventListener("pointerdown",e=>{ e.preventDefault(); startHold(); });
el("secret-show").addEventListener("pointerup",  ()=>{ holding=false; if(!holdRAF) holdRAF=requestAnimationFrame(holdLoop); });
el("secret-show").addEventListener("pointerleave",()=>{ holding=false; if(!holdRAF) holdRAF=requestAnimationFrame(holdLoop); });
el("secret-hide").addEventListener("click", ()=> showOverlay("overlay-secret", false) );

/* ======= START – animacja ~3s ======= */
function startAnimation(isFirst=false){
  if(isFirst) state.startIndex = rand(state.players.length);
  const wheel=el("start-wheel"); wheel.innerHTML="";
  // w trybie test – bąble z AVATARAMI, w normalnym – same imiona
state.players.forEach((p,i)=>{
  const d=document.createElement("div");
  d.className="p";
  d.innerHTML = `<img class="wava" src="${escapeHtml(p.avatar || AVATAR_FILES.nikt)}" alt="">
                 <span class="n">${escapeHtml(p.name)}</span>`;
  d.dataset.i=i;
  wheel.appendChild(d);
});

  show("view-start");
  animateWheelTo(state.startIndex, ()=>{ el("starter-name").textContent=state.players[state.startIndex].name; renderStats(); setTimeout(()=>show("view-lobby"),300); });
}
function animateWheelTo(targetIndex,done){
  const items=[...el("start-wheel").children], len=items.length; let pos=rand(len);
  const baseSpins=2, offset=(targetIndex-(pos%len)+len)%len, total=baseSpins*len+offset;
  const targetMs=3000; let startDelay=20; let k=(2*(targetMs-total*startDelay))/(total*(total-1));
  if(k<0){k=0; startDelay=Math.max(10,targetMs/total-1);} let step=0, delay=startDelay;
  el("start-hint").textContent= state.testMode ? "Losowanie avatara kto zaczyna…" : "Trwa losowanie…";
  (function tick(){
    items.forEach(n=>n.classList.remove("active")); items[pos%len].classList.add("active");
    pos++; step++;
    if(step<total){ delay=startDelay+k*step; setTimeout(tick,delay); }
    else{
      items.forEach(n=>n.classList.remove("active")); items[targetIndex].classList.add("active");
      const winnerName = state.players[targetIndex].name;
      el("start-hint").textContent = state.testMode ? ("Zaczyna: " + winnerName) : ("Zaczyna: "+winnerName);
      vibrate(30); if(done) done();
    }
  })();
}

/* ======= LOBBY / STATYSTYKI ======= */
function renderStats(){
  const head = el("stats-head");
  head.innerHTML = state.partyMode
    ? '<tr><th>Gracz</th><th>Punkty</th><th class="shots-col">Shoty</th></tr>'
    : '<tr><th>Gracz</th><th>Punkty</th></tr>';

  const body = el("stats-body");      // ← TEGO BRAKOWAŁO
  body.innerHTML = "";

  state.players.forEach(p=>{
    const tr=document.createElement("tr"); tr.className="rowcard";
    const avatar = p.avatar || AVATAR_FILES.nikt;
    const nameCell = `<div class="player">
        <img class="stat-ava" src="${escapeHtml(avatar)}" alt="">
        <span class="name">${escapeHtml(p.name)}</span>
      </div>`;
    tr.innerHTML = state.partyMode
      ? `<td>${nameCell}</td><td>${p.points||0}</td><td class="shots-col">${p.shots||0}</td>`
      : `<td>${nameCell}</td><td>${p.points||0}</td>`;
    body.appendChild(tr);
  });
  save();
}


/* Nowa gra → pytanie o WŁAŚNIE ZAKOŃCZONĄ grę */
el("btn-new-round").addEventListener("click", ()=> showOverlay("overlay-result", true));
el("res-yes").addEventListener("click", ()=>{ applyPreviousResult(true); showOverlay("overlay-result", false); dealNewRound(); });
el("res-no").addEventListener("click",  ()=>{ applyPreviousResult(false); showOverlay("overlay-result", false); dealNewRound(); });

/* PUNKTACJA (wielu impostorów) */
function applyPreviousResult(impostorWon){
  const imps = new Set(state.lastImpostorIndices || []);
  if (imps.size === 0) return;

  if(impostorWon){
    state.players.forEach((p,i)=>{ if(imps.has(i)) p.points = (p.points||0) + 1; });
    if(state.partyMode){
      state.players.forEach((p,i)=>{ if(!imps.has(i)) p.shots = (p.shots||0) + 1; });
    }
  }else{
    state.players.forEach((p,i)=>{ if(!imps.has(i)) p.points = (p.points||0) + 1; });
    if(state.partyMode){
      state.players.forEach((p,i)=>{ if(imps.has(i)) p.shots = (p.shots||0) + 2; });
    }
  }
  renderStats();
}

/* Rozdanie nowej rundy + sekwencyjne ujawnianie */
function dealNewRound(){
  state.startIndex=(state.startIndex+1)%state.players.length;
  state.word=pickUniqueWord();
  state.impostorIndices = chooseImpostors(state.players.length);
  state.lastImpostorIndices = [...state.impostorIndices];
  save();
  revealSequence(0);
}
function revealSequence(i){
  const total=state.players.length, p=state.players[i], isImp=isImpostor(i);
  const nextName=(i+1<total)?state.players[i+1].name:null;
  openSecret({playerName:p.name, text:isImp?null:state.word, isImp, pos:i, total, nextName});
  const once=()=>{ el("secret-hide").removeEventListener("click", once);
    if(i<total-1) revealSequence(i+1); else startAnimation(false);
  };
  el("secret-hide").addEventListener("click", once);
}

/* ======= ZARZĄDZANIE (kompakt) ======= */
const manageHTML=(p,i)=>`
  <div class="rowcard" style="display:flex;align-items:center;gap:8px;padding:10px">
    <div class="chip">${i+1}</div>
    <img src="${escapeHtml(p.avatar||AVATAR_FILES.nikt)}" alt="" style="width:28px;height:28px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,255,255,.15)">
    <input type="text" data-name="${i}" value="${escapeHtml(p.name)}"
      style="flex:1;min-width:100px;background:var(--input);border:1px solid var(--hairline);
      border-radius:10px;padding:10px;color:var(--text);font-size:16px"/>
    <button class="icon" data-up="${i}" title="Wyżej">↑</button>
    <button class="icon" data-down="${i}" title="Niżej">↓</button>
    <button class="icon danger" data-del="${i}" title="Usuń">✕</button>
  </div>`;
const styleIcon=document.createElement('style');
styleIcon.textContent=`.icon{appearance:none;border:1px solid rgba(255,255,255,.15);background:var(--secondary);color:#fff;border-radius:10px;min-width:36px;height:36px;font-size:16px;line-height:1;cursor:pointer}
.icon:active{transform:translateY(1px)} .icon.danger{border-color:rgba(255,107,107,.35);color:#ffb3b3}`; document.head.appendChild(styleIcon);

const manageSec=(function(){ const sec=document.createElement("section"); sec.id="view-manage"; sec.className="card screen"; sec.style.display="none";
sec.innerHTML=`<h2 class="title">Gracze</h2><div id="manage-list" class="list"></div>
<div class="row"><input id="manage-name" type="text" placeholder="Dodaj nowego gracza" style="flex:1"/>
<button class="btn" id="manage-add">Dodaj</button></div><div class="divider"></div>
<div class="row">
  <button class="btn full" id="manage-save">Zapisz i wróć</button>
  <button class="btn ghost full" id="manage-cancel">Anuluj</button>
  <button class="btn secondary full" id="reset-stats">Wyzeruj statystyki</button>
  <button class="btn secondary full" id="reset-words">Wyczyść historię haseł</button>
</div>`; document.querySelector(".wrap").appendChild(sec); return sec; })();

el("btn-manage").addEventListener("click", ()=>{ renderManage(); show("view-manage"); });
function renderManage(){ const box=el("manage-list"); box.innerHTML=""; state.players.forEach((p,i)=> box.insertAdjacentHTML('beforeend', manageHTML(p,i))); }
document.addEventListener("input",(e)=>{ if(e.target?.dataset?.name!==undefined){ const i=+e.target.dataset.name; state.players[i].name=e.target.value.trim(); }});
document.addEventListener("click",(e)=>{
  const d=e.target?.dataset||{};
  if(d.up!==undefined){ const i=+d.up; if(i>0){ [state.players[i-1],state.players[i]]=[state.players[i],state.players[i-1]]; renderManage(); } }
  if(d.down!==undefined){ const i=+d.down; if(i<state.players.length-1){ [state.players[i+1],state.players[i]]=[state.players[i],state.players[i+1]]; renderManage(); } }
  if(d.del!==undefined){ const i=+d.del; if(confirm(`Usunąć gracza ${state.players[i].name}?`)){ state.players.splice(i,1); if(state.players.length<3){ alert("Co najmniej 3 graczy."); } renderManage(); } }
  if(e.target?.id==="manage-add"){
    const name=el("manage-name").value.trim(); if(!name) return;
    if(state.players.some(p=>p.name.toLowerCase()===name.toLowerCase())) return alert("To imię już istnieje.");
    if(state.players.length>=12) return alert("Maksymalnie 12 graczy.");
    const idx = state.players.length;
    const avatar = (idx>=5) ? AVATAR_FILES.nikt : (guessAvatarForName(name) || AVATAR_FILES.nikt);
    state.players.push({id:uuid(), name, points:0, shots:0, avatar});
    el("manage-name").value=""; renderManage();
  }
  if(e.target?.id==="manage-save"){ if(state.players.length<3) return alert("Potrzeba co najmniej 3 graczy.");
    state.startIndex = state.startIndex % state.players.length; save(); renderStats(); show("view-lobby"); }
  if(e.target?.id==="manage-cancel"){ show("view-lobby"); }
  if(e.target?.id==="reset-stats"){ if(!confirm("Wyzerować punkty i shoty?")) return; state.players.forEach(p=>{ p.points=0; p.shots=0; }); save(); renderManage(); }
  if(e.target?.id==="reset-words"){
    if(!confirm("Wyczyścić historię użytych haseł?")) return;
    state.usedWords = [];
    save();
    alert("Historia haseł wyczyszczona. Następne rundy znów będą korzystały z nieużytych słów.");
  }
});

/* ======= KONTYNUUJ ======= */
el("btn-continue").addEventListener("click", ()=>{ el("starter-name").textContent=state.players[state.startIndex]?.name ?? "–"; renderStats(); show("view-lobby"); });
