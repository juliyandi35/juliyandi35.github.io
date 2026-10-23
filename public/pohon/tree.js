// Pohon Proyek: procedural tree of juliyandi35's GitHub repos. Data comes from data.js (const D).
const $ = id => document.getElementById(id);
const h = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
const rng = (s => () => (s = s + 0x6D2B79F5 | 0, s = Math.imul(s ^ s >>> 15, s | 1), s ^= s + Math.imul(s ^ s >>> 7, s | 61), ((s ^ s >>> 14) >>> 0) / 4294967296))(35);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const TC = {R: '#d9443a', SPSS: '#1f9a58', Excel: '#d4951c', Python: '#2f78d0', Stata: '#e06a24', MATLAB: '#9b4fd0', SmartPLS: '#139b9b', Lainnya: '#7c8794'};
const RGB = Object.fromEntries(Object.entries(TC).map(([k, v]) => [k, [1, 3, 5].map(i => parseInt(v.slice(i, i + 2), 16))]));
const MIST = '223,231,238', NOW = Date.now(), DAY = 864e5;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

const REPOS = D.map(([n, c, t, d, s, p, cr, z]) => ({n, c, t, d, s, p, cr, z, url: 'https://github.com/juliyandi35/' + n, on: true}));
REPOS.forEach(r => r.age = (NOW - Date.parse(r.p)) / DAY);
const countBy = t => REPOS.filter(r => r.t === t).length;

// ---------- structure: trunk → category groups → categories → repos ----------
const byCat = new Map();
REPOS.forEach(r => (byCat.get(r.c) || byCat.set(r.c, []).get(r.c)).push(r));
const CATS = [...byCat].map(([name, list]) => ({name, list: list.sort((a, b) => a.t.localeCompare(b.t) || a.n.localeCompare(b.n))}))
  .sort((a, b) => b.list.length - a.list.length);
const pyramid = []; CATS.forEach((c, i) => i % 2 ? pyramid.push(c) : pyramid.unshift(c));

function repoNode(list) {
  if (list.length === 1) return {n: 1, repo: list[0], kids: []};
  const k = list.length > 3 ? Math.round(list.length * (.4 + rng() * .2)) : list.length >> 1;
  return {n: list.length, kids: [repoNode(list.slice(0, k)), repoNode(list.slice(k))]};
}
function catNode(arr) {
  if (arr.length === 1) return Object.assign(repoNode(arr[0].list), {cat: arr[0].name});
  const tot = arr.reduce((s, c) => s + c.list.length, 0);
  let acc = 0, cut = 1, best = 1e9;
  for (let i = 1; i < arr.length; i++) { acc += arr[i - 1].list.length; if (Math.abs(acc - tot / 2) < best) { best = Math.abs(acc - tot / 2); cut = i; } }
  return {n: tot, kids: [catNode(arr.slice(0, cut)), catNode(arr.slice(cut))]};
}
const crown = catNode(pyramid);
const ROOT = {n: crown.n, trunk: true, kids: crown.kids};

const NODES = []; let MAXD = 0;
const width = n => 1.3 + 6.4 * (Math.sqrt(n) - 1); // pipe model: cross-section grows with the leaves a branch serves
function place(nd, x0, y0, ang, depth, cat) {
  const len = nd.trunk ? 250 : nd.repo ? 30 : 34 + 6.5 * Math.sqrt(nd.n);
  Object.assign(nd, {x0, y0, ang, depth, cat: nd.cat || cat, len: len * (.88 + rng() * .24), w: width(nd.n), bend: (rng() - .5) * (nd.trunk ? .12 : .32)});
  nd.x = x0 + Math.sin(ang) * nd.len; nd.y = y0 - Math.cos(ang) * nd.len;
  nd.cx = (x0 + nd.x) / 2 - (nd.y - y0) * nd.bend; nd.cy = (y0 + nd.y) / 2 + (nd.x - x0) * nd.bend;
  NODES.push(nd); MAXD = Math.max(MAXD, depth);
  if (!nd.kids.length) return;
  const [a, b] = nd.kids, t = a.n + b.n;
  const th = .62 + .3 * (1 - Math.min(1, nd.n / 60)) + (depth < 3 ? .3 - depth * .08 : 0);
  const lim = a => clamp(a, -1.5, 1.5);
  place(a, nd.x, nd.y, lim(ang - th * b.n / t + (rng() - .5) * .2), depth + 1, nd.cat || cat);
  place(b, nd.x, nd.y, lim(ang + th * a.n / t + (rng() - .5) * .2), depth + 1, nd.cat || cat);
}
place(ROOT, 0, 0, 0, 0);
NODES.sort((a, b) => a.depth - b.depth);
NODES.forEach(nd => nd.kids.forEach(k => k.parent = nd));
const LEAVES = NODES.filter(n => n.repo);

