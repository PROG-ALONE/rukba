/* ============================================================
   رُكبة — نظام التأهيل والتغذية (تطبيق صفحة واحدة، تخزين محلي)
   ============================================================ */
'use strict';

const APP_VERSION = '1.0.0';
const KEY = 'rukba.data.v1';
const SKEY = 'rukba.secrets.v1';
const GIST_FILE = 'rukba-data.json';

/* ---------------- أدوات عامة ---------------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clone = o => JSON.parse(JSON.stringify(o));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const r1 = n => Math.round(n * 10) / 10;
const r0 = n => Math.round(n);
const fmtN = (n, d = 0) => n == null || isNaN(n) ? '—' : Number(n).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 });
const num = v => (v === '' || v == null || isNaN(+v)) ? null : +v;
const uid = p => p + '_' + Math.random().toString(36).slice(2, 8);
const avg = a => { const v = a.filter(x => x != null && !isNaN(x)); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null; };
const sum = a => a.filter(x => x != null && !isNaN(x)).reduce((s, x) => s + x, 0);

const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
const diffDays = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
const today = () => iso(new Date());
const dateRange = (a, b) => { const out = []; for (let d = a; d <= b; d = addDays(d, 1)) out.push(d); return out; };
const fmtD = (s, o) => new Intl.DateTimeFormat('ar-IQ-u-nu-latn', o || { day: 'numeric', month: 'long' }).format(parse(s));
const fmtShort = s => { const d = parse(s); return `${d.getDate()}/${d.getMonth() + 1}`; };
const weekday = s => new Intl.DateTimeFormat('ar-IQ', { weekday: 'long' }).format(parse(s));
const hijri = s => { try { return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }).format(parse(s)); } catch { return ''; } };
const isFriday = s => parse(s).getDay() === 5;

/* ---------------- الأيقونات ---------------- */
const ICONS = {
  home: '<path d="M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/>',
  log: '<rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="M8 8.5h8M8 12.5h8M8 16.5h5"/>',
  program: '<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
  plan: '<circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M8 18h6.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H16"/>',
  food: '<path d="M12 21c-4.5 0-7.5-3.3-7.5-8 0-3.6 2.4-6.2 5.4-6.2 1 0 1.6.3 2.1.6.5-.3 1.1-.6 2.1-.6 3 0 5.4 2.6 5.4 6.2 0 4.7-3 8-7.5 8Z"/><path d="M12 6.4c0-1.8.9-3 2.6-3.4"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="m7.5 15 3.5-4 3 2.5 5-6.5"/>',
  report: '<path d="M14 3.5H7A2.5 2.5 0 0 0 4.5 6v12A2.5 2.5 0 0 0 7 20.5h10a2.5 2.5 0 0 0 2.5-2.5V9L14 3.5Z"/><path d="M14 3.5V9h5.5M8.5 13h7M8.5 16.5h4"/>',
  learn: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  play: '<path d="M8 5.5v13l10.5-6.5L8 5.5Z"/>',
  alert: '<path d="M12 3.5 2.5 20h19L12 3.5Z"/><path d="M12 10v4.5M12 17.2v.1"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.1"/>',
  prev: '<path d="m9 6 6 6-6 6"/>',
  next: '<path d="m15 6-6 6 6 6"/>',
  down: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
  up: '<path d="M12 16V5M7 9.5l5-5 5 5M5 20h14"/>',
  cloud: '<path d="M7 18.5h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.5 9.5 4.5 4.5 0 0 0 7 18.5Z"/><path d="m9.5 13.5 2.5-2.5 2.5 2.5M12 11v6"/>',
  print: '<path d="M7 9V3.5h10V9M7 17H4.5V10a1.5 1.5 0 0 1 1.5-1.5h12a1.5 1.5 0 0 1 1.5 1.5v7H17"/><path d="M7 14h10v6.5H7z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
  share: '<path d="M12 3.5v12M7.5 8 12 3.5 16.5 8"/><path d="M6 11.5H5v9h14v-9h-1"/>'
};
const ic = (n, s = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${s}>${ICONS[n] || ''}</svg>`;
const LOGO = `<svg width="36" height="36" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="var(--accent)"/><path d="M14 6c1 6 1.5 9 4.5 12.5" stroke="var(--accent-ink)" stroke-width="3" stroke-linecap="round" fill="none"/><ellipse cx="21" cy="20" rx="4" ry="5" fill="var(--accent-ink)"/><path d="M21.5 25c.3 3.5 1 6 3.5 9" stroke="var(--accent-ink)" stroke-width="3" stroke-linecap="round" fill="none" opacity=".75"/></svg>`;

/* ---------------- التخزين ---------------- */
let D = null;

function defaults() {
  const now = Date.now();
  return {
    version: 1,
    meta: { created: now, updatedAt: now, cfgUpdatedAt: 1, lastExport: 0 },
    profile: { ...clone(DEFAULT_PROFILE), rate: 0.6 },
    phases: clone(DEFAULT_PHASES),
    consults: clone(DEFAULT_CONSULTS),
    foods: clone(DEFAULT_FOODS),
    meals: clone(DEFAULT_MEALS),
    logs: buildSeedLogs(),
    report: { questions: '', lang: 'ar' }
  };
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw);
      const base = defaults();
      D = { ...base, ...d, meta: { ...base.meta, ...d.meta }, profile: { ...base.profile, ...d.profile }, report: { ...base.report, ...d.report } };
      return;
    }
  } catch (e) { console.warn('load failed', e); }
  D = defaults();
  persist();
}
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(D)); }
  catch (e) { toast('تعذر الحفظ على هذا الجهاز: ' + e.message); }
}
function saveCfg() { D.meta.cfgUpdatedAt = Date.now(); D.meta.updatedAt = Date.now(); persist(); Sync.schedule(); }
function saveLog(log) { log.updatedAt = Date.now(); D.logs[log.date] = log; D.meta.updatedAt = Date.now(); persist(); Sync.schedule(); }
function getLog(date) { return D.logs[date] ? clone(D.logs[date]) : { date, ex: {} }; }

/* ---------------- منطق المجال ---------------- */
const phasesSorted = () => [...D.phases].sort((a, b) => a.start < b.start ? -1 : 1);
function phaseFor(date) {
  let ph = null;
  for (const p of phasesSorted()) if (p.start <= date && (!p.end || p.end >= date)) ph = p;
  return ph;
}
const currentPhase = () => phaseFor(today()) || phasesSorted().at(-1);
const activeEx = ph => ph ? ph.exercises.filter(e => e.active !== false) : [];

function dayStats(date) {
  const log = D.logs[date];
  const ph = phaseFor(date);
  const exs = activeEx(ph);
  const planned = exs.length;
  let done = 0, skipped = 0, recorded = 0; const exPains = [];
  if (log && log.ex) for (const e of exs) {
    const v = log.ex[e.id];
    if (!v) continue;
    if (v.d === true) { done++; recorded++; } else if (v.d === false) { skipped++; recorded++; }
    if (v.p != null) exPains.push(v.p);
  }
  const pct = planned ? done / planned : null;
  let session = 'nodata';
  if (log) session = done === 0 ? 'none' : (pct >= .999 ? 'full' : 'partial');
  if (log && done === 0 && recorded === 0 && !hasAnyField(log)) session = 'nodata';
  const pains = [log?.painDuring, ...exPains].filter(x => x != null);
  return {
    date, log, ph, planned, done, skipped, pct, session,
    painMax: pains.length ? Math.max(...pains) : null,
    painMorning: log?.painMorning ?? null, painDaily: log?.painDaily ?? null,
    limit: ph ? ph.painLimit : null
  };
}
function hasAnyField(l) { return ['steps', 'weight', 'sleep', 'water', 'painDuring', 'painMorning', 'notes'].some(k => l[k] != null && l[k] !== ''); }

function painClass(v, limit) {
  if (v == null) return '';
  if (limit == null) limit = 0;
  if (v <= limit) return 'ok';
  if (v <= limit + 2) return 'warn';
  return 'bad';
}
const painColor = (v, limit) => ({ ok: 'var(--ok)', warn: 'var(--warn)', bad: 'var(--bad)' }[painClass(v, limit)] || 'var(--muted)');

function weightSeries() {
  return Object.values(D.logs).filter(l => l.weight != null).sort((a, b) => a.date < b.date ? -1 : 1).map(l => ({ x: l.date, y: l.weight }));
}
function currentWeight() { const s = weightSeries(); return s.length ? s.at(-1).y : D.profile.startWeight; }

/* الطاقة — معادلة Mifflin-St Jeor */
function energy(weight = currentWeight()) {
  const p = D.profile;
  const bmr = 10 * weight + 6.25 * p.height - 5 * p.age + (p.sex === 'f' ? -161 : 5);
  const tdee = bmr * p.activity;
  const target = Math.max(tdee - p.deficit, p.sex === 'f' ? 1300 : 1600);
  const protein = Math.round(p.proteinPerKg * weight / 5) * 5;
  return { bmr: r0(bmr), tdee: r0(tdee), target: r0(target / 10) * 10, protein, fat: r0(target * .28 / 9), carbs: r0((target - protein * 4 - target * .28) / 4) };
}

const foodById = id => D.foods.find(f => f.id === id);
function itemsTotals(items) {
  const t = { kcal: 0, p: 0, c: 0, f: 0 };
  for (const it of items) {
    const f = foodById(it.f); if (!f) continue;
    const k = it.g / 100;
    t.kcal += f.kcal * k; t.p += f.p * k; t.c += f.c * k; t.f += f.f * k;
  }
  return t;
}
const mealById = id => D.meals.find(m => m.id === id);
const mealTotals = m => itemsTotals(m.items);
function dayNutrition(log) {
  const t = { kcal: 0, p: 0, c: 0, f: 0, any: false };
  for (const mm of log?.meals || []) {
    const m = mealById(mm.m); if (!m) continue;
    const mt = mealTotals(m);
    for (const k of ['kcal', 'p', 'c', 'f']) t[k] += mt[k] * (mm.q || 1);
    t.any = true;
  }
  const xt = itemsTotals(log?.extra || []);
  for (const k of ['kcal', 'p', 'c', 'f']) t[k] += xt[k];
  if ((log?.extra || []).length) t.any = true;
  return t;
}
function dayKcal(log) { if (!log) return null; if (log.kcal != null) return log.kcal; const n = dayNutrition(log); return n.any ? n.kcal : null; }
function dayProtein(log) { if (!log) return null; if (log.protein != null) return log.protein; const n = dayNutrition(log); return n.any ? n.p : null; }

function lastConsult(date = today()) {
  return [...D.consults].filter(c => c.date <= date).sort((a, b) => a.date < b.date ? 1 : -1)[0];
}
/* الدورة: 14 يوم تبدأ من آخر استشارة (أو حتى موعد الاستشارة القادمة إن وُجد) */
function currentCycle(date = today()) {
  const lc = lastConsult(date);
  const base = lc ? lc.date : (phasesSorted()[0]?.start || date);
  const n = Math.max(0, Math.floor(diffDays(base, date) / 14));
  const start = addDays(base, n * 14);
  let end = addDays(start, 13);
  const nc = D.profile.nextConsult;
  if (nc && nc > date && nc <= addDays(start, 27)) end = addDays(nc, -1);
  return { start, end, index: n + 1, day: diffDays(start, date) + 1, len: diffDays(start, end) + 1 };
}

/* ---------------- رسوم بيانية SVG ---------------- */
const CHARTS = {};
function chart(o) {
  const id = uid('ch');
  const W = o.w || 640, H = o.h || 220, pl = 40, pr = 12, pt = 14, pb = 26;
  const data = o.data;
  const xs = data.map(d => d.x);
  const vals = data.map(d => d.y).filter(v => v != null);
  const refs = o.refs || [];
  let lo = o.yMin ?? Math.min(...vals, ...refs.map(r => r.y));
  let hi = o.yMax ?? Math.max(...vals, ...refs.map(r => r.y));
  if (!vals.length) { lo = o.yMin ?? 0; hi = o.yMax ?? Math.max(10, ...refs.map(r => r.y * 1.2)); }
  if (hi === lo) { hi += 1; lo -= 1; }
  if (o.yMin == null && o.type !== 'bar') { const p = (hi - lo) * .12; lo -= p; hi += p; }
  if (o.type === 'bar' && o.yMin == null) lo = 0;
  const ticks = o.ticks || niceTicks(lo, hi, 5); lo = Math.min(lo, ticks[0]); hi = Math.max(hi, ticks.at(-1));
  const n = data.length;
  const iw = W - pl - pr, ih = H - pt - pb;
  const bw = n ? iw / n : iw;
  const X = i => o.type === 'bar' ? pl + bw * i + bw / 2 : pl + (n <= 1 ? iw / 2 : iw * i / (n - 1));
  const Y = v => pt + ih - (v - lo) / (hi - lo) * ih;
  const color = o.color || 'var(--series-1)';
  let g = '';
  for (const t of ticks) g += `<line class="grid-l" x1="${pl}" x2="${W - pr}" y1="${Y(t)}" y2="${Y(t)}"/><text class="ax" x="${pl - 6}" y="${Y(t) + 4}" text-anchor="end">${fmtN(t, o.dec ?? 0)}</text>`;
  const step = Math.max(1, Math.ceil(n / (o.xTicks || 7)));
  for (let i = 0; i < n; i += step) g += `<text class="ax" x="${X(i)}" y="${H - 6}" text-anchor="middle">${fmtShort(xs[i])}</text>`;
  let marks = '';
  if (o.type === 'bar') {
    const w = Math.min(24, Math.max(3, bw - 4));
    data.forEach((d, i) => {
      if (d.y == null) return;
      const y0 = Y(Math.max(lo, 0)), y1 = Y(d.y), h = Math.max(1, y0 - y1), x = X(i) - w / 2, r = Math.min(4, w / 2, h);
      const c = d.c || color;
      marks += `<path d="M${x},${y0} V${y1 + r} Q${x},${y1} ${x + r},${y1} H${x + w - r} Q${x + w},${y1} ${x + w},${y1 + r} V${y0} Z" fill="${c}"/>`;
    });
  } else {
    (o.series || [{ key: 'y', color, name: o.name }]).forEach(s => {
      let path = '', pen = false; const dots = [];
      data.forEach((d, i) => {
        const v = d[s.key]; if (v == null) { if (!o.connect) pen = false; return; }
        path += (pen ? 'L' : 'M') + X(i).toFixed(1) + ',' + Y(v).toFixed(1); pen = true;
        dots.push([X(i), Y(v), d[s.key + 'c']]);
      });
      if (s.area && path) marks += `<path d="${path} L${dots.at(-1)[0]},${pt + ih} L${dots[0][0]},${pt + ih} Z" fill="${s.color}" opacity=".1"/>`;
      if (!s.dotsOnly) marks += `<path d="${path}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
      const showDots = s.dotsOnly || dots.length <= 31;
      if (showDots) dots.forEach(([x, y, c]) => marks += `<circle cx="${x}" cy="${y}" r="4" fill="${c || s.color}" stroke="var(--card)" stroke-width="2"/>`);
      else if (dots.length) { const [x, y] = dots.at(-1); marks += `<circle cx="${x}" cy="${y}" r="4.5" fill="${s.color}" stroke="var(--card)" stroke-width="2"/>`; }
    });
  }
  let rl = '';
  for (const r of refs) {
    rl += `<line x1="${pl}" x2="${W - pr}" y1="${Y(r.y)}" y2="${Y(r.y)}" stroke="${r.color || 'var(--ink-2)'}" stroke-width="1.5" stroke-dasharray="${r.dash || '5 4'}"/>`;
    rl += `<text class="ax" x="${W - pr}" y="${Y(r.y) - 5}" text-anchor="end" style="fill:var(--ink-2);font-weight:600">${esc(r.label)}</text>`;
  }
  CHARTS[id] = { data, X: data.map((_, i) => X(i)), W, H, tip: o.tip, pt, ih };
  return `<div class="chart" id="${id}" role="img" aria-label="${esc(o.label || '')}"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="direction:ltr">${g}${marks}${rl}<line class="hov" x1="0" x2="0" y1="${pt}" y2="${pt + ih}" stroke="var(--ink-2)" stroke-width="1" opacity="0"/></svg><div class="tip"></div></div>`;
}
function niceTicks(lo, hi, n) {
  const span = hi - lo, raw = span / n, mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const st = [1, 2, 5, 10].map(s => s * mag).find(s => span / s <= n) || 10 * mag;
  const a = Math.floor(lo / st) * st, out = [];
  for (let v = a; v <= hi + st * .001; v += st) out.push(+v.toFixed(6));
  if (out.at(-1) < hi) out.push(out.at(-1) + st);
  return out;
}
function bindCharts(root = document) {
  $$('.chart', root).forEach(el => {
    const c = CHARTS[el.id]; if (!c || el.dataset.b) return; el.dataset.b = 1;
    const svg = $('svg', el), tip = $('.tip', el), hov = $('.hov', el);
    const move = ev => {
      const r = svg.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width * c.W;
      let bi = 0, bd = 1e9; c.X.forEach((px, i) => { const d = Math.abs(px - x); if (d < bd) { bd = d; bi = i; } });
      const d = c.data[bi];
      const html = c.tip ? c.tip(d) : `${fmtD(d.x)}: ${fmtN(d.y, 1)}`;
      if (!html) { tip.classList.remove('show'); return; }
      tip.innerHTML = html;
      const px = c.X[bi] / c.W * r.width;
      tip.style.right = 'auto';
      tip.style.left = Math.min(Math.max(px, 70), r.width - 70) + 'px';
      tip.style.transform = 'translate(-50%, -105%)';
      tip.style.top = '0px';
      tip.classList.add('show');
      hov.setAttribute('x1', c.X[bi]); hov.setAttribute('x2', c.X[bi]); hov.setAttribute('opacity', .4);
    };
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerdown', move);
    svg.addEventListener('pointerleave', () => { tip.classList.remove('show'); hov.setAttribute('opacity', 0); });
  });
}

