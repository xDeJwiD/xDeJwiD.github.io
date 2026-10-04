/* Rules and persisted state. No DOM or storage side effects. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ImpostorCore = api;
})(globalThis, function () {
  'use strict';
  const VERSION = 3;
  const STORAGE_KEY = 'impostorParty_v3';
  const clone = value => JSON.parse(JSON.stringify(value));
  const normalize = value => String(value).normalize('NFC').trim().toLocaleLowerCase('pl');
  const wordKey = w => normalize(w.word) + '|' + normalize(w.category);
  const validText = (v, max = 80) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
  const validWord = w => w && validText(w.word, 120) && validText(w.category, 120) &&
    validText(w.hint, 160) && normalize(w.word) !== normalize(w.hint) && normalize(w.word) !== normalize(w.category);
  function poolFor(sets, selected) {
    const unique = new Map();
    for (const key of selected) for (const word of (Object.hasOwn(sets, key) && Array.isArray(sets[key]) ? sets[key] : [])) {
      if (validWord(word)) unique.set(wordKey(word), { ...word });
    }
    return [...unique.values()];
  }
  function settingsValid(settings, sets) {
    return settings && ['none', 'category', 'hint'].includes(settings.impostorInfo) &&
      (settings.avatarStyle === undefined || ['normal', 'beach'].includes(settings.avatarStyle)) &&
      (settings.beachNextRound === undefined || typeof settings.beachNextRound === 'boolean') &&
      (settings.impostorKnowsRole === undefined || typeof settings.impostorKnowsRole === 'boolean') &&
      ['default', '1', '2', 'many'].includes(settings.impostorCount) &&
      Array.isArray(settings.selectedWordSets) && settings.selectedWordSets.length > 0 &&
      settings.selectedWordSets.every(k => Object.hasOwn(sets, k) && poolFor(sets, [k]).length > 0) &&
      new Set(settings.selectedWordSets).size === settings.selectedWordSets.length;
  }
  function playersValid(players, allowEmpty = false) {
    if (!Array.isArray(players) || players.length < 3 || players.length > 12) return false;
    const ids = new Set(), names = new Set(), orderNames = new Set();
    return players.every(p => {
      if (!p || !validText(p.id) || ids.has(p.id) || !validText(p.orderName, 40) ||
          typeof p.name !== 'string' || p.name.length > 40 ||
          (!allowEmpty && !validText(p.name, 40)) ||
          !Number.isSafeInteger(p.points) || p.points < 0 || p.points >= Number.MAX_SAFE_INTEGER) return false;
      ids.add(p.id);
      const order = normalize(p.orderName), name = normalize(p.name);
      if (orderNames.has(order) || (name && names.has(name))) return false;
      orderNames.add(order);
      if (name) names.add(name);
      return true;
    });
  }
  function randomIndex(n, random) { return Math.min(n - 1, Math.floor(random() * n)); }
  function chooseImpostors(total, mode, random = Math.random) {
    if (!Number.isInteger(total) || total < 3 || total > 12) throw new Error('Potrzeba od 3 do 12 graczy.');
    let count;
    if (mode === '1') count = 1;
    else if (mode === '2') count = 2;
    else if (mode === 'many') count = 2 + randomIndex(total - 2, random);
    else if (mode === 'default') {
      const roll = random();
      count = roll < .05 ? total : roll < .13 ? 2 : 1;
    } else throw new Error('Nieprawidłowy tryb impostorów.');
    // Bounded shuffle, including for deterministic random sources in tests.
    const indices = Array.from({ length: total }, (_, i) => i);
    for (let i = total - 1; i > 0; i--) {
      const j = randomIndex(i + 1, random);
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.slice(0, count);
  }
  function pickWord(sets, selected, history, previousWord, random = Math.random) {
    const pool = poolFor(sets, selected);
    if (!pool.length) throw new Error('Wybierz przynajmniej jeden dostępny zestaw haseł.');
    const used = new Set(history);
    let available = pool.filter(w => !used.has(wordKey(w)));
    if (!available.length) {
      // Reset only the exhausted selection, not the history of other sets.
      pool.forEach(w => used.delete(wordKey(w)));
      available = pool;
    }
    if (available.length > 1 && previousWord) available = available.filter(w => wordKey(w) !== wordKey(previousWord));
    const word = available[randomIndex(available.length, random)];
    used.add(wordKey(word));
    return { word: clone(word), usedWords: [...used] };
  }
  function emptyState() {
    return { version: VERSION, players: [], settings: { impostorInfo: 'category', impostorCount: 'default',
      impostorKnowsRole: true, avatarStyle: 'normal', beachNextRound: false, selectedWordSets: ['default'] }, usedWords: [], round: null };
  }
  function createRound(state, sets, id, first = false, random = Math.random) {
    if (!playersValid(state.players, first)) throw new Error('Sprawdź liczbę graczy i unikalne nazwy (do 40 znaków).');
    if (!settingsValid(state.settings, sets)) throw new Error('Wybierz poprawne ustawienia i dostępne zestawy haseł.');
    if (!validText(id) || id === state.round?.id) throw new Error('Nieprawidłowy identyfikator rundy.');
    const next = clone(state);
    const knowsRole = state.settings.impostorKnowsRole !== false || state.settings.impostorInfo !== 'none';
    const pool = poolFor(sets, state.settings.selectedWordSets);
    const partners = word => pool.filter(w => normalize(w.category) === normalize(word.category) && normalize(w.word) !== normalize(word.word));
    const eligible = knowsRole ? pool : pool.filter(w => partners(w).length);
    if (!eligible.length) throw new Error('Tryb nieświadomego impostora wymaga dwóch różnych haseł w tej samej kategorii. Wybierz inny zestaw.');
    const picked = pickWord({ eligible }, ['eligible'], state.usedWords, state.round?.word, random);
    const alternatives = knowsRole ? [] : partners(picked.word);
    const impostorWord = knowsRole ? null : clone(alternatives[randomIndex(alternatives.length, random)]);
    const indices = chooseImpostors(state.players.length, state.settings.impostorCount, random);
    next.usedWords = picked.usedWords;
    next.settings.beachNextRound = false;
    next.round = { id, beachReveal: state.settings.beachNextRound === true && state.settings.avatarStyle !== 'beach', beachRevealed: [], players: clone(state.players), impostorIds: indices.map(i => state.players[i].id),
      word: picked.word, info: state.settings.impostorInfo, knowsRole, impostorWord,
      starterId: state.players[randomIndex(state.players.length, random)].id,
      cursor: 0, phase: first ? 'entry' : 'reveal', settled: false };
    return next;
  }
  function recordName(state, name) {
    const next = clone(state), round = next.round;
    name = name.normalize('NFC').trim();
    if (!round || round.phase !== 'entry' || round.cursor >= round.players.length) throw new Error('Nie można teraz wpisać imienia.');
    if (!validText(name, 40) || next.players.some((p, i) => i !== round.cursor && normalize(p.name) === normalize(name)))
      throw new Error('Podaj unikalną nazwę, od 1 do 40 znaków.');
    const player = round.players[round.cursor];
    player.name = name;
    next.players.find(p => p.id === player.id).name = name;
    return next;
  }
  function markAvatarRevealed(state) {
    const r = state.round;
    if (!r || !r.beachReveal || !['entry', 'reveal'].includes(r.phase)) return state;
    const player = r.players[r.cursor];
    if (!player || r.beachRevealed.includes(player.id)) return state;
    const next = clone(state);
    next.round.beachRevealed.push(player.id);
    if (next.round.beachRevealed.length === r.players.length) next.settings.avatarStyle = 'beach';
    return next;
  }
  function advanceReveal(state) {
    const next = clone(state), r = next.round;
    if (!r || !['entry', 'reveal'].includes(r.phase) || !r.players[r.cursor]?.name) throw new Error('Najpierw odczytaj swoją rolę.');
    if (r.beachReveal && !r.beachRevealed.includes(r.players[r.cursor].id)) throw new Error('Najpierw odsłoń sekret.');
    r.cursor++;
    if (r.cursor === r.players.length) r.phase = 'playing';
    return next;
  }
  function settleAndDeal(state, expectedRoundId, impostorWon, sets, newId, random = Math.random) {
    const r = state.round;
    if (!r || r.id !== expectedRoundId || r.phase !== 'playing' || r.settled || typeof impostorWon !== 'boolean')
      throw new Error('Ta runda nie czeka na rozliczenie.');
    const scored = clone(state);
    const participants = new Set(r.players.map(p => p.id)), imps = new Set(r.impostorIds);
    for (const p of scored.players) if (participants.has(p.id) && imps.has(p.id) === impostorWon) p.points++;
    scored.round.settled = true;
    // Both scoring and dealing are committed together by the caller.
    return createRound(scored, sets, newId, false, random);
  }
  function replacePlayers(state, players) {
    if (state.round && state.round.phase !== 'playing') throw new Error('Dokończ rozdawanie ról.');
    if (!playersValid(players)) throw new Error('Potrzeba 3–12 graczy z unikalnymi, niepustymi nazwami (do 40 znaków).');
    const next = clone(state);
    next.players = clone(players);
    return next;
  }
  function validateSave(data, sets) {
    try {
      // Retired empty pack must not invalidate an otherwise usable saved game.
      if (Array.isArray(data?.settings?.selectedWordSets) && data.settings.selectedWordSets.includes('custom')) {
        data = clone(data);
        data.settings.selectedWordSets = data.settings.selectedWordSets.filter(k => k !== 'custom');
        if (!data.settings.selectedWordSets.length) data.settings.selectedWordSets = ['default'];
      }
      if (!data || data.version !== VERSION || !settingsValid(data.settings, sets) ||
          !Array.isArray(data.usedWords) || data.usedWords.length > 10000 ||
          !data.usedWords.every(w => validText(w, 250))) return null;
      if (!Object.hasOwn(data, 'round') || (data.round !== null && typeof data.round !== 'object')) return null;
      const r = data.round;
      if (!playersValid(data.players, r?.phase === 'entry')) return null;
      if (r) {
        if (r.knowsRole !== undefined && typeof r.knowsRole !== 'boolean') return null;
        if (r.knowsRole === false) {
          if (r.info !== 'none' || !validWord(r.impostorWord) ||
              normalize(r.impostorWord.word) === normalize(r.word?.word) ||
              normalize(r.impostorWord.category) !== normalize(r.word?.category)) return null;
        } else if (r.impostorWord != null) return null;
        if (!validText(r.id) || !['entry', 'reveal', 'playing'].includes(r.phase) || r.settled !== false ||
            !playersValid(r.players, r.phase === 'entry') || !validWord(r.word) ||
            !['none', 'category', 'hint'].includes(r.info) || !Number.isInteger(r.cursor) ||
            r.cursor < 0 || r.cursor > r.players.length ||
            (r.phase === 'playing') !== (r.cursor === r.players.length)) return null;
        const ids = new Set(r.players.map(p => p.id));
        if (r.beachReveal !== undefined && typeof r.beachReveal !== 'boolean') return null;
        if (r.beachRevealed !== undefined && (!Array.isArray(r.beachRevealed) ||
            new Set(r.beachRevealed).size !== r.beachRevealed.length || r.beachRevealed.some(id => !ids.has(id)))) return null;
        if (r.beachReveal) {
          if (!Array.isArray(r.beachRevealed) || data.settings.beachNextRound === true) return null;
          if (r.players.slice(0, r.cursor).some(p => !r.beachRevealed.includes(p.id))) return null;
          if (r.players.slice(r.cursor + 1).some(p => r.beachRevealed.includes(p.id))) return null;
          if ((r.beachRevealed.length === r.players.length) !== (data.settings.avatarStyle === 'beach')) return null;
        } else if (r.beachRevealed?.length) return null;
        if (!ids.has(r.starterId) || !Array.isArray(r.impostorIds) || !r.impostorIds.length ||
            r.impostorIds.some(id => !ids.has(id)) || new Set(r.impostorIds).size !== r.impostorIds.length) return null;
        if (r.phase !== 'playing' && (data.players.length !== r.players.length ||
            data.players.some((p, i) => p.id !== r.players[i].id || p.name !== r.players[i].name ||
              p.orderName !== r.players[i].orderName || p.points !== r.players[i].points))) return null;
        if (r.phase === 'entry' && r.players.slice(r.cursor + 1).some(p => p.name !== '')) return null;
        if (r.players.slice(0, r.cursor).some(p => !validText(p.name, 40))) return null;
      }
      return clone(data);
    } catch { return null; }
  }
  function migrateLegacy(data, sets, makeId) {
    if (!data || !Array.isArray(data.players)) return null;
    const next = emptyState();
    next.players = data.players.map(p => ({ id: makeId(), name: typeof p?.name === 'string' ? p.name.trim() : '',
      orderName: typeof p?.name === 'string' ? p.name.trim() : '',
      points: Number.isSafeInteger(p?.points) && p.points >= 0 ? p.points : 0 }));
    if (!playersValid(next.players)) return null;
    const settings = { impostorInfo: data.impostorInfo || 'category', impostorCount: data.impostorCount || 'default',
      selectedWordSets: Array.isArray(data.selectedWordSets) ? data.selectedWordSets.filter(k => poolFor(sets, [k]).length) : ['default'] };
    if (settingsValid(settings, sets)) next.settings = settings;
    // Legacy rounds cannot be reconstructed; import roster and scores only.
    const allowed = new Set(poolFor(sets, Object.keys(sets)).map(wordKey));
    next.usedWords = [...new Set((Array.isArray(data.usedWords) ? data.usedWords : []).map(w => {
      if (typeof w === 'string') return normalize(w);
      return w?.word && w?.category ? wordKey(w) : '';
    }).filter(k => allowed.has(k)))];
    return next;
  }
  return { VERSION, STORAGE_KEY, clone, normalize, wordKey, poolFor, settingsValid, playersValid, chooseImpostors,
    pickWord, emptyState, createRound, recordName, markAvatarRevealed, advanceReveal, settleAndDeal, replacePlayers, validateSave, migrateLegacy };
});