(function dom(nd) { // dominant tool per node tints the thin wood
  nd.cnt = {};
  if (nd.repo) nd.cnt[nd.repo.t] = 1;
  else nd.kids.forEach(k => { dom(k); for (const t in k.cnt) nd.cnt[t] = (nd.cnt[t] || 0) + k.cnt[t]; });
  nd.tool = Object.keys(nd.cnt).sort((a, b) => nd.cnt[b] - nd.cnt[a])[0];
})(ROOT);

LEAVES.forEach(nd => { // decorative foliage around each twig tip
  nd.dec = Array.from({length: 9}, (_, i) => {
    const along = i < 3 ? .35 + i * .2 : 1, sp = i < 3 ? 6 : 22;
    return {x: nd.x0 + (nd.x - nd.x0) * along + (rng() - .5) * sp, y: nd.y0 + (nd.y - nd.y0) * along + (rng() - .5) * sp,
      a: nd.ang + (rng() - .5) * 2.6, l: 6 + rng() * 8, col: rng() < .45 ? TC[nd.repo.t] : rng() < .7 ? '#2e8a52' : '#c4493c', al: .22 + rng() * .28};
  });
});

// limbs follow the dominant child, so trunk → bough → branch → twig is one continuous tapering form (no seams at forks)
const chaikin = (P, it) => {
  const mid = (p, q, t) => ({x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t, w: p.w + (q.w - p.w) * t, d: p.d + (q.d - p.d) * t});
  for (; it > 0; it--) {
    const Q = [P[0]];
    for (let i = 0; i < P.length - 1; i++) Q.push(mid(P[i], P[i + 1], .25), mid(P[i], P[i + 1], .75));
    Q.push(P[P.length - 1]); P = Q;
  }
  return P;
};
const LIMBS = [];
(function limb(start) {
  const nodes = [];
  for (let nd = start; nd; nd = nd.kids.length ? (nd.kids[0].n >= nd.kids[1].n ? nd.kids[0] : nd.kids[1]) : null) nodes.push(nd);
  const P = [];
  nodes.forEach((nd, i) => {
    const wEnd = nd.kids.length ? Math.max(nd.kids[0].w, nd.kids[1].w) : nd.w * .3, S = nd.trunk ? 10 : 4;
    for (let s = i ? 1 : 0; s <= S; s++) {
      const t = s / S, u = 1 - t;
      P.push({x: u * u * nd.x0 + 2 * u * t * nd.cx + t * t * nd.x, y: u * u * nd.y0 + 2 * u * t * nd.cy + t * t * nd.y, w: nd.w + (wEnd - nd.w) * t, d: nd.depth + t});
    }
  });
  if (start.trunk) {
    P.unshift({...P[0], y: 40}); // sink the base below the soil line
    P.forEach(p => p.w *= 1 + .4 * Math.max(0, .5 - p.d) ** 2 / .25); // gentle flare; the roots build the rest
  } else P[0].w *= 1.3; // branch collar, tucked under the parent
  LIMBS.push({nodes, start, pts: chaikin(P, 2)});
  nodes.forEach(nd => nd.kids.forEach(k => nodes.includes(k) || limb(k)));
})(ROOT);
for (let i = 0; i < 9; i++) { // roots start hidden inside the trunk and swell into buttresses
  const side = i % 2 ? 1 : -1, reach = 70 + rng() * 160, drop = 14 + rng() * 34, w0 = ROOT.w * (.42 + rng() * .18);
  const x0 = side * ROOT.w * (.04 + rng() * .16);
  const P = [
    {x: x0, y: -130, w: w0 * .3, d: -.1},
    {x: x0 + side * reach * .14, y: -34, w: w0, d: .05},
    {x: x0 + side * reach * .42, y: drop * .4 + (rng() - .5) * 6, w: w0 * .42, d: .3},
    {x: x0 + side * reach, y: drop + (rng() - .5) * 10, w: 1.4, d: .6}];
  LIMBS.push({nodes: [ROOT], start: {w: w0, root: true}, pts: chaikin(P, 3)});
}
LIMBS.sort((a, b) => (a.start.root ? 1e9 : a.start.w) - (b.start.root ? 1e9 : b.start.w)); // thin first so parents cover children's bases; roots last, over the trunk
const INNER = []; // foliage along slender limbs so the crown reads as a full canopy, not a ring of tips
LIMBS.forEach(L => {
  if (L.start.root || L.start.w > 12) return;
  for (let i = 0; i < 4; i++) {
    const p = L.pts[(L.pts.length * (.3 + rng() * .6)) | 0];
    INNER.push({x: p.x + (rng() - .5) * 14, y: p.y + (rng() - .5) * 14, d: p.d, a: rng() * 6.3, l: 6 + rng() * 7,
      col: rng() < .6 ? '#3d8f5e' : rng() < .6 ? '#c25a4c' : TC[L.start.tool], al: .25 + rng() * .25, node: L.nodes[0]});
  }
});