/* ---------------- واجهة عامة ---------------- */
let toastT;
function toast(msg) {
  let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); }
  t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600);
}
function dialog({ title, body, actions }) {
  const dl = document.createElement('dialog');
  dl.innerHTML = `<div class="dh">${esc(title)}</div><div class="db">${body}</div><div class="df"></div>`;
  for (const a of actions) {
    const b = document.createElement('button'); b.className = 'btn ' + (a.cls || ''); b.textContent = a.label;
    b.onclick = async () => { const r = a.run ? await a.run(dl) : true; if (r !== false) { dl.close(); dl.remove(); } };
    $('.df', dl).append(b);
  }
  document.body.append(dl); dl.showModal();
  dl.addEventListener('cancel', () => setTimeout(() => dl.remove(), 50));
  return dl;
}
function formDialog({ title, fields, values = {}, onSave, onDelete, saveLabel = 'حفظ' }) {
  const body = fields.map(f => {
    const v = values[f.k] ?? f.def ?? '';
    const id = 'fd_' + f.k;
    if (f.type === 'textarea') return `<label class="f" style="margin-bottom:12px">${esc(f.label)}<textarea id="${id}">${esc(v)}</textarea></label>`;
    if (f.type === 'select') return `<label class="f" style="margin-bottom:12px">${esc(f.label)}<select id="${id}">${f.options.map(([ov, ol]) => `<option value="${esc(ov)}" ${String(ov) === String(v) ? 'selected' : ''}>${esc(ol)}</option>`).join('')}</select></label>`;
    if (f.type === 'checkbox') return `<label class="row" style="margin-bottom:12px"><input type="checkbox" id="${id}" ${v ? 'checked' : ''} style="width:22px;height:22px"> ${esc(f.label)}</label>`;
    return `<label class="f" style="margin-bottom:12px">${esc(f.label)}<input id="${id}" type="${f.type || 'text'}" ${f.step ? `step="${f.step}"` : ''} ${f.type === 'number' ? 'inputmode="decimal"' : ''} value="${esc(v)}" ${f.dir ? `dir="${f.dir}"` : ''}></label>`;
  }).join('') + (f => f ? `<p class="muted">${f}</p>` : '')(fields.note);
  const actions = [];
  if (onDelete) actions.push({ label: 'حذف', cls: 'danger', run: () => { if (confirm('متأكد من الحذف؟')) { onDelete(); return true; } return false; } });
  actions.push({ label: 'إلغاء' });
  actions.push({
    label: saveLabel, cls: 'primary', run: dl => {
      const out = {};
      for (const f of fields) {
        const el = $('#fd_' + f.k, dl);
        out[f.k] = f.type === 'checkbox' ? el.checked : f.type === 'number' ? num(el.value) : el.value.trim();
      }
      return onSave(out);
    }
  });
  return dialog({ title, body, actions });
}

/* ---------------- التنقل ---------------- */
const NAV = [
  ['home', 'اليوم', 'home', 'اليوم'],
  ['log', 'السجل اليومي', 'log', 'السجل'],
  ['program', 'البرنامج العلاجي', 'program', 'البرنامج'],
  ['plan', 'خطة التعافي', 'plan', 'الخطة'],
  ['nutrition', 'التغذية', 'food', 'التغذية'],
  ['progress', 'التقدم', 'chart', 'التقدم'],
  ['report', 'تقرير الدكتور', 'report', 'التقرير'],
  ['learn', 'المكتبة العلمية', 'learn', 'المكتبة'],
  ['settings', 'الإعدادات والبيانات', 'settings', 'الإعدادات']
];
function shell() {
  document.body.innerHTML = `
  <div class="app">
    <aside class="side">
      <div class="brand">${LOGO}<div><b>رُكبة</b><small>مسار التأهيل والتغذية</small></div></div>
      <nav class="nav">${NAV.map(([r, l, i]) => `<a href="#${r}" data-r="${r}">${ic(i)}<span>${l}</span></a>`).join('')}</nav>
      <div class="side-foot"><div id="syncState"></div><div>الإصدار ${APP_VERSION}</div></div>
    </aside>
    <main id="main" tabindex="-1"></main>
    <nav class="tabbar">${NAV.map(([r, , i, sh]) => `<a href="#${r}" data-r="${r}">${ic(i)}<span>${sh}</span></a>`).join('')}</nav>
  </div>`;
}
function route() {
  const h = location.hash.slice(1) || 'home';
  const [r, arg] = h.split('/');
  $$('[data-r]').forEach(a => { if (a.dataset.r !== r) a.removeAttribute('aria-current'); else a.setAttribute('aria-current', 'page'); });
  const main = $('#main');
  for (const k in CHARTS) delete CHARTS[k];
  const V = VIEWS[r] || VIEWS.home;
  main.innerHTML = V.html(arg);
  V.bind && V.bind(main, arg);
  bindCharts(main);
  updateSyncState();
  if (!route.first) window.scrollTo(0, 0);
  route.first = false;
}
route.first = true;

/* ================= الصفحات ================= */
const VIEWS = {};

