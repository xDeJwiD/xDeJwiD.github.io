const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const C = require('../game-core.js');
const sets = Object.fromEntries(['default', 'country', 'food', 'animal', 'objects', 'places', 'holidays', 'absurd'].map(key => {
  const code = fs.readFileSync(path.join(__dirname, '../words', `words_${key}.js`), 'utf8');
  return [key, vm.runInNewContext(code + `; JSON.parse(JSON.stringify(WORDS_${key.toUpperCase()}))`)];
}));
const random = () => .7;
test('absurd pack has 36 single-word prompts with usable hints and paired categories', () => {
  assert.equal(sets.absurd.length, 36);
  for (const w of sets.absurd) {
    assert.ok(!/\s/.test(w.word), w.word);
    assert.ok(sets.absurd.some(other => other.word !== w.word && other.category === w.category));
  }
});
test('beach transition consumes its queue once and validates resumable per-player progress in both modes', () => {
  for (const engine of [C, require('../time-core.js')]) {
    const s = engine.emptyState(); s.players = roster(3); s.settings.beachNextRound = true;
    let n = engine.createRound(s, sets, 'beach-round');
    assert.equal(n.settings.beachNextRound, false); assert.equal(n.round.beachReveal, true);
    assert.throws(() => engine.advanceReveal(n));
    for (let i = 0; i < 3; i++) {
      n = engine.markAvatarRevealed(n);
      assert.equal(engine.markAvatarRevealed(n), n);
      assert.deepEqual(engine.validateSave(n, sets), n);
      const bad = engine.clone(n); bad.round.beachRevealed.push('not-a-player');
      assert.equal(engine.validateSave(bad, sets), null);
      n = engine.advanceReveal(n);
    }
    assert.equal(n.settings.avatarStyle, 'beach'); assert.deepEqual(engine.validateSave(n, sets), n);
    const next = engine.settleAndDeal(n, n.round.id, true, sets, 'next');
    assert.equal(next.round.beachReveal, false); assert.equal(next.settings.avatarStyle, 'beach');
    const legacy = engine.clone(next); delete legacy.round.beachReveal; delete legacy.round.beachRevealed; delete legacy.settings.beachNextRound;
    assert.deepEqual(engine.validateSave(legacy, sets), legacy);
  }
});
test('retired custom selection is migrated without changing the saved round or source', () => {
  const old = playing(); old.settings.selectedWordSets = ['custom', 'food'];
  const migrated = C.validateSave(old, sets);
  assert.deepEqual(migrated.settings.selectedWordSets, ['food']);
  assert.deepEqual(migrated.round, old.round);
  assert.deepEqual(old.settings.selectedWordSets, ['custom', 'food']);
  old.settings.selectedWordSets = ['custom'];
  assert.deepEqual(C.validateSave(old, sets).settings.selectedWordSets, ['default']);
});
test('unaware mode persists a different word in the same category for every role count', () => {
  for (const key of Object.keys(sets).filter(k => k !== 'custom')) for (const mode of ['1', '2', 'many', 'default']) {
    const state = initial(); Object.assign(state.settings, { impostorInfo: 'none', impostorKnowsRole: false, impostorCount: mode, selectedWordSets: [key] });
    const next = C.createRound(state, sets, 'blind', false, () => 0);
    assert.equal(next.round.knowsRole, false);
    assert.notEqual(C.normalize(next.round.word.word), C.normalize(next.round.impostorWord.word));
    assert.equal(next.round.word.category, next.round.impostorWord.category);
    assert.deepEqual(C.validateSave(next, sets), next);
    assert.equal(state.round, null);
    if (mode === 'default') assert.equal(next.round.impostorIds.length, state.players.length);
  }
});
test('category and hint override unaware preference; legacy saves still load', () => {
  for (const info of ['category', 'hint']) {
    const s = initial(); Object.assign(s.settings, { impostorInfo: info, impostorKnowsRole: false });
    const n = C.createRound(s, sets, 'aware');
    assert.equal(n.round.knowsRole, true); assert.equal(n.round.impostorWord, null);
  }
  const legacy = playing(); delete legacy.settings.impostorKnowsRole; delete legacy.round.knowsRole; delete legacy.round.impostorWord;
  assert.deepEqual(C.validateSave(legacy, sets), legacy);
  legacy.settings.impostorKnowsRole = 'false'; assert.equal(C.validateSave(legacy, sets), null);
});
test('unaware mode rejects unpaired pools and invalid alternative saves', () => {
  const s = initial(); Object.assign(s.settings, { impostorInfo: 'none', impostorKnowsRole: false, selectedWordSets: ['objects'] });
  assert.throws(() => C.createRound(s, { objects: [sets.objects[0]] }, 'bad'), /dwóch/);
  const valid = C.createRound(s, sets, 'ok');
  for (const mutate of [r => { r.impostorWord = r.word; }, r => { r.impostorWord = null; },
    r => { r.impostorWord.category = 'Other'; }, r => { r.info = 'hint'; }, r => { r.knowsRole = 'false'; }]) {
    const broken = C.clone(valid); mutate(broken.round); assert.equal(C.validateSave(broken, sets), null);
  }
});
test('expanded packs have same-category alternatives and globally unique words', () => {
  const all = Object.values(sets).flat();
  assert.equal(new Set(all.map(w => C.normalize(w.word))).size, all.length);
  for (const key of ['objects', 'places', 'holidays']) {
    assert.ok(sets[key].length >= 36);
    for (const word of sets[key]) assert.ok(sets[key].some(w => w.category === word.category && w.word !== word.word));
  }
});
function roster(n = 5) {
  return Array.from({ length: n }, (_, i) => ({ id: `p${i}`, name: `Player ${i}`, orderName: `Person ${i}`, points: 0 }));
}
function initial(n = 5) {
  const s = C.emptyState(); s.players = roster(n); s.settings.impostorCount = '1';
  return s;
}
function playing(n = 5) {
  let s = C.createRound(initial(n), sets, 'r1', false, random);
  for (let i = 0; i < n; i++) s = C.advanceReveal(s);
  return s;
}
test('all shipped word data is usable, unique and animals are animals', () => {
  for (const [key, words] of Object.entries(sets)) assert.equal(C.poolFor(sets, [key]).length, words.length, key);
  assert.equal(sets.default.length, 142);
  assert.equal(sets.animal.length, 42);
  assert.ok(sets.animal.every(w => w.category === 'Zwierzęta' && w.word !== 'USA'));
  assert.equal(sets.custom, undefined);
});
test('duplicate words across sets do not receive extra weight', () => {
  const word = sets.default[0];
  assert.equal(C.poolFor({ a: [word, word], b: [{ ...word, word: word.word.toLowerCase() }] }, ['a', 'b']).length, 1);
});
test('prototype names are not valid word sets', () => {
  assert.equal(C.poolFor(sets, ['toString', '__proto__']).length, 0);
});
test('every legal roster size and mode yields valid, unique roles with bounded randomness', () => {
  for (let n = 3; n <= 12; n++) for (const mode of ['default', '1', '2', 'many']) for (const roll of [0, .049, .05, .129, .13, .5, .999]) {
    const roles = C.chooseImpostors(n, mode, () => roll);
    assert.equal(new Set(roles).size, roles.length);
    assert.ok(roles.every(i => i >= 0 && i < n));
    if (mode === '1') assert.equal(roles.length, 1);
    if (mode === '2') assert.equal(roles.length, 2);
    if (mode === 'many') assert.ok(roles.length >= 2 && roles.length < n);
    if (mode === 'default') assert.equal(roles.length, roll < .05 ? n : roll < .13 ? 2 : 1);
  }
});
test('invalid player counts fail immediately, never loop', () => {
  for (const n of [0, 1, 2, 13, -1, 3.5, NaN]) for (const mode of ['1', '2', 'many', 'default'])
    assert.throws(() => C.chooseImpostors(n, mode, () => 0));
});
test('invalid and empty sets cannot start a round', () => {
  for (const chosen of [[], ['AAA'], ['BBB'], ['custom'], ['default', 'AAA']]) {
    const s = initial(); s.settings.selectedWordSets = chosen;
    assert.throws(() => C.createRound(s, sets, 'bad'));
    assert.equal(s.round, null); assert.deepEqual(s.usedWords, []);
  }
});
test('words never repeat until the pool is exhausted', () => {
  let history = [], last = null; const seen = new Set();
  for (let i = 0; i < sets.food.length; i++) {
    const picked = C.pickWord(sets, ['food'], history, last, random);
    assert.ok(!seen.has(C.wordKey(picked.word)));
    seen.add(C.wordKey(picked.word)); history = picked.usedWords; last = picked.word;
  }
  const picked = C.pickWord(sets, ['food'], history, last, random);
  assert.notEqual(C.wordKey(picked.word), C.wordKey(last));
});
test('exhausting one selection preserves other sets history', () => {
  const unrelated = C.wordKey(sets.default[0]);
  const history = [unrelated, ...sets.animal.map(C.wordKey)];
  const picked = C.pickWord(sets, ['animal'], history, sets.animal[0], random);
  assert.ok(picked.usedWords.includes(unrelated));
  assert.equal(picked.usedWords.length, 2);
});
test('entry round resumes at every naming and reveal boundary', () => {
  const base = initial(3); base.players.forEach(p => { p.name = ''; });
  let s = C.createRound(base, sets, 'entry', true, random);
  for (let i = 0; i < 3; i++) {
    assert.ok(C.validateSave(JSON.parse(JSON.stringify(s)), sets));
    assert.equal(s.round.cursor, i);
    assert.throws(() => C.advanceReveal(s));
    s = C.recordName(s, `Nick ${i}`);
    assert.ok(C.validateSave(JSON.parse(JSON.stringify(s)), sets));
    s = C.advanceReveal(s);
  }
  assert.equal(s.round.phase, 'playing');
  assert.ok(C.validateSave(s, sets));
  assert.throws(() => C.advanceReveal(s));
});
test('duplicate and whitespace-only entry names are rejected', () => {
  const base = initial(3); base.players.forEach(p => { p.name = ''; });
  let s = C.createRound(base, sets, 'entry', true, random);
  assert.throws(() => C.recordName(s, '   '));
  s = C.advanceReveal(C.recordName(s, 'Dawid'));
  assert.throws(() => C.recordName(s, ' DAWID '));
});
test('reordering does not transfer impostor points to another person', () => {
  let s = playing(); const imp = s.round.impostorIds[0];
  s = C.replacePlayers(s, [...s.players].reverse());
  const next = C.settleAndDeal(s, 'r1', true, sets, 'r2', random);
  assert.equal(next.players.find(p => p.id === imp).points, 1);
  assert.equal(next.players.filter(p => p.points === 1).length, 1);
});
test('new players do not receive points for a previous round', () => {
  let s = playing();
  s = C.replacePlayers(s, [...s.players, { id: 'new', name: 'New', orderName: 'New', points: 0 }]);
  const next = C.settleAndDeal(s, 'r1', false, sets, 'r2', random);
  assert.equal(next.players.find(p => p.id === 'new').points, 0);
  assert.equal(next.players.filter(p => p.points === 1).length, 4);
});
test('removing an impostor cannot transfer their win to their replacement', () => {
  let s = playing(); const imp = s.round.impostorIds[0];
  s = C.replacePlayers(s, s.players.filter(p => p.id !== imp));
  const next = C.settleAndDeal(s, 'r1', true, sets, 'r2', random);
  assert.ok(next.players.every(p => p.points === 0));
});
test('draft mutations are separate and invalid edited rosters cannot be committed', () => {
  const s = playing(); const draft = C.clone(s.players); draft[0].name = 'Edited';
  assert.notEqual(s.players[0].name, draft[0].name);
  assert.throws(() => C.replacePlayers(s, draft.slice(0, 2)));
  draft[0].name = draft[1].name; assert.throws(() => C.replacePlayers(s, draft));
  draft[0].name = ''; assert.throws(() => C.replacePlayers(s, draft));
});
test('settings changes apply only to the following round', () => {
  const s = playing(); s.settings.impostorInfo = 'none'; s.settings.impostorCount = '2';
  assert.equal(s.round.info, 'category'); assert.equal(s.round.impostorIds.length, 1);
  const next = C.settleAndDeal(s, 'r1', true, sets, 'r2', random);
  assert.equal(next.round.info, 'none'); assert.equal(next.round.impostorIds.length, 2);
});
test('result cannot be submitted twice or before the reveal sequence finishes', () => {
  const s = playing();
  const next = C.settleAndDeal(s, 'r1', true, sets, 'r2', random);
  assert.throws(() => C.settleAndDeal(next, 'r1', true, sets, 'r3', random));
  assert.throws(() => C.settleAndDeal(next, 'r2', true, sets, 'r3', random));
});
test('failure to deal does not partially score, consume words or move the starter', () => {
  const s = playing(); s.settings.selectedWordSets = ['AAA']; const before = JSON.stringify(s);
  assert.throws(() => C.settleAndDeal(s, 'r1', true, sets, 'r2', random));
  assert.equal(JSON.stringify(s), before);
});
test('every player can start the next round, including the previous starter', () => {
  const s = playing();
  for (let i = 0; i < s.players.length; i++) {
    const next = C.settleAndDeal(s, 'r1', true, sets, `r2-${i}`, () => (i + .5) / s.players.length);
    assert.equal(next.round.starterId, s.players[i].id);
  }
  const next = C.settleAndDeal(s, 'r1', true, sets, 'repeat', random);
  assert.equal(next.round.starterId, s.round.starterId);
});
test('starter is drawn only from the current roster after deletion and reordering', () => {
  let s = playing();
  s = C.replacePlayers(s, s.players.filter(p => p.id !== s.round.starterId).reverse());
  for (let i = 0; i < s.players.length; i++) {
    const next = C.settleAndDeal(s, 'r1', false, sets, `r2-${i}`, () => (i + .5) / s.players.length);
    assert.equal(next.round.starterId, s.players[i].id);
  }
});
test('everyone-impostor rounds preserve the original team scoring rules', () => {
  const base = initial(3); base.settings.impostorCount = 'default';
  let s = C.createRound(base, sets, 'all', false, () => 0);
  for (let i = 0; i < 3; i++) s = C.advanceReveal(s);
  const won = C.settleAndDeal(s, 'all', true, sets, 'won', random);
  const lost = C.settleAndDeal(s, 'all', false, sets, 'lost', random);
  assert.ok(won.players.every(p => p.points === 1));
  assert.ok(lost.players.every(p => p.points === 0));
});
test('malformed saves are rejected without throwing', () => {
  for (const data of [null, {}, { players: [{}] }, [], false]) assert.equal(C.validateSave(data, sets), null);
  for (const corrupt of [s => s.players.splice(0, 4), s => s.players[0].points = '7', s => s.players[0].points = -1,
    s => s.players[1].id = s.players[0].id, s => s.round.cursor = -1, s => s.round.cursor = 0,
    s => s.round.impostorIds = ['unknown'], s => s.round.word = null, s => s.round.starterId = 'unknown',
    s => s.settings.selectedWordSets = ['AAA'], s => s.round.settled = true]) {
    const s = playing(); corrupt(s); assert.equal(C.validateSave(s, sets), null);
  }
});
test('legacy import transfers only valid roster, scores and compatible history', () => {
  const legacy = { players: roster(3), lastImpostorIndices: [0], usedWords: [sets.default[0], 'USA|Państwa'], selectedWordSets: ['AAA'], impostorCount: 'many' };
  const original = JSON.stringify(legacy); let id = 0;
  const s = C.migrateLegacy(legacy, sets, () => `legacy${id++}`);
  assert.equal(s.round, null); assert.equal(s.players.length, 3); assert.equal(s.usedWords.length, 2);
  assert.ok(C.validateSave(s, sets)); assert.equal(JSON.stringify(legacy), original);
  assert.equal(C.migrateLegacy({ players: [{ name: '' }] }, sets, () => 'id'), null);
});
test('full 100-round simulation remains resumable through changes of mode and roster order', () => {
  let s = playing();
  for (let i = 0; i < 100; i++) {
    s.settings.impostorCount = ['default', '1', '2', 'many'][i % 4];
    s = C.replacePlayers(s, [...s.players].reverse());
    s = C.settleAndDeal(s, s.round.id, i % 2 === 0, sets, `next${i}`, random);
    for (let j = 0; j < s.players.length; j++) {
      s = C.validateSave(JSON.parse(JSON.stringify(s)), sets);
      assert.ok(s); s = C.advanceReveal(s);
    }
    assert.ok(C.validateSave(s, sets));
  }
});