// ---------- drawing ----------
const tc = $('tree'), ctx = tc.getContext('2d'), off = document.createElement('canvas'), oc = off.getContext('2d');
let W, H, dpr, V = {k: 1, tx: 0, ty: 0}, FIT, t0 = REDUCED ? -1e9 : performance.now(), dirty = true, sel = null, hov = null;
const GROW = 5200;
const prog = now => Math.min(1, (now - t0) / GROW) * (MAXD + 3);
const mixA = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const BARK = [[58, 66, 76], [150, 158, 166]]; // slate bark, tuned to the portfolio's ink

function drawLimb(c, L, g, minW, k) {
  let P = L.pts;
  if (P[P.length - 1].d > g) { const i = P.findIndex(p => p.d > g); if (i < 2) return; P = P.slice(0, i); }
  const n = P.length;
  const N = P.map((p, i) => {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)], dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
    return [-dy / l, dx / l];
  });
  const R = P.map(p => Math.max(minW, p.w) / 2);
  const band = (a, b) => { // strip between two lateral offsets, -1 and 1 are the edges
    c.beginPath();
    for (let i = 0; i < n; i++) c.lineTo(P[i].x + N[i][0] * R[i] * a, P[i].y + N[i][1] * R[i] * a);
    for (let i = n - 1; i >= 0; i--) c.lineTo(P[i].x + N[i][0] * R[i] * b, P[i].y + N[i][1] * R[i] * b);
    c.fill();
  };
  const root = L.start.root, sw = L.start.w, base = mixA(BARK[0], BARK[1], root ? .38 : clamp(sw / 90, .2, .45));
  // roots are painted over the trunk and fade in from inside it, so the two read as one piece of wood
  const q = P[Math.floor(n * .3)];
  const paint = (col, a) => {
    if (!root) return `rgba(${col},${a})`;
    const gr = c.createLinearGradient(P[0].x, P[0].y, q.x, q.y);
    gr.addColorStop(0, `rgba(${col},0)`); gr.addColorStop(1, `rgba(${col},${a})`);
    return gr;
  };
  const tint = root ? 0 : (1 - clamp(sw / 20, 0, 1)) * .75; // thin wood picks up its repos' colour
  c.fillStyle = paint(mixA(base, L.start.tool ? RGB[L.start.tool] : base, tint).map(v => v | 0), 1);
  band(-1, 1);
  if (sw * k < 3) return;
  // cylinder shading, light from upper left; lit side picked per limb so left-running roots shade correctly
  const m = N[n >> 1], s = m[0] * -.6 + m[1] * -.8 > 0 ? 1 : -1;
  c.fillStyle = paint('255,255,255', .16); band(s * .05, s * .9); band(s * .3, s * .7);
  c.fillStyle = paint('22,32,43', .26); band(-s * .2, -s); band(-s * .62, -s);
  if (sw < 14) return;
  c.lineWidth = Math.max(.5 / k, sw * .012);
  for (let j = 0; j < Math.min(16, sw / 5); j++) { // bark furrows
    const f = -.85 + 1.7 * ((j * .618) % 1);
    c.strokeStyle = j % 4 ? paint('22,32,43', .24) : paint('255,255,255', .2);
    c.beginPath();
    for (let i = 0; i < n && R[i] > 4.5; i++) {
      const o = f + .018 * Math.sin(i * .35 + j * 2.1);
      c.lineTo(P[i].x + N[i][0] * R[i] * o, P[i].y + N[i][1] * R[i] * o);
    }
    c.stroke();
  }
}