/* ---------- اليوم ---------- */
VIEWS.home = {
  html() {
    const t = today(), p = D.profile, ph = currentPhase(), cy = currentCycle();
    const hr = new Date().getHours();
    const greet = hr < 12 ? 'صباح الخير' : 'مساء الخير';
    const st = dayStats(t), log = D.logs[t] || {};
    const w = currentWeight(), lost = p.startWeight - w, toGo = w - p.goalWeight;
    const prog = Math.max(0, Math.min(1, (p.startWeight - w) / (p.startWeight - p.goalWeight)));
    const last7 = dateRange(addDays(t, -6), t).map(dayStats);
    const steps7 = avg(last7.map(s => s.log?.steps ?? null));
    const cyDays = dateRange(cy.start, cy.end);
    const cyAll = cyDays.filter(d => d <= t).map(dayStats);
    const cyStats = cyAll.filter(s => s.session !== 'nodata');
    const unlogged = cyAll.length - cyStats.length;
    const plannedSum = sum(cyStats.map(s => s.planned)), doneSum = sum(cyStats.map(s => s.done));
    const adh = plannedSum ? doneSum / plannedSum : null;
    const pains7 = last7.map(s => s.painMax).filter(x => x != null);
    const maxPain7 = pains7.length ? Math.max(...pains7) : null;
    const over = last7.filter(s => (s.painMax != null && s.painMax > s.limit) || (s.painMorning != null && s.painMorning > s.limit));
    const e = energy(w);
    const stepT = ph?.stepTarget || 7000;
    const daysSinceExport = D.meta.lastExport ? diffDays(iso(new Date(D.meta.lastExport)), t) : null;
    const alerts = [];
    if (over.length) alerts.push(['bad', 'alert', `تجاوز الألم الحد المسموح (${ph.painLimit} من 10) في ${over.length} يوم خلال آخر 7 أيام. خفّف الحمل وبلّغ د. أصيل.`]);
    if (!p.nextConsult) alerts.push(['info', 'info', 'حدد موعد الاستشارة القادمة مع د. أصيل من صفحة <a href="#program">البرنامج العلاجي</a> حتى تنضبط الدورة والتقرير.']);
    if (!Sync.enabled() && (daysSinceExport == null || daysSinceExport >= 5)) alerts.push(['warn', 'alert', `${daysSinceExport == null ? 'لم تصدّر نسخة احتياطية بعد' : 'آخر نسخة احتياطية قبل ' + daysSinceExport + ' يوم'}. <a href="#settings">صدّر الآن</a> أو فعّل المزامنة.`]);
    if (isFriday(t) && !log.vitD) alerts.push(['info', 'info', 'اليوم جمعة: موعد فيتامين D (50,000 IU). سجّله من السجل اليومي.']);

    const strip = cyDays.map((d, i) => {
      const s = dayStats(d), fut = d > t;
      const pct = s.pct ?? 0;
      const pd = s.painMax ?? s.painMorning;
      return `<a class="d ${d === t ? 'today' : ''} ${fut ? 'future' : ''} ${pct >= .5 ? 'full' : ''}" href="#log/${d}" title="${fmtD(d)} — ${s.done}/${s.planned}">
        ${!fut && s.session !== 'nodata' ? `<div class="fill" style="height:${Math.round(pct * 100)}%"></div>` : ''}
        <span>${i + 1}</span>
        <i class="pd" style="background:${pd == null ? 'transparent' : painColor(pd, s.limit)};${pd == null ? 'box-shadow:none' : ''}"></i></a>`;
    }).join('');

    const items = [
      [st.done === st.planned && st.planned > 0, `التمارين <span class="num">${st.done}/${st.planned}</span>`],
      [log.steps >= stepT, `الخطوات <span class="num">${fmtN(log.steps)}</span> من <span class="num">${fmtN(stepT)}</span>`],
      [log.painDuring != null, 'ألم التمارين' + (log.painDuring != null ? ` <span class="num">${log.painDuring}/10</span>` : '')],
      [log.painMorning != null, 'ألم الصبح (أول خطوات)'],
      [log.weight != null, 'الوزن' + (log.weight != null ? ` <span class="num">${log.weight}</span> كغم` : '')],
      [log.sleep != null, 'النوم' + (log.sleep != null ? ` <span class="num">${log.sleep}</span> ساعة` : '')],
      [(log.water || 0) >= p.waterTarget, `الماء <span class="num">${log.water || 0}/${p.waterTarget}</span> لتر`],
      [dayProtein(log) >= e.protein * .9, `البروتين <span class="num">${fmtN(dayProtein(log))}/${e.protein}</span> غ`]
    ];
    if (isFriday(t)) items.push([!!log.vitD, 'فيتامين D الأسبوعي']);

    return `
    <div class="page-head"><div><h1>${greet}، ${esc(p.name.split(' ')[0])}</h1>
      <p>${weekday(t)} ${fmtD(t, { day: 'numeric', month: 'long', year: 'numeric' })} · ${hijri(t)}</p></div>
      <a class="btn primary" href="#log/${t}">${ic('log')} سجّل اليوم</a></div>
    ${alerts.length ? `<div class="stack" style="margin-bottom:16px">${alerts.map(([c, i, m]) => `<div class="alert ${c}">${ic(i)}<div>${m}</div></div>`).join('')}</div>` : ''}
    <div class="hero">
      <section class="card cycle-card">
        <div class="cycle-top">
          <div><div class="sub">الدورة الحالية بين استشارتين · ${esc(ph?.name || '')}</div>
            <div class="big num">${cy.day}<small>/ ${cy.len} يوم</small></div></div>
          <div style="text-align:end">
            <span class="pill ${adh == null ? '' : adh >= .85 ? 'ok' : adh >= .6 ? 'warn' : 'bad'}">الالتزام <span class="num">${adh == null ? '—' : r0(adh * 100) + '%'}</span></span>
            <div class="muted" style="margin-top:6px">${fmtD(cy.start)} ← ${fmtD(cy.end)}</div>
            ${unlogged ? `<div class="muted">${unlogged} يوم بدون تسجيل بهذي الدورة</div>` : ''}
            ${p.nextConsult ? `<div class="muted">الاستشارة القادمة: <b>${fmtD(p.nextConsult)}</b> (بعد ${diffDays(t, p.nextConsult)} يوم)</div>` : ''}
          </div>
        </div>
        <div class="strip">${strip}</div>
        <div class="legend"><span><i style="background:var(--accent)"></i>نسبة إنجاز التمارين</span><span><i style="background:var(--ok);border-radius:50%"></i>ألم ضمن الحد</span><span><i style="background:var(--warn);border-radius:50%"></i>فوق الحد قليلاً</span><span><i style="background:var(--bad);border-radius:50%"></i>فوق الحد</span></div>
        <div class="row" style="margin-top:14px"><a class="btn sm" href="#report">${ic('report')} تقرير هذه الدورة</a><span class="muted">حد الألم بهذه المرحلة: <b class="num">${ph?.painLimit ?? '—'}</b> من 10</span></div>
      </section>
      <section class="card"><h2>مهام اليوم <a class="btn sm" href="#log/${t}">فتح</a></h2>
        <ul class="check-list">${items.map(([ok, l]) => `<li><span class="tick ${ok ? 'on' : ''}">${ok ? ic('check', 'width="15" height="15" stroke-width="3"') : ''}</span><span>${l}</span></li>`).join('')}</ul>
      </section>
    </div>
    <div class="grid g4" style="margin-top:16px">
      <section class="card kpi"><div class="lbl">الوزن الحالي</div><div class="val num">${fmtN(w, 1)} <small>كغم</small></div>
        <div class="delta muted">${lost > 0 ? 'نزلت ' + fmtN(lost, 1) + ' كغم' : 'نقطة البداية ' + p.startWeight + ' كغم'} · باقي ${fmtN(toGo, 1)} للهدف ${p.goalWeight}</div>
        <div class="meter" title="التقدم نحو الهدف"><div style="width:${prog * 100}%"></div></div></section>
      <section class="card kpi"><div class="lbl">معدل الخطوات (7 أيام)</div><div class="val num">${fmtN(steps7)}</div>
        <div class="delta muted">الهدف بهذه المرحلة ${fmtN(stepT)}</div>
        <div class="meter"><div style="width:${Math.min(100, (steps7 || 0) / stepT * 100)}%"></div></div></section>
      <section class="card kpi"><div class="lbl">أعلى ألم (7 أيام)</div><div class="val num" style="color:${painColor(maxPain7, ph?.painLimit)}">${maxPain7 ?? '—'}<small> /10</small></div>
        <div class="delta muted">الحد المسموح ${ph?.painLimit ?? '—'} · أيام فوق الحد: ${over.length}</div></section>
      <section class="card kpi"><div class="lbl">هدف السعرات اليومي</div><div class="val num">${fmtN(e.target)} <small>سعرة</small></div>
        <div class="delta muted">بروتين ${e.protein} غ · ماء ${p.waterTarget} لتر · نوم ${p.sleepTarget} ساعات</div></section>
    </div>
    <div class="grid g2" style="margin-top:16px">
      <section class="card"><div class="chart-title"><h2 style="margin:0">الخطوات — آخر 14 يوم</h2><span class="muted">الخط المتقطع = هدف المرحلة</span></div>
        ${chart({ type: 'bar', data: dateRange(addDays(t, -13), t).map(d => ({ x: d, y: D.logs[d]?.steps ?? null })), refs: [{ y: stepT, label: fmtN(stepT) }], h: 200, label: 'الخطوات', tip: d => d.y == null ? `${fmtD(d.x)}: غير مسجل` : `${weekday(d.x)} ${fmtD(d.x)}<br><b>${fmtN(d.y)}</b> خطوة` })}</section>
      <section class="card"><div class="chart-title"><h2 style="margin:0">ألم الوتر — آخر 14 يوم</h2><span class="muted">أعلى ألم مسجل باليوم</span></div>
        ${chart({ type: 'line', data: dateRange(addDays(t, -13), t).map(d => { const s = dayStats(d); return { x: d, y: s.painMax, yc: painColor(s.painMax, s.limit), m: s.painMorning }; }), yMin: 0, yMax: 10, ticks: [0, 2, 4, 6, 8, 10], refs: [{ y: ph?.painLimit ?? 0, label: 'الحد', color: 'var(--ok)' }], h: 200, label: 'الألم', tip: d => `${fmtD(d.x)}<br>تمارين: <b>${d.y ?? '—'}</b> · صبح: <b>${d.m ?? '—'}</b>` })}</section>
    </div>`;
  }
};

