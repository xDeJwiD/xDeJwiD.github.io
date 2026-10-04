const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const C = require('../time-core.js');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'time.html'), 'utf8');
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
test('time mode uses normal secret hold, avatars, timer and atomic scoring', t => {
  const a=app();t.after(a.close);
  let now=0;Object.defineProperty(a.w.performance,'now',{value:()=>now});
  a.w.localStorage.setItem('impostorParty_v3','normal-untouched');
  a.start(); a.input('entry-name','Nick 0');a.click('entry-confirm');
  assert.equal(a.el('order-beach'),null);
  assert.ok(a.el('hero-current').style.getPropertyValue('--avatar-alternate').includes('/normal/av_daw.png'));
  assert.ok(a.el('hero-current').style.backgroundImage.includes('av_daw.png'));
  a.hold(300);assert.equal(a.el('secret-content').hidden,true);a.hold();
  assert.equal(a.el('secret-content').hidden,false);a.click('secret-hide');
  for(let i=1;i<3;i++){a.input('entry-name',`Nick ${i}`);a.click('entry-confirm');a.hold();a.click('secret-hide');}
  assert.equal(a.el('view-lobby').style.display,'');const before=a.saved();
  for(let i=0;i<6;i++){
    a.event('time-pad','pointerdown',{button:0,isPrimary:true});now+=2345;
    a.event('time-pad','pointerdown',{button:0,isPrimary:true});assert.equal(a.el('time-value').textContent,'2,3 s');
    a.event('time-pad','pointerdown',{button:0,isPrimary:true});assert.equal(a.el('time-value').textContent,'START');
  }
  assert.deepEqual(a.saved(),before);
  a.click('btn-new-round');a.click('res-cancel');assert.deepEqual(a.saved(),before);
  a.click('btn-new-round');a.click('res-yes');
  const next=a.saved();assert.equal(next.round.phase,'reveal');assert.notEqual(next.round.id,before.round.id);
  for(const p of next.players)assert.equal(p.points,before.round.impostorIds.includes(p.id)?1:0);
  a.click('res-yes');assert.deepEqual(a.saved(),next);
  assert.equal(a.w.localStorage.getItem('impostorParty_v3'),'normal-untouched');assert.deepEqual(a.errors,[]);
});
test('time settings, beach preview and reload retain normal V3 semantics', t=>{
  const a=app();t.after(a.close);a.start();a.finishEntry();const before=a.saved().round;
  a.click('btn-settings');a.input('timeMin','11.34');a.input('timeMax','11.34');a.click('precision-2');a.click('info-hint');a.click('setup-save');
  assert.deepEqual(a.saved().round,before);
  a.click('btn-manage');a.click('manage-beach');a.click('manage-save');
  a.click('btn-new-round');a.click('res-no');assert.equal(a.saved().round.word.word,'11,34 s');assert.equal(a.saved().round.word.hint,'XX,XX s');
  a.hold();const b=app(a.saved());t.after(b.close);b.click('btn-continue');assert.equal(b.el('secret-content').hidden,true);
  assert.ok(b.el('hero-current').style.backgroundImage.includes('/beach/avb_'));
  for(let i=0;i<3;i++){b.hold();b.click('secret-hide');}
  b.event('time-pad','pointerdown',{button:0,isPrimary:true});b.w.dispatchEvent(new b.w.Event('blur'));
  assert.equal(b.el('time-value').textContent,'START');assert.deepEqual(b.errors,[]);
});
test('time core supports all precisions, bounds and role modes with validated saves',()=>{
  for(const precision of [0,1,2])for(const count of ['1','2','many','default'])for(const value of [0,60]){
    const s=C.emptyState();s.players=['A','B','C'].map((name,i)=>({id:String(i),name,orderName:name,points:0}));
    Object.assign(s.settings,{timeMin:value,timeMax:value,timePrecision:precision,impostorCount:count});
    const n=C.createRound(s,{},'r',false,()=>0);assert.equal(Number(n.round.word.word.replace(' s','').replace(',','.')),value);assert.deepEqual(C.validateSave(n,{}),n);
  }
  const s=C.emptyState();s.settings.timeMin=.07;s.settings.timeMax=.07;s.settings.timePrecision=2;assert.ok(C.settingsValid(s.settings,{}));
  s.settings.timePrecision=0;assert.equal(C.settingsValid(s.settings,{}),false);
});
test('live timer applies next round, stops repainting and requires a separate reset',t=>{
  const a=app();t.after(a.close);let now=0;Object.defineProperty(a.w.performance,'now',{value:()=>now});
  assert.equal(a.el('time-live').checked,false);a.start();a.finishEntry();
  a.click('btn-settings');a.click('time-live');a.click('setup-cancel');
  assert.equal(a.saved().settings.timeLive,false);
  a.click('btn-settings');a.click('time-live');a.click('setup-save');
  assert.equal(a.saved().round.timeLive,false);
  a.click('btn-new-round');a.click('res-no');
  for(let i=0;i<3;i++){a.hold();a.click('secret-hide');}
  const press=()=>a.event('time-pad','pointerdown',{button:0,isPrimary:true});
  press();assert.equal(a.el('time-value').textContent,'0,0 s');now=1250;a.advance(32);
  assert.equal(a.el('time-value').textContent,'1,3 s');press();
  now=9000;a.advance(100);assert.equal(a.el('time-value').textContent,'1,3 s');
  press();assert.equal(a.el('time-value').textContent,'START');now=10000;a.advance(32);
  assert.equal(a.el('time-value').textContent,'START');press();assert.equal(a.el('time-value').textContent,'0,0 s');
  a.w.dispatchEvent(new a.w.Event('blur'));now=15000;a.advance(100);assert.equal(a.el('time-value').textContent,'START');
  const b=app(a.saved());t.after(b.close);b.click('btn-continue');b.click('time-pad');assert.equal(b.el('time-value').textContent,'0,0 s');
});
test('time page references exist and normal page opens sibling mode',()=>{
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
  for(const [,file] of html.matchAll(/(?:src|href)="([^"]+)"/g))if(!file.startsWith('http'))assert.ok(fs.existsSync(path.resolve(root,file)),file);
  const js=fs.readFileSync(path.join(root,'time.js'),'utf8');for(const [,id] of js.matchAll(/\bel\('([^']+)'\)/g))assert.ok(ids.includes(id),id);
  assert.ok(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('href="time.html"'));
});