function leafShape(c, x, y, a, l, wd) {
  c.save(); c.translate(x, y); c.rotate(a - Math.PI / 2);
  c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(l * .5, -wd, l, 0); c.quadraticCurveTo(l * .5, wd, 0, 0);
  c.restore();
}
function ellipse(c, y, rx, ry, inner, outer) {
  c.save(); c.scale(1, ry / rx);
  const cy = y * rx / ry, gr = c.createRadialGradient(0, cy, 0, 0, cy, rx);
  gr.addColorStop(0, inner); gr.addColorStop(1, outer);
  c.fillStyle = gr; c.beginPath(); c.arc(0, cy, rx, 0, 7); c.fill(); c.restore();
}

function drawStatic(now) {
  const g = prog(now), c = oc, k = V.k, minW = .9 / k;
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, off.width, off.height);
  c.setTransform(dpr * k, 0, 0, dpr * k, dpr * V.tx, dpr * V.ty);
  ellipse(c, 10, 460, 90, 'rgba(181,101,42,.10)', 'rgba(181,101,42,0)');
  ellipse(c, 8, 250, 44, 'rgba(22,32,43,.28)', 'rgba(22,32,43,0)'); // contact shadow under the root plate
  for (const L of LIMBS) { c.globalAlpha = L.nodes.some(n => n.on) ? 1 : .18; drawLimb(c, L, g, minW, k); }
  c.globalAlpha = 1;
  const soil = c.createLinearGradient(0, 2, 0, 36); // roots sink into the ground; fully opaque before the trunk's buried end
  soil.addColorStop(0, `rgba(${MIST},0)`); soil.addColorStop(1, `rgb(${MIST})`);
  c.fillStyle = soil; c.fillRect(-700, 2, 1400, 140);
  c.strokeStyle = 'rgba(22,32,43,.14)'; c.lineWidth = 1 / k;
  c.beginPath(); c.moveTo(-520, 4); c.lineTo(520, 4); c.stroke();
  for (const f of INNER) {
    if (f.d > g) continue;
    c.globalAlpha = f.al * (f.node.on ? 1 : .15); c.fillStyle = f.col;
    leafShape(c, f.x, f.y, f.a, f.l, f.l * .34); c.fill();
  }
  for (const nd of LEAVES) {
    const s = clamp(g - nd.depth - 1, 0, 1);
    if (s <= 0) continue;
    for (const d of nd.dec) {
      c.globalAlpha = d.al * s * (nd.on ? 1 : .15); c.fillStyle = d.col;
      leafShape(c, d.x, d.y, d.a, d.l * s, d.l * .32 * s); c.fill();
    }
  }
  c.globalAlpha = 1;
}