/* ---------- السجل اليومي ---------- */
VIEWS.log = {
  html(arg) {
    const d = arg && /^\d{4}-\d\d-\d\d$/.test(arg) ? arg : today();
    const log = getLog(d), ph = phaseFor(d), exs = activeEx(ph), p = D.profile;
    const e = energy(currentWeight());
    const lim = ph?.painLimit ?? 0;
    const scale = (k, label, hint) => `<div class="scale-wrap" data-scale="${k}"><div class="sl"><span>${label}</span><span class="num" data-v>${log[k] ?? '—'}</span></div>
      ${hint ? `<div class="muted">${hint}</div>` : ''}
      <div class="scale" role="group" aria-label="${label}">${Array.from({ length: 11 }, (_, i) => `<button type="button" data-v="${i}" aria-pressed="${log[k] === i}" style="${log[k] === i ? `background:${painColor(i, lim)}` : ''}">${i}</button>`).join('')}</div></div>`;
    const exRows = exs.map(x => {
      const v = log.ex?.[x.id] || {};
      const state = v.d === true ? 'done' : v.d === false ? 'skip' : 'none';
      return `<div class="ex-row" data-ex="${x.id}">
        <button type="button" class="ex-check" aria-pressed="${state === 'done'}" data-state="${state}" aria-label="${esc(x.name)}">${state === 'skip' ? ic('x', 'stroke-width="3"') : ic('check', 'stroke-width="3"')}</button>
        <div><div class="ex-name">${esc(x.name)}</div><div class="ex-meta"><span class="num">${esc(x.dose)}</span> · ${esc(x.goal)} ${x.video ? `· <a href="${esc(x.video)}" target="_blank" rel="noopener">${ic('play', 'width="13" height="13" style="vertical-align:-1px"')} الفيديو</a>` : ''}</div></div>
        <div class="ex-pain"><select aria-label="ألم ${esc(x.name)}"><option value="">ألم —</option>${Array.from({ length: 11 }, (_, i) => `<option value="${i}" ${v.p === i ? 'selected' : ''}>ألم ${i}</option>`).join('')}</select></div>
      </div>`;
    }).join('');
    const slots = Object.entries(MEAL_SLOTS).map(([sk, sl]) => {
      const allow = { b: ['b'], l: ['l'], d: ['b', 'd'], x: ['x'] }[sk];
      const tpls = D.meals.filter(m => allow.includes(m.slot));
      const chosen = (log.meals || []).filter(m => m.s === sk);
      return `<div class="meal-slot" data-slot="${sk}"><h4><span>${sl}</span><span class="muted num">${fmtN(sum(chosen.map(c => mealById(c.m) ? mealTotals(mealById(c.m)).kcal * c.q : 0)))} سعرة</span></h4>
        <div class="chips">${tpls.map(m => `<button type="button" class="chip" data-meal="${m.id}" aria-pressed="${chosen.some(c => c.m === m.id)}">${esc(m.name)}</button>`).join('')}</div>
        ${chosen.map(c => { const m = mealById(c.m); if (!m) return ''; return `<div class="meal-line"><span style="flex:1">${esc(m.name)}</span><span class="muted">الكمية</span>
          <span class="stepper" data-q="${c.m}"><button type="button" data-d="-0.5">−</button><input type="number" step="0.5" min="0" value="${c.q}"><button type="button" data-d="0.5">+</button></span></div>`; }).join('')}
      </div>`;
    }).join('');
    const n = dayNutrition(log);
    const extras = (log.extra || []).map((x, i) => { const f = foodById(x.f); return `<div class="meal-line" data-xi="${i}"><span style="flex:1">${esc(f?.name || x.f)}</span><span class="num">${f?.unitG ? r1(x.g / f.unitG) + ' ' + f.unit : x.g + ' غ'}</span><span class="muted num">${fmtN(f ? f.kcal * x.g / 100 : 0)} سعرة</span><button class="btn sm iconbtn danger" data-delx="${i}" aria-label="حذف">${ic('trash')}</button></div>`; }).join('');

    return `
    <div class="page-head"><div><h1>السجل اليومي</h1><p>${weekday(d)} ${fmtD(d, { day: 'numeric', month: 'long', year: 'numeric' })} · ${hijri(d)}</p></div>
      <div class="datebar"><a class="btn iconbtn" href="#log/${addDays(d, -1)}" aria-label="اليوم السابق">${ic('prev')}</a>
      <input type="date" id="logDate" value="${d}" max="${addDays(today(), 1)}">
      <a class="btn iconbtn" href="#log/${addDays(d, 1)}" aria-label="اليوم التالي">${ic('next')}</a>
      ${d !== today() ? `<a class="btn sm" href="#log/${today()}">اليوم</a>` : ''}<span class="saved" id="saved">${ic('check', 'width="14" height="14"')} حُفظ</span></div></div>

    <div class="grid g2" style="align-items:start">
      <div class="stack">
        <section class="card"><h2><span>التمارين العلاجية</span><span class="pill acc">${esc(ph ? ph.name.split('—')[0].trim() : 'لا توجد مرحلة')}</span></h2>
          ${exs.length ? `<div class="row" style="margin-bottom:6px"><button class="btn sm" id="allDone">${ic('check')} أنجزت الكل</button><button class="btn sm" id="clearEx">مسح</button><span class="muted">اضغط مرة = تم، مرتين = ما سويته، ثلاث = بدون تسجيل</span></div>${exRows}` : '<p class="muted">لا توجد مرحلة علاجية بهذا التاريخ.</p>'}
        </section>
        <section class="card"><h2><span>ألم الوتر الرضفي</span><span class="pill ${lim === 0 ? 'ok' : 'warn'}">الحد ${lim} من 10</span></h2>
          ${scale('painDuring', 'أعلى ألم أثناء/بعد التمارين', '')}
          ${scale('painMorning', 'ألم الصبح (أول خطوات بعد النوم)', 'هذا أهم مؤشر: يبيّن استجابة الوتر للحمل خلال 24 ساعة')}
          ${scale('painDaily', 'ألم النشاط اليومي (درج، جلوس طويل، مشي)', '')}
          <div id="painAlert"></div>
        </section>
        <section class="card"><h2>ملاحظات اليوم</h2>
          <textarea id="notes" placeholder="أي إحساس، مكان الألم، تمرين صعب، شي تريد تسأل عنه الدكتور...">${esc(log.notes || '')}</textarea>
          <label class="row" style="margin-top:8px"><input type="checkbox" id="flag" ${log.flag ? 'checked' : ''} style="width:20px;height:20px"> مهمة للدكتور (تظهر مميّزة بالتقرير)</label>
        </section>
      </div>
      <div class="stack">
        <section class="card"><h2>الحركة والجسم</h2>
          <div class="grid g2">
            <label class="f">الخطوات (من Fitbit)<input type="number" inputmode="numeric" id="steps" value="${log.steps ?? ''}" placeholder="مثلاً 7000"></label>
            <label class="f">الوزن (كغم)<input type="number" inputmode="decimal" step="0.1" id="weight" value="${log.weight ?? ''}" placeholder="آخر وزن ${fmtN(currentWeight(), 1)}"></label>
            <label class="f">النوم (ساعات)<input type="number" inputmode="decimal" step="0.5" id="sleep" value="${log.sleep ?? ''}"></label>
            <label class="f">محيط الخصر (سم، أسبوعي)<input type="number" inputmode="decimal" step="0.5" id="waist" value="${log.waist ?? ''}"></label>
          </div>
          <div class="row" style="margin-top:14px"><span class="f" style="font-size:13px;color:var(--ink-2)">الماء (لتر)</span>
            <span class="stepper" id="water"><button type="button" data-d="-0.25">−</button><input type="number" step="0.25" min="0" value="${log.water ?? 0}"><button type="button" data-d="0.25">+</button></span>
            <span class="muted">الهدف ${p.waterTarget} لتر</span></div>
          <label class="row" style="margin-top:14px;${isFriday(d) ? 'font-weight:600' : ''}"><input type="checkbox" id="vitD" ${log.vitD ? 'checked' : ''} style="width:22px;height:22px"> أخذت فيتامين D (50,000 IU) ${isFriday(d) ? '<span class="pill acc">اليوم جمعة</span>' : ''}</label>
        </section>
        <section class="card"><h2><span>الأكل</span><button class="btn sm" id="usual">أكلي المعتاد</button></h2>
          ${slots}
          <div class="meal-slot"><h4><span>أكل إضافي (بالغرام أو الحبة)</span></h4>
            ${extras}
            <div class="meal-line"><select id="xFood" style="flex:2;min-width:150px">${D.foods.map(f => `<option value="${f.id}">${esc(f.name)}</option>`).join('')}</select>
            <input type="number" id="xAmt" inputmode="decimal" placeholder="الكمية" style="flex:1;min-width:80px"><span class="muted" id="xUnit"></span>
            <button class="btn sm" id="xAdd">${ic('plus')} إضافة</button></div>
          </div>
          <div class="sumbar" style="margin-top:12px">
            <div><b class="num">${fmtN(n.kcal)}</b><span>سعرة تقديرية / ${fmtN(e.target)}</span></div>
            <div><b class="num">${fmtN(n.p)}</b><span>بروتين تقديري (غ) / ${e.protein}</span></div>
            <div><b class="num">${fmtN(n.c)}</b><span>كاربوهيدرات (غ)</span></div>
            <div><b class="num">${fmtN(n.f)}</b><span>دهون (غ)</span></div>
          </div>
          <div class="grid g2" style="margin-top:12px">
            <label class="f">البروتين حسب حسابك (غ) — اختياري<input type="number" inputmode="numeric" id="protein" value="${log.protein ?? ''}" placeholder="${fmtN(n.p)}"></label>
            <label class="f">السعرات حسب حسابك — اختياري<input type="number" inputmode="numeric" id="kcal" value="${log.kcal ?? ''}" placeholder="${fmtN(n.kcal)}"></label>
          </div>
        </section>
      </div>
    </div>`;
  },
  bind(root, arg) {
    const d = arg && /^\d{4}-\d\d-\d\d$/.test(arg) ? arg : today();
    let log = getLog(d);
    const ph = phaseFor(d), lim = ph?.painLimit ?? 0;
    let t;
    const commit = (rerender) => {
      saveLog(log);
      const s = $('#saved'); s.classList.add('show'); clearTimeout(t); t = setTimeout(() => s.classList.remove('show'), 1400);
      if (rerender) { const y = window.scrollY; route(); window.scrollTo(0, y); }
      else painAlert();
    };
    const painAlert = () => {
      const msgs = [];
      if (log.painDuring != null && log.painDuring > lim) msgs.push(`ألم التمارين (${log.painDuring}) فوق الحد المسموح (${lim}).`);
      if (log.painMorning != null && log.painMorning > lim) msgs.push(`ألم الصبح (${log.painMorning}) فوق الحد — الوتر ما تحمّل حمل أمس بالكامل.`);
      const exOver = Object.entries(log.ex || {}).filter(([, v]) => v.p != null && v.p > lim);
      if (exOver.length) msgs.push(`تمارين سببت ألم فوق الحد: ${exOver.map(([id]) => ph?.exercises.find(e => e.id === id)?.name).join('، ')}.`);
      $('#painAlert').innerHTML = msgs.length ? `<div class="alert bad">${ic('alert')}<div>${msgs.join('<br>')}<br><b>القاعدة:</b> لا تزيد الحمل (خطوات، تكرارات) لحد ما يرجع الألم ضمن الحد، وبلّغ د. أصيل.</div></div>` : '';
    };
    painAlert();
    $('#logDate').onchange = e => { if (e.target.value) location.hash = '#log/' + e.target.value; };
    $$('.ex-row', root).forEach(row => {
      const id = row.dataset.ex;
      $('.ex-check', row).onclick = () => {
        log.ex = log.ex || {}; const v = log.ex[id] || { d: null, p: null };
        v.d = v.d === null || v.d === undefined ? true : v.d === true ? false : null;
        log.ex[id] = v; commit(true);
      };
      $('select', row).onchange = e => { log.ex = log.ex || {}; const v = log.ex[id] || { d: null, p: null }; v.p = num(e.target.value); log.ex[id] = v; commit(); };
    });
    const ad = $('#allDone'); if (ad) ad.onclick = () => { log.ex = log.ex || {}; activeEx(ph).forEach(x => { log.ex[x.id] = { ...(log.ex[x.id] || { p: null }), d: true }; }); commit(true); };
    const ce = $('#clearEx'); if (ce) ce.onclick = () => { log.ex = {}; commit(true); };
    $$('[data-scale]', root).forEach(w => {
      const k = w.dataset.scale;
      $$('button', w).forEach(b => b.onclick = () => {
        const v = +b.dataset.v; log[k] = log[k] === v ? null : v;
        $$('button', w).forEach(x => { const on = +x.dataset.v === log[k]; x.setAttribute('aria-pressed', on); x.style.background = on ? painColor(+x.dataset.v, lim) : ''; });
        $('[data-v]', w).textContent = log[k] ?? '—';
        commit();
      });
    });
    for (const k of ['steps', 'weight', 'sleep', 'waist', 'protein', 'kcal']) $('#' + k).addEventListener('change', e => { log[k] = num(e.target.value); commit(k === 'protein' || k === 'kcal'); });
    $('#notes').addEventListener('input', e => { log.notes = e.target.value; clearTimeout(VIEWS.log._n); VIEWS.log._n = setTimeout(() => commit(), 500); });
    $('#flag').onchange = e => { log.flag = e.target.checked; commit(); };
    $('#vitD').onchange = e => { log.vitD = e.target.checked; commit(); };
    const stepper = (el, get, set) => {
      const inp = $('input', el);
      $$('button', el).forEach(b => b.onclick = () => { const v = Math.max(0, r1((num(inp.value) || 0) + +b.dataset.d)); inp.value = v; set(v); });
      inp.onchange = () => set(Math.max(0, num(inp.value) || 0));
    };
    stepper($('#water'), null, v => { log.water = v; commit(); });
    $$('.meal-slot[data-slot]', root).forEach(sl => {
      const sk = sl.dataset.slot;
      $$('.chip', sl).forEach(c => c.onclick = () => {
        log.meals = log.meals || [];
        const i = log.meals.findIndex(m => m.s === sk && m.m === c.dataset.meal);
        if (i >= 0) log.meals.splice(i, 1); else log.meals.push({ s: sk, m: c.dataset.meal, q: 1 });
        commit(true);
      });
      $$('[data-q]', sl).forEach(st => stepper(st, null, v => {
        const m = log.meals.find(m => m.s === sk && m.m === st.dataset.q); if (m) m.q = v;
        if (v === 0) log.meals = log.meals.filter(x => x !== m);
        commit(true);
      }));
    });
    $('#usual').onclick = () => {
      const has = id => D.meals.some(m => m.id === id);
      log.meals = [['b', 'm_pizza'], ['l', 'm_chard'], ['d', 'm_pizza'], ['x', 'm_tea']].filter(([, m]) => has(m)).map(([s, m]) => ({ s, m, q: 1 }));
      commit(true);
    };
    const unitLbl = () => { const f = foodById($('#xFood').value); $('#xUnit').textContent = f?.unit ? f.unit : 'غرام'; };
    $('#xFood').onchange = unitLbl; unitLbl();
    $('#xAdd').onclick = () => {
      const f = foodById($('#xFood').value), a = num($('#xAmt').value);
      if (!f || !a) { toast('اكتب الكمية'); return; }
      log.extra = log.extra || []; log.extra.push({ f: f.id, g: f.unitG ? a * f.unitG : a }); commit(true);
    };
    $$('[data-delx]', root).forEach(b => b.onclick = () => { log.extra.splice(+b.dataset.delx, 1); commit(true); });
  }
};

