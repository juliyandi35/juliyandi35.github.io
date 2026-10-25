// Nalarata. Number, owner, and brand live on <body data-*> in index.html.
// Every link and all content work without this file; it adds the live plot, the ledger dots,
// the tabs and composer, and the scroll reveals.
(() => {
  const { wa, owner, brand } = document.body.dataset;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const ease = (t) => 1 - (1 - t) ** 3;
  const comma = (v, d = 2) => v.toFixed(d).replace('.', ',');

  // Runs fn(eased t) for dur ms; returns a cancel function.
  function tween(dur, fn, done) {
    let id, t0;
    const step = (now) => {
      t0 ??= now;
      const t = Math.min(1, (now - t0) / dur);
      fn(ease(t));
      if (t < 1) id = requestAnimationFrame(step); else if (done) done();
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }

  // Adds .in once an element is on screen. Without IntersectionObserver, everything is shown.
  function onceVisible(els, cb, threshold = 0.25) {
    if (!('IntersectionObserver' in window)) { els.forEach((el) => { el.classList.add('in'); cb && cb(el); }); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
      cb && cb(e.target);
    }), { threshold });
    els.forEach((el) => io.observe(el));
  }

  const viridis = (t) => {
    const s = [[68, 1, 84], [59, 82, 139], [33, 144, 140], [93, 200, 99], [253, 231, 37]];
    const k = Math.min(3.999, Math.max(0, t) * 4), i = Math.floor(k), f = k - i;
    return `rgb(${s[i].map((v, j) => Math.round(v + (s[i + 1][j] - v) * f)).join(',')})`;
  };

  /* ---------- Hero: draggable scatter with a live least-squares fit ---------- */
  (() => {
    const svg = $('#plot');
    if (!svg) return;
    const NS = 'http://www.w3.org/2000/svg';
    const L = 52, R = 584, T = 16, B = 368, W = R - L, H = B - T;
    const ORIG = [[1, 1.6], [1.7, 2.3], [2.2, 2.1], [2.8, 3.6], [3.3, 3.1], [3.9, 4.4], [4.4, 4.0], [5, 5.5], [5.6, 5.0], [6.1, 6.4], [6.8, 6.0], [7.4, 7.3], [8.2, 7.9], [9, 8.8]];
    const data = ORIG.map((p) => p.slice());
    const sx = (x) => L + (x / 10) * W, sy = (y) => B - (y / 10) * H;
    const clamp = (v) => Math.max(0, Math.min(10, v));
    const el = (n, a, p = svg) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };

    const clip = el('clipPath', { id: 'plot-area' }, el('defs', {}));
    el('rect', { x: L, y: T, width: W, height: H }, clip);
    const grid = el('g', { class: 'grid' });
    for (let i = 0; i <= 10; i += 2) {
      el('line', { x1: sx(i), x2: sx(i), y1: T, y2: B }, grid);
      el('line', { x1: L, x2: R, y1: sy(i), y2: sy(i) }, grid);
      el('text', { x: sx(i), y: B + 20, 'text-anchor': 'middle' }).textContent = i;
      el('text', { x: L - 10, y: sy(i) + 4, 'text-anchor': 'end' }).textContent = i;
    }
    el('line', { class: 'axis', x1: L, x2: R, y1: B, y2: B });
    el('line', { class: 'axis', x1: L, x2: L, y1: T, y2: B });
    el('text', { x: (L + R) / 2, y: B + 44, 'text-anchor': 'middle' }).textContent = 'variabel bebas (X)';
    el('text', { x: 14, y: (T + B) / 2, 'text-anchor': 'middle', transform: `rotate(-90 14 ${(T + B) / 2})` }).textContent = 'variabel terikat (Y)';

    const res = el('g', { class: 'res', 'clip-path': 'url(#plot-area)' });
    const resLines = data.map(() => el('line', {}, res));
    const fitLine = el('line', { class: 'fit', pathLength: 1, 'clip-path': 'url(#plot-area)' });

    const pts = data.map((d, i) => {
      const g = el('g', { class: 'pt', tabindex: 0, role: 'button', 'aria-roledescription': 'titik yang bisa digeser' });
      g.style.setProperty('--d', `${i * 45}ms`);
      return { g, hit: el('circle', { class: 'hit', r: 26 }, g), ring: el('circle', { class: 'ring', r: 18 }, g), dot: el('circle', { class: 'dot', r: 10 }, g) };
    });

    const ro = { a: $('#ro-a'), b: $('#ro-b'), r: $('#ro-r') };
    const status = $('#plot-status');

    function fit() {
      const n = data.length;
      const mx = data.reduce((s, d) => s + d[0], 0) / n, my = data.reduce((s, d) => s + d[1], 0) / n;
      let sxy = 0, sxx = 0, syy = 0;
      data.forEach(([x, y]) => { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; syy += (y - my) ** 2; });
      const b = sxx ? sxy / sxx : 0;
      return { a: my - b * mx, b, r2: sxx && syy ? (sxy * sxy) / (sxx * syy) : 0 };
    }

    const readout = (f, k = 1) => { ro.a.textContent = comma(f.a * k); ro.b.textContent = comma(f.b * k); ro.r.textContent = comma(f.r2 * k); };

    let countUp = null;
    function draw() {
      const f = fit();
      fitLine.setAttribute('x1', sx(0)); fitLine.setAttribute('y1', sy(f.a));
      fitLine.setAttribute('x2', sx(10)); fitLine.setAttribute('y2', sy(f.a + f.b * 10));
      data.forEach(([x, y], i) => {
        const p = pts[i], cx = sx(x), cy = sy(y), yhat = f.a + f.b * x;
        [p.hit, p.ring, p.dot].forEach((c) => { c.setAttribute('cx', cx); c.setAttribute('cy', cy); });
        p.dot.setAttribute('fill', viridis(Math.min(1, Math.abs(y - yhat) / 2.5)));
        p.g.setAttribute('aria-label', `Titik ${i + 1}: x ${comma(x, 1)}, y ${comma(y, 1)}`);
        const r = resLines[i];
        r.setAttribute('x1', cx); r.setAttribute('x2', cx); r.setAttribute('y1', cy); r.setAttribute('y2', sy(yhat));
      });
      if (!countUp) readout(f);
      return f;
    }

    const announce = () => { const f = fit(); status.textContent = `Garis baru: y sama dengan ${comma(f.a)} tambah ${comma(f.b)} x. R kuadrat ${comma(f.r2)}.`; };
    const stopIntro = () => { if (countUp) { countUp(); countUp = null; draw(); } };

    let resetting = null;
    pts.forEach((p, i) => {
      const pos = (e) => {
        const r = svg.getBoundingClientRect(), k = 600 / r.width;
        return [clamp(((e.clientX - r.left) * k - L) / W * 10), clamp((B - (e.clientY - r.top) * k) / H * 10)];
      };
      p.g.addEventListener('pointerdown', (e) => {
        stopIntro(); if (resetting) { resetting(); resetting = null; }
        p.g.setPointerCapture(e.pointerId); p.g.classList.add('drag');
      });
      p.g.addEventListener('pointermove', (e) => { if (!p.g.classList.contains('drag')) return; data[i] = pos(e); draw(); });
      const end = () => { if (!p.g.classList.contains('drag')) return; p.g.classList.remove('drag'); announce(); };
      p.g.addEventListener('pointerup', end);
      p.g.addEventListener('pointercancel', end);
      p.g.addEventListener('keydown', (e) => {
        const s = { ArrowUp: [0, 0.25], ArrowDown: [0, -0.25], ArrowLeft: [-0.25, 0], ArrowRight: [0.25, 0] }[e.key];
        if (!s) return;
        e.preventDefault(); stopIntro();
        data[i] = [clamp(data[i][0] + s[0]), clamp(data[i][1] + s[1])];
        draw(); announce();
      });
    });

    $('#reset').addEventListener('click', () => {
      stopIntro();
      if (resetting) resetting();
      const from = data.map((d) => d.slice());
      const back = (t) => { data.forEach((d, i) => { d[0] = from[i][0] + (ORIG[i][0] - from[i][0]) * t; d[1] = from[i][1] + (ORIG[i][1] - from[i][1]) * t; }); draw(); };
      if (reduce) { back(1); announce(); return; }
      resetting = tween(650, back, () => { resetting = null; announce(); });
    });

    const f0 = draw();
    if (!reduce) {
      svg.classList.add('intro');
      readout(f0, 0);
      countUp = () => {};
      setTimeout(() => {
        if (!countUp) return;
        countUp = tween(1000, (t) => readout(f0, t), () => { countUp = null; draw(); });
      }, 1100);
    }
  })();

  /* ---------- Ledger: 280 dots, one per project, filled as the sentence scrolls in ---------- */
  (() => {
    const box = $('#dots'), count = $('#count');
    if (!box) return;
    const N = 280, frag = document.createDocumentFragment();
    for (let i = 0; i < N; i++) {
      const dot = document.createElement('i');
      const a = (i / N) * 70; // start of this dot's fill, percent of the dot field's entry range
      dot.style.cssText = `--i:${i};--c:${viridis((i / (N - 1)) * 0.8)};--a:${a.toFixed(1)}%;--z:${Math.min(100, a + 30).toFixed(1)}%`;
      frag.appendChild(dot);
    }
    box.appendChild(frag);
    if (reduce) { box.classList.add('in'); return; }
    count.textContent = '0';
    onceVisible([box], () => tween(1600, (t) => { count.textContent = Math.round(N * t); }), 0.2);
  })();

  /* ---------- Services: tabs, sheet tone, and the WhatsApp composer ---------- */
  const SERVICE = {
    skripsi: 'olah data dan bimbingan statistik untuk skripsi atau tesis',
    riset: 'konsultasi riset dan analisis data',
    tutor: 'tutoring',
  };
  const link = (text) => `https://wa.me/${wa}?text=${encodeURIComponent(text)}`;
  const opener = `Halo ${owner}, saya dari website ${brand}.`;
  $$('[data-wa="general"]').forEach((a) => { a.href = link(`${opener} Saya mau tanya soal layanan olah data dan riset.`); });

  (() => {
    const tabs = $$('[role="tab"]');
    const sheet = $('#sheet'), preview = $('#preview'), send = $('#send');
    if (!tabs.length || !sheet) return;
    let current = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
    const deadline = () => $('input[name="deadline"]:checked').value;
    const ink = (s) => { const e = document.createElement('span'); e.className = 'ink'; e.textContent = s; return e; };

    function update() {
      const service = SERVICE[current.dataset.service], when = deadline();
      // Fresh spans each time, so the highlighter redraws.
      preview.replaceChildren(`${opener} Saya mau tanya soal `, ink(service), '. Deadline saya ', ink(when), '. Mohon info ruang lingkup dan harganya.');
      send.href = link(`${opener} Saya mau tanya soal ${service}. Deadline saya ${when}. Mohon info ruang lingkup dan harganya.`);
    }

    function select(tab, focus) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        $(`#${t.getAttribute('aria-controls')}`).classList.toggle('is-on', on);
      });
      current = tab;
      sheet.dataset.tone = tab.dataset.service;
      if (focus) tab.focus();
      update();
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', (e) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], true); }
        else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); select(tabs[e.key === 'Home' ? 0 : tabs.length - 1], true); }
      });
    });
    $$('input[name="deadline"]').forEach((r) => r.addEventListener('change', update));
    update();
  })();

  /* ---------- Scroll reveals: pen marks, work flow, portraits ---------- */
  onceVisible($$('.mark'), null, 0.35);
  onceVisible($$('#flow'), null, 0.4);
  onceVisible($$('.about__figs'), null, 0.2);

  /* ---------- Certificates: native dialog lightbox ---------- */
  (() => {
    const dlg = $('#lightbox');
    if (!dlg || typeof dlg.showModal !== 'function') return; // links still open the image
    const img = $('#lb-img'), cap = $('#lb-cap');
    let opener = null;
    $$('.cert__open').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      opener = a;
      const thumb = a.querySelector('img');
      img.src = a.href; img.alt = thumb.alt;
      img.setAttribute('width', thumb.getAttribute('width')); img.setAttribute('height', thumb.getAttribute('height'));
      cap.textContent = a.closest('.cert').querySelector('.cert__cap').textContent;
      dlg.showModal();
    }));
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => { if (opener) opener.focus(); });
  })();
})();