function frame(now) {
  const g = prog(now);
  if (dirty || g < MAXD + 3) { drawStatic(now); dirty = false; }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, tc.width, tc.height); ctx.drawImage(off, 0, 0);
  ctx.setTransform(dpr * V.k, 0, 0, dpr * V.k, dpr * V.tx, dpr * V.ty);
  for (let n = sel || hov; n; n = n.parent) { // path from the chosen repo down to the trunk
    ctx.strokeStyle = 'rgba(181,101,42,.85)'; ctx.lineWidth = Math.max(1.8 / V.k, n.w * .22);
    ctx.beginPath(); ctx.moveTo(n.x0, n.y0); ctx.quadraticCurveTo(n.cx, n.cy, n.x, n.y); ctx.stroke();
  }
  for (const nd of LEAVES) {
    const s = clamp(g - nd.depth - 1, 0, 1);
    if (s <= 0) continue;
    const r = nd.repo, fresh = clamp(1 - r.age / 720, .3, 1);
    const pulse = r.age < 60 && !REDUCED ? 1 + .16 * Math.sin(now / 380 + nd.x) : 1;
    const l = (12 + 7 * fresh + Math.min(8, r.s * 4)) * s * pulse * (nd === hov ? 1.5 : 1);
    const dim = r.on ? 1 : .12, col = RGB[r.t].join(',');
    ctx.fillStyle = `rgba(${col},${.05 * dim * fresh})`;
    ctx.beginPath(); ctx.arc(nd.x + Math.sin(nd.ang) * l / 2, nd.y - Math.cos(nd.ang) * l / 2, l * .8, 0, 7); ctx.fill();
    ctx.fillStyle = `rgba(${col},${(.6 + .4 * fresh) * dim})`;
    leafShape(ctx, nd.x, nd.y, nd.ang, l, l * .34); ctx.fill();
  }
  if (sel) { ctx.strokeStyle = '#16202b'; ctx.lineWidth = 1.5 / V.k; ctx.beginPath(); ctx.arc(sel.x + Math.sin(sel.ang) * 11, sel.y - Math.cos(sel.ang) * 11, 18, 0, 7); ctx.stroke(); }
  if (V.k > FIT * 2.4) { // repo names once zoomed in
    ctx.font = `${10 / V.k}px "Geist Mono",ui-monospace,monospace`; ctx.fillStyle = 'rgba(22,32,43,.8)';
    LEAVES.forEach(nd => nd.repo.on && ctx.fillText(nd.repo.n, nd.x + 8 / V.k + Math.sin(nd.ang) * 26, nd.y - Math.cos(nd.ang) * 26));
  }
  requestAnimationFrame(frame);
}