/* ---------- البرنامج العلاجي ---------- */
VIEWS.program = {
  html() {
    const cur = currentPhase();
    const phases = phasesSorted().reverse();
    return `
    <div class="page-head"><div><h1>البرنامج العلاجي</h1><p>برنامج د. أصيل كما هو. أي تعديل بالتمارين أو انتقال لمرحلة جديدة يكون بقراره بعد الاستشارة.</p></div>
      <div class="row"><button class="btn" id="addConsult">${ic('plus')} تسجيل استشارة</button><button class="btn primary" id="addPhase">${ic('plus')} مرحلة جديدة</button></div></div>
    <section class="card" style="margin-bottom:16px"><h2>الاستشارات مع د. أصيل
      <span class="row"><span class="muted">القادمة:</span><input type="date" id="nextC" value="${D.profile.nextConsult || ''}" style="width:auto;min-height:38px"></span></h2>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>التاريخ</th><th>العنوان</th><th>ما تقرر</th><th></th></tr></thead><tbody>
      ${[...D.consults].sort((a, b) => a.date < b.date ? 1 : -1).map(c => `<tr><td class="num" style="white-space:nowrap">${c.date}</td><td><b>${esc(c.title)}</b></td><td>${esc(c.notes)}</td><td><button class="btn sm iconbtn" data-ec="${c.id}" aria-label="تعديل">${ic('edit')}</button></td></tr>`).join('')}
      </tbody></table></div></section>
    ${phases.map(ph => `
      <section class="card" style="margin-bottom:16px">
        <h2><span>${esc(ph.name)} ${ph === cur ? '<span class="pill acc">الحالية</span>' : ph.end && ph.end < today() ? '<span class="pill">منتهية</span>' : ''}</span>
          <span class="row"><button class="btn sm" data-ep="${ph.id}">${ic('edit')} تعديل</button><button class="btn sm" data-ax="${ph.id}">${ic('plus')} تمرين</button></span></h2>
        <div class="row" style="margin-bottom:10px">
          <span class="pill">${fmtD(ph.start, { day: 'numeric', month: 'short', year: 'numeric' })} ← ${ph.end ? fmtD(ph.end, { day: 'numeric', month: 'short', year: 'numeric' }) : 'مستمرة'}</span>
          <span class="pill ${ph.painLimit === 0 ? 'ok' : 'warn'}">حد الألم ${ph.painLimit}/10</span>
          <span class="pill">هدف الخطوات ${fmtN(ph.stepTarget)}</span></div>
        <p class="sub" style="margin:0 0 8px">${esc(ph.goal || '')}</p>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th>#</th><th>التمرين</th><th>الجرعة</th><th>الهدف الوظيفي</th><th class="c">الفيديو</th><th class="c">ضمن المتابعة</th><th></th></tr></thead><tbody>
        ${ph.exercises.map((x, i) => `<tr style="${x.active === false ? 'opacity:.55' : ''}"><td class="num">${i + 1}</td><td dir="ltr" style="text-align:right"><b>${esc(x.name)}</b></td><td class="num">${esc(x.dose)}</td><td>${esc(x.goal)}</td>
          <td class="c">${x.video ? `<a class="btn sm iconbtn" href="${esc(x.video)}" target="_blank" rel="noopener" aria-label="فيديو">${ic('play')}</a>` : ''}</td>
          <td class="c">${x.active === false ? 'لا' : 'نعم'}</td><td><button class="btn sm iconbtn" data-ex="${ph.id}|${x.id}" aria-label="تعديل">${ic('edit')}</button></td></tr>`).join('')}
        </tbody></table></div>
      </section>`).join('')}`;
  },
  bind(root) {
    $('#nextC').onchange = e => { D.profile.nextConsult = e.target.value; saveCfg(); toast('تم حفظ موعد الاستشارة'); };
    const consultForm = c => formDialog({
      title: c ? 'تعديل استشارة' : 'تسجيل استشارة جديدة',
      fields: [{ k: 'date', label: 'التاريخ', type: 'date', def: today() }, { k: 'title', label: 'العنوان' }, { k: 'notes', label: 'ما قرره الدكتور / ملاحظات الجلسة', type: 'textarea' }],
      values: c || {},
      onSave: v => { if (!v.date) return false; if (c) Object.assign(c, v); else D.consults.push({ id: uid('c'), ...v }); if (D.profile.nextConsult && D.profile.nextConsult <= v.date) D.profile.nextConsult = ''; saveCfg(); route(); },
      onDelete: c ? () => { D.consults = D.consults.filter(x => x !== c); saveCfg(); route(); } : null
    });
    $('#addConsult').onclick = () => consultForm(null);
    $$('[data-ec]', root).forEach(b => b.onclick = () => consultForm(D.consults.find(c => c.id === b.dataset.ec)));
    const phaseFields = [{ k: 'name', label: 'اسم المرحلة' }, { k: 'nameEn', label: 'الاسم بالإنكليزي (للتقرير)', dir: 'ltr' }, { k: 'start', label: 'تاريخ البداية', type: 'date' }, { k: 'end', label: 'تاريخ النهاية (فارغ = مستمرة)', type: 'date' },
      { k: 'painLimit', label: 'حد الألم المسموح (0–10)', type: 'number' }, { k: 'stepTarget', label: 'هدف الخطوات اليومي', type: 'number' }, { k: 'goal', label: 'هدف المرحلة', type: 'textarea' }];
    $$('[data-ep]', root).forEach(b => b.onclick = () => {
      const ph = D.phases.find(p => p.id === b.dataset.ep);
      formDialog({ title: 'تعديل المرحلة', fields: phaseFields, values: ph, onSave: v => { Object.assign(ph, v); saveCfg(); route(); },
        onDelete: D.phases.length > 1 ? () => { D.phases = D.phases.filter(p => p !== ph); saveCfg(); route(); } : null });
    });
    $('#addPhase').onclick = () => {
      const cur = currentPhase();
      formDialog({ title: 'مرحلة جديدة (بعد قرار د. أصيل)', fields: [...phaseFields, { k: 'copy', label: 'انسخ تمارين المرحلة الحالية كبداية (تعدلها بعدين)', type: 'checkbox', def: true }],
        values: { name: 'المرحلة ' + (D.phases.length + 1), start: today(), painLimit: cur?.painLimit ?? 0, stepTarget: cur?.stepTarget ?? 7000, copy: true },
        onSave: v => {
          if (!v.start) return false;
          const exs = v.copy && cur ? cur.exercises.map(x => ({ ...x, id: uid('x') })) : [];
          delete v.copy;
          if (cur && !cur.end && cur.start < v.start) cur.end = addDays(v.start, -1);
          D.phases.push({ id: uid('p'), ...v, exercises: exs }); saveCfg(); route();
        } });
    };
    const exFields = [{ k: 'name', label: 'اسم التمرين (إنكليزي كما أرسله الدكتور)', dir: 'ltr' }, { k: 'short', label: 'اختصار للجدول (مثلاً TKE)', dir: 'ltr' }, { k: 'dose', label: 'الجرعة (مثلاً 2 × 15 أو 10 × 10 ث)' },
      { k: 'goal', label: 'الهدف الوظيفي', type: 'textarea' }, { k: 'video', label: 'رابط الفيديو', type: 'url', dir: 'ltr' }, { k: 'active', label: 'ضمن المتابعة اليومية', type: 'checkbox', def: true }];
    $$('[data-ax]', root).forEach(b => b.onclick = () => {
      const ph = D.phases.find(p => p.id === b.dataset.ax);
      formDialog({ title: 'تمرين جديد', fields: exFields, values: { active: true }, onSave: v => { if (!v.name) return false; ph.exercises.push({ id: uid('x'), ...v }); saveCfg(); route(); } });
    });
    $$('[data-ex]', root).forEach(b => b.onclick = () => {
      const [pid, xid] = b.dataset.ex.split('|'); const ph = D.phases.find(p => p.id === pid); const x = ph.exercises.find(e => e.id === xid);
      formDialog({ title: 'تعديل التمرين', fields: exFields, values: x, onSave: v => { Object.assign(x, v); saveCfg(); route(); },
        onDelete: () => { ph.exercises = ph.exercises.filter(e => e !== x); saveCfg(); route(); } });
    });
  }
};

