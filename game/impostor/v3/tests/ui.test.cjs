const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const C = require('../game-core.js');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => fs.readFileSync(path.join(root, m[1]), 'utf8')).join('\n');
function app(saved = null, options = {}) {
  const dom = new JSDOM(html, { url: 'https://impostor.test/game/impostor/v3/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window, alerts = [], errors = [];
  const el = id => w.document.getElementById(id);
  let time = 0, counter = 0;
  const frames = new Map(), timers = new Map();
  w.scrollTo = () => {};
  w.matchMedia = () => ({ matches: false });
  w.alert = s => alerts.push(s);
  w.confirm = () => true;
  w.requestAnimationFrame = cb => { const id = ++counter; frames.set(id, cb); return id; };
  w.cancelAnimationFrame = id => frames.delete(id);
  w.setTimeout = (cb, delay) => { const id = ++counter; timers.set(id, { cb, at: time + delay }); return id; };
  w.clearTimeout = id => timers.delete(id);
  w.addEventListener('error', e => { errors.push(e.error); e.preventDefault(); });
  if (saved) w.localStorage.setItem(C.STORAGE_KEY, typeof saved === 'string' ? saved : JSON.stringify(saved));
  if (options.legacy) w.localStorage.setItem('impostorParty_v10', JSON.stringify(options.legacy));
  if (options.noStorage) Object.defineProperty(w, 'localStorage', { get() { throw new Error('No storage'); } });
  if (options.noWrite) w.Storage.prototype.setItem = () => { throw new Error('Quota exceeded'); };
  w.eval(scripts);
  function advance(ms) {
    const target = time + ms;
    while (time < target) {
      time += 16;
      const ready = [...frames]; frames.clear(); ready.forEach(([, cb]) => cb(time));
      for (const [id, task] of [...timers]) if (task.at <= time) { timers.delete(id); task.cb(); }
    }
  }
  function event(id, type, props = {}) {
    const e = new w.Event(type, { bubbles: true, cancelable: true });
    Object.assign(e, props); el(id).dispatchEvent(e);
  }
  function input(id, value) { el(id).value = value; event(id, 'input'); }
  function click(id) { el(id).click(); }
  function hold(ms = 1000) {
    event('secret-show', 'pointerdown', { button: 0, isPrimary: true, pointerId: 1 });
    advance(ms);
    event('secret-show', 'pointerup');
    event('secret-show', 'click');
  }
  function start(n = 3, names = ['Dawid', 'Kuba', 'Jula', 'Ola', 'Adam']) {
    click('btn-test'); input('playerCount', String(n)); click('btn-begin-entry');
    for (let i = 0; i < n; i++) input(`order-${i}`, names[i] || `Osoba ${i}`);
    click('order-confirm');
  }
  function finishEntry(n = 3) {
    for (let i = 0; i < n; i++) { input('entry-name', `Nick ${i}`); click('entry-confirm'); hold(); click('secret-hide'); }
    advance(5000);
  }
  return { dom, w, el, alerts, errors, click, input, event, advance, hold, start, finishEntry,
    saved: () => JSON.parse(w.localStorage.getItem(C.STORAGE_KEY)), close: () => dom.window.close() };
}

test('unaware role setting applies next round, survives refresh, and hides all role cues', t => {
  const a = app(); t.after(a.close); a.start(); a.finishEntry();
  const previous = a.saved().round;
  a.click('btn-settings'); a.click('info-none'); a.click('impostor-knows-role'); a.click('count-2');
  a.click('words-objects'); a.click('words-default'); a.click('setup-save');
  assert.deepEqual(a.saved().round, previous);
  a.click('btn-new-round'); a.click('res-yes');
  const r = a.saved().round; assert.equal(r.knowsRole, false); assert.equal(r.impostorIds.length, 2);
  for (let i = 0; i < 3; i++) {
    a.hold();
    assert.equal(a.el('secret-value').textContent, r.impostorIds.includes(r.players[i].id) ? r.impostorWord.word : r.word.word);
    assert.equal(a.el('secret-value').hidden, false);
    assert.equal(a.el('secret-word-label').hidden, false);
    assert.equal(a.el('secret-imp-hint').textContent, '');
    assert.equal(a.el('secret-category').textContent, '');
    assert.equal(a.el('overlay-secret').querySelector('.modal').classList.contains('secret-impostor'), false);
    if (i === 1) {
      const b = app(a.saved()); t.after(b.close); b.click('btn-continue');
      assert.equal(b.el('secret-value').textContent, ''); b.hold();
      assert.equal(b.el('secret-value').textContent, a.el('secret-value').textContent);
    }
    a.click('secret-hide');
  }
  a.advance(5000); a.click('btn-settings'); a.click('info-hint');
  assert.equal(a.el('impostor-knows-role').disabled, true);
  a.click('setup-save'); a.click('btn-new-round'); a.click('res-no');
  assert.equal(a.saved().round.knowsRole, true);
  for (let i = 0; i < 3; i++) {
    a.hold(); const now = a.saved().round;
    if (now.impostorIds.includes(now.players[i].id)) {
      assert.equal(a.el('secret-imp-hint').textContent, 'Jesteś impostorem!');
      assert.equal(a.el('secret-category').textContent, now.word.hint);
    }
    a.click('secret-hide');
  }
  assert.deepEqual(a.errors, []);
});
test('new-game controls include three packs and cancel restores role preference', t => {
  const a = app(); t.after(a.close); a.click('btn-test');
  assert.equal(a.el('impostor-knows-role').checked, true);
  assert.equal(a.el('impostor-knows-role').disabled, true);
  a.click('info-none'); a.click('impostor-knows-role');
  for (const [key, count] of [['objects', 40], ['places', 36], ['holidays', 36]]) { a.click(`words-${key}`); assert.equal(a.el(`words-count-${key}`).textContent, String(count)); }
  a.click('words-default'); a.input('playerCount', '3'); a.click('btn-begin-entry');
  ['A', 'B', 'C'].forEach((n, i) => a.input(`order-${i}`, n)); a.click('order-confirm');
  assert.equal(a.saved().round.knowsRole, false); a.finishEntry();
  a.click('btn-settings'); a.click('impostor-knows-role'); a.click('setup-cancel'); a.click('btn-settings');
  assert.equal(a.el('impostor-knows-role').checked, false);
});
test('beach reveal is queued once, persists per player and resets for a new game', t => {
  const a = app(); t.after(a.close); a.start(); a.finishEntry();
  const before = a.saved().round;
  a.click('btn-manage'); a.click('manage-beach');
  assert.ok(a.el('manage-list').querySelector('img').getAttribute('src').includes('/normal/av_'));
  a.click('manage-cancel');
  assert.ok(a.el('stats-body').querySelector('img').getAttribute('src').includes('/normal/'));
  a.click('btn-manage'); a.click('manage-beach'); a.click('manage-save');
  assert.deepEqual(a.saved().round, before);
  assert.equal(a.saved().settings.beachNextRound,true);
  assert.ok([...a.el('stats-body').querySelectorAll('img')].every(n => n.getAttribute('src').includes('/normal/')));
  a.click('btn-manage');
  assert.equal(a.el('manage-beach').checked,true);
  a.click('manage-cancel'); a.click('btn-new-round'); a.click('res-no');
  assert.equal(a.saved().round.beachReveal,true);assert.equal(a.saved().settings.beachNextRound,false);
  assert.ok(a.el('hero-current').style.backgroundImage.includes('/normal/'));
  a.hold(); a.advance(1300); assert.ok(a.el('hero-next').style.backgroundImage.includes('/normal/'));
  const b = app(a.saved()); t.after(b.close); b.click('btn-continue');
  assert.ok(b.el('hero-current').style.backgroundImage.includes('/beach/'));
  for(let i=0;i<3;i++){b.hold();b.click('secret-hide');}b.advance(5000);
  assert.equal(b.saved().settings.avatarStyle,'beach');
  b.click('btn-manage');assert.equal(b.el('manage-beach').disabled,true);b.click('manage-cancel');
  b.click('btn-new-round');b.click('res-no');assert.equal(b.saved().round.beachReveal,false);
  assert.ok(b.el('hero-current').style.backgroundImage.includes('/beach/'));
  const c=app(b.saved());t.after(c.close);c.start();
  assert.equal(c.saved().settings.avatarStyle,'normal');assert.equal(c.saved().settings.beachNextRound,false);
  assert.equal(c.saved().round.beachReveal,false);
  for (const style of ['normal', 'beach']) for (const key of ['adi','daw','jul','kub','nikt','wan'])
    assert.ok(fs.existsSync(path.join(root, 'avatars', style, `${style === 'beach' ? 'avb' : 'av'}_${key}.png`)));
});
test('identical avatar variants never blend or fade during a hold', async t => {
  const a=app();t.after(a.close);
  const hero=a.el('hero-current');
  for(const src of ['avatars/normal/av_daw.png','avatars/beach/avb_daw.png']) {
    a.w.AvatarReveal.set(hero,src,src);
    for(const progress of [0,.25,.5,.75,1]) {
      a.w.AvatarReveal.mix(hero,progress);
      assert.equal(hero.dataset.crossfade,'false');
      assert.equal(hero.style.getPropertyValue('--avatar-mix'),'0');
    }
  }
  a.start();a.input('entry-name','Dawid');a.click('entry-confirm');
  a.event('secret-show','pointerdown',{button:0,isPrimary:true,pointerId:1});a.advance(400);
  assert.equal(hero.style.getPropertyValue('--avatar-mix'),'0');
  a.advance(700);assert.equal(a.el('secret-content').hidden,false);
  assert.equal(hero.style.getPropertyValue('--avatar-mix'),'0');
});
test('hold crossfade preserves slide classes, cancels cleanly and ignores stale image loads', async t => {
  const a=app();t.after(a.close);const images=[];
  a.w.Image=class { constructor(){images.push(this);} set src(value){this.url=value;} };
  a.start();assert.equal(a.el('order-beach'),null);a.finishEntry();
  a.click('btn-manage');a.click('manage-beach');a.click('manage-save');a.click('btn-new-round');a.click('res-no');
  let hero=a.el('hero-current');const beachImage=images.find(i=>i.url.includes('/beach/avb_daw.png'));assert.ok(beachImage);
  beachImage.onload();await new Promise(resolve=>setImmediate(resolve));
  a.event('secret-show','pointerdown',{button:0,isPrimary:true,pointerId:1});a.advance(400);
  assert.ok(Number(hero.style.getPropertyValue('--avatar-mix'))>0);
  assert.ok(Number(hero.style.getPropertyValue('--avatar-mix'))<1);
  assert.equal(hero.className,'hero-img is-current');
  a.event('secret-show','pointercancel');assert.equal(hero.style.getPropertyValue('--avatar-mix'),'0');
  a.hold();assert.equal(hero.style.getPropertyValue('--avatar-mix'),'1');
  a.advance(1300);assert.ok(hero.classList.contains('to-left'));assert.ok(a.el('hero-next').classList.contains('enter'));
  const incoming=a.el('hero-next');
  a.click('secret-hide');
  hero=a.el('hero-current');assert.equal(hero,incoming);
  assert.ok(a.el('overlay-secret').classList.contains('show'));
  assert.equal(hero.style.getPropertyValue('--avatar-mix'),'0');assert.equal(hero.className,'hero-img is-current');
  for(const image of images.slice(1))image.onload();await new Promise(resolve=>setImmediate(resolve));
  assert.equal(hero.style.getPropertyValue('--avatar-mix'),'0');
  a.hold();assert.equal(hero.style.getPropertyValue('--avatar-mix'),'1');
  a.w.dispatchEvent(new a.w.Event('blur'));assert.equal(hero.style.getPropertyValue('--avatar-mix'),'0');
  assert.ok(hero.style.getPropertyValue('--avatar-base').includes('/beach/'));
  assert.equal(a.el('secret-content').hidden,true);
});
test('new game, first reveal sequence, result and next round work through real DOM controls', t => {
  const a = app(); t.after(a.close);
  assert.equal(a.el('btn-continue').disabled, true);
  a.start(); assert.equal(a.el('entry-person').textContent, 'Dawid');
  assert.equal(a.saved().round.phase, 'entry');
  a.finishEntry();
  assert.equal(a.el('view-lobby').style.display, ''); assert.equal(a.saved().round.phase, 'playing');
  const old = a.saved(); a.click('btn-new-round'); a.click('res-yes');
  const next = a.saved();
  assert.notEqual(next.round.id, old.round.id); assert.equal(next.round.phase, 'reveal');
  for (const p of next.players) assert.equal(p.points, old.round.impostorIds.includes(p.id) ? 1 : 0);
  for (let i = 0; i < 3; i++) { assert.equal(a.el('secret-value').textContent, ''); a.hold(); a.click('secret-hide'); }
  a.advance(5000); assert.equal(a.saved().round.phase, 'playing');
  assert.deepEqual(a.alerts, []); assert.deepEqual(a.errors, []);
});
test('short holds and cancelled pointer gestures cannot reveal a secret', t => {
  const a = app(); t.after(a.close); a.start(); a.input('entry-name', 'Nick'); a.click('entry-confirm');
  a.hold(400); a.advance(1000); assert.equal(a.el('secret-content').hidden, true);
  a.event('secret-show', 'pointerdown', { button: 0, isPrimary: true, pointerId: 1 }); a.advance(400);
  a.event('secret-show', 'pointercancel'); a.advance(1000); assert.equal(a.el('secret-content').hidden, true);
  a.hold(); assert.equal(a.el('secret-content').hidden, false); assert.equal(a.el('secret-hide').hidden, false);
  a.advance(1500); assert.equal(a.el('hero-next-name').textContent, 'Kuba');
});
test('first hold survives captured pointerleave and unavailable pointer capture', t => {
  for (const captured of [true,false]) {
    const a=app();t.after(a.close);a.start();a.input('entry-name','Nick');a.click('entry-confirm');
    const button=a.el('secret-show');
    button.setPointerCapture=()=>{if(!captured)throw new Error('Capture unavailable');};
    button.hasPointerCapture=()=>captured;
    a.event('secret-show','pointerdown',{button:0,isPrimary:true,pointerId:1});
    if(captured)a.event('secret-show','pointerleave',{pointerId:1});
    a.advance(1000);assert.equal(a.el('secret-content').hidden,false);assert.deepEqual(a.errors,[]);
  }
});
test('dragging outside a captured reveal button cancels the hold', t => {
  const a = app(); t.after(a.close); a.start(); a.input('entry-name', 'Nick'); a.click('entry-confirm');
  a.el('secret-show').getBoundingClientRect = () => ({ left: 20, top: 20, right: 300, bottom: 250 });
  a.event('secret-show', 'pointerdown', { button: 0, isPrimary: true, pointerId: 1 }); a.advance(400);
  a.event('secret-show', 'pointermove', { clientX: 310, clientY: 120 }); a.advance(1000);
  assert.equal(a.el('secret-content').hidden, true); assert.equal(a.saved().round.cursor, 0);
});
test('V2 reveal button is replaced by the handoff button after revealing', t => {
  const a = app(); t.after(a.close); a.start(); a.input('entry-name', 'Nick'); a.click('entry-confirm');
  assert.equal(a.el('secret-show').hidden, false);
  assert.equal(a.el('secret-hide').hidden, true);
  assert.equal(a.el('secret-instruction').hidden, false);
  a.hold();
  assert.equal(a.el('secret-show').hidden, true);
  assert.equal(a.el('secret-hide').hidden, false);
  assert.equal(a.el('secret-instruction').hidden, true);
  assert.equal(a.saved().round.cursor, 0);
  a.click('secret-hide'); assert.equal(a.saved().round.cursor, 1);
  a.input('entry-name', 'Next'); a.click('entry-confirm');
  assert.equal(a.el('secret-show').hidden, false);
  assert.equal(a.el('secret-content').hidden, true);
});
test('keyboard hold, window blur and visibility changes protect the same player secret', t => {
  const a = app(); t.after(a.close); a.start(); a.input('entry-name', 'Nick'); a.click('entry-confirm');
  a.event('secret-show', 'keydown', { key: ' ', repeat: false }); a.advance(1000);
  a.event('secret-show', 'keyup', { key: ' ' }); assert.equal(a.el('secret-content').hidden, false);
  a.w.dispatchEvent(new a.w.Event('blur'));
  assert.equal(a.el('secret-content').hidden, true); assert.equal(a.el('secret-value').textContent, '');
  a.hold(); assert.equal(a.el('secret-content').hidden, false);
  Object.defineProperty(a.w.document, 'hidden', { configurable: true, value: true });
  a.w.document.dispatchEvent(new a.w.Event('visibilitychange'));
  assert.equal(a.el('secret-content').hidden, true); assert.equal(a.saved().round.cursor, 0);
});
test('refresh resumes partial entry with the same word/roles and a concealed screen', t => {
  const a = app(); t.after(a.close); a.start(); a.input('entry-name', 'Nick'); a.click('entry-confirm'); a.hold();
  const saved = a.saved(); const b = app(saved); t.after(b.close); b.click('btn-continue');
  assert.equal(b.el('overlay-secret').classList.contains('show'), true);
  assert.equal(b.el('secret-content').hidden, true); assert.equal(b.el('secret-player').textContent, 'Nick');
  assert.deepEqual(b.saved().round, saved.round);
  b.hold(); b.click('secret-hide'); assert.equal(b.el('entry-person').textContent, 'Kuba');
});
test('refresh during later reveals resumes the correct person', t => {
  const a = app(); t.after(a.close); a.start(); a.finishEntry(); a.click('btn-new-round'); a.click('res-no');
  a.hold(); a.click('secret-hide'); const saved = a.saved();
  const b = app(saved); t.after(b.close); b.click('btn-continue');
  assert.equal(b.el('secret-player').textContent, 'Nick 1'); assert.equal(b.el('secret-content').hidden, true);
  assert.equal(b.saved().round.id, saved.round.id);
});
test('refresh during the starter animation keeps the chosen starter and enters the lobby', t => {
  const a = app(); t.after(a.close); a.start();
  for (let i = 0; i < 3; i++) { a.input('entry-name', `Nick ${i}`); a.click('entry-confirm'); a.hold(); a.click('secret-hide'); }
  assert.equal(a.el('view-start').style.display, ''); const saved = a.saved();
  const b = app(saved); t.after(b.close); b.click('btn-continue');
  assert.equal(b.el('view-lobby').style.display, '');
  assert.equal(b.el('starter-name').textContent, saved.players.find(p => p.id === saved.round.starterId).name);
  assert.deepEqual(b.saved(), saved);
});
test('cancel roster changes discards names, additions, order and resets', t => {
  const a = app(); t.after(a.close); a.start(); a.finishEntry(); const before = a.saved();
  a.click('btn-manage');
  const input = a.w.document.querySelector('[data-name="0"]'); input.value = 'Changed'; input.dispatchEvent(new a.w.Event('input', { bubbles: true }));
  a.input('manage-name', 'Nowy'); a.click('manage-add'); a.w.document.querySelector('[data-down="0"]').click();
  a.click('reset-stats'); a.click('reset-words'); a.click('manage-cancel');
  assert.deepEqual(a.saved(), before); assert.equal(a.el('stats-body').textContent.includes('Changed'), false);
});
test('deletion stops at 3; empty and duplicate edited names cannot be saved', t => {
  const a = app(); t.after(a.close); a.start(4); a.finishEntry(4); a.click('btn-manage');
  a.w.document.querySelector('[data-del="3"]').click();
  assert.ok([...a.w.document.querySelectorAll('[data-del]')].every(b => b.disabled));
  const name = a.w.document.querySelector('[data-name="0"]');
  name.value = ''; name.dispatchEvent(new a.w.Event('input', { bubbles: true })); a.click('manage-save');
  assert.equal(a.el('view-manage').style.display, '');
  name.value = 'Nick 1'; name.dispatchEvent(new a.w.Event('input', { bubbles: true })); a.click('manage-save');
  assert.equal(a.el('view-manage').style.display, ''); assert.equal(a.alerts.length, 2);
  name.value = 'Renamed'; name.dispatchEvent(new a.w.Event('input', { bubbles: true })); a.click('manage-save');
  assert.equal(a.saved().players.length, 3); assert.equal(a.saved().players[0].name, 'Renamed');
});
test('cancel settings restores controls on re-entry; saved mode affects only next round', t => {
  const a = app(); t.after(a.close); a.start(); a.finishEntry(); a.click('btn-settings');
  a.click('info-none'); a.click('count-2'); a.click('setup-cancel'); a.click('btn-settings');
  assert.equal(a.el('info-category').checked, true); assert.equal(a.el('count-default').checked, true);
  a.click('info-none'); a.click('count-2'); a.click('setup-save');
  assert.equal(a.saved().settings.impostorInfo, 'none'); assert.equal(a.saved().round.info, 'category');
  a.click('btn-new-round'); a.click('res-yes');
  assert.equal(a.saved().round.info, 'none'); assert.equal(a.saved().round.impostorIds.length, 2);
});
test('custom is removed and the final active word set cannot be unchecked', t => {
  const a = app(); t.after(a.close); a.click('btn-test');
  assert.equal(a.el('words-custom'), null); assert.equal(a.el('words-AAA'), null);
  a.click('words-default'); assert.equal(a.el('words-default').checked, true);
  assert.equal(a.alerts.length, 1);
});
test('double result click does not double score or create another round', t => {
  const a = app(); t.after(a.close); a.start(); a.finishEntry(); a.click('btn-new-round'); a.click('res-yes');
  const once = a.saved(); a.click('res-yes'); assert.deepEqual(a.saved(), once);
});
test('broken storage and invalid saves leave new games playable', t => {
  for (const options of [{ noStorage: true }, { noWrite: true }, {}]) {
    const a = app(options.noWrite ? null : '{broken', options); t.after(a.close);
    a.start(); a.finishEntry();
    assert.equal(a.el('view-lobby').style.display, ''); assert.equal(a.el('storage-notice').hidden, false);
    assert.deepEqual(a.errors, []);
  }
});
test('V2 import leaves original storage untouched and never invents a pending result', t => {
  const legacy = { players: ['A', 'B', 'C'].map(name => ({ name, points: 4 })), lastImpostorIndices: [0] };
  const a = app(null, { legacy }); t.after(a.close);
  assert.equal(a.el('btn-import').hidden, false); a.click('btn-import');
  assert.equal(a.saved().round, null); assert.equal(a.el('btn-new-round').textContent, 'Rozdaj role');
  assert.deepEqual(JSON.parse(a.w.localStorage.getItem('impostorParty_v10')), legacy);
  a.click('btn-new-round'); assert.equal(a.saved().round.phase, 'reveal');
  assert.ok(a.saved().players.every(p => p.points === 4));
});
test('untrusted player names are rendered as text', t => {
  const a = app(); t.after(a.close); a.start();
  a.input('entry-name', '<img src=x onerror=alert(1)>'); a.click('entry-confirm'); a.hold(); a.click('secret-hide');
  assert.equal(a.el('entry-list').querySelectorAll('img').length, 3);
  assert.ok(a.el('entry-list').textContent.includes('<img src=x onerror=alert(1)>')); assert.deepEqual(a.alerts, []);
});
test('stale hero timeout cannot change the next player view', t => {
  const a = app(); t.after(a.close); a.start(); a.input('entry-name', 'First'); a.click('entry-confirm');
  a.hold(); a.click('secret-hide'); a.input('entry-name', 'Second'); a.click('entry-confirm'); a.advance(2000);
  assert.equal(a.el('hero-banner').getAttribute('aria-hidden'), 'true');
  assert.equal(a.el('secret-player').textContent, 'Second'); assert.equal(a.el('secret-content').hidden, true);
});
test('another tab update clears current secret and stale editor state', t => {
  const a = app(); t.after(a.close); a.start(); a.finishEntry(); const saved = a.saved(); a.click('btn-manage');
  saved.players[0].name = 'Updated';
  a.w.dispatchEvent(new a.w.StorageEvent('storage', { key: C.STORAGE_KEY, newValue: JSON.stringify(saved) }));
  assert.equal(a.el('view-menu').style.display, ''); a.click('btn-continue');
  assert.ok(a.el('stats-body').textContent.includes('Updated'));
});

test('each impostor knowledge setting shows only the intended information', t => {
  const base = app(); t.after(base.close); base.start(); base.input('entry-name', 'Nick'); base.click('entry-confirm');
  for (const info of ['none', 'category', 'hint']) {
    const saved = base.saved(); saved.round.info = info; saved.round.impostorIds = [saved.players[0].id];
    const a = app(saved); t.after(a.close); a.click('btn-continue');
    assert.equal(a.el('secret-category').textContent, ''); a.hold();
    assert.equal(a.el('secret-value').textContent, '');
    assert.equal(a.el('secret-category').textContent, info === 'none' ? '' : saved.round.word[info]);
    assert.equal(a.el('secret-imp-hint').hidden, false);
    assert.ok(a.el('overlay-secret').querySelector('.secret-impostor'));
    a.click('secret-hide'); assert.equal(a.el('secret-category').textContent, '');
    assert.equal(a.el('overlay-secret').querySelector('.secret-impostor'), null);
  }
});
test('failed next deal leaves score and result dialog unchanged, allowing correction', t => {
  const a = app(); t.after(a.close); a.start(); a.finishEntry(); const before = a.saved();
  const original = a.w.ImpostorCore.settleAndDeal;
  a.w.ImpostorCore.settleAndDeal = () => { throw new Error('Simulated deal failure'); };
  a.click('btn-new-round'); a.click('res-yes');
  assert.deepEqual(a.saved(), before); assert.ok(a.el('overlay-result').classList.contains('show'));
  a.w.ImpostorCore.settleAndDeal = original; a.click('res-yes');
  assert.notEqual(a.saved().round.id, before.round.id);
});
test('V2 secret card and both action buttons retain their original styling', t => {
  const a = app(); t.after(a.close);
  const style = a.w.document.createElement('style'); style.textContent = fs.readFileSync(path.join(root, 'impostor.css'), 'utf8');
  a.w.document.head.appendChild(style);
  a.start(); a.input('entry-name', 'Nick'); a.click('entry-confirm');
  assert.equal(a.el('secret-stage'), null);
  assert.equal(a.w.getComputedStyle(a.el('secret-show')).minHeight, '72px');
  assert.equal(a.el('secret-content').parentElement.className, 'card center');
  assert.equal(a.el('secret-show').parentElement, a.el('secret-hide').parentElement);
  a.hold();
  assert.equal(a.w.getComputedStyle(a.el('secret-show')).display, 'none');
  assert.equal(a.w.getComputedStyle(a.el('secret-hide')).minHeight, '72px');
  assert.equal(a.w.getComputedStyle(a.el('overlay-secret')).overflowY, 'auto');
});
test('HTML has unique ids and existing local resources, and UI references resolve', () => {
  const clean = html.replace(/<!--[\s\S]*?-->/g, '');
  const ids = [...clean.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, file] of clean.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (!file.startsWith('http')) assert.ok(fs.existsSync(path.resolve(root, file)), file);
  }
  const ui = fs.readFileSync(path.join(root, 'impostor.js'), 'utf8');
  for (const [, id] of ui.matchAll(/\bel\('([^']+)'\)/g)) assert.ok(ids.includes(id), id);
  for (const [, file] of ui.matchAll(/'(avatars\/[^']+\.png)'/g)) assert.ok(fs.existsSync(path.resolve(root, file)), file);
});
test('V2 name variants and decorated names keep distinct avatars across all screens', t => {
  const a = app(); t.after(a.close);
  a.start(5, ['Dawcio🔥', 'KUBSON99', 'Waneska', 'Dzjula', 'Adrix']);
  const files = ['daw', 'kub', 'wan', 'jul', 'adi'].map(key => `avatars/normal/av_${key}.png`);
  assert.deepEqual([...a.el('entry-list').querySelectorAll('img')].map(n => n.getAttribute('src')), files);
  for (let i = 0; i < 5; i++) {
    a.input('entry-name', `Nick ${i}`); a.click('entry-confirm');
    assert.ok(a.el('hero-current').style.backgroundImage.includes(files[i]));
    a.hold(); a.click('secret-hide');
  }
  assert.deepEqual([...a.el('start-wheel').querySelectorAll('img')].map(n => n.getAttribute('src')), files);
  a.advance(5000);
  assert.deepEqual([...a.el('stats-body').querySelectorAll('img')].map(n => n.getAttribute('src')), files);
  a.click('btn-manage');
  assert.deepEqual([...a.el('manage-list').querySelectorAll('img')].map(n => n.getAttribute('src')), files);
});
test('unrecognized roster labels fall back to nicknames, also when resuming an existing save', t => {
  const a = app(); t.after(a.close); a.start(3, ['1', '2', '3']);
  for (const name of ['Dawid', 'Qba', 'Julcia']) { a.input('entry-name', name); a.click('entry-confirm'); a.hold(); a.click('secret-hide'); }
  a.advance(5000);
  const b = app(a.saved()); t.after(b.close); b.click('btn-continue');
  assert.deepEqual([...b.el('stats-body').querySelectorAll('img')].map(n => n.getAttribute('src')),
    ['avatars/normal/av_daw.png', 'avatars/normal/av_kub.png', 'avatars/normal/av_jul.png']);
});