// ---------- view ----------
function resize() {
  const r = tc.getBoundingClientRect(); dpr = devicePixelRatio || 1; W = r.width; H = r.height;
  tc.width = off.width = W * dpr; tc.height = off.height = H * dpr;
  fit(); drawChart();
}
function fit() { // wide screens keep the headline column clear
  const wide = W >= 900, bx0 = wide ? Math.min(W * .34, 500) : 8, bx1 = W - (wide ? 24 : 8), by0 = wide ? 148 : 56, by1 = H - (wide ? 44 : 12);
  let x0 = -460, x1 = 460, y0 = 0, y1 = 70;
  NODES.forEach(n => { x0 = Math.min(x0, n.x - 30); x1 = Math.max(x1, n.x + 30); y0 = Math.min(y0, n.y - 34); });
  FIT = Math.min((bx1 - bx0) / (x1 - x0), (by1 - by0) / (y1 - y0));
  V = {k: FIT, tx: (bx0 + bx1) / 2 - (x0 + x1) / 2 * FIT, ty: (by0 + by1) / 2 - (y0 + y1) / 2 * FIT}; dirty = true;
}
function zoomAt(f, sx, sy) {
  const k = clamp(V.k * f, FIT * .7, FIT * 9); f = k / V.k;
  V.tx = sx - (sx - V.tx) * f; V.ty = sy - (sy - V.ty) * f; V.k = k; dirty = true; hideTip();
}
const toWorld = (sx, sy) => [(sx - V.tx) / V.k, (sy - V.ty) / V.k];
function pick(sx, sy) {
  const [x, y] = toWorld(sx, sy); let best = null, bd = (18 / V.k) ** 2;
  for (const nd of LEAVES) {
    if (!nd.repo.on) continue; // filtered-out leaves are dimmed and stay silent
    const d = (nd.x + Math.sin(nd.ang) * 10 - x) ** 2 + (nd.y - Math.cos(nd.ang) * 10 - y) ** 2;
    if (d < bd) { bd = d; best = nd; }
  }
  return best;
}
let drag = null;
tc.addEventListener('pointerdown', e => { tc.setPointerCapture(e.pointerId); drag = {x: e.offsetX, y: e.offsetY, tx: V.tx, ty: V.ty, moved: false}; });
tc.addEventListener('pointermove', e => {
  if (drag && (drag.moved || Math.hypot(e.offsetX - drag.x, e.offsetY - drag.y) > 4)) {
    drag.moved = true; tc.style.cursor = 'grabbing';
    V.tx = drag.tx + e.offsetX - drag.x; V.ty = drag.ty + e.offsetY - drag.y; dirty = true; hideTip(); return;
  }
  hov = pick(e.offsetX, e.offsetY);
  hov ? showTip(hov.repo, e.offsetX, e.offsetY) : hideTip();
  tc.style.cursor = hov ? 'pointer' : 'grab';
});
tc.addEventListener('pointerup', e => {
  if (drag && !drag.moved) { sel = pick(e.offsetX, e.offsetY); showCard(sel && sel.repo); drawChart(); }
  drag = null; tc.style.cursor = 'grab';
});
tc.addEventListener('pointercancel', () => { drag = null; });
tc.addEventListener('pointerleave', () => { hov = null; hideTip(); });
tc.addEventListener('wheel', e => { // plain scroll keeps scrolling the page; ctrl/pinch zooms the tree
  if (!e.ctrlKey && !e.metaKey) return;
  e.preventDefault(); zoomAt(Math.exp(-e.deltaY * .0025), e.offsetX, e.offsetY);
}, {passive: false});
$('bIn').onclick = () => zoomAt(1.4, W / 2, H / 2);
$('bOut').onclick = () => zoomAt(1 / 1.4, W / 2, H / 2);
$('bFit').onclick = fit;
$('bRe').onclick = () => { t0 = REDUCED ? -1e9 : performance.now(); };

// ---------- tooltip & detail card (textContent only: descriptions come from GitHub) ----------
const tip = $('tip'), card = $('card');
const fmtDate = s => new Date(s).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'});
const dot = t => { const i = h('i', 'dot'); i.style.background = TC[t]; return i; };
function arrow() {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('class', 'ico'); s.setAttribute('aria-hidden', 'true');
  s.innerHTML = '<path d="M7 17 17 7M9 7h8v8"/>';
  return s;
}
function fillInfo(el, r) {
  const tool = h('div', 'meta'); tool.append(dot(r.t), `${r.t} · ${r.c}`);
  el.replaceChildren(h('b', null, r.n), h('p', null, r.d || 'Tanpa deskripsi'), tool,
    h('div', 'meta', `Diperbarui ${fmtDate(r.p)} · ${(r.z / 1024).toFixed(1)} MB · ${r.s} bintang`));
}
function showTip(r, x, y) {
  fillInfo(tip, r); tip.hidden = false;
  tip.style.left = Math.min(x + 16, W - tip.offsetWidth - 8) + 'px';
  tip.style.top = Math.max(8, y - tip.offsetHeight - 12) + 'px';
}
function hideTip() { tip.hidden = true; }
function showCard(r) {
  if (!r) { card.hidden = true; return; }
  fillInfo(card, r);
  const a = h('a', 'btn', 'Buka di GitHub'); a.href = r.url; a.target = '_blank'; a.rel = 'noopener'; a.append(arrow());
  const x = h('button', 'close', 'Tutup'); x.onclick = () => { sel = null; card.hidden = true; drawChart(); };
  const row = h('div', 'card-actions'); row.append(a, x);
  card.append(row); card.hidden = false;
}