/* ---------- خطة التعافي ---------- */
VIEWS.plan = {
  html() {
    const t = today(), p = D.profile, w = currentWeight(), ph = currentPhase();
    const phs = phasesSorted();
    const future = [
      ['تحميل ثقيل بطيء (Heavy Slow Resistance)', 'سكوات وليك برس ورفعة سمانة بأوزان أثقل وإيقاع بطيء (3 ثواني نزول، 3 صعود)، 3 مرات بالأسبوع. هذي المرحلة اللي تبني قوة الوتر فعلياً. يحددها د. أصيل.'],
      ['تخزين الطاقة (Energy storage)', 'إدخال القفز الخفيف والحبل وتغيير الاتجاه تدريجياً، لأن الوتر الرضفي "نابض" يخزن الطاقة ويطلقها. تبدأ بس لما يكون ألم السكوات بساق وحدة ضمن الحد.'],
      ['الرجوع للجري ثم الكرة', 'جري خفيف متقطع، ثم تمارين كرة بدون التحام، ثم تدريب كامل، ثم مباراة. معيار الانتقال: لا ألم بالصبح، وقوة الرجلين متقاربة (فرق أقل من 10%).']
    ];
    const rate = p.rate || 0.6;
    const ms = [80, 75, 70, p.goalWeight].filter((v, i, a) => v < w && a.indexOf(v) === i).sort((a, b) => b - a);
    const eta = target => addDays(t, Math.ceil((w - target) / rate * 7));
    return `
    <div class="page-head"><div><h1>خطة التعافي</h1><p>المسار الكامل من التأهيل للرجوع للكرة، والروتين اليومي، وخطة الوزن.</p></div></div>
    <div class="grid g2" style="align-items:start">
      <section class="card"><h2>مسار التأهيل</h2>
        <div class="roadmap">
          ${phs.map(x => { const done = x.end && x.end < t, now = x === ph; return `<div class="rm-step ${done ? 'done' : ''} ${now ? 'now' : ''}"><span class="node"></span><h3>${esc(x.name)}</h3><p>${fmtD(x.start)} ← ${x.end ? fmtD(x.end) : 'مستمرة'} · حد الألم ${x.painLimit} · ${fmtN(x.stepTarget)} خطوة</p><p>${esc(x.goal || '')}</p></div>`; }).join('')}
          ${future.map(([a, b]) => `<div class="rm-step"><span class="node"></span><h3>${a} <span class="pill">لاحقاً، بقرار الدكتور</span></h3><p>${b}</p></div>`).join('')}
        </div>
        <div class="alert info" style="margin-top:4px">${ic('info')}<div>المراحل اللاحقة مأخوذة من البروتوكولات المنشورة لعلاج التهاب الوتر الرضفي (تحميل تدريجي على 4 مراحل)، وموجودة هنا للفهم فقط. التوقيت والتمارين يقررها د. أصيل.</div></div>
      </section>
      <div class="stack">
        <section class="card"><h2>الروتين اليومي المقترح</h2>
          <div class="day-plan">
            <div class="t">الصبح</div><div>سجّل ألم أول خطوات بعد النوم (0–10)، وبعدها الوزن بعد الحمام وقبل الأكل.</div>
            <div class="t">الريوك</div><div>بيتزا الخضار والبيض. أضف لها مصدر بروتين (لبن مصفى أو جبن).</div>
            <div class="t">الدوام</div><div>قوم كل 30–45 دقيقة. لا تكعد طويلاً والركبة مثنية 90°، ومد رجلك تحت الميز.</div>
            <div class="t">المشي</div><div>قسّم الخطوات على 2–3 فترات بدل ما تمشيها مرة وحدة. على أرض مستوية، وبحذاء مريح.</div>
            <div class="t">الغداء</div><div>السلك أو الخباز، ويا مصدر بروتين (دجاج، سمك، عدس، تونة).</div>
            <div class="t">التمارين</div><div>جلسة تمارين د. أصيل كاملة، وسجّل ألم كل تمرين. الوقت المثالي بعد الغداء بساعتين أو بعد العصر.</div>
            <div class="t">العصر</div><div>الوجبة الثالثة، وبعدها شاي بالحليب.</div>
            <div class="t">الليل</div><div>نوم 7–9 ساعات. النوم هو وقت ترميم الكولاجين وإفراز هرمون النمو.</div>
            <div class="t">الجمعة</div><div>فيتامين D (50,000 IU)، وقياس محيط الخصر، ومراجعة الأسبوع.</div>
          </div>
        </section>
        <section class="card"><h2>خطة الوزن</h2>
          <p class="sub" style="margin-top:0">من <b class="num">${fmtN(w, 1)}</b> إلى <b class="num">${p.goalWeight}</b> كغم بمعدل <b class="num">${rate}</b> كغم بالأسبوع (يتغير من الإعدادات).</p>
          <table class="tbl"><thead><tr><th>المحطة</th><th>المتبقي</th><th>التاريخ المتوقع</th></tr></thead><tbody>
          ${ms.map(m => `<tr><td class="num"><b>${m}</b> كغم</td><td class="num">${fmtN(w - m, 1)} كغم</td><td>${fmtD(eta(m), { day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>`).join('')}
          </tbody></table>
          <div class="alert warn" style="margin-top:12px">${ic('info')}<div>وزنك وقت ما كنت تلعب وتتمرن كان ${p.fitWeight} كغم وبيه كتلة عضلية. هدف ${p.goalWeight} أقل منه، فلما توصل حدود 70 راجع محيط الخصر وشكل الجسم قبل لا تكمل. النزول الصحيح يحافظ على العضل، وهذا أهم من الرقم.</div></div>
        </section>
        <section class="card"><h2>قواعد زيادة الحمل</h2>
          <ul style="margin:0;padding-inline-start:20px">
            <li>تزيد الخطوات أو التكرارات بس إذا كان ألم الصبح ضمن الحد يومين متتاليين.</li>
            <li>الزيادة تكون حوالي 10% بالأسبوع كحد أعلى (مثلاً 7000 ← 7700).</li>
            <li>إذا ارتفع ألم الصبح عن الحد: ارجع لحمل اليوم اللي قبله، وبلّغ الدكتور.</li>
            <li>يوم المشي الكثير (8000+) لا تضيف عليه درج عالي أو وقوف طويل.</li>
          </ul>
        </section>
      </div>
    </div>`;
  }
};

/* ---------- التغذية ---------- */
VIEWS.nutrition = {
  html() {
    const p = D.profile, w = currentWeight(), e = energy(w);
    const typical = ['m_pizza', 'm_chard', 'm_pizza', 'm_tea'].map(mealById).filter(Boolean);
    const tt = typical.reduce((a, m) => { const x = mealTotals(m); for (const k in a) a[k] += x[k]; return a; }, { kcal: 0, p: 0, c: 0, f: 0 });
    const sug = ['m_pizza_p', 'm_chard_p', 'm_tuna', 'm_tea'].map(mealById).filter(Boolean);
    const st = sug.reduce((a, m) => { const x = mealTotals(m); for (const k in a) a[k] += x[k]; return a; }, { kcal: 0, p: 0, c: 0, f: 0 });
    const last14 = dateRange(addDays(today(), -13), today()).map(d => D.logs[d]);
    const k14 = avg(last14.map(dayKcal)), p14 = avg(last14.map(dayProtein));
    const row = (l, a, b, unit) => `<tr><td>${l}</td><td class="num">${fmtN(a)} ${unit}</td><td class="num">${fmtN(b)} ${unit}</td></tr>`;
    return `
    <div class="page-head"><div><h1>التغذية</h1><p>الحساب تقريبي ومقصود يكون بسيط. الهدف تنزل دهون وتحافظ على العضل وتغذي الوتر.</p></div></div>
    <div class="grid g3">
      <section class="card kpi"><div class="lbl">الأيض الأساسي BMR</div><div class="val num">${fmtN(e.bmr)} <small>سعرة</small></div><div class="delta muted">اللي يحرقه جسمك وانت مرتاح (Mifflin-St Jeor)</div></section>
      <section class="card kpi"><div class="lbl">الحرق اليومي الكلي TDEE</div><div class="val num">${fmtN(e.tdee)} <small>سعرة</small></div><div class="delta muted">BMR × ${p.activity} (دوام مكتبي + ${fmtN(currentPhase()?.stepTarget || 7000)} خطوة + تمارين)</div></section>
      <section class="card kpi"><div class="lbl">هدفك اليومي</div><div class="val num" style="color:var(--accent)">${fmtN(e.target)} <small>سعرة</small></div><div class="delta muted">عجز ${p.deficit} سعرة ≈ ${r1(p.deficit * 7 / 7700)} كغم دهون بالأسبوع</div></section>
    </div>
    <div class="grid g2" style="margin-top:16px;align-items:start">
      <section class="card"><h2>الماكروز اليومية</h2>
        <table class="tbl"><tbody>
          <tr><td><b>البروتين</b></td><td class="num"><b>${e.protein}</b> غ</td><td class="muted">${p.proteinPerKg} غ/كغم. يحمي العضل ويبني كولاجين الوتر.</td></tr>
          <tr><td><b>الدهون</b></td><td class="num">~${e.fat} غ</td><td class="muted">28% من السعرات. ضرورية للهرمونات.</td></tr>
          <tr><td><b>الكاربوهيدرات</b></td><td class="num">~${Math.max(0, e.carbs)} غ</td><td class="muted">الباقي. وقود المشي والتمارين.</td></tr>
          <tr><td><b>الماء</b></td><td class="num">${p.waterTarget} لتر</td><td class="muted">أكثر بالصيف وأيام المشي الطويل.</td></tr>
        </tbody></table>
        ${k14 != null || p14 != null ? `<p class="sub">معدلك آخر 14 يوم (من السجل): <b class="num">${fmtN(k14)}</b> سعرة و<b class="num">${fmtN(p14)}</b> غ بروتين.</p>` : ''}
      </section>
      <section class="card"><h2>يومك المعتاد مقابل يوم مقترح</h2>
        <table class="tbl"><thead><tr><th></th><th>المعتاد (ريوك + سلك + ريوك + شاي)</th><th>المقترح</th></tr></thead><tbody>
        ${row('السعرات', tt.kcal, st.kcal, '')}${row('البروتين', tt.p, st.p, 'غ')}${row('الكاربوهيدرات', tt.c, st.c, 'غ')}${row('الدهون', tt.f, st.f, 'غ')}
        </tbody></table>
        <div class="alert ${tt.kcal < e.target - 600 ? 'warn' : 'info'}" style="margin-top:12px">${ic('alert')}<div>يومك المعتاد تقريباً <b class="num">${fmtN(tt.kcal)}</b> سعرة و<b class="num">${fmtN(tt.p)}</b> غ بروتين، يعني أقل من هدفك بـ <b class="num">${fmtN(e.target - tt.kcal)}</b> سعرة و<b class="num">${fmtN(e.protein - tt.p)}</b> غ بروتين. العجز الكبير والبروتين القليل يضيّعون العضل اللي قاعد تبنيه، ويبطّئون ترميم الوتر. الحل مو تاكل أكثر بشكل عشوائي: أضف بروتين لكل وجبة. <a href="#learn/fatloss">اقرأ ليش</a>.</div></div>
      </section>
    </div>
    <section class="card" style="margin-top:16px"><h2>قوالب الوجبات <button class="btn sm" id="addMeal">${ic('plus')} قالب جديد</button></h2>
      <p class="muted" style="margin-top:-6px">عدّل المكونات والكميات حتى يطابق القالب أكلك الحقيقي، وكل الحسابات تتحدث تلقائياً.</p>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>الوجبة</th><th>المكونات</th><th class="c">سعرات</th><th class="c">بروتين</th><th class="c">كارب</th><th class="c">دهون</th><th></th></tr></thead><tbody>
      ${D.meals.map(m => { const t = mealTotals(m); return `<tr><td><b>${esc(m.name)}</b><div class="muted">${MEAL_SLOTS[m.slot] || ''}</div></td><td class="muted">${m.items.map(it => { const f = foodById(it.f); return f ? `${esc(f.name.split('(')[0].trim())} ${f.unitG ? r1(it.g / f.unitG) + ' ' + f.unit : it.g + 'غ'}` : ''; }).join('، ')}</td>
        <td class="c num"><b>${fmtN(t.kcal)}</b></td><td class="c num">${fmtN(t.p)}</td><td class="c num">${fmtN(t.c)}</td><td class="c num">${fmtN(t.f)}</td><td><button class="btn sm iconbtn" data-em="${m.id}" aria-label="تعديل">${ic('edit')}</button></td></tr>`; }).join('')}
      </tbody></table></div></section>
    <section class="card" style="margin-top:16px"><h2>طرق سهلة ترفع البروتين بأكلك</h2>
      <div class="grid g2"><ul style="margin:0;padding-inline-start:20px">
        <li>بالريوك: أضف 40 غ جبن أبيض، أو 200 غ لبن مصفى جنب البيتزا (+20 غ).</li>
        <li>بالغداء: 150–180 غ صدر دجاج أو سمك مع السلك (+45–55 غ).</li>
        <li>بدل بيضة صفار: أضف 2 بياض بيض (+7 غ، سعرات قليلة).</li></ul>
        <ul style="margin:0;padding-inline-start:20px">
        <li>بالعصر: تونة بالماء (علبة +26 غ)، أو عدس وحمص.</li>
        <li>الشاي: حليب سائل خالي الدسم بدل المجفف الكامل (نفس الطعم تقريباً، دهون أقل).</li>
        <li>إذا صعب توصل للرقم: سكوب واي بروتين واحد (+24 غ).</li></ul></div>
    </section>
    <section class="card" style="margin-top:16px"><h2>قاعدة الأغذية (لكل 100 غرام) <button class="btn sm" id="addFood">${ic('plus')} غذاء جديد</button></h2>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>الغذاء</th><th class="c">سعرات</th><th class="c">بروتين</th><th class="c">كارب</th><th class="c">دهون</th><th></th></tr></thead><tbody>
      ${D.foods.map(f => `<tr><td>${esc(f.name)}</td><td class="c num">${f.kcal}</td><td class="c num">${f.p}</td><td class="c num">${f.c}</td><td class="c num">${f.f}</td><td><button class="btn sm iconbtn" data-ef="${f.id}" aria-label="تعديل">${ic('edit')}</button></td></tr>`).join('')}
      </tbody></table></div></section>`;
  },
  bind(root) {
    const mealEditor = m => {
      const items = clone(m?.items || []);
      const body = () => `<label class="f">اسم الوجبة<input id="mName" value="${esc(m?.name || '')}"></label>
        <label class="f" style="margin-top:10px">الوقت<select id="mSlot">${Object.entries(MEAL_SLOTS).map(([k, l]) => `<option value="${k}" ${m?.slot === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        <h3 style="margin:16px 0 6px;font-size:15px">المكونات (بالغرام)</h3><div id="mItems"></div>
        <div class="meal-line"><select id="mF" style="flex:2">${D.foods.map(f => `<option value="${f.id}">${esc(f.name)}</option>`).join('')}</select><input id="mG" type="number" inputmode="decimal" placeholder="غرام" style="flex:1"><button type="button" class="btn sm" id="mAdd">${ic('plus')}</button></div>
        <p class="muted" id="mTot"></p>`;
      const dl = dialog({
        title: m ? 'تعديل الوجبة' : 'وجبة جديدة', body: body(), actions: [
          ...(m ? [{ label: 'حذف', cls: 'danger', run: () => { if (!confirm('حذف القالب؟')) return false; D.meals = D.meals.filter(x => x !== m); saveCfg(); route(); } }] : []),
          { label: 'إلغاء' },
          { label: 'حفظ', cls: 'primary', run: dl => { const name = $('#mName', dl).value.trim(); if (!name) return false; const v = { name, slot: $('#mSlot', dl).value, items }; if (m) Object.assign(m, v); else D.meals.push({ id: uid('m'), ...v }); saveCfg(); route(); } }
        ]
      });
      const draw = () => {
        $('#mItems', dl).innerHTML = items.map((it, i) => { const f = foodById(it.f); return `<div class="meal-line"><span style="flex:2">${esc(f?.name || it.f)}</span><input type="number" data-i="${i}" value="${it.g}" style="flex:1;min-height:38px"><button type="button" class="btn sm iconbtn danger" data-rm="${i}">${ic('trash')}</button></div>`; }).join('');
        const t = itemsTotals(items); $('#mTot', dl).textContent = `المجموع: ${fmtN(t.kcal)} سعرة · ${fmtN(t.p)} غ بروتين · ${fmtN(t.c)} غ كارب · ${fmtN(t.f)} غ دهون`;
        $$('[data-i]', dl).forEach(inp => inp.onchange = () => { items[+inp.dataset.i].g = num(inp.value) || 0; draw(); });
        $$('[data-rm]', dl).forEach(b => b.onclick = () => { items.splice(+b.dataset.rm, 1); draw(); });
      };
      $('#mAdd', dl).onclick = () => { const g = num($('#mG', dl).value); if (!g) return; items.push({ f: $('#mF', dl).value, g }); $('#mG', dl).value = ''; draw(); };
      draw();
    };
    $('#addMeal').onclick = () => mealEditor(null);
    $$('[data-em]', root).forEach(b => b.onclick = () => mealEditor(mealById(b.dataset.em)));
    const foodFields = [{ k: 'name', label: 'الاسم' }, { k: 'kcal', label: 'سعرات / 100غ', type: 'number' }, { k: 'p', label: 'بروتين / 100غ', type: 'number', step: '0.1' }, { k: 'c', label: 'كاربوهيدرات / 100غ', type: 'number', step: '0.1' }, { k: 'f', label: 'دهون / 100غ', type: 'number', step: '0.1' }, { k: 'unit', label: 'اسم الوحدة (اختياري، مثل: حبة)' }, { k: 'unitG', label: 'وزن الوحدة بالغرام (اختياري)', type: 'number', step: '0.1' }];
    $('#addFood').onclick = () => formDialog({ title: 'غذاء جديد', fields: foodFields, onSave: v => { if (!v.name) return false; D.foods.push({ id: uid('f'), ...v, kcal: v.kcal || 0, p: v.p || 0, c: v.c || 0, f: v.f || 0 }); saveCfg(); route(); } });
    $$('[data-ef]', root).forEach(b => b.onclick = () => { const f = foodById(b.dataset.ef); formDialog({ title: 'تعديل غذاء', fields: foodFields, values: f, onSave: v => { Object.assign(f, v); saveCfg(); route(); } }); });
  }
};

/* ---------- التقدم ---------- */
VIEWS.progress = {
  range: 30,
  html() {
    const t = today(), R = VIEWS.progress.range;
    const all = Object.keys(D.logs).sort();
    const start = R === 0 ? (all[0] || t) : addDays(t, -(R - 1));
    const days = dateRange(start, t);
    const st = days.map(dayStats);
    const ph = currentPhase();
    const ws = weightSeries().filter(p => p.x >= start);
    const wData = ws.length ? ws : [{ x: t, y: currentWeight() }];
    const segBtn = (v, l) => `<button data-rng="${v}" aria-pressed="${R === v}">${l}</button>`;
    const rows = [...st].reverse().filter(s => s.log);
    return `
    <div class="page-head"><div><h1>التقدم</h1><p>كل الرسوم من سجلك اليومي. مرّر إصبعك على الرسم حتى تشوف قيم كل يوم.</p></div>
      <div class="seg">${segBtn(14, '14 يوم')}${segBtn(30, '30 يوم')}${segBtn(90, '90 يوم')}${segBtn(0, 'الكل')}</div></div>
    <div class="grid g2">
      <section class="card"><div class="chart-title"><h2 style="margin:0">الوزن (كغم)</h2><span class="muted">الخط المتقطع = الهدف</span></div>
        ${chart({ type: 'line', data: wData, refs: [{ y: D.profile.goalWeight, label: 'الهدف ' + D.profile.goalWeight, color: 'var(--ok)' }], dec: 0, connect: true, label: 'الوزن', tip: d => `${fmtD(d.x)}<br><b>${fmtN(d.y, 1)}</b> كغم` })}</section>
      <section class="card"><div class="chart-title"><h2 style="margin:0">الخطوات اليومية</h2><span class="muted">هدف المرحلة الحالية ${fmtN(ph?.stepTarget)}</span></div>
        ${chart({ type: 'bar', data: st.map(s => ({ x: s.date, y: s.log?.steps ?? null })), refs: [{ y: ph?.stepTarget || 7000, label: fmtN(ph?.stepTarget || 7000) }], label: 'الخطوات', tip: d => d.y == null ? `${fmtD(d.x)}: غير مسجل` : `${weekday(d.x)} ${fmtD(d.x)}<br><b>${fmtN(d.y)}</b> خطوة` })}</section>
      <section class="card"><div class="chart-title"><h2 style="margin:0">ألم الوتر (0–10)</h2>
        <span class="legend" style="margin:0"><span><i style="background:var(--series-1)"></i>أثناء التمارين</span><span><i style="background:var(--series-2)"></i>الصبح</span></span></div>
        ${chart({ type: 'line', data: st.map(s => ({ x: s.date, y: s.painMax, m: s.painMorning })), series: [{ key: 'y', color: 'var(--series-1)' }, { key: 'm', color: 'var(--series-2)' }], yMin: 0, yMax: 10, ticks: [0, 2, 4, 6, 8, 10], refs: [{ y: ph?.painLimit ?? 0, label: 'الحد الحالي', color: 'var(--ok)' }], label: 'الألم', tip: d => `${fmtD(d.x)}<br>تمارين: <b>${d.y ?? '—'}</b> · صبح: <b>${d.m ?? '—'}</b>` })}</section>
      <section class="card"><div class="chart-title"><h2 style="margin:0">الالتزام بالتمارين (%)</h2><span class="muted">نسبة التمارين المنجزة من المطلوب</span></div>
        ${chart({ type: 'bar', data: st.map(s => ({ x: s.date, y: s.session === 'nodata' ? null : r0((s.pct || 0) * 100), c: s.pct >= .999 ? 'var(--series-3)' : 'var(--series-1)' })), yMin: 0, yMax: 100, ticks: [0, 25, 50, 75, 100], label: 'الالتزام', tip: d => d.y == null ? `${fmtD(d.x)}: غير مسجل` : `${fmtD(d.x)}<br><b>${d.y}%</b>` })}</section>
      <section class="card"><div class="chart-title"><h2 style="margin:0">النوم (ساعات)</h2></div>
        ${chart({ type: 'bar', data: st.map(s => ({ x: s.date, y: s.log?.sleep ?? null })), refs: [{ y: D.profile.sleepTarget, label: D.profile.sleepTarget + ' س' }], label: 'النوم', tip: d => d.y == null ? `${fmtD(d.x)}: غير مسجل` : `${fmtD(d.x)}<br><b>${d.y}</b> ساعة` })}</section>
      <section class="card"><div class="chart-title"><h2 style="margin:0">البروتين اليومي (غ)</h2></div>
        ${chart({ type: 'bar', data: st.map(s => ({ x: s.date, y: s.log ? (dayProtein(s.log) != null ? r0(dayProtein(s.log)) : null) : null })), refs: [{ y: energy().protein, label: 'الهدف ' + energy().protein }], label: 'البروتين', tip: d => d.y == null ? `${fmtD(d.x)}: غير مسجل` : `${fmtD(d.x)}<br><b>${d.y}</b> غ` })}</section>
    </div>
    <section class="card" style="margin-top:16px"><h2>جدول الأيام</h2>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>التاريخ</th><th>المرحلة</th><th class="c">التمارين</th><th class="c">ألم تمارين</th><th class="c">ألم صبح</th><th class="c">خطوات</th><th class="c">وزن</th><th class="c">نوم</th><th class="c">ماء</th><th class="c">سعرات</th><th class="c">بروتين</th></tr></thead><tbody>
      ${rows.map(s => `<tr><td><a href="#log/${s.date}">${weekday(s.date)} ${fmtShort(s.date)}</a></td><td class="muted">${esc(s.ph?.name.split('—')[0] || '')}</td><td class="c num">${s.done}/${s.planned}</td>
        <td class="c num" style="color:${painColor(s.painMax, s.limit)}">${s.painMax ?? '—'}</td><td class="c num" style="color:${painColor(s.painMorning, s.limit)}">${s.painMorning ?? '—'}</td><td class="c num">${fmtN(s.log.steps)}</td><td class="c num">${s.log.weight ?? '—'}</td><td class="c num">${s.log.sleep ?? '—'}</td><td class="c num">${s.log.water ?? '—'}</td><td class="c num">${fmtN(dayKcal(s.log))}</td><td class="c num">${fmtN(dayProtein(s.log))}</td></tr>`).join('') || '<tr><td colspan="11" class="muted">ماكو أيام مسجلة بهذي الفترة.</td></tr>'}
      </tbody></table></div></section>`;
  },
  bind(root) { $$('[data-rng]', root).forEach(b => b.onclick = () => { VIEWS.progress.range = +b.dataset.rng; route(); }); }
};

/* ---------- المكتبة العلمية ---------- */
VIEWS.learn = {
  html(slug) {
    if (slug) {
      const L = LESSONS.find(l => l.slug === slug);
      if (L) {
        const i = LESSONS.indexOf(L), nx = LESSONS[i + 1], pv = LESSONS[i - 1];
        return `<div class="row" style="margin-bottom:14px"><a class="btn sm" href="#learn">${ic('prev')} كل الدروس</a></div>
          <article class="article"><div class="muted" style="color:var(--accent);font-weight:600">${esc(L.cat)}</div><h1>${esc(L.title)}</h1>${L.html}
          <hr><div class="row">${pv ? `<a class="btn" href="#learn/${pv.slug}">${ic('prev')} ${esc(pv.title)}</a>` : ''}<span class="spacer"></span>${nx ? `<a class="btn primary" href="#learn/${nx.slug}">${esc(nx.title)} ${ic('next')}</a>` : ''}</div></article>`;
      }
    }
    const cats = [...new Set(LESSONS.map(l => l.cat))];
    return `<div class="page-head"><div><h1>المكتبة العلمية</h1><p>شرح علمي مبسط ومبني على الأبحاث: الركبة والوتر، العلاج الطبيعي، والتغذية وخسارة الدهون. المصادر بنهاية كل درس.</p></div></div>
      ${cats.map(c => `<h2 style="font-size:18px;margin:22px 0 10px">${esc(c)}</h2><div class="lessons">${LESSONS.filter(l => l.cat === c).map(l => `<a class="card lesson-card" href="#learn/${l.slug}"><span class="k">${esc(l.cat)}</span><b>${esc(l.title)}</b><span>${esc(l.desc)}</span></a>`).join('')}</div>`).join('')}`;
  }
};

/* ---------- الإعدادات والبيانات ---------- */
VIEWS.settings = {
  html() {
    const p = D.profile, s = Sync.secrets();
    const nLogs = Object.keys(D.logs).length;
    return `
    <div class="page-head"><div><h1>الإعدادات والبيانات</h1><p>البيانات محفوظة على هذا الجهاز فقط. حتى تنقلها بين اللابتوب والآيباد استخدم التصدير والاستيراد، أو المزامنة التلقائية.</p></div></div>
    <div class="grid g2" style="align-items:start">
      <section class="card"><h2>نقل البيانات بملف</h2>
        <p class="sub" style="margin-top:0">عندك <b class="num">${nLogs}</b> يوم مسجل. آخر تصدير: <b>${D.meta.lastExport ? new Date(D.meta.lastExport).toLocaleString('ar-IQ-u-nu-latn') : 'ما صار'}</b></p>
        <div class="row"><button class="btn primary" id="exp">${ic('down')} تصدير ملف</button>
          ${navigator.canShare ? `<button class="btn" id="shr">${ic('share')} مشاركة / AirDrop</button>` : ''}
          <label class="btn" for="impF">${ic('up')} استيراد ملف</label><input type="file" id="impF" accept=".json,application/json" hidden></div>
        <ol class="sub" style="padding-inline-start:20px;margin-bottom:0"><li>على الجهاز اللي سجلت بيه: <b>تصدير ملف</b>، واحفظه بـ iCloud Drive أو أرسله AirDrop.</li><li>على الجهاز الثاني: <b>استيراد ملف</b> ← اختر <b>دمج</b>.</li><li>الدمج ياخذ الأحدث لكل يوم، فما تضيع بيانات أي جهاز.</li></ol>
      </section>
      <section class="card"><h2><span>المزامنة التلقائية (GitHub Gist)</span><span class="pill ${Sync.enabled() ? 'ok' : ''}">${Sync.enabled() ? 'مفعّلة' : 'غير مفعّلة'}</span></h2>
        <p class="sub" style="margin-top:0">الـ Gist ملف سري بحسابك على GitHub. التطبيق يحفظ بياناتك بيه، وكل جهاز يفتح الموقع يسحب آخر نسخة ويرفع تعديلاته. تحتاج تسويها مرة وحدة على كل جهاز.</p>
        <label class="f">التوكن (Personal access token — صلاحية gist فقط)<input type="password" id="gTok" dir="ltr" value="${esc(s.token || '')}" placeholder="ghp_..." autocomplete="off"></label>
        <label class="f" style="margin-top:10px">رقم الـ Gist (يتعبى تلقائياً بأول جهاز، وانسخه للجهاز الثاني)<input type="text" id="gId" dir="ltr" value="${esc(s.gistId || '')}" placeholder="فارغ = ينشئ واحد جديد"></label>
        <div class="row" style="margin-top:12px"><button class="btn primary" id="gSave">${ic('cloud')} حفظ وتشغيل المزامنة</button>${Sync.enabled() ? `<button class="btn" id="gNow">مزامنة الآن</button><button class="btn danger" id="gOff">إيقاف</button>` : ''}</div>
        <p class="muted" id="gMsg">${s.lastSync ? 'آخر مزامنة: ' + new Date(s.lastSync).toLocaleString('ar-IQ-u-nu-latn') : ''}</p>
        <details><summary class="sub" style="cursor:pointer">شلون أسوي التوكن؟</summary><ol class="sub" style="padding-inline-start:20px">
          <li>افتح github.com ← الصورة الشخصية ← Settings ← Developer settings ← Personal access tokens ← <b>Tokens (classic)</b> ← Generate new token (classic).</li>
          <li>الاسم: rukba، والمدة: No expiration أو سنة.</li><li>علّم على <b>gist</b> فقط، وما تختار أي صلاحية ثانية.</li><li>انسخ التوكن والصقه هنا، واضغط حفظ. التطبيق ينشئ Gist سري ويحط رقمه.</li>
          <li>على الآيباد: الصق نفس التوكن ونفس رقم الـ Gist.</li></ol>
          <p class="muted">التوكن ينحفظ على هذا الجهاز فقط، وما يدخل بملفات التصدير. لأن صلاحيته gist فقط، ما يكدر يوصل لمستودعاتك أو كودك.</p></details>
      </section>
      <section class="card"><h2>الملف الشخصي والأهداف</h2>
        <div class="grid g2">
          ${[['name', 'الاسم', 'text'], ['age', 'العمر', 'number'], ['height', 'الطول (سم)', 'number'], ['startWeight', 'وزن البداية (كغم)', 'number'], ['goalWeight', 'الوزن الهدف (كغم)', 'number'], ['fitWeight', 'وزنك وقت اللياقة (كغم)', 'number'],
            ['activity', 'معامل النشاط (1.2 مكتبي – 1.55 نشيط)', 'number'], ['deficit', 'العجز اليومي (سعرة)', 'number'], ['proteinPerKg', 'البروتين (غ لكل كغم)', 'number'], ['rate', 'معدل النزول المتوقع (كغم/أسبوع)', 'number'], ['waterTarget', 'هدف الماء (لتر)', 'number'], ['sleepTarget', 'هدف النوم (ساعات)', 'number']]
            .map(([k, l, ty]) => `<label class="f">${l}<input type="${ty}" ${ty === 'number' ? 'step="any" inputmode="decimal"' : ''} data-pk="${k}" value="${esc(p[k] ?? '')}"></label>`).join('')}
        </div>
        <label class="f" style="margin-top:10px">الاسم بالإنكليزي (للتقرير الإنكليزي)<input type="text" dir="ltr" data-pk="nameEn" value="${esc(p.nameEn || '')}"></label>
        <label class="f" style="margin-top:10px">التشخيص (يظهر بالتقرير)<input type="text" data-pk="diagnosis" value="${esc(p.diagnosis)}"></label>
        <label class="f" style="margin-top:10px">التشخيص بالإنكليزي (للتقرير الإنكليزي)<input type="text" dir="ltr" data-pk="diagnosisEn" value="${esc(p.diagnosisEn || '')}"></label>
        <label class="f" style="margin-top:10px">المعالج<input type="text" data-pk="therapist" value="${esc(p.therapist)}"></label>
        <label class="f" style="margin-top:10px">المعالج بالإنكليزي<input type="text" dir="ltr" data-pk="therapistEn" value="${esc(p.therapistEn || '')}"></label>
      </section>
      <section class="card"><h2>المظهر وأخرى</h2>
        <div class="seg" id="theme">${[['auto', 'تلقائي'], ['light', 'فاتح'], ['dark', 'داكن']].map(([v, l]) => `<button data-th="${v}" aria-pressed="${(localStorage.getItem('rukba.theme') || 'auto') === v}">${l}</button>`).join('')}</div>
        <hr><p class="sub">لتثبيت التطبيق على الآيباد: افتح الموقع بـ Safari ← زر المشاركة ← <b>إضافة إلى الشاشة الرئيسية</b>. يشتغل بعدها مثل التطبيق، وحتى بدون إنترنت.</p>
        <div class="alert warn">${ic('alert')}<div>التطبيق المثبّت على الشاشة الرئيسية له تخزين منفصل عن Safari العادي، فاستخدم واحد منهم دائماً على نفس الجهاز.</div></div>
        <hr><button class="btn danger" id="reset">${ic('trash')} مسح كل البيانات من هذا الجهاز</button>
      </section>
    </div>`;
  },
  bind(root) {
    $$('[data-pk]', root).forEach(inp => inp.onchange = () => { const k = inp.dataset.pk; D.profile[k] = inp.type === 'number' ? num(inp.value) : inp.value; saveCfg(); toast('تم الحفظ'); });
    $('#exp').onclick = () => Backup.download();
    const sh = $('#shr'); if (sh) sh.onclick = () => Backup.share();
    $('#impF').onchange = e => { const f = e.target.files[0]; if (f) Backup.importFile(f); e.target.value = ''; };
    $('#gSave').onclick = async () => {
      const token = $('#gTok').value.trim(), gistId = $('#gId').value.trim();
      if (!token) { toast('الصق التوكن أولاً'); return; }
      Sync.setSecrets({ ...Sync.secrets(), token, gistId, on: true });
      $('#gMsg').textContent = 'جاري الاتصال...';
      try { await Sync.syncNow(true); toast('المزامنة شغالة'); route(); }
      catch (err) { $('#gMsg').textContent = 'فشل: ' + err.message; }
    };
    const gn = $('#gNow'); if (gn) gn.onclick = async () => { $('#gMsg').textContent = 'جاري المزامنة...'; try { await Sync.syncNow(true); route(); toast('تمت المزامنة'); } catch (err) { $('#gMsg').textContent = 'فشل: ' + err.message; } };
    const go = $('#gOff'); if (go) go.onclick = () => { Sync.setSecrets({ ...Sync.secrets(), on: false }); route(); };
    $$('[data-th]', root).forEach(b => b.onclick = () => { localStorage.setItem('rukba.theme', b.dataset.th); applyTheme(); route(); });
    $('#reset').onclick = () => {
      if (!confirm('راح تنمسح كل بياناتك من هذا الجهاز. صدّرت نسخة احتياطية؟')) return;
      if (prompt('اكتب: امسح') !== 'امسح') return;
      localStorage.removeItem(KEY); load(); route(); toast('تم المسح وإرجاع البيانات الأولية');
    };
  }
};

/* ---------------- النسخ الاحتياطي ---------------- */
const Backup = {
  json() { return JSON.stringify({ app: 'rukba', exportedAt: new Date().toISOString(), ...D }, null, 1); },
  name() { const n = new Date(); return `rukba-backup-${today()}-${pad(n.getHours())}${pad(n.getMinutes())}.json`; },
  mark() { D.meta.lastExport = Date.now(); persist(); },
  download() {
    const blob = new Blob([this.json()], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = this.name();
    document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    this.mark(); toast('تم التصدير'); setTimeout(route, 300);
  },
  async share() {
    const file = new File([this.json()], this.name(), { type: 'application/json' });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'نسخة رُكبة' }); this.mark(); route(); }
      else this.download();
    } catch (e) { if (e.name !== 'AbortError') this.download(); }
  },
  importFile(f) {
    const rd = new FileReader();
    rd.onload = () => {
      let obj; try { obj = JSON.parse(rd.result); } catch { toast('الملف مو JSON صالح'); return; }
      if (!obj || !obj.logs || !obj.profile) { toast('هذا الملف مو نسخة من رُكبة'); return; }
      delete obj.app; delete obj.exportedAt;
      const n = Object.keys(obj.logs).length;
      dialog({
        title: 'استيراد البيانات', body: `<p>الملف يحتوي <b>${n}</b> يوم مسجل (تاريخ التصدير: ${esc(new Date(obj.meta?.updatedAt || Date.now()).toLocaleString('ar-IQ-u-nu-latn'))}).</p><p class="sub"><b>دمج</b>: ياخذ الأحدث لكل يوم ويحافظ على بيانات الجهازين، وهو الموصى به.<br><b>استبدال</b>: يمسح بيانات هذا الجهاز ويحط بيانات الملف بدلها.</p>`,
        actions: [{ label: 'إلغاء' }, { label: 'استبدال', cls: 'danger', run: () => { D = { ...defaults(), ...obj }; D.meta.cfgUpdatedAt = Date.now(); persist(); Sync.schedule(); route(); toast('تم الاستبدال'); } },
          { label: 'دمج', cls: 'primary', run: () => { const c = mergeInto(D, obj); persist(); Sync.schedule(); route(); toast(c ? 'تم الدمج' : 'بياناتك أحدث، ما تغير شي'); } }]
      });
    };
    rd.readAsText(f);
  }
};
function mergeInto(local, remote) {
  let changed = false;
  for (const [d, r] of Object.entries(remote.logs || {})) {
    const l = local.logs[d];
    if (!l || (r.updatedAt || 0) > (l.updatedAt || 0)) { local.logs[d] = r; changed = true; }
  }
  if ((remote.meta?.cfgUpdatedAt || 0) > (local.meta.cfgUpdatedAt || 0)) {
    for (const k of ['profile', 'phases', 'consults', 'foods', 'meals', 'report']) if (remote[k]) local[k] = remote[k];
    local.meta.cfgUpdatedAt = remote.meta.cfgUpdatedAt; changed = true;
  }
  local.meta.updatedAt = Math.max(local.meta.updatedAt || 0, remote.meta?.updatedAt || 0);
  return changed;
}

/* ---------------- مزامنة GitHub Gist ---------------- */
const Sync = {
  secrets() { try { return JSON.parse(localStorage.getItem(SKEY)) || {}; } catch { return {}; } },
  setSecrets(s) { localStorage.setItem(SKEY, JSON.stringify(s)); },
  enabled() { const s = this.secrets(); return !!(s.on && s.token); },
  busy: false, timer: null,
  async api(path, opt = {}) {
    const s = this.secrets();
    const res = await fetch('https://api.github.com' + path, {
      ...opt, cache: 'no-store',
      headers: { Accept: 'application/vnd.github+json', Authorization: 'Bearer ' + s.token, 'X-GitHub-Api-Version': '2022-11-28', ...(opt.body ? { 'Content-Type': 'application/json' } : {}) }
    });
    if (!res.ok) {
      const m = { 401: 'التوكن غير صحيح أو منتهي', 403: 'التوكن ما عنده صلاحية gist', 404: 'الـ Gist غير موجود أو التوكن ما يخصه' }[res.status];
      throw new Error(m || ('HTTP ' + res.status));
    }
    return res.json();
  },
  payload() { return JSON.stringify(D); },
  async pull() {
    const s = this.secrets();
    const j = await this.api('/gists/' + s.gistId);
    const f = j.files[GIST_FILE];
    if (!f) return false;
    const content = f.truncated ? await (await fetch(f.raw_url, { cache: 'no-store' })).text() : f.content;
    const remote = JSON.parse(content);
    const changed = mergeInto(D, remote);
    persist();
    return changed;
  },
  async push() {
    const s = this.secrets();
    await this.api('/gists/' + s.gistId, { method: 'PATCH', body: JSON.stringify({ files: { [GIST_FILE]: { content: this.payload() } } }) });
    this.setSecrets({ ...this.secrets(), lastSync: Date.now() });
  },
  async syncNow(manual) {
    if (!this.enabled() || this.busy) return;
    this.busy = true; updateSyncState('جاري المزامنة...');
    try {
      const s = this.secrets();
      if (!s.gistId) {
        const j = await this.api('/gists', { method: 'POST', body: JSON.stringify({ description: 'Rukba — rehab & nutrition data (private)', public: false, files: { [GIST_FILE]: { content: this.payload() } } }) });
        this.setSecrets({ ...s, gistId: j.id, lastSync: Date.now() });
      } else {
        const changed = await this.pull();
        await this.push();
        if (changed && !manual) route();
      }
    } finally { this.busy = false; updateSyncState(); }
  },
  schedule() {
    if (!this.enabled()) return;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.syncNow().catch(e => updateSyncState('فشل المزامنة: ' + e.message)), 2500);
  }
};
function updateSyncState(msg) {
  const el = $('#syncState'); if (!el) return;
  const s = Sync.secrets();
  el.innerHTML = msg ? esc(msg) : Sync.enabled()
    ? `<span class="dot on"></span>مزامنة مفعّلة${s.lastSync ? ' · ' + new Date(s.lastSync).toLocaleTimeString('ar-IQ-u-nu-latn', { hour: '2-digit', minute: '2-digit' }) : ''}`
    : `<span class="dot"></span>محفوظ على هذا الجهاز`;
}

/* ---------------- التشغيل ---------------- */
function applyTheme() {
  const t = localStorage.getItem('rukba.theme') || 'auto';
  if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t);
}
function init() {
  applyTheme();
  load();
  shell();
  window.addEventListener('hashchange', route);
  route();
  if (Sync.enabled()) Sync.syncNow().catch(e => updateSyncState('فشل المزامنة: ' + e.message));
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && Sync.enabled()) Sync.syncNow().catch(() => {}); });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
}
document.addEventListener('DOMContentLoaded', init);
