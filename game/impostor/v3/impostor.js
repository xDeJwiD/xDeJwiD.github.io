/* V3: explicit round transitions; animations never own gameplay state. */
(() => {
  'use strict';
  const Core = ImpostorCore;
  const WORD_SETS = {
    default: WORDS_DEFAULT, country: WORDS_COUNTRY,
    food: WORDS_FOOD, animal: WORDS_ANIMAL, objects: WORDS_OBJECTS, places: WORDS_PLACES, holidays: WORDS_HOLIDAYS,
  };
  const el = id => document.getElementById(id);
  const copy = Core.clone;
  const escapeHtml = value => String(value).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]);
  let sequence = 0;
  const uuid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${++sequence}-${Math.random().toString(36).slice(2)}`;
  const AVATARS = {
    adrian: 'avatars/normal/av_adi.png', kuba: 'avatars/normal/av_kub.png',
    wanessa: 'avatars/normal/av_wan.png', jula: 'avatars/normal/av_jul.png',
    dawid: 'avatars/normal/av_daw.png', nikt: 'avatars/normal/av_nikt.png'
  };
  const styledAvatar = (src, style) => (style || state.settings.avatarStyle) === 'beach' ? src.replace('/normal/av_', '/beach/avb_') : src;
  const NAME_HINTS = {
    wanessa: ['wanessa', 'vanessa', 'wanes', 'vanes', 'wane', 'waneska', 'vannes', 'wan', 'wa'],
    jula: ['jula', 'julia', 'julka', 'julcia', 'jull', 'jul', 'dzjula', 'ju'],
    dawid: ['dawid', 'david', 'dawcio', 'daw', 'dawo', 'dawko', 'da'],
    adrian: ['adrian', 'adi', 'adik', 'adek', 'adri', 'adrix', 'adriano', 'ad'],
    kuba: ['kuba', 'qba', 'kub', 'kubus', 'kubuś', 'kubson', 'kubix', 'kubon', 'ku'],
  };
  const avatarAliases = Object.entries(NAME_HINTS).flatMap(([key, aliases]) =>
    aliases.map(alias => ({ key, alias }))).sort((a, b) => b.alias.length - a.alias.length);
  function avatarFor(player, style) {
    if (!style) style = state.round?.beachReveal && state.round.beachRevealed.includes(player.id) ? 'beach' : state.settings.avatarStyle || 'normal';
    // Keep identity from the initial roster; if that was a number/placeholder, try the nick.
    for (const value of [player.orderName, player.name]) {
      const name = Core.normalize(value || '').replace(/[^a-ząćęłńóśźż]/g, '');
      const match = avatarAliases.find(a => name === a.alias) ||
        avatarAliases.find(a => a.alias.length >= 3 && name.includes(a.alias));
      if (match) return styledAvatar(AVATARS[match.key], style);
    }
    // Accept only known local filenames from older saves, never arbitrary stored URLs.
    const savedFile = typeof player.avatar === 'string' ? player.avatar.split('/').pop().replace(/\.webp$/i, '.png').replace(/^(avatar_|avb_)/, 'av_') : '';
    return styledAvatar(Object.values(AVATARS).find(src => src.split('/').pop() === savedFile) || AVATARS.nikt, style);
  }
  const img = (player, cls, style) => `<img class="${cls}" src="${avatarFor(player, style)}" alt="" decoding="async">`;
  function vibrate(ms) { try { navigator.vibrate?.(ms); } catch { } }
  let state = Core.emptyState();
  let hasSave = false, storageDisabled = false;
  let setupDraft = null, manageDraft = null, resetHistoryDraft = false;
  let resultRoundId = null, transitionBusy = false;
  let secretVisible = false, secretOpen = false, resumeFocus = null;
  let holding = false, holdProgress = 0, holdFrame = 0, lastTime = 0, holdSource = null;
  let heroTimer = 0, wheelTimer = 0, wheelToken = 0;

  function storageNotice(message) {
    el('storage-notice').textContent = message;
    el('storage-notice').hidden = false;
  }
  function persist() {
    hasSave = state.players.length >= 3;
    el('btn-continue').disabled = !hasSave;
    if (storageDisabled) return;
    try { localStorage.setItem(Core.STORAGE_KEY, JSON.stringify(state)); }
    catch {
      storageDisabled = true;
      storageNotice('Nie udało się zapisać gry. Możesz grać dalej, ale nie zamykaj ani nie odświeżaj tej strony.');
    }
  }
  function commit(next) { state = next; persist(); }
  function load() {
    try {
      const raw = localStorage.getItem(Core.STORAGE_KEY);
      if (raw) {
        let parsed = null;
        try { parsed = Core.validateSave(JSON.parse(raw), WORD_SETS); } catch { }
        if (parsed) { state = parsed; hasSave = true; }
        else storageNotice('Nie udało się odczytać poprzedniego zapisu V3. Rozpocznij nową grę.');
      }
      if (!hasSave) {
        let legacy = null;
        try { legacy = Core.migrateLegacy(JSON.parse(localStorage.getItem('impostorParty_v10')), WORD_SETS, uuid); } catch { }
        if (legacy) {
          el('btn-import').hidden = false;
          el('btn-import').onclick = () => {
            if (!confirm('Przenieść graczy i punkty? Starej rundy nie można wznowić — rozpoczniesz nowe rozdanie. Zapis V2 pozostanie bez zmian.')) return;
            commit(legacy); el('btn-import').hidden = true; renderLobby();
          };
        }
      }
    } catch {
      storageDisabled = true;
      storageNotice('Pamięć przeglądarki jest niedostępna. Gra będzie działała do zamknięcia lub odświeżenia strony.');
    }
    el('btn-continue').disabled = !hasSave;
  }
  function show(id) {
    document.querySelectorAll('.wrap > .screen').forEach(view => { view.style.display = view.id === id ? '' : 'none'; });
    window.scrollTo(0, 0);
  }
  function overlay(id, on) {
    const element = el(id);
    if (on) resumeFocus = document.activeElement;
    element.classList.toggle('show', on);
    const any = !!document.querySelector('.overlay.show');
    document.body.classList.toggle('lock-scroll', any);
    document.querySelector('.wrap').inert = any;
    if (on) {
      element.scrollTop = 0;
      element.querySelector('button:not([hidden]):not([disabled])')?.focus({ preventScroll: true });
    } else if (!any && resumeFocus?.isConnected) resumeFocus.focus({ preventScroll: true });
  }
  document.addEventListener('keydown', event => {
    const dialog = document.querySelector('.overlay.show');
    if (!dialog || event.key !== 'Tab') return;
    const buttons = [...dialog.querySelectorAll('button:not([hidden]):not([disabled])')].filter(b => b.getClientRects().length);
    if (!buttons.length) return;
    const first = buttons[0], last = buttons.at(-1);
    if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  });

  // Settings are a draft until explicitly saved or a new game is confirmed.
  function syncSettings(settings) {
    el('impostor-knows-role').checked = settings.impostorKnowsRole !== false;
    document.querySelectorAll('input[name="impostorInfo"]').forEach(n => { n.checked = n.value === settings.impostorInfo; });
    document.querySelectorAll('input[name="impostorCount"]').forEach(n => { n.checked = n.value === settings.impostorCount; });
    document.querySelectorAll('input[name="wordSet"]').forEach(n => {
      const count = Core.poolFor(WORD_SETS, [n.value]).length;
      n.disabled = !count;
      n.checked = !!count && settings.selectedWordSets.includes(n.value);
      el(`words-count-${n.value}`).textContent = count;
      n.nextElementSibling.title = count ? '' : 'Zestaw nie zawiera jeszcze haseł';
    });
    updateRoleOption();
  }
  function updateRoleOption() {
    const active = document.querySelector('input[name="impostorInfo"]:checked')?.value === 'none';
    el('impostor-knows-role').disabled = !active;
    el('role-option').hidden = !active;
  }
  document.querySelectorAll('input[name="impostorInfo"]').forEach(n => n.addEventListener('change', updateRoleOption));
  function readSettings() {
    const settings = {
      impostorInfo: document.querySelector('input[name="impostorInfo"]:checked')?.value,
      avatarStyle: state.settings.avatarStyle || 'normal', beachNextRound: state.settings.beachNextRound === true,
      impostorKnowsRole: el('impostor-knows-role').checked,
      impostorCount: document.querySelector('input[name="impostorCount"]:checked')?.value,
      selectedWordSets: [...document.querySelectorAll('input[name="wordSet"]:checked')].map(n => n.value)
    };
    if (!Core.settingsValid(settings, WORD_SETS)) throw new Error('Wybierz przynajmniej jeden dostępny zestaw haseł.');
    return settings;
  }
  function openSettings(edit) {
    syncSettings(state.settings);
    el('player-count-section').hidden = edit;
    ['btn-begin-entry', 'back-to-menu'].forEach(id => { el(id).hidden = edit; });
    ['setup-save', 'setup-cancel'].forEach(id => { el(id).hidden = !edit; });
    show('view-setup');
  }
  el('btn-test').onclick = () => openSettings(false);
  el('btn-settings').onclick = () => openSettings(true);
  el('back-to-menu').onclick = () => { syncSettings(state.settings); show('view-menu'); };
  el('setup-cancel').onclick = () => { syncSettings(state.settings); renderLobby(); };
  el('setup-save').onclick = () => {
    try { const next = copy(state); next.settings = readSettings(); commit(next); renderLobby(); }
    catch (error) { alert(error.message); }
  };
  document.querySelectorAll('input[name="wordSet"]').forEach(input => input.addEventListener('change', () => {
    if (!document.querySelector('input[name="wordSet"]:checked')) {
      input.checked = true; alert('Zostaw zaznaczony przynajmniej jeden zestaw haseł.');
    }
  }));
  for (let i = 3; i <= 12; i++) {
    const dot = document.createElement('div'); dot.className = 'player-dot'; dot.dataset.value = i; el('playerDots').appendChild(dot);
  }
  function updateSlider() {
    const n = Number(el('playerCount').value);
    el('playerCountValue').textContent = `${n} graczy`;
    document.querySelectorAll('.player-dot').forEach(dot => dot.classList.toggle('active', Number(dot.dataset.value) === n));
  }
  el('playerCount').addEventListener('input', updateSlider);
  el('btn-begin-entry').onclick = () => {
    try { setupDraft = readSettings(); } catch (error) { return alert(error.message); }
    const total = Math.max(3, Math.min(12, Number(el('playerCount').value) || 5));
    el('order-list').innerHTML = Array.from({ length: total }, (_, i) => `<div class="rowcard"><label for="order-${i}">Osoba ${i + 1}</label><input type="text" id="order-${i}" data-order="${i}" maxlength="40" placeholder="Imię" autocomplete="off"></div>`).join('');
    show('view-order');
  };
  el('order-back').onclick = () => { syncSettings(setupDraft); show('view-setup'); };
  el('order-confirm').onclick = () => {
    try {
      const names = [...document.querySelectorAll('[data-order]')].map(n => n.value.normalize('NFC').trim());
      if (names.some(n => !n || n.length > 40) || new Set(names.map(Core.normalize)).size !== names.length)
        throw new Error('Wpisz unikalne imiona wszystkich osób (do 40 znaków).');
      const next = Core.emptyState(); next.settings = copy(setupDraft); next.settings.avatarStyle = 'normal'; next.settings.beachNextRound = false; next.usedWords = [...state.usedWords];
      next.players = names.map(orderName => ({ id: uuid(), orderName, name: '', points: 0 }));
      commit(Core.createRound(next, WORD_SETS, uuid(), true)); resumeRound();
    } catch (error) { alert(error.message); }
  };
  function renderEntry() {
    const r = state.round, player = r.players[r.cursor];
    el('entry-index').textContent = r.cursor + 1;
    el('entry-total').textContent = r.players.length;
    el('entry-person').textContent = player.orderName;
    el('entry-name').value = player.name || '';
    el('entry-list').innerHTML = r.players.map((p, i) => `<div class="rowcard"><div class="entry-player">
      ${img(p, 'entry-avatar')}<span class="chip entry-chip">${i + 1}</span><strong class="${p.name ? '' : 'entry-empty'}">${escapeHtml(p.name || '—')}</strong></div></div>`).join('');
    show('view-entry');
  }
  el('entry-confirm').onclick = () => {
    if (secretOpen || state.round?.phase !== 'entry') return;
    try { commit(Core.recordName(state, el('entry-name').value)); el('entry-name').blur(); openSecret(); }
    catch (error) { alert(error.message); }
  };
  el('entry-name').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); el('entry-confirm').click(); } });

  // Secret text only enters the DOM after a successful hold.
  function clearHero() {
    clearTimeout(heroTimer); heroTimer = 0;
    el('hero-current').style.transition = 'none';
    el('hero-next').style.transition = 'none';
    el('hero-current').className = 'hero-img is-current';
    el('hero-next').className = 'hero-img';
    el('hero-banner').setAttribute('aria-hidden', 'true');
    el('hero-next-name').textContent = '';
    void el('hero-current').offsetHeight;
    el('hero-current').style.transition = '';
    el('hero-next').style.transition = '';
  }
  function stopHold() {
    holding = false; holdSource = null; holdProgress = 0; lastTime = 0;
    cancelAnimationFrame(holdFrame); holdFrame = 0;
    el('secret-show').style.setProperty('--holdp', 0);
    if (!secretVisible) AvatarReveal.mix(el('hero-current'), 0);
  }
  function concealSecret() {
    secretVisible = false; stopHold(); clearHero();
    const current = state.round?.players[state.round.cursor];
    if (current) setHeroAvatar(el('hero-current'), current);
    el('overlay-secret').querySelector('.modal').classList.remove('secret-impostor');
    el('secret-word-label').hidden = false;
    el('secret-instruction').hidden = false;
    el('secret-show').hidden = false;
    ['secret-value', 'secret-category', 'secret-imp-hint'].forEach(id => { el(id).textContent = ''; });
    el('secret-content').hidden = true;
    el('secret-hide').hidden = true;
    el('secret-show').querySelector('.label').textContent = 'Przytrzymaj, by odsłonić';
    const player = state.round?.players[state.round.cursor];
    el('secret-show').setAttribute('aria-label', `Przytrzymaj, by odsłonić rolę: ${player?.name || player?.orderName || ''}`);
    el('secret-show').setAttribute('aria-expanded', 'false');
  }
  function setHeroAvatar(element, player) {
    const base = avatarFor(player);
    const changing = state.round?.beachReveal && !state.round.beachRevealed.includes(player.id);
    AvatarReveal.set(element, base, changing ? avatarFor(player, 'beach') : base);
  }
  function openSecret() {
    const r = state.round;
    if (!r || !['entry', 'reveal'].includes(r.phase)) return;
    const player = r.players[r.cursor];
    concealSecret(); secretOpen = true;
    el('secret-player').textContent = player.name || player.orderName;
    el('secret-pos').textContent = `${r.cursor + 1} / ${r.players.length}`;
    setHeroAvatar(el('hero-current'), player);
    AvatarReveal.clear(el('hero-next'));
    el('secret-show').setAttribute('aria-label', `Przytrzymaj, by odsłonić rolę: ${player.name || player.orderName}`);
    if (!el('overlay-secret').classList.contains('show')) overlay('overlay-secret', true);
    else el('secret-show').focus({ preventScroll: true });
  }
  function revealSecret() {
    if (!secretOpen || secretVisible || document.hidden) return;
    secretVisible = true; stopHold();
    AvatarReveal.mix(el('hero-current'), 1);
    const revealed = Core.markAvatarRevealed(state);
    if (revealed !== state) commit(revealed);
    const r = state.round, actualImpostor = r.impostorIds.includes(r.players[r.cursor].id);
    const isImp = actualImpostor && r.knowsRole !== false;
    el('secret-word-label').hidden = isImp;
    el('secret-value').hidden = isImp;
    el('secret-value').textContent = isImp ? '' : actualImpostor && r.knowsRole === false ? r.impostorWord.word : r.word.word;
    el('secret-imp-hint').hidden = !isImp;
    el('secret-imp-hint').textContent = isImp ? 'Jesteś impostorem!' : '';
    el('secret-category-label').hidden = !isImp || r.info === 'none';
    el('secret-category').hidden = !isImp || r.info === 'none';
    el('secret-category-label').textContent = r.info === 'hint' ? 'Podpowiedź:' : 'Kategoria hasła:';
    el('secret-category').textContent = isImp ? (r.info === 'category' ? r.word.category : r.info === 'hint' ? r.word.hint : '') : '';
    el('secret-content').hidden = false;
    el('overlay-secret').querySelector('.modal').classList.toggle('secret-impostor', isImp);
    el('secret-instruction').hidden = true;
    el('secret-show').hidden = true;
    el('secret-show').setAttribute('aria-expanded', 'true');
    el('secret-hide').hidden = false;
    vibrate(15);
    const next = r.players[r.cursor + 1];
    if (next) heroTimer = setTimeout(() => {
      if (!secretOpen || !secretVisible) return;
      setHeroAvatar(el('hero-next'), next);
      el('hero-next').className = 'hero-img from-right';
      void el('hero-next').offsetHeight;
      el('hero-current').classList.add('to-left');
      el('hero-next').classList.add('enter');
      el('hero-next-name').textContent = next.name || next.orderName;
      el('hero-banner').setAttribute('aria-hidden', 'false');
    }, 1200);
  }
  function holdLoop(time) {
    if (!holding || document.hidden) { stopHold(); return; }
    if (!lastTime) lastTime = time;
    holdProgress = Math.min(1, holdProgress + Math.max(0, time - lastTime) / 900);
    lastTime = time;
    el('secret-show').style.setProperty('--holdp', Math.round(holdProgress * 100));
    AvatarReveal.mix(el('hero-current'), holdProgress);
    if (holdProgress >= 1) revealSecret();
    else holdFrame = requestAnimationFrame(holdLoop);
  }
  function startHold(source) {
    if (!secretOpen || secretVisible || holding) return;
    stopHold(); holding = true; holdSource = source;
    holdFrame = requestAnimationFrame(holdLoop);
  }
  el('secret-show').addEventListener('pointerdown', e => {
    if (e.button !== 0 || e.isPrimary === false || secretVisible) return;
    e.preventDefault(); el('secret-show').focus({ preventScroll: true });
    try { el('secret-show').setPointerCapture?.(e.pointerId); } catch { /* Continue with document-level release handling. */ }
    startHold('pointer');
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type =>
    el('secret-show').addEventListener(type, () => { if (holdSource === 'pointer') stopHold(); }));
  el('secret-show').addEventListener('pointerleave', e => {
    if (holdSource === 'pointer' && !el('secret-show').hasPointerCapture?.(e.pointerId)) stopHold();
  });
  ['pointerup', 'pointercancel'].forEach(type => document.addEventListener(type, () => { if (holdSource === 'pointer') stopHold(); }));
  el('secret-show').addEventListener('pointermove', e => {
    if (holdSource !== 'pointer') return;
    const rect = el('secret-show').getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) stopHold();
  });
  el('secret-show').addEventListener('contextmenu', e => e.preventDefault());
  el('secret-show').addEventListener('keydown', e => {
    if (![' ', 'Enter'].includes(e.key)) return;
    e.preventDefault();
    if (e.repeat) return;
    if (secretVisible) return;
    startHold('keyboard');
  });
  el('secret-show').addEventListener('keyup', e => { if ([' ', 'Enter'].includes(e.key)) { e.preventDefault(); stopHold(); } });
  el('secret-show').addEventListener('blur', () => { if (holding) stopHold(); });
  el('secret-hide').onclick = () => {
    if (!secretOpen || !secretVisible) return;
    const next = Core.advanceReveal(state);
    if (next.round.phase === 'reveal') {
      // Retain the visible incoming layer and keep the dialog mounted between players.
      if (el('hero-next').classList.contains('enter')) {
        const outgoing = el('hero-current'), incoming = el('hero-next');
        outgoing.id = 'hero-swap'; incoming.id = 'hero-current'; outgoing.id = 'hero-next';
      }
      commit(next); openSecret(); return;
    }
    concealSecret(); secretOpen = false; overlay('overlay-secret', false);
    commit(next);
    if (next.round.phase === 'playing') startAnimation();
    else resumeRound();
  };
  function protectSecret() { stopHold(); if (secretOpen) concealSecret(); }
  window.addEventListener('blur', protectSecret);
  window.addEventListener('pagehide', protectSecret);
  document.addEventListener('visibilitychange', () => { if (document.hidden) protectSecret(); });

  function startAnimation() {
    clearTimeout(wheelTimer);
    const token = ++wheelToken, r = state.round;
    const target = r.players.findIndex(p => p.id === r.starterId);
    el('start-wheel').innerHTML = r.players.map(p => `<div class="p"><div class="start-player">${img(p, 'start-avatar')}<span class="n">${escapeHtml(p.name)}</span></div></div>`).join('');
    show('view-start');
    const items = [...el('start-wheel').children];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let step = 0;
    const steps = items.length * 2 + target + 1;
    const baseDelay = 20;
    const slowdown = 2 * (2700 - (steps - 1) * baseDelay) / ((steps - 1) * steps);
    function tick() {
      if (token !== wheelToken) return;
      items.forEach(n => n.classList.remove('active'));
      items[reduce ? target : step % items.length].classList.add('active');
      step++;
      if (!reduce && step < steps) wheelTimer = setTimeout(tick, baseDelay + slowdown * step);
      else wheelTimer = setTimeout(() => { if (token === wheelToken) { vibrate(30); renderLobby(); } }, 300);
    }
    tick();
  }
  function renderStats() {
    el('stats-head').innerHTML = '<tr><th scope="col">Gracz</th><th scope="col">Punkty</th></tr>';
    el('stats-body').innerHTML = state.players.map(p => `<tr class="rowcard"><td><div class="player">${img(p, 'stat-ava')}
      <span class="name">${escapeHtml(p.name)}</span></div></td><td>${p.points}</td></tr>`).join('');
    const r = state.round;
    const starter = r && (state.players.find(p => p.id === r.starterId) || r.players.find(p => p.id === r.starterId));
    el('starter-name').textContent = starter?.name || '–';
    el('btn-new-round').textContent = r ? 'Nowa gra' : 'Rozdaj role';
  }
  function renderLobby() { renderStats(); show('view-lobby'); }
  function resumeRound() {
    const r = state.round;
    if (!r || r.phase === 'playing') return renderLobby();
    if (r.phase === 'entry') {
      renderEntry();
      if (r.players[r.cursor].name) openSecret();
    } else { renderLobby(); openSecret(); }
  }
  el('btn-continue').onclick = () => { if (hasSave) resumeRound(); };
  el('btn-new-round').onclick = () => {
    if (transitionBusy || secretOpen) return;
    if (!state.round) {
      try { commit(Core.createRound(state, WORD_SETS, uuid())); resumeRound(); }
      catch (error) { alert(error.message); }
      return;
    }
    if (state.round.phase !== 'playing') return;
    resultRoundId = state.round.id;
    overlay('overlay-result', true);
  };
  function submitResult(won) {
    if (transitionBusy || !resultRoundId) return;
    transitionBusy = true;
    try {
      const next = Core.settleAndDeal(state, resultRoundId, won, WORD_SETS, uuid());
      resultRoundId = null; commit(next); overlay('overlay-result', false); resumeRound();
    } catch (error) { alert(error.message); }
    finally { transitionBusy = false; }
  }
  el('res-yes').onclick = () => submitResult(true);
  el('res-no').onclick = () => submitResult(false);
  el('res-cancel').onclick = () => { resultRoundId = null; overlay('overlay-result', false); };

  // Roster editing and resets only affect a private draft until Save.
  function renderManage() {
    el('manage-list').innerHTML = manageDraft.map((p, i) => `<div class="rowcard manage-row"><div class="chip">${i + 1}</div>
      ${img(p, 'manage-avatar')}<input data-name="${i}" aria-label="Nazwa gracza ${i + 1}" maxlength="40" value="${escapeHtml(p.name)}">
      <button class="icon" data-up="${i}" aria-label="Przesuń gracza ${i + 1} wyżej" ${i === 0 ? 'disabled' : ''}>↑</button>
      <button class="icon" data-down="${i}" aria-label="Przesuń gracza ${i + 1} niżej" ${i === manageDraft.length - 1 ? 'disabled' : ''}>↓</button>
      <button class="icon danger" data-del="${i}" aria-label="Usuń gracza ${i + 1}" ${manageDraft.length <= 3 ? 'disabled' : ''}>✕</button></div>`).join('');
  }
  el('btn-manage').onclick = () => {
    if (state.round && state.round.phase !== 'playing') return;
    manageDraft = copy(state.players); resetHistoryDraft = false;
    el('manage-beach').checked = state.settings.beachNextRound === true;
    el('manage-beach').disabled = state.settings.avatarStyle === 'beach';
    el('manage-name').value = ''; renderManage(); show('view-manage');
  };
  el('manage-list').addEventListener('input', e => {
    const index = Number(e.target.dataset.name);
    if (manageDraft && Number.isInteger(index) && manageDraft[index]) manageDraft[index].name = e.target.value;
  });
  el('manage-list').addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button || !manageDraft) return;
    const d = button.dataset;
    if (d.del !== undefined) {
      if (manageDraft.length <= 3) return alert('Potrzeba co najmniej 3 graczy.');
      const i = Number(d.del);
      if (confirm(`Usunąć gracza ${manageDraft[i].name}?`)) manageDraft.splice(i, 1);
    } else {
      const i = Number(d.up ?? d.down), j = i + (d.up !== undefined ? -1 : 1);
      if (j >= 0 && j < manageDraft.length) [manageDraft[i], manageDraft[j]] = [manageDraft[j], manageDraft[i]];
    }
    renderManage();
  });
  el('manage-add').onclick = () => {
    const name = el('manage-name').value.normalize('NFC').trim();
    if (!name || name.length > 40) return alert('Podaj nazwę od 1 do 40 znaków.');
    if (manageDraft.length >= 12) return alert('Maksymalnie 12 graczy.');
    if (manageDraft.some(p => Core.normalize(p.name) === Core.normalize(name) || Core.normalize(p.orderName) === Core.normalize(name))) return alert('To imię już istnieje.');
    manageDraft.push({ id: uuid(), name, orderName: name, points: 0 });
    el('manage-name').value = ''; renderManage();
  };
  el('manage-save').onclick = () => {
    try {
      const players = manageDraft.map(p => ({ ...p, name: p.name.normalize('NFC').trim() }));
      const next = Core.replacePlayers(state, players);
      next.settings.beachNextRound = state.settings.avatarStyle !== 'beach' && el('manage-beach').checked;
      if (resetHistoryDraft) next.usedWords = [];
      commit(next); manageDraft = null; renderLobby();
    } catch (error) { alert(error.message); }
  };
  el('manage-cancel').onclick = () => { manageDraft = null; resetHistoryDraft = false; renderLobby(); };
  el('reset-stats').onclick = () => {
    if (confirm('Wyzerować punkty po zapisaniu zmian?')) {
      manageDraft.forEach(p => { p.points = 0; }); renderManage();
    }
  };
  el('reset-words').onclick = () => {
    if (confirm('Wyczyścić historię haseł po zapisaniu zmian?')) {
      resetHistoryDraft = true;
    }
  };
  window.addEventListener('storage', event => {
    if (event.key !== Core.STORAGE_KEY || !event.newValue) return;
    try {
      const updated = Core.validateSave(JSON.parse(event.newValue), WORD_SETS);
      if (!updated) return;
      protectSecret(); secretOpen = false; overlay('overlay-secret', false); overlay('overlay-result', false);
      clearTimeout(wheelTimer); wheelToken++;
      resultRoundId = null; manageDraft = null; state = updated; hasSave = true;
      el('btn-continue').disabled = false;
      storageNotice('Gra została zaktualizowana w innej karcie. Wybierz „Kontynuuj”, aby wrócić do aktualnej rundy.');
      show('view-menu');
    } catch { }
  });
  load(); syncSettings(state.settings); updateSlider(); show('view-menu');
})();