// ---------- filters ----------
const F = {cat: null, tool: null, q: ''};
function applyFilter() {
  const q = F.q.toLowerCase();
  REPOS.forEach(r => r.on = (!F.cat || r.c === F.cat) && (!F.tool || r.t === F.tool)
    && (!q || (r.n + ' ' + r.d + ' ' + r.c).toLowerCase().includes(q)));
  (function on(nd) { return nd.on = nd.repo ? nd.repo.on : nd.kids.map(on).some(Boolean); })(ROOT);
  if (sel && !sel.repo.on) { sel = null; card.hidden = true; }
  const shown = REPOS.filter(r => r.on).length;
  $('status').textContent = shown === REPOS.length ? '' : `${shown} dari ${REPOS.length} repo cocok`;
  dirty = true; lists(); drawChart();
}
function lists() {
  $('tools').replaceChildren(...Object.keys(TC).map(t => {
    const b = h('button', 'chip'); b.setAttribute('aria-pressed', F.tool === t);
    b.append(dot(t), t, h('span', 'n', countBy(t)));
    b.onclick = () => { F.tool = F.tool === t ? null : t; applyFilter(); };
    return b;
  }));
  $('cats').replaceChildren(...CATS.map(c => {
    const b = h('button', 'cat'); b.setAttribute('aria-pressed', F.cat === c.name);
    const top = h('div', 'cat-top'); top.append(h('span', 'cat-name', c.name), h('span', 'n', c.list.length));
    const bar = h('div', 'comp');
    Object.keys(TC).forEach(t => {
      const n = c.list.filter(r => r.t === t).length;
      if (!n) return;
      const s = h('span'); s.style.flex = n; s.style.background = TC[t]; s.title = `${t}: ${n}`; bar.append(s);
    });
    b.append(top, bar);
    b.onclick = () => {
      F.cat = F.cat === c.name ? null : c.name; applyFilter();
      if (F.cat) $('pohon').scrollIntoView({behavior: REDUCED ? 'auto' : 'smooth'});
    };
    return b;
  }));
}
$('q').addEventListener('input', e => { F.q = e.target.value.trim(); applyFilter(); });

// ---------- size chart: one bar per repo, ordered left to right like the leaves ----------
const cc = $('chart'), cx2 = cc.getContext('2d');
const BARS = [...LEAVES].sort((a, b) => a.x - b.x);
let cHov = -1;
function drawChart() {
  const r = cc.getBoundingClientRect(), d = devicePixelRatio || 1, w = r.width, ht = r.height;
  cc.width = w * d; cc.height = ht * d; cx2.setTransform(d, 0, 0, d, 0, 0);
  const bw = w / BARS.length, hs = BARS.map(nd => Math.log2(nd.repo.z + 2)), mx = Math.max(...hs) * 1.1;
  cx2.strokeStyle = 'rgba(22,32,43,.07)'; cx2.lineWidth = 1;
  for (let i = 1; i < 4; i++) { cx2.beginPath(); cx2.moveTo(0, ht * i / 4); cx2.lineTo(w, ht * i / 4); cx2.stroke(); }
  BARS.forEach((nd, i) => {
    const hot = i === cHov || nd === sel;
    cx2.fillStyle = hot ? '#16202b' : nd.repo.on ? TC[nd.repo.t] : 'rgba(22,32,43,.1)';
    cx2.globalAlpha = hot ? 1 : .85;
    const bh = hs[i] / mx * (ht - 8); cx2.fillRect(i * bw, ht - bh, Math.max(1, bw - .6), bh);
  });
  cx2.globalAlpha = 1; cx2.strokeStyle = 'rgba(22,32,43,.55)'; cx2.lineWidth = 1.2; cx2.beginPath(); // moving average
  hs.forEach((_, i) => {
    const a = hs.slice(Math.max(0, i - 8), i + 9), m = a.reduce((s, v) => s + v) / a.length;
    const x = i * bw + bw / 2, y = ht - m / mx * (ht - 8); i ? cx2.lineTo(x, y) : cx2.moveTo(x, y);
  });
  cx2.stroke();
}
const cIdx = e => clamp(Math.floor(e.offsetX / cc.clientWidth * BARS.length), 0, BARS.length - 1);
const cLabel = () => $('ctip').textContent = 'Arahkan ke batang untuk melihat repo, klik untuk detail di pohon';
cc.addEventListener('pointermove', e => {
  const i = cIdx(e);
  if (!BARS[i].repo.on) { cHov = -1; hov = null; cLabel(); drawChart(); return; } // same rule as the tree: filtered-out repos stay silent
  cHov = i; hov = BARS[i]; const r = hov.repo; $('ctip').textContent = `${r.n} · ${(r.z / 1024).toFixed(2)} MB · ${r.t}`; drawChart();
});
cc.addEventListener('pointerleave', () => { cHov = -1; hov = null; cLabel(); drawChart(); });
cc.addEventListener('click', e => {
  if (!BARS[cIdx(e)].repo.on) return;
  sel = BARS[cIdx(e)]; showCard(sel.repo); drawChart();
  $('pohon').scrollIntoView({behavior: REDUCED ? 'auto' : 'smooth'});
});

// ---------- copy that depends on the data ----------
function summary() {
  const tools = Object.keys(TC).filter(t => t !== 'Lainnya').sort((a, b) => countBy(b) - countBy(a));
  const active = REPOS.filter(r => r.age < 90).length, mb = REPOS.reduce((s, r) => s + r.z, 0) / 1024;
  document.querySelectorAll('[data-count]').forEach(e => e.textContent = REPOS.length);
  if (typeof D_DATE === 'string') $('snap').textContent = `Data dari GitHub API, diperbarui ${fmtDate(D_DATE)}`;
  $('nCat').textContent = CATS.length;
  $('facts').textContent = `${CATS[0].name} jadi cabang paling rimbun dengan ${CATS[0].list.length} repo, disusul ${CATS[1].name} (${CATS[1].list.length}). `
    + `${tools[0]} dipakai di ${countBy(tools[0])} repo, ${tools[1]} di ${countBy(tools[1])}, ${tools[2]} di ${countBy(tools[2])}. `
    + `${active} repo diperbarui dalam 90 hari terakhir, total ${mb.toFixed(0)} MB.`;
  const recent = [...REPOS].sort((a, b) => b.p.localeCompare(a.p) || b.cr.localeCompare(a.cr)).slice(0, 8);
  $('recent').replaceChildren(...recent.map(r => {
    const a = h('a', 'rec'); a.href = r.url; a.target = '_blank'; a.rel = 'noopener';
    const main = h('div', 'rec-main'); main.append(h('b', null, r.n), h('p', null, r.d || r.c));
    const meta = h('div', 'rec-meta'); meta.append(dot(r.t), r.t, h('span', 'date', fmtDate(r.p)));
    a.append(main, meta, arrow());
    return a;
  }));
}

applyFilter(); summary(); cLabel();
new ResizeObserver(resize).observe(tc); // fires once on start, then whenever the hero's box changes
requestAnimationFrame(frame);
