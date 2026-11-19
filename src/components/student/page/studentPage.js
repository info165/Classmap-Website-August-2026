/* ==========================================================================
   ClassMap — Boards Homepage · interactions
   Vanilla JS, no dependencies.
   ========================================================================== */
/* eslint-disable */
// @ts-nocheck
/**
 * The For Students page's interactions, from the standalone page, run inside the
 * site. `root` is the page's shadow root; every listener, timer and animation
 * frame is tracked so leaving the page stops all of it.
 */
export function mount(root, host) {
  let dead = false;
  const undo = [];
  const listen = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); undo.push(() => t.removeEventListener(ev, fn, o)); };
  const addEventListener = (ev, fn, o) => listen(window, ev, fn, o);
  const timers = new Set(), ticks = new Set(), frames = new Set();
  const setTimeout = (fn, ms, ...a) => { const id = window.setTimeout(() => { timers.delete(id); if (!dead) fn(...a); }, ms); timers.add(id); return id; };
  const clearTimeout = (id) => { timers.delete(id); window.clearTimeout(id); };
  const setInterval = (fn, ms, ...a) => { const id = window.setInterval(() => { if (!dead) fn(...a); }, ms); ticks.add(id); return id; };
  const clearInterval = (id) => { ticks.delete(id); window.clearInterval(id); };
  const requestAnimationFrame = (fn) => { const id = window.requestAnimationFrame((t) => { frames.delete(id); if (!dead) fn(t); }); frames.add(id); return id; };
  const cancelAnimationFrame = (id) => { frames.delete(id); window.cancelAnimationFrame(id); };

  /* ---------- CONFIG — edit these ---------- */
  const CONFIG = {
    // CBSE Class 10 Boards 2027 — first exam. Update when the official date sheet is out.
    examDate: null, // null = read from <div id="count" data-exam="...">
    price: 1299,
    discountPct: 40
  };

  const $  = (s, r = root) => r.querySelector(s);
  const $$ = (s, r = root) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ======================================================================
     1. PHONE SCREENS  +  THE PINNED STORY
        One phone stays fixed while the screen, island and text change as
        you scroll (desktop: text beside it · mobile: text beneath it).
     ====================================================================== */
  const mark = '<img src="/student-page/assets/logo-mark.png" alt="">';
  const ICONS = '<svg viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx=".8"/><rect x="5" y="5.5" width="3" height="6.5" rx=".8"/><rect x="10" y="3" width="3" height="9" rx=".8"/><rect x="15" y="0" width="3" height="12" rx=".8"/></svg>'
    + '<svg viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M1 4.2a10 10 0 0 1 14 0M3.4 6.8a6.4 6.4 0 0 1 9.2 0M5.9 9.3a2.8 2.8 0 0 1 4.2 0"/></svg>'
    + '<svg viewBox="0 0 26 12" fill="none"><rect x=".6" y=".6" width="21" height="10.8" rx="3" stroke="currentColor" opacity=".55"/><rect x="2" y="2" width="16" height="8" rx="1.8" fill="currentColor"/><rect x="23" y="4" width="2" height="4" rx="1" fill="currentColor" opacity=".55"/></svg>';
  const tick = '<span class="tick"><svg viewBox="0 0 12 12" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.3l2.4 2.4 4.6-5"/></svg></span>';

  const ORDER = ['splash', 'pick', 'base', 'weak', 'mock', 'pal', 'report'];
  const LABELS = ['', 'Step 1 · Topic', 'Step 2 · Base test', 'Step 3 · Weak topics', 'Step 4 · Mock papers', 'Step 5 · PAL', 'Step 6 · Report'];
  const TITLES = ['ClassMap Student Portal', 'Pick a topic', 'Take the Base Test', 'See your weak topics', 'Attempt CBSE mock papers', 'Take your adaptive test', 'Get your analysis report'];

  const chrome = n => `<div class="segs">${[1, 2, 3, 4, 5, 6].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</div><div class="crow"><b>ClassMap</b><span>STEP ${n} OF 6</span></div>`;
  const trow = (name, i, sel) => `<div class="trow pop ${sel ? 'sel' : ''}" style="--i:${i}">${name}${tick}</div>`;
  const wrow = (name, cls, label, i, hi) => `<div class="wrow ${cls} ${hi ? 'hi' : ''}" style="--i:${i}"><i></i><span class="nm">${name}</span><span class="st">${label}</span></div>`;
  const paper = (name, i, first) => `<div class="paper-card pop ${first ? 'first' : ''}" style="--i:${i}"><span class="pi"></span><span><b>${name}</b><small>Previous year · 3 hrs</small></span><span class="go">Attempt</span></div>`;
  const opt = (l, t, i, pick) => `<div class="opt pop ${pick ? 'pick' : ''}" style="--i:${i}"><b>${l}</b>${t}</div>`;
  const rl = (cls, ic, a, b, i) => `<div class="rl ${cls} pop" style="--i:${i}"><i>${ic}</i><span>${a}<small>${b}</small></span></div>`;


  /* ---- real-app "Pick a topic" screen: chapter cards with progress rings ---- */
  const TI = {
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.2 3 3.2 15 0 18M12 3c-3.2 3-3.2 15 0 18"/></svg>',
    flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6L5 19a1.6 1.6 0 0 0 1.4 2.2h11.2A1.6 1.6 0 0 0 19 19l-5-10V3"/><path d="M7.6 15h8.8"/></svg>',
    atom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="1.7" fill="currentColor"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c0-9.5 5-14 14.500-14C19.500 14.500 14.500 19 5 19z"/><path d="M5 19c3-5.500 6-8.500 10.500-10.500"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2.500L4.500 13.500h6.500l-1 8 9-11.500h-6.500z"/></svg>',
    micro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21h12M12 17.500a5.500 5.500 0 0 0 5.500-5.500V4M9.500 4h8M11 2v4M8 17.500h8"/></svg>',
    drops: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3.500c2.500 3 4.300 5 4.300 7.300a4.300 4.300 0 0 1-8.600 0C3.700 8.500 5.500 6.500 8 3.500zM16.500 11c1.900 2.200 3.200 3.700 3.200 5.400a3.200 3.200 0 0 1-6.400 0c0-1.700 1.300-3.200 3.200-5.400z"/></svg>',
    magnet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.900" stroke-linecap="round" stroke-linejoin="round"><path d="M5 14.500V10a7 7 0 0 1 14 0v4.500M5 14.500h4V10a3 3 0 0 1 6 0v4.500h4M5 14.500V18h4v-3.500M15 14.500V18h4v-3.500"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.900" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2.500M12 18.500V21M3 12h2.500M18.500 12H21M5.600 5.600l1.800 1.800M16.600 16.600l1.800 1.800M5.600 18.400l1.800-1.800M16.600 7.400l1.800-1.800"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.500l2 5.500 5.500 2-5.500 2-2 5.500-2-5.500-5.500-2 5.500-2zM19 15l.9 2.100L22 18l-2.100.9L19 21l-.9-2.100L16 18l2.100-.9z"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round"><path d="M5 20v-8M12 20V5M19 20v-5"/></svg>',
    clip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.900" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4.500" width="14" height="16.500" rx="2.500"/><path d="M9 4.500V3.500h6v1M9 11h6M9 15h4"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linejoin="round"><path d="M12 3.500l2.600 5.400 5.900.8-4.300 4.100 1 5.800L12 16.800 6.800 19.600l1-5.800L3.500 9.700l5.900-.8z"/></svg>',
    coin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="12" r="6"/><path d="M15.500 6.500a6 6 0 0 1 0 11M7 12h4"/></svg>',
    flame: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.500c.5 3-1.500 4.500-3 6.500-1.600 2.100-2.200 4.200-1.200 6.600C9 18.700 10.800 20 12 20s4-1 4.400-4c.200-1.700-.5-3-1.400-4.200 0 1.400-.7 2.200-1.600 2.200 1-2.600.700-6.500-1.400-11.500z" opacity=".95"/></svg>',
    calc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.900" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2.500"/><path d="M8.500 7.500h7M8.500 12h.01M12 12h.01M15.500 12h.01M8.500 16h.01M12 16h.01M15.500 16h.01"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.900" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4.500A1.500 1.500 0 0 1 6.500 3H19v15H6.500A1.500 1.500 0 0 0 5 19.500z"/><path d="M5 19.500A1.500 1.500 0 0 0 6.500 21H19M9 8h6M9 12h4"/></svg>',
    ball: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3.500 9h17M3.500 15h17M12 3c-3 3-3 15 0 18"/></svg>'
  };
  const RC = 15.2; // ring radius (viewBox 36) -> circumference ~95.5
  const ring = (n, col) => `<span class="tp-ring" style="--p:${n};--c:${col}"><svg viewBox="0 0 36 36"><circle class="bg" cx="18" cy="18" r="${RC}"/><circle class="fg" cx="18" cy="18" r="${RC}"/></svg><b>${n}</b></span>`;
  const newRing = '<span class="tp-ring new"><b>New</b></span>';
  // theme, icon, chapter no, title, ring, tags, button
  const tpc = (th, icon, ch, title, rg, opts = {}) => `<div class="tpc ${th} ${opts.sel ? 'tp-sel' : ''} pop" style="--i:${opts.i || 0}">
      <div class="tpc-top"><span class="tpc-ic">${TI[icon]}</span>${rg}</div>
      <div class="tpc-meta"><span class="tpc-ch">CHAPTER ${ch}</span>${opts.pal ? `<span class="tpc-pal">${TI.spark}PAL</span>` : ''}${opts.star ? `<span class="tpc-star">${TI.star}</span>` : ''}</div>
      <div class="tpc-title">${title}</div>
      <div class="tpc-act"><span class="tpc-chart">${TI.chart}</span><span class="tpc-btn">${opts.base ? TI.clip + 'Base test' : TI.spark + 'PAL test'}</span></div>
      ${opts.sel ? '<i class="tp-ripple"></i>' : ''}
    </div>`;
  const tnav = (cls, icon, label, on) => `<span class="tn ${cls} ${on ? 'on' : ''}"><i>${TI[icon]}</i>${label}</span>`;

  const SCREENS = {
    splash: `<div class="app splash"><i class="sp-ring"></i><i class="sp-ring r2"></i>
      <div class="sp-logo">${mark}</div><div class="sp-name">ClassMap</div><div class="sp-sub">Your Boards, mapped.</div>
      <div class="sp-btn">Scroll to begin ↓</div></div>`,

    pick: `<div class="app tp">
      <div class="tp-head pop" style="--i:0">
        <span class="tp-brand"><span class="tp-logo">${mark}</span>Class<em>Map</em></span>
        <span class="tp-pills"><span class="tp-pill coin">${TI.coin}10</span><span class="tp-pill fire">${TI.flame}3</span></span>
        <span class="tp-av"><b>T</b><small>PRO</small></span>
      </div>
      <div class="tp-grid">
        ${tpc('pink', 'bolt', 4, 'Carbon and its Compounds', newRing, { i: 1, star: true, base: true, sel: true })}
        ${tpc('blue', 'micro', 5, 'Life Processes', ring(53, '#F59E0B'), { i: 2, star: true, base: true })}
        ${tpc('teal', 'drops', 7, 'Magnetic Effects of Electric Current', newRing, { i: 3, star: true, base: true })}
        ${tpc('orange', 'magnet', 8, 'Our Environment', newRing, { i: 4, star: true, base: true })}
        ${tpc('magenta', 'sun', 9, 'Sustainable Management of Natural Resources', newRing, { i: 5, star: true, base: true })}
        ${tpc('cyan', 'book', 10, 'Control And Coordination', ring(53, '#F59E0B'), { i: 6, star: true, base: true })}
      </div>
      <div class="tp-nav">${tnav('maths', 'calc', 'Maths')}${tnav('sci', 'flask', 'Science', true)}${tnav('eng', 'book', 'English')}${tnav('soc', 'ball', 'Social')}</div></div>`,

    base: `<div class="app bs">
      <!-- A · setup sheet -->
      <div class="bs-a">
        <div class="bs-ah"><b>Base test · Carbon and its Compounds</b><i><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.700" stroke-linecap="round"><path d="M3.500 3.500l9 9M12.500 3.500l-9 9"/></svg></i></div>
        <div class="bs-hero"><div class="bs-hl"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.500l1.400 3.700 3.700 1.400-3.700 1.400L8 11.700 6.600 8 2.900 6.600l3.700-1.400zM12.500 10.500l.6 1.500 1.500.6-1.500.6-.6 1.500-.6-1.500-1.500-.6 1.500-.6z"/></svg>SMART TEST</div><div class="bs-ht">A test built for you</div><div class="bs-hp">Pick what to cover and how long you have. We choose the questions from your own answers.</div></div>
        <div class="bs-k">1 · KIND OF TEST</div>
        <div class="bs-seg"><span class="s1 rip">Objective</span><span>Written answers</span><span>Objective + written</span></div>
        <div class="bs-k">2 · HOW LONG</div>
        <div class="bs-dur"><span class="d1 rip">30 min</span><span>1 hour</span><span>1 h 30 min</span><span>2 hours</span><span>2 h 30 min</span><span>3 hours</span></div>
        <div class="bs-sum"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.600" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 4.500V8l2.300 1.400"/></svg><b class="q"></b> questions<u>·</u><b class="m"></b> marks<em>, from the questions in your topics.</em></div>
        <div class="bs-k t3"><span>3 · TOPICS IN CARBON AND ITS COMPOUNDS</span><u>Clear</u></div>
        <div class="bs-tl">
            <div class="bs-tp" style="--c:2.30s"><span class="bs-ck"><svg viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"><path d="M3.500 8.300l3 3 6-6.500"/></svg></span><span>Covalent Bonding and Carbon's Structure</span></div>
            <div class="bs-tp" style="--c:2.50s"><span class="bs-ck"><svg viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"><path d="M3.500 8.300l3 3 6-6.500"/></svg></span><span>Catenation, Saturation, and the Homologous Series</span></div>
            <div class="bs-tp" style="--c:2.70s"><span class="bs-ck"><svg viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"><path d="M3.500 8.300l3 3 6-6.500"/></svg></span><span>Functional Groups and Nomenclature of Carbon Compounds</span></div>
            <div class="bs-tp" style="--c:2.90s"><span class="bs-ck"><svg viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"><path d="M3.500 8.300l3 3 6-6.500"/></svg></span><span>Chemical Properties of Carbon Compounds</span></div>
            <div class="bs-tp" style="--c:3.10s"><span class="bs-ck"><svg viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"><path d="M3.500 8.300l3 3 6-6.500"/></svg></span><span>Ethanol, Ethanoic Acid, Soaps and Detergents</span></div>
        </div>
        <div class="bs-start"><div class="bs-go"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.500l1.400 3.700 3.700 1.400-3.700 1.400L8 11.700 6.600 8 2.900 6.600l3.700-1.400zM12.500 10.500l.6 1.500 1.500.6-1.500.6-.6 1.500-.6-1.500-1.500-.6 1.500-.6z"/></svg>Start test</div></div>
      </div>
      <!-- B · the exam -->
      <div class="bs-b">
        <div class="bs-bh pop" style="--i:0">
          <i class="bs-x"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.700" stroke-linecap="round"><path d="M3.500 3.500l9 9M12.500 3.500l-9 9"/></svg></i>
          <div class="bs-pg"><small>SMART TEST · 5 TOPICS</small><div class="bs-bar"><i></i></div></div>
          <span class="bs-clock"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.600" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 4.500V8l2.300 1.400"/></svg><b>29:35</b></span><span class="bs-cnt">2/5</span>
        </div>
        <div class="bs-chips pop" style="--i:1"><span class="bs-q2">Q2</span><span class="bs-sec">SECTION A · OBJECTIVE</span><span class="bs-qt"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.600" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 4.500V8l2.300 1.400"/></svg><b>0:15</b> / 1:10</span></div>
        <div class="bs-question pop" style="--i:2">Among hydrocarbons, what are the SATURATED hydrocarbons (like methane, ethane) called?</div>
        <div class="bs-opts">
          <div class="bs-o a pop" style="--i:3"><b>A</b>Alkynes</div>
          <div class="bs-o b pop" style="--i:4"><b>B</b>Alkenes</div>
          <div class="bs-o c pop" style="--i:5"><b>C</b>Aromatics</div>
          <div class="bs-o d pop pick" style="--i:6"><b>D</b>Alkanes</div>
        </div>
        <div class="bs-mid pop" style="--i:7"><span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.500" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12.500h4M6.500 14h3M8 2a4 4 0 0 0-2.200 7.300c.4.300.7.800.7 1.300V11h3v-.4c0-.5.300-1 .7-1.300A4 4 0 0 0 8 2z"/></svg>Need a hint?</span><span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.500" stroke-linecap="round" stroke-linejoin="round"><path d="M10.500 2.500l3 3L5.500 13.500 2 14l.5-3.500z"/></svg>Rough work</span></div>
        <div class="bs-bf pop" style="--i:8">
          <div class="bs-leg"><span><i class="m"></i>Multiple choice</span><span><i class="v"></i>Assertion &amp; reason</span></div>
          <div class="bs-nums"><span>1</span><span class="cur">2</span><span>3</span><span class="v">4</span><span class="v">5</span></div>
          <div class="bs-nav"><span class="bs-bk">Back</span><span class="bs-nx">Next</span></div>
          <div class="bs-ans"><span class="n0">0/5 answered</span><span class="n1">1/5 answered</span></div>
        </div>
      </div>
    </div>`,

    weak: `<div class="app wk">
      <div class="wk-hero pop" style="--i:0">
        <div class="wk-lab">SCIENCE · SMART TEST RESULT</div>
        <div class="wk-row">
          <span class="wk-ring"><svg viewBox="0 0 36 36"><circle class="bg" cx="18" cy="18" r="15.200"/><circle class="fg" cx="18" cy="18" r="15.200"/></svg><b></b></span>
          <div class="wk-msg"><b>Good, a few gaps to close</b><span>You know most of it. The gaps below are where the next marks are.</span></div>
        </div>
        <div class="wk-stats two"><div><b>3/5</b><span>MARKS</span></div><div><b>16/30 min</b><span>TIME USED</span></div></div>
      </div>
      <div class="wk-card pop" style="--i:1">
        <div class="wk-h">Marks by section</div>
        <div class="wk-sec"><span>Objective <em>· 5 questions</em></span><b>3/5</b></div>
        <div class="wk-bar"><i class="am" style="--w:60%;--d:.9s"></i></div>
      </div>
      <div class="wk-card pop" style="--i:2">
        <div class="wk-h">Topic by topic</div>
        <div class="wk-sub">Weakest first. This is what your next Smart Test will work on.</div>
        <div class="wk-topics">
          <div class="wk-t r"><div><span>Occurrence and Extraction of Metals</span><b>0%</b></div><div class="wk-bar"><i style="--w:8%;--d:1.1s"></i></div></div>
          <div class="wk-t r"><div><span>Displacement Reactions and Reactivity Series</span><b>0%</b></div><div class="wk-bar"><i style="--w:8%;--d:1.25s"></i></div></div>
          <div class="wk-t y"><div><span>Reactions with Oxygen, Water and Acids</span><b>60%</b></div><div class="wk-bar"><i style="--w:60%;--d:1.4s"></i></div></div>
          <div class="wk-t y"><div><span>Physical Properties of Metals</span><b>55%</b></div><div class="wk-bar"><i style="--w:55%;--d:1.55s"></i></div></div>
          <div class="wk-t g"><div><span>Corrosion and Alloys</span><b>100%</b></div><div class="wk-bar"><i style="--w:100%;--d:1.7s"></i></div></div>
        </div>
      </div>
      <div class="wk-lost pop" style="--i:3"><span class="wk-lh">↘ Where you lost the most marks</span><span class="wk-chip">Minerals, Ores and Gangue · −1</span></div>
    </div>`,

    mock: `<div class="app mk">
      <div class="mk-hero pop" style="--i:0">
        <div class="mk-lab"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.500l1.400 3.700 3.700 1.400-3.700 1.400L8 11.700 6.600 8 2.900 6.600l3.700-1.400zM12.500 10.500l.6 1.500 1.500.6-1.500.6-.6 1.500-.6-1.500-1.500-.6 1.500-.6z"/></svg>CBSE MOCK TEST · 2025-26</div>
        <div class="mk-title">CBSE Class 10 Science · Sample Paper 2025-26</div>
        <div class="mk-sub">Objective + written · 3 hours</div>
        <div class="mk-stats">
          <div><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.600" stroke-linecap="round" stroke-linejoin="round"><path d="M2.500 5l1.500 1.500L6.500 4M2.500 11l1.500 1.500L6.500 10M9.500 5.500h8M9.500 11.500h8M2.500 17h15"/></svg><b class="c39"></b><span>QUESTIONS</span></div>
          <div><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.600"><circle cx="10" cy="10" r="7.500"/><circle cx="10" cy="10" r="4"/><circle cx="10" cy="10" r="1" fill="currentColor"/></svg><b class="c80"></b><span>MARKS</span></div>
          <div><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.600" stroke-linecap="round"><circle cx="10" cy="10" r="7.500"/><path d="M10 5.500V10l3 2"/></svg><b class="c180"></b><span>MINUTES</span></div>
          <div><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.600" stroke-linecap="round" stroke-linejoin="round"><path d="M5.500 2.500h9M5.500 17.500h9M6.500 2.500c0 4 3.500 5 3.500 7.500s-3.500 3.500-3.500 7.500M13.500 2.500c0 4-3.500 5-3.500 7.500s3.500 3.500 3.500 7.500"/></svg><b class="cq">4:37</b><span>PER QUESTION</span></div>
        </div>
        <div class="mk-note">The 4 case studies have 14 parts in all, shown one part at a time.</div>
      </div>
      <div class="mk-card pop" style="--i:1">
        <div class="mk-h">Where the marks are (CBSE pattern)</div>
        <div class="mk-split"><i style="--w:37.500%;--d:.8s"></i><i style="--w:31.250%;--d:1s"></i><i style="--w:31.250%;--d:1.2s"></i></div>
        <div class="mk-secs">
          <div class="pop" style="--i:4"><b>A</b><span><strong>Biology</strong><small>16 questions · 30 marks</small></span></div>
          <div class="pop" style="--i:5"><b>B</b><span><strong>Chemistry</strong><small>13 questions · 25 marks</small></span></div>
          <div class="pop" style="--i:6"><b>C</b><span><strong>Physics</strong><small>10 questions · 25 marks</small></span></div>
        </div>
      </div>
      <div class="mk-about pop" style="--i:3">
        <div class="mk-ah"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.700" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.500c2.500-1 5-.800 7 .800 2-1.600 4.500-1.800 7-.800v10.500c-2.500-1-5-.800-7 .800-2-1.600-4.500-1.800-7-.800zM10 5.300v10.500"/></svg>About this paper</div>
        <p>This is the official CBSE sample paper, in its own order, as set for the board pattern. It is not personalised. After you submit, each answer is marked step by step against the CBSE marking scheme.</p>
        <ul><li>39 questions in 3 sections: A Biology, B Chemistry, C Physics. All questions are compulsory; internal choice is given in some.</li></ul>
      </div>
    </div>`,

    pal: `<div class="app pm">
      <i class="pm-sp s1"></i><i class="pm-sp s2"></i><i class="pm-sp s3"></i><i class="pm-sp s4"></i>
      <div class="pm-top pop" style="--i:0"><span class="pm-badge"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.500l1.400 3.700 3.700 1.400-3.700 1.400L8 11.700 6.600 8 2.900 6.600l3.700-1.400zM12.500 10.500l.6 1.500 1.500.6-1.500.6-.6 1.500-.6-1.500-1.500-.6 1.500-.6z"/></svg>SMART TEST</span></div>
      <div class="pm-card pop" style="--i:1">
        <div class="pm-h"><svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.500l1.400 3.700 3.700 1.400-3.700 1.400L8 11.700 6.600 8 2.900 6.600l3.700-1.400zM12.500 10.500l.6 1.500 1.500.6-1.500.6-.6 1.500-.6-1.500-1.500-.6 1.500-.6z"/></svg>How your test is built</div>
        <p class="pm-s">Because of your earlier answers, the 13 questions divide like this:</p>
        <div class="pm-seg"><i class="r" style="flex:6"></i><i class="a" style="flex:2"></i><i class="g" style="flex:2"></i><i class="v" style="flex:3"></i></div>
        <div class="pm-rows">
          <div class="pm-r r" style="--j:0"><b style="--to:6"></b><span>On your weak spots</span></div>
          <div class="pm-r a" style="--j:1"><b style="--to:2"></b><span>Mistakes to fix</span></div>
          <div class="pm-r g" style="--j:2"><b style="--to:2"></b><span>Strengths kept sharp</span></div>
          <div class="pm-r v" style="--j:3"><b style="--to:3"></b><span>New ground</span></div>
        </div>
        <div class="pm-f"><b>Focus topics:</b> Combination and Decomposition Reactions (45%)</div>
      </div>
      <div class="pm-btn pop" style="--i:6"><i class="pm-rp"></i><svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.500l1.400 3.700 3.700 1.400-3.700 1.400L8 11.700 6.600 8 2.900 6.600l3.700-1.400zM12.500 10.500l.6 1.500 1.500.6-1.500.6-.6 1.500-.6-1.500-1.500-.6 1.500-.6z"/></svg>Build my Smart Test</div>
      <p class="pm-note pop" style="--i:7">Each Smart Test is different. Nothing is repeated while there are unseen questions left.</p>
    </div>`,

    report: `<div class="app wk done">
      <i class="pm-sp s1"></i><i class="pm-sp s2"></i><i class="pm-sp s4"></i>
      <div class="wk-hero pop" style="--i:0">
        <div class="wk-lab">SCIENCE · SMART TEST RESULT</div>
        <div class="wk-row">
          <span class="wk-ring"><svg viewBox="0 0 36 36"><circle class="bg" cx="18" cy="18" r="15.200"/><circle class="fg" cx="18" cy="18" r="15.200"/></svg><b></b></span>
          <div class="wk-msg"><b>Nearly exam-ready</b><span>Strong. One topic is left to polish.</span></div>
        </div>
        <div class="wk-stats two"><div><b>4/5</b><span>MARKS</span></div><div><b>22/30 min</b><span>TIME USED</span></div></div>
      </div>
      <div class="wk-card pop" style="--i:1">
        <div class="wk-h">Marks by section</div>
        <div class="wk-sec"><span>Objective <em>· 5 questions</em></span><b>4/5</b></div>
        <div class="wk-bar"><i class="gn" style="--w:80%;--d:.9s"></i></div>
      </div>
      <div class="wk-card pop" style="--i:2">
        <div class="wk-h">Topic by topic</div>
        <div class="wk-sub">Weakest first. This is what your next Smart Test will work on.</div>
        <div class="wk-topics">
          <div class="wk-t y" style="--j:0;--to:75;--dd:1.15s"><div><span>Displacement and Double Displacement Reactions</span><b></b></div><div class="wk-bar"><i style="--w:75%;--d:1.15s"></i></div></div>
          <div class="wk-t g" style="--j:1;--to:100;--dd:1.3s"><div><span>Effects of Oxidation in Everyday Life: Corrosion and Rancidity</span><b></b></div><div class="wk-bar"><i style="--w:100%;--d:1.3s"></i></div></div>
          <div class="wk-t g" style="--j:2;--to:100;--dd:1.45s"><div><span>Oxidation, Reduction and Redox Reactions</span><b></b></div><div class="wk-bar"><i style="--w:100%;--d:1.45s"></i></div></div>
          <div class="wk-t g" style="--j:3;--to:100;--dd:1.6s"><div><span>Chemical Equations: Word Equations and Balancing</span><b></b></div><div class="wk-bar"><i style="--w:100%;--d:1.6s"></i></div></div>
          <div class="wk-t g" style="--j:4;--to:100;--dd:1.75s"><div><span>Combination and Decomposition Reactions</span><b></b></div><div class="wk-bar"><i style="--w:100%;--d:1.75s"></i></div></div>
        </div>
      </div>
      <div class="wk-next pop" style="--i:4"><div class="wk-nb"><i class="wk-rp"></i><span>Start next topic</span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg></div></div>
    </div>`
  };

  const shell = (inner, label = '') =>
    `<i class="pb pb1"></i><i class="pb pb2"></i><i class="pb pb3"></i><div class="glass"><div class="isl ${label ? 'wide' : ''}"><i></i><span>${label}</span></div><div class="status"><span>9:41</span><span>${ICONS}</span></div>${inner}<i class="hbar"></i></div>`;

  /* ---- the pinned phone ---- */
  const story = $('#story'), beats = $$('.beat'), N = ORDER.length;
  const dev = document.createElement('div');
  dev.className = 'phone tilt'; dev.dataset.tiltMax = '6';
  dev.innerHTML = shell(ORDER.map(k => `<div class="scr" data-k="${k}">${SCREENS[k]}</div>`).join(''));
  $('#devPhone').appendChild(dev);
  const devScr = $$('.scr', dev), isl = $('.isl', dev), islLbl = $('.isl span', dev);
  const devNum = $('#devNum'), devTitle = $('#devTitle'), dots = $('#devDots');
  dots.innerHTML = ORDER.map((_, i) => `<button role="tab" aria-label="${TITLES[i]}" data-go="${i}"></button>`).join('');
  const dotEls = $$('button', dots);

  /* big outlined numerals behind each step's text */
  beats.forEach((b, i) => { if (i) b.dataset.n = String(i).padStart(2, '0'); });

  /* floating glass cards that change with each step */
  const FI = {
    spark: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 1.5l2 5.5 5.5 2-5.5 2-2 5.5-2-5.5-5.5-2 5.5-2z"/></svg>',
    check: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 10.5l3.5 3.5 7.5-8"/></svg>',
    clock: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10" cy="10" r="7"/><path d="M10 6v4.2l2.8 1.8"/></svg>',
    grid: '<svg viewBox="0 0 20 20" fill="currentColor"><rect x="2.5" y="2.5" width="6" height="6" rx="1.6"/><rect x="11.5" y="2.5" width="6" height="6" rx="1.6" opacity=".6"/><rect x="2.5" y="11.5" width="6" height="6" rx="1.6" opacity=".6"/><rect x="11.5" y="11.5" width="6" height="6" rx="1.6"/></svg>',
    doc: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2.5h7l3.5 3.5v11.5H5z"/><path d="M8 10h5M8 13.5h5"/></svg>',
    wave: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c2.5 0 2.5-6 5-6s2.5 8 5 8 2.5-9 6-9"/></svg>',
    up: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14l5-5 3 3 6-7M12 5h5v5"/></svg>'
  };
  const FLOATS = [
    ['spark', 'Diagnostic engine', 'Ready when you are'],
    ['check', 'Topic selected', 'Science · Carbon and its Compounds'],
    ['clock', 'Smart Test · 5 questions', 'Carbon and its Compounds'],
    ['grid', '5 topics mapped', '1 strong · 2 revise · 2 fix first'],
    ['doc', 'Sample Paper 2025-26', '39 questions · 80 marks'],
    ['wave', 'Adaptive test', 'Built from your weak topics'],
    ['up', 'Nearly exam-ready', '60% → 80% after PAL']
  ];
  const floatsEl = $('#floats');
  floatsEl.innerHTML = FLOATS.map((f, i) => `<div class="dfloat ${i % 2 ? 'top' : ''}"><span class="ic">${FI[f[0]]}</span><div><b>${f[1]}</b><span>${f[2]}</span></div></div>`).join('');
  const floatEls = $$('.dfloat', floatsEl);

  /* ======================================================================
     APP-OPEN INTRO — the phone shows a home screen, ClassMap gets tapped,
     opens full-screen, then the splash settles. Plays once, skips on scroll.
     ====================================================================== */
  const G = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const HOME_ICONS = [
    ['Photos', G('<circle cx="12" cy="8" r="3"/><circle cx="8" cy="14" r="3"/><circle cx="16" cy="14" r="3"/>')],
    ['Calendar', G('<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>')],
    ['Clock', G('<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3 2"/>')],
    ['Maps', G('<path d="M12 21s6-5.500 6-10a6 6 0 0 0-12 0c0 4.500 6 10 6 10z"/><circle cx="12" cy="11" r="2"/>')],
    ['Notes', G('<rect x="5" y="3.500" width="14" height="17" rx="3"/><path d="M9 9h6M9 13h6M9 17h3"/>')],
    ['__CM__', ''],
    ['Music', G('<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2.500"/><circle cx="17" cy="16" r="2.500"/>')],
    ['Mail', G('<rect x="3.500" y="6" width="17" height="12" rx="3"/><path d="M4 8l8 6 8-6"/>')],
    ['Wallet', G('<rect x="3.500" y="6.500" width="17" height="12" rx="3"/><path d="M16 12.500h2"/>')],
    ['Health', G('<path d="M12 20s-7-4.500-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.500-7 10-7 10z"/>')],
    ['Weather', G('<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.500 5.500l1.400 1.400M17.100 17.100l1.400 1.400M5.500 18.500l1.400-1.400M17.100 6.900l1.400-1.400"/>')],
    ['Books', G('<path d="M5 5a2 2 0 0 1 2-2h12v16H7a2 2 0 0 0-2 2z"/><path d="M5 19a2 2 0 0 0 2 2h12"/>')],
    ['Files', G('<path d="M3.500 7a2 2 0 0 1 2-2H10l2 2.500h6.500a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>')],
    ['Video', G('<rect x="3.500" y="5.500" width="17" height="13" rx="3"/><path d="M10.500 9.500l4 2.500-4 2.500z"/>')],
    ['Store', G('<path d="M6 8h12l1 12H5z"/><path d="M9 8a3 3 0 0 1 6 0"/>')],
    ['Camera', G('<path d="M4 8.500a2 2 0 0 1 2-2h2l1.500-2h5L16 6.500h2a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.500" r="3.500"/>')]
  ];
  const DOCK = [G('<path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/>'), G('<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6l-4 3v-3H6a2 2 0 0 1-2-2z"/>'), G('<circle cx="12" cy="12" r="8.500"/><path d="M12 3.500v17M3.500 12h17"/>'), G('<path d="M4 7h16M4 12h16M4 17h10"/>')];
  const homeHTML = `<div class="home" aria-hidden="true">
      <i class="hw hw1"></i><i class="hw hw2"></i>
      <div class="hs">${HOME_ICONS.map((ic, i) => ic[0] === '__CM__'
        ? `<div class="hi cm" style="--i:${i}"><i><img src="/student-page/assets/logo-mark.png" alt=""></i><span>ClassMap</span></div>`
        : `<div class="hi" style="--i:${i}"><i>${ic[1]}</i><span>${ic[0]}</span></div>`).join('')}</div>
      <div class="hdock">${DOCK.map((d, i) => `<div class="hi" style="--i:${18 + i}"><i>${d}</i></div>`).join('')}</div>
      <i class="htap"></i>
      <div class="hopen"><img src="/student-page/assets/logo-mark.png" alt=""></div>
    </div>`;
  let home = null, introState = 'done', introT = [], replayT = 0;
  function mountHome() {
    if (home) home.remove();
    dev.classList.add('pre');
    $('.glass', dev).insertAdjacentHTML('beforeend', homeHTML);
    home = $('.home', dev); introState = 'wait'; introT = [];
  }
  function finishIntro() {
    if (introState === 'done') return;
    introState = 'done'; introT.forEach(clearTimeout);
    const h = home; h.classList.add('out'); dev.classList.remove('pre');
    setTimeout(() => h.remove(), 600);          // remove THIS overlay only, never a newer one
  }
  /* coming back to the top of the page plays the "open the app" moment again */
  function replayIntro() {
    clearTimeout(replayT);
    if (reduce) return;
    replayT = setTimeout(() => { if (active === 0 && introState === 'done') { mountHome(); setTimeout(runIntro, 60); } }, 260);
  }
  function runIntro() {
    if (introState !== 'wait') return; introState = 'run';
    const at = (ms, fn) => introT.push(setTimeout(() => { if (introState === 'run') fn(); }, ms));
    home.classList.add('run');
    at(1500, () => { home.classList.add('tap'); });
    at(1800, () => {
      const g = $('.glass', dev).getBoundingClientRect(), r = $('.hi.cm i', home).getBoundingClientRect();
      const op = $('.hopen', home), fs = parseFloat(getComputedStyle(dev).fontSize), img = $('img', op);
      const k = g.width / $('.glass', dev).offsetWidth || 1;   // undo any tilt / scale on the phone
      op.style.cssText = `transition:none;left:${(r.left - g.left) / k}px;top:${(r.top - g.top) / k}px;width:${r.width / k}px;height:${r.height / k}px;border-radius:${r.width / k * .27}px;opacity:1`;
      img.style.transition = 'none'; img.style.width = (r.width / k * .78) + 'px';
      void op.offsetWidth;
      op.style.transition = ''; img.style.transition = '';
      home.classList.add('open');
      op.style.left = '0px'; op.style.top = '0px'; op.style.width = $('.glass', dev).offsetWidth + 'px'; op.style.height = $('.glass', dev).offsetHeight + 'px';
      op.style.borderRadius = getComputedStyle($('.glass', dev)).borderRadius;
      img.style.width = (fs * 6.4) + 'px';
    });
    at(2750, () => { finishIntro(); });
  }
  // first play: when the phone is really on screen (immediately on desktop, on scroll for phones)
  if (!reduce) {
    mountHome();
    new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { io.disconnect(); setTimeout(runIntro, 150); } }, { threshold: .55 }).observe(dev);
  }

  /* mobile hero: reuse the first beat's content as a normal block above the phone */
  const heroM = $('#heroM .wrap');
  heroM.innerHTML = $('.beat.b0 .hero-full').innerHTML;
  $$('[id]', heroM).forEach(e => e.removeAttribute('id'));

  let active = -1;
  function setActive(i) {
    if (i === active) return;
    const prevActive = active;
    active = i;
    if (i > 0) { finishIntro(); clearTimeout(replayT); }
    else if (prevActive > 0) replayIntro();
    devScr.forEach((s, k) => s.classList.toggle('on', k === i));
    beats.forEach((b, k) => { b.classList.toggle('is-active', k === i); b.classList.toggle('is-past', k < i); });
    dotEls.forEach((d, k) => { d.classList.toggle('on', k === i); d.setAttribute('aria-selected', k === i); });
    floatEls.forEach((f, k) => f.classList.toggle('on', k === i));
    isl.classList.toggle('wide', i > 0);
    islLbl.textContent = LABELS[i];
    devNum.textContent = i ? '0' + i : '▶';
    devTitle.textContent = TITLES[i];
  }
  function storyRange() { return Math.max(1, story.offsetHeight - innerHeight); }
  function storyTop() { return story.getBoundingClientRect().top + scrollY; }
  function updateStory() {
    const p = clamp((scrollY - storyTop()) / storyRange(), 0, 1);
    setActive(Math.min(N - 1, Math.floor(p * N)));
  }
  function goStep(i) {
    const target = storyTop() + ((i + .5) / N) * storyRange();
    scrollTo({ top: target, behavior: reduce ? 'auto' : 'smooth' });
  }
  listen(root, 'click', e => {
    const a = e.target.closest('[data-go]'); if (!a) return;
    e.preventDefault(); goStep(+a.dataset.go);
  });
  $('.dev-pill').addEventListener('click', () => goStep(Math.min(N - 1, active + 1)));
  $('.dev-pill').style.cursor = 'pointer';
  // first paint: let the hero text + splash animate in
  requestAnimationFrame(() => setTimeout(updateStory, 80));

  /* ---- app showcase: three live phones that cycle through the real screens ---- */
  const FAN = { l: ['weak', 'mock', 'pal', 'report'], m: ['pick', 'base', 'weak', 'mock'], r: ['report', 'pal', 'base', 'pick'] };
  const CAPS = {
    pick: ['Pick a topic', 'Choose your subject and chapter.'],
    base: ['Base Test', 'Your first honest read on every concept.'],
    weak: ['Test result', 'Marks, topic by topic, what to fix first.'],
    mock: ['CBSE mock papers', 'Full sample papers, real board pattern.'],
    pal: ['PAL adaptive test', 'A test built around your weak spots.'],
    report: ['Analysis report', 'What improved. What’s weak. What next.']
  };
  const CYCLE = 5600;
  const fanEl = $('#fan');
  const fanPhones = $$('.phone[data-fan]');
  const fanState = {};
  fanPhones.forEach((p, n) => {
    const key = p.dataset.fan, list = FAN[key], shot = $('.shot', p), col = p.closest('.col');
    p.insertAdjacentHTML('afterbegin', shell(list.map(k => `<div class="scr" data-k="${k}">${SCREENS[k]}</div>`).join('')));
    if (shot) $('.glass', p).appendChild(shot);
    const dotsEl = $('.fdots', col);
    dotsEl.innerHTML = list.map((k, i) => `<button aria-label="${CAPS[k][0]}" data-i="${i}"><i></i></button>`).join('');
    fanState[key] = { p, list, col, i: -1, t: 0, hover: false, scr: $$('.scr', p), isl: $('.isl', p), lbl: $('.isl span', p), cap: $('.fcap', col), dots: $$('button', dotsEl), delay: n * 900 };
    col.addEventListener('pointerenter', () => { fanState[key].hover = true; });
    col.addEventListener('pointerleave', () => { fanState[key].hover = false; });
    dotsEl.addEventListener('click', e => { const bt = e.target.closest('button'); if (bt) fanShow(key, +bt.dataset.i, true); });
  });
  function fanShow(key, i, user) {
    const s = fanState[key]; if (!s) return;
    clearTimeout(s.t); s.i = i;
    const k = s.list[i], idx = ORDER.indexOf(k);
    s.scr.forEach((el, n) => el.classList.toggle('on', n === i));
    s.isl.classList.add('wide'); s.lbl.textContent = LABELS[idx];
    s.cap.classList.add('sw');
    setTimeout(() => { $('b', s.cap).textContent = CAPS[k][0]; $('span', s.cap).textContent = CAPS[k][1]; s.cap.classList.remove('sw'); }, 220);
    s.dots.forEach((d, n) => { d.classList.remove('on'); if (n === i) { void d.offsetWidth; d.classList.add('on'); } });
    if (fanLive && !reduce) s.t = setTimeout(() => fanTick(key), CYCLE);
  }
  function fanTick(key) {
    const s = fanState[key];
    if (s.hover) { s.t = setTimeout(() => fanTick(key), 800); return; }
    fanShow(key, (s.i + 1) % s.list.length);
  }
  let fanLive = false, fanStarted = false;
  new IntersectionObserver(es => {
    const vis = es[0].isIntersecting;
    if (vis && !fanStarted) { fanStarted = true; fanEl.classList.add('in'); }
    fanLive = vis;
    Object.keys(fanState).forEach(key => {
      const s = fanState[key];
      if (vis) { if (s.i < 0) setTimeout(() => fanShow(key, 0), 350 + s.delay); else if (!reduce) { clearTimeout(s.t); s.t = setTimeout(() => fanTick(key), 1200 + s.delay); } }
      else clearTimeout(s.t);
    });
  }, { threshold: .2 }).observe(fanEl);

  /* parallax + fan-open, driven by scroll (called from the main scroll handler) */
  const fanCols = $$('.col', fanEl), fanChips = $$('.fchip', fanEl);
  function updateFan() {
    const r = fanEl.getBoundingClientRect(), vh = innerHeight;
    if (r.bottom < -200 || r.top > vh + 200) return;
    const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
    const o = clamp((vh - r.top - vh * .12) / (vh * .55), 0, 1), e = 1 - Math.pow(1 - o, 3);
    fanEl.style.setProperty('--p', p.toFixed(4));
    fanEl.style.setProperty('--o', e.toFixed(4));
  }

  /* ======================================================================
     2. TEXT SPLIT + REVEAL
     ====================================================================== */
  function splitWords(el) {
    let idx = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const s = document.createElement('span'); s.textContent = part; s.style.setProperty('--i', idx++);
            w.appendChild(s); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          if (n.tagName === 'EM') {
            const w = document.createElement('span'); w.className = 'w';
            const s = document.createElement('span'); s.style.setProperty('--i', idx++);
            n.replaceWith(w); w.appendChild(s); s.appendChild(n);
          } else walk(n);
        }
      });
    };
    walk(el);
  }
  const splitEls = $$('.split');
  splitEls.forEach(el => { if (el.id === 'h1') el.style.setProperty('--base', '.15s'); splitWords(el); });

  const revealIO = new IntersectionObserver((es, io) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .18, rootMargin: '0px 0px -6% 0px' });
  $$('.rv, .rv-l, .split').forEach(el => revealIO.observe(el));

  /* ======================================================================
     3. COUNTDOWN
     ====================================================================== */
  const exam = new Date(CONFIG.examDate || $('#count').dataset.exam).getTime();
  const pad = n => String(n).padStart(2, '0');
  function tickCount() {
    let d = Math.max(0, exam - Date.now());
    const days = Math.floor(d / 864e5); d -= days * 864e5;
    const h = Math.floor(d / 36e5); d -= h * 36e5;
    const m = Math.floor(d / 6e4); d -= m * 6e4;
    const s = Math.floor(d / 1e3);
    const vals = { d: days, h: pad(h), m: pad(m), s: pad(s) };
    $$('[data-u]').forEach(el => {
      const v = String(vals[el.dataset.u]);
      if (el.textContent !== v) {
        el.textContent = v;
        if (el.classList.contains('roll')) { el.classList.remove('rolled'); void el.offsetWidth; el.classList.add('rolled'); }
      }
    });
    $$('.cd2').forEach(c => { c.classList.toggle('nt', s === 0); c.style.setProperty('--sec', s === 0 ? 0 : (s + 1) / 60); });
  }
  tickCount(); setInterval(tickCount, 1000);

  /* ======================================================================
     4. CONTOUR MAP CANVAS (the "Map" in ClassMap)
     ====================================================================== */
  function contours(cv, opt) {
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, t = 0, vis = true, mx = 0, my = 0, raf = 0;
    function size() {
      const r = cv.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio || 1, 2);
      W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const base = Math.min(W, H) * (opt.scale || 1);
      opt.centers.forEach((c, ci) => {
        const cx = c.x * W + mx * c.p, cy = c.y * H + my * c.p;
        for (let i = 1; i <= c.n; i++) {
          ctx.beginPath();
          const R = i * c.step * base;
          for (let a = 0; a <= Math.PI * 2 + .02; a += Math.PI / 80) {
            const w = 1 + .09 * Math.sin(2 * a + t * .25 + i * .28 + ci) + .055 * Math.sin(3 * a - t * .18 + i * .4 + ci * 2) + .035 * Math.sin(5 * a + t * .12 + i * .6);
            const x = cx + Math.cos(a) * R * w * 1.25, y = cy + Math.sin(a) * R * w;
            a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.closePath();
          const major = i % 4 === 0;
          ctx.strokeStyle = `rgba(${opt.rgb},${(major ? opt.alpha * 1.9 : opt.alpha) * (1 - i / (c.n + 5))})`;
          ctx.lineWidth = major ? 1.3 : .8;
          ctx.stroke();
        }
      });
    }
    function loop() { t += .016; draw(); raf = vis ? requestAnimationFrame(loop) : 0; }
    new ResizeObserver(size).observe(cv);
    new IntersectionObserver(e => { vis = e[0].isIntersecting; if (vis && !raf && !reduce) loop(); }).observe(cv);
    size();
    if (!reduce) loop();
    return { move(x, y) { mx = x; my = y; } };
  }
  const heroC = contours($('#contours'), {
    rgb: '255,99,33', alpha: .2,
    centers: [{ x: .82, y: .32, n: 20, step: .05, p: 16 }, { x: .04, y: .92, n: 14, step: .055, p: -12 }]
  });
  contours($('#contours2'), {
    rgb: '255,255,255', alpha: .5, scale: .9,
    centers: [{ x: .88, y: .1, n: 16, step: .06, p: 0 }, { x: .08, y: .95, n: 12, step: .06, p: 0 }]
  });

  /* ======================================================================
     5. POINTER FX — glow, magnetic buttons, phone tilt
     ====================================================================== */
  if (fine && !reduce) {
    const glow = $('#glow'); let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy;
    addEventListener('pointermove', e => {
      tx = e.clientX; ty = e.clientY; glow.classList.add('on');
      heroC.move((e.clientX / innerWidth - .5), (e.clientY / innerHeight - .5));
    }, { passive: true });
    listen(document, 'pointerleave', () => glow.classList.remove('on'));
    (function gl() { gx = lerp(gx, tx, .12); gy = lerp(gy, ty, .12); glow.style.transform = `translate(${gx}px,${gy}px)`; requestAnimationFrame(gl); })();

    $$('.magnet').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * .22).toFixed(1) + 'px');
        b.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * .3).toFixed(1) + 'px');
      });
      b.addEventListener('pointerleave', () => { b.style.setProperty('--mx', '0px'); b.style.setProperty('--my', '0px'); });
    });

    $$('.tilt').forEach(el => {
      const host = el.closest('.story-dev') || el;
      const max = +el.dataset.tiltMax || 6;
      host.addEventListener('pointermove', e => {
        const r = host.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(1100px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max * 1.4).toFixed(2)}deg)`;
      });
      host.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ======================================================================
     6. NAV, PROGRESS, ROUTE, DOCK  (one scroll handler)
     ====================================================================== */
  const nav = $('#nav'), prog = $('#progress'), dock = $('#dock');
  let ticking = false, hideDock = false;
  function onScroll() {
    const y = scrollY, vh = innerHeight;
    nav.classList.toggle('scrolled', y > 30);
    prog.style.transform = `scaleX(${clamp(y / (document.documentElement.scrollHeight - vh), 0, 1)})`;
    updateStory();
    updateFan();
    const sr = story.getBoundingClientRect();
    const inStory = sr.top < vh * .6 && sr.bottom > vh * .4;
    dock.classList.toggle('show', y > 640 && !hideDock && !inStory);
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
  // keep the mobile dock hidden while pricing or the final CTA are on screen
  const dockWatch = new Set();
  const dockIO = new IntersectionObserver(es => {
    es.forEach(e => e.isIntersecting ? dockWatch.add(e.target) : dockWatch.delete(e.target));
    hideDock = dockWatch.size > 0; onScroll();
  }, { threshold: .2 });
  dockIO.observe($('.final')); dockIO.observe($('#pricing'));

  /* mobile menu */
  const burger = $('#burger');
  function menu(open) {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', () => menu(!document.body.classList.contains('menu-open')));
  $$('#drawer a').forEach(a => a.addEventListener('click', () => menu(false)));

  /* ======================================================================
     7. HEATMAP — "Know exactly what to fix"
     ====================================================================== */
  const HM = {
    'Maths': ['Real Numbers', 'Polynomials', 'Linear Equations', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry', 'Trigonometry'],
    'Science': ['Chemical Reactions', 'Acids, Bases & Salts', 'Metals & Non-metals', 'Carbon Compounds', 'Life Processes', 'Heredity', 'Light', 'Electricity'],
    'Social Science': ['Nationalism in Europe', 'Nationalism in India', 'Resources & Development', 'Water Resources', 'Agriculture', 'Power Sharing', 'Federalism', 'Money & Credit'],
    'English': ['Reading Comprehension', 'Letter Writing', 'Grammar · Tenses', 'Editing & Omission', 'First Flight · Prose', 'First Flight · Poetry', 'Footprints Without Feet', 'Writing Skills']
  };
  const ROUND_GAIN = [0, .36, .55, .70];
  const ROUND_LBL = ['Base', 'R1', 'R2', 'R3'];
  const ROUND_FULL = ['Base test', 'PAL round 1', 'PAL round 2', 'PAL round 3'];
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const status = s => s >= 72 ? 'g' : s >= 48 ? 'y' : 'r';
  const stText = { g: 'Strong', y: 'Revise', r: 'Fix first' };

  const data = {};
  Object.keys(HM).forEach((sub, si) => {
    const R = rng(7 + si * 101);
    data[sub] = HM[sub].map(() => {
      const bias = 22 + R() * 62;
      return Array.from({ length: 8 }, () => ({ s: clamp(bias + (R() - .5) * 52, 6, 96), j: .75 + R() * .4 }));
    });
  });
  const scoreAt = (c, r) => {
    const w = c.s < 48 ? 1 : c.s < 72 ? .85 : .5;
    return clamp(c.s + (97 - c.s) * ROUND_GAIN[r] * w * c.j, 0, 99);
  };

  let sub = 'Maths', round = 0;
  const hm = $('#hm'), tabs = $('#hmTabs'), rnds = $('#hmRounds'), body = $('#hmBody'), playBtn = $('#hmPlay'), ringEl = $('#hmRing');
  tabs.innerHTML = Object.keys(HM).map((s, i) => `<button role="tab" aria-selected="${i === 0}" data-s="${s}">${s === 'Social Science' ? 'Social Sci' : s}</button>`).join('') + '<i class="ind"></i>';
  rnds.innerHTML = ROUND_LBL.map((l, i) => `<button class="${i === 0 ? 'on' : ''}" data-r="${i}" aria-label="${ROUND_FULL[i]}">${l}</button>`).join('') + '<i class="ind"></i>';

  function moveInd(box, btn) { const ind = $('.ind', box); if (!btn || !ind) return; ind.style.width = btn.offsetWidth + 'px'; ind.style.transform = `translateX(${btn.offsetLeft}px)`; }
  const syncInd = () => { moveInd(tabs, $('button[aria-selected="true"]', tabs)); moveInd(rnds, $('button.on', rnds)); };
  addEventListener('resize', syncInd); addEventListener('load', syncInd);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncInd);

  function build() {
    body.innerHTML = HM[sub].map((name, ri) => `<div class="hrow"><span class="nm">${name}</span><div class="cells">${data[sub][ri].map((_, k) => `<i data-r="${ri}" data-c="${k}" style="--k:${k + ri}"></i>`).join('')}</div><span class="pc"></span></div>`).join('');
    paint(true);
  }
  const tween = (el, to, suffix = '') => {
    const from = parseFloat(el.dataset.v || 0); el.dataset.v = to;
    if (reduce) { el.textContent = Math.round(to) + suffix; return; }
    const t0 = performance.now(), dur = 800;
    (function step(now) { const p = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(lerp(from, to, e)) + suffix; if (p < 1) requestAnimationFrame(step); })(t0);
  };
  function statsAt(r) {
    let sum = 0, n = 0, g = 0, rd = 0, y = 0;
    data[sub].forEach(row => row.forEach(c => { const s = scoreAt(c, r), st = status(s); sum += s; n++; if (st === 'g') g++; else if (st === 'r') rd++; else y++; }));
    return { pct: sum / n, g, r: rd, y, n };
  }
  const swap = (el, fn) => { if (reduce) { fn(); return; } el.classList.add('sw'); setTimeout(() => { fn(); el.classList.remove('sw'); }, 170); };
  function paint(first) {
    const counts = { r: 0, y: 0, g: 0 }; let sum = 0, n = 0, worst = null;
    $$('.hrow', body).forEach((row, ri) => {
      let rs = 0, rr = 0;
      $$('.cells i', row).forEach((cell, k) => {
        const s = scoreAt(data[sub][ri][k], round), st = status(s), prev = cell.dataset.s;
        if (prev && prev !== st) { cell.classList.remove('chg'); void cell.offsetWidth; cell.classList.add('chg'); }
        cell.dataset.s = st; cell.dataset.v = Math.round(s);
        counts[st]++; rs += s; sum += s; n++; if (st === 'r') rr++;
      });
      const avg = rs / 8; row.dataset.s = status(avg); $('.pc', row).textContent = Math.round(avg) + '%';
      if (!worst || avg < worst.avg) worst = { avg, name: HM[sub][ri], reds: rr };
    });
    const pct = sum / n;
    tween($('#stR'), counts.r); tween($('#stY'), counts.y); tween($('#stG'), counts.g); tween($('#stP'), pct, '%');
    ringEl.style.setProperty('--p', (pct / 100).toFixed(3));
    ringEl.style.setProperty('--rc', `hsl(${Math.round(pct < 50 ? 4 + pct * .68 : 38 + (pct - 50) * 2.14)} 88% ${pct < 50 ? 50 : 44}%)`);
    ['r', 'y', 'g'].forEach(k => { $(`.hm-stats .${k} u`).style.width = (counts[k] / n * 100).toFixed(1) + '%'; });
    $$('button', rnds).forEach((b, i) => b.classList.toggle('on', i === round));
    syncInd();
    // insight strip + chips
    const base = statsAt(0), now = statsAt(round), gain = Math.round(now.pct - base.pct), fixed = now.g - base.g;
    const setIns = () => {
      if (counts.r > 0) { $('#hiK').textContent = 'FIX FIRST'; $('#hiT').textContent = worst.name; $('#hiS').textContent = worst.reds ? `${worst.reds} of 8 parts in red` : `Lowest topic · ${Math.round(worst.avg)}%`; hm.classList.remove('clear'); }
      else { $('#hiK').textContent = 'ALL CLEAR'; $('#hiT').textContent = 'Nothing left in red'; $('#hiS').textContent = `${counts.y} parts left to polish`; hm.classList.add('clear'); }
      $('#hiD').textContent = round === 0 ? 'Starting point' : `▲ +${gain} pts`;
    };
    if (first === true) setIns(); else { swap($('#hmIns'), setIns); }
  }
  tabs.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    sub = b.dataset.s; $$('button', tabs).forEach(x => x.setAttribute('aria-selected', x === b)); build(); syncInd();
  });
  rnds.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; stopAuto(); round = +b.dataset.r; paint(); });

  /* legend: hover (or tap) a colour to spotlight those cells */
  $$('#hmLegend .lg').forEach(l => {
    const f = l.dataset.f, on = () => hm.classList.add('f-' + f), off = () => hm.classList.remove('f-' + f);
    l.addEventListener('pointerenter', on); l.addEventListener('pointerleave', off); l.addEventListener('focus', on); l.addEventListener('blur', off);
    l.addEventListener('click', () => hm.classList.toggle('f-' + f));
  });

  /* auto loop: Base -> R1 -> R2 -> R3 -> back, only while on screen, paused on hover */
  let auto = true, inView = false, started = false, hover = false, loopT = 0;
  const ICO_PLAY = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5v11l9-5.5z"/></svg>';
  const ICO_PAUSE = '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2.5" width="3.4" height="11" rx="1"/><rect x="9.6" y="2.5" width="3.4" height="11" rx="1"/></svg>';
  const setIcon = () => { playBtn.innerHTML = auto ? ICO_PAUSE : ICO_PLAY; playBtn.classList.toggle('live', auto); };
  function loop() {
    clearTimeout(loopT); if (!auto || !inView || reduce) return;
    loopT = setTimeout(() => { if (!hover) { round = (round + 1) % 4; paint(); } loop(); }, round === 3 ? 3600 : 2300);
  }
  function stopAuto() { auto = false; clearTimeout(loopT); setIcon(); }
  playBtn.addEventListener('click', () => { if (auto) stopAuto(); else { auto = true; setIcon(); if (round === 3) round = 0; paint(); loop(); } });
  hm.addEventListener('pointerenter', () => { hover = true; }); hm.addEventListener('pointerleave', () => { hover = false; });
  setIcon(); build();

  // tooltip
  const tip = $('#tip');
  body.addEventListener('pointerover', e => {
    const c = e.target.closest('i[data-c]'); if (!c) return;
    const st = c.dataset.s;
    tip.innerHTML = `<b>${HM[sub][+c.dataset.r]}</b><span>Part ${+c.dataset.c + 1} · ${c.dataset.v}% · ${stText[st]}</span>`;
    const r = c.getBoundingClientRect(); tip.style.left = r.left + r.width / 2 + 'px'; tip.style.top = r.top + 'px'; tip.classList.add('on');
  });
  body.addEventListener('pointerout', () => tip.classList.remove('on'));

  // start the story when it scrolls into view, pause it when it leaves
  new IntersectionObserver(es => {
    inView = es[0].isIntersecting;
    if (inView) { if (!started) { started = true; setTimeout(() => { round = 0; paint(); syncInd(); loop(); }, 700); } else loop(); }
    else clearTimeout(loopT);
  }, { threshold: .4 }).observe(hm);

  /* ======================================================================
     8. GRADING TIMELINE
     ====================================================================== */
  const gs = $('#gs'), gsSteps = $$('.gstep');
  const DUR = { 1: 3.6, 2: 4.6, 3: 5.8 };
  const PHOTO = { 1: '.gp-clip img', 2: '.vf .sheet img', 3: '.gr-l img' };
  const desktopFly = matchMedia('(min-width:961px)');
  let phase = 1, phaseT = 0, flyT = 0, gsVisible = false;

  /* the photo of the answer sheet physically travels from one stage to the next */
  function flyPhoto(from, toSel, delay) {
    if (reduce) return;
    const gr = gs.getBoundingClientRect();
    const a = from.getBoundingClientRect();
    if (a.width < 20) return;
    flyT = setTimeout(() => {
      const to = $(toSel, gs); if (!to) return;
      const b = to.getBoundingClientRect(); if (b.width < 20) return;
      const el = document.createElement('div'); el.className = 'gfly';
      el.style.cssText = `left:${a.left - gr.left}px;top:${a.top - gr.top}px;width:${a.width}px;height:${a.height}px`;
      gs.appendChild(el);
      const dx = b.left - a.left, dy = b.top - a.top, sx = b.width / a.width, sy = b.height / a.height;
      const mid = `translate(${dx * .5}px,${dy * .5 - 46}px) scale(${(1 + sx) / 2},${(1 + sy) / 2}) rotate(-3deg)`;
      const an = el.animate([
        { transform: 'translate(0,0) scale(1,1) rotate(0deg)', offset: 0 },
        { transform: mid, offset: .5 },
        { transform: `translate(${dx}px,${dy}px) scale(${sx},${sy}) rotate(0deg)`, offset: 1 }
      ], { duration: 820, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
      an.onfinish = () => { const f = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' }); f.onfinish = () => el.remove(); };
    }, delay);
  }

  function setPhase(p) {
    const prev = phase;
    clearTimeout(flyT); $$('.gfly', gs).forEach(e => e.remove());
    const fly = desktopFly.matches && !reduce;
    gs.style.setProperty('--fd', fly ? '1.25s' : '.1s');
    // capture the source photo's position BEFORE the layout transitions begin
    if (fly && p > prev && PHOTO[prev]) { const src = $(PHOTO[prev], gs); if (src) flyPhoto(src, PHOTO[p], 480); }
    phase = p; gs.dataset.phase = p;
    gsSteps.forEach(b => {
      const on = +b.dataset.p === p;
      b.classList.remove('on'); void b.offsetWidth;
      if (on) { b.style.setProperty('--dur', DUR[p] + 's'); b.classList.add('on'); }
    });
    clearTimeout(phaseT);
    if (gsVisible && !reduce) phaseT = setTimeout(() => setPhase(p % 3 + 1), DUR[p] * 1000);
  }
  gsSteps.forEach(b => b.addEventListener('click', () => setPhase(+b.dataset.p)));
  new IntersectionObserver(e => {
    gsVisible = e[0].isIntersecting;
    if (gsVisible) setPhase(1); else clearTimeout(phaseT);
  }, { threshold: .3 }).observe(gs);

  /* ======================================================================
     9b. AUDIENCE — selectable cards + live dashboards
     ====================================================================== */
  (function () {
    const root = $('.aud2'); if (!root) return;
    const items = $$('.ai', root), panels = $$('.ap', root), CYC = 6500;
    // teacher heat grid
    const HT = ['Real Numbers', 'Polynomials', 'Quadratic Eq.', 'Triangles', 'Trigonometry'], COLS = 14, R = rng(11);
    const bias = [.2, .38, .5, .78, .45];
    $('#auHeat').innerHTML = HT.map((t, r) => `<div class="hr"><span>${t}</span><div>${Array.from({ length: COLS }, (_, k) => {
      const v = R() + bias[r] * .55 - .2, c = v > .62 ? 'r' : v > .34 ? 'y' : 'g';
      return `<i class="${c}" style="--k:${r * COLS + k}"></i>`;
    }).join('')}</div></div>`).join('');

    let cur = -1, t = 0, hover = false, live = false;
    function show(i) {
      clearTimeout(t); cur = i;
      items.forEach((e, n) => { const on = n === i; e.classList.toggle('on', on); e.setAttribute('aria-selected', on); });
      panels.forEach((p, n) => p.classList.toggle('on', n === i));
      const pr = $('.au-pr', items[i]); pr.style.animation = 'none'; void pr.offsetWidth; pr.style.animation = '';
      if (live && !reduce) t = setTimeout(next, CYC);
    }
    function next() { if (hover) { t = setTimeout(next, 800); return; } show((cur + 1) % items.length); }
    items.forEach((e, n) => {
      e.addEventListener('click', ev => { if (ev.target.closest('a')) return; show(n); });
      e.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); show(n); } });
      e.addEventListener('pointermove', ev => { const r = e.getBoundingClientRect(); e.style.setProperty('--mx', (ev.clientX - r.left) + 'px'); e.style.setProperty('--my', (ev.clientY - r.top) + 'px'); });
    });
    root.addEventListener('pointerenter', () => { hover = true; root.classList.add('hov'); });
    root.addEventListener('pointerleave', () => { hover = false; root.classList.remove('hov'); });
    new IntersectionObserver(es => {
      live = es[0].isIntersecting;
      if (live) { cur < 0 ? show(0) : (clearTimeout(t), t = setTimeout(next, 1500)); } else clearTimeout(t);
    }, { threshold: .35 }).observe(root);
  })();

  /* ======================================================================
     10. FAQ
     ====================================================================== */
  $$('.qa').forEach(q => {
    $('button', q).addEventListener('click', () => {
      const open = !q.classList.contains('open');
      $$('.qa').forEach(o => { o.classList.remove('open'); $('button', o).setAttribute('aria-expanded', false); });
      if (open) { q.classList.add('open'); $('button', q).setAttribute('aria-expanded', true); }
    });
  });


  /* ---- live exam timers: the clock counts down, the question timer counts up, every second ---- */
  (function () {
    const fmt = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    const T0 = 6.1;                                   // the exam screen has finished arriving
    function pulse(el, txt) { if (el.textContent !== txt) el.textContent = txt; }
    setInterval(() => {
      root.querySelectorAll('.bs-b').forEach(b => {
        const scr = b.closest('.scr'), clock = b.querySelector('.bs-clock b'), q = b.querySelector('.bs-qt b');
        if (!scr || !clock || !q) return;
        if (!scr.classList.contains('on')) { delete b.dataset.t0; clock.textContent = '29:35'; q.textContent = '0:15'; return; }
        if (!b.dataset.t0) b.dataset.t0 = String(Date.now());
        const e = Math.max(0, Math.floor((Date.now() - +b.dataset.t0) / 1000 - T0));
        pulse(clock, fmt(Math.max(0, 29 * 60 + 35 - e)));
        pulse(q, fmt(Math.min(70, 15 + e)));
        q.parentElement.classList.toggle('late', 15 + e >= 70);
      });
    }, 1000);
  })();


  /* ======================================================================
     LAPTOP — the lid opens as you scroll, the screen boots with the logo, then a
     camera pushes in on features while a cursor points them out and clicks through.
     ====================================================================== */
  (function () {
    const lap = $('#lap'); if (!lap) return;
    const view = $('#lapView'), world = $('#lapWorld'), pages = $$('.pg', lap), cur = $('#lapCur'), hl = $('#lapHl'), tag = $('#lapTag'), rip = $('#lapRip'), tilt = $('#lap3d');
    const tagB = $('b', tag), cap = $('#lapCap'), dots = $$('.lc-d button', cap), capN = $('.lc-n', cap), capT = $('.lc-t b', cap), capS = $('.lc-t small', cap);
    const chipA = $('.lap-chip.a', lap), chipB = $('.lap-chip.b', lap);

    const PAGES = [
      { ox: .03, ar: [1807, 842], foci: [{ f: [.2125, .18], t: 'Live readiness for every chapter' }, { f: [.826, .243], t: 'Or build your own test' }], act: [.826, .243] },
      { ox: .5, ar: [1827, 837], foci: [{ f: [.364, .43], t: 'Pick the kind of test' }, { f: [.482, .824], t: 'Pick the topics to cover' }], act: [.482, .94] },
      { foci: [{ f: '.pq-q', t: 'Questions built for your topics', below: true }, { f: '.pq-opt.c', t: 'Pick your answer', pick: true }], act: '.pq-nx', extra: 1500 },
      { foci: [{ f: '.rs-ring', t: 'Your readiness: 60%' }, { f: '.rs-row.r', t: 'Fix these first' }, { f: '.rs-row.g', t: 'Already strong' }], act: '.rs-back' },
      { foci: [{ f: '.lmk-sci', t: 'Pick your subject', below: true }, { f: '.lmk-tags', t: 'Sections A, B and C', below: true }], act: '.lmk-start' },
      { foci: [{ f: '.mp-s:nth-child(2)', t: '80 marks · 180 minutes', below: true }, { f: '.mp-split', t: 'Official CBSE pattern, marked step by step' }], act: '.mp-cancel' },
      { foci: [{ f: '.ph-chip.on', t: 'Filter by subject' }, { f: '.ph-row:nth-child(1) .ph-pct', t: 'Every test scored, question by question' }], act: '.ph-back' }
    ];
    const INFO = [
      { t: 'Every chapter, one glance', s: 'PAL and Base tests, one click away.', a: ['14 chapters', 'Science · Class 10'], b: ['PAL ready', 'on 3 chapters'] },
      { t: 'Build your own Smart Test', s: 'Pick the kind of test, how long and the topics.', a: ['Base test · Our Environment', 'Objective · 30 min'], b: ['5 questions · 5 marks', 'from the topics you pick'] },
      { t: 'One question at a time', s: 'Timed, just like the real exam.', a: ['Smart Test · 5 topics', 'Question 2 of 5'], b: ['0:05 / 1:10', 'time on this question'] },
      { t: 'Your result, topic by topic', s: 'Marks, readiness and exactly what to fix first.', a: ['60% ready', '3 of 5 marks'], b: ['2 topics to fix first', 'Food Chains and Garbage'] },
      { t: 'Practise on the real paper', s: 'Official CBSE sample papers, one subject at a time.', a: ['CBSE mock tests', '4 subjects'], b: ['Sample Paper 2025-26', '80 marks · 3 hours'] },
      { t: 'The real board pattern', s: 'Sections, marks and timing, exactly as set by CBSE.', a: ['39 questions · 80 marks', 'Science · Class 10'], b: ['180 minutes', 'marked step by step'] },
      { t: 'Every test, one tap away', s: 'Scores, dates and a question-by-question review.', a: ['6 tests this week', 'Science'], b: ['Best score 100%', 'Chemical Equations'] }
    ];
    const DWELL = 6500, ZOOM = 1.4;
    let token = 0, timers = [], idx = -1, running = false, lastP = 0;
    const later = (fn, ms, tk) => timers.push(setTimeout(() => { if (tk === token) fn(); }, ms));
    const clearT = () => { timers.forEach(clearTimeout); timers = []; };

    /* image-fraction -> pixel position inside the view (matches object-fit:cover) */
    function pt(i, f) {
      if (typeof f === 'string') {                      // live HTML page: aim at an element
        const el = $(f, pages[i]); if (!el) return [view.clientWidth / 2, view.clientHeight / 2];
        let x = el.offsetWidth / 2, y = el.offsetHeight / 2;
        for (let e = el; e && e !== world; e = e.offsetParent) { x += e.offsetLeft; y += e.offsetTop; }
        return [x, y];
      }
      const P = PAGES[i], cw = view.clientWidth, ch = view.clientHeight, sc = Math.max(cw / P.ar[0], ch / P.ar[1]), rw = P.ar[0] * sc, rh = P.ar[1] * sc;
      return [(cw - rw) * P.ox + f[0] * rw, f[1] * rh];
    }
    function camera(x, y, z) {
      const cw = view.clientWidth, ch = view.clientHeight;
      let tx = 0, ty = 0;
      if (z > 1) {
        const sx = x + (cw / 2 - x) * .42, sy = y + (ch / 2 - y) * .42;
        tx = clamp(sx - x * z, cw * (1 - z), 0); ty = clamp(sy - y * z, ch * (1 - z), 0);
      }
      world.style.setProperty('--z', z); world.style.setProperty('--tx', tx + 'px'); world.style.setProperty('--ty', ty + 'px');
      return [tx, ty];
    }
    function put(el, x, y) { el.style.left = x + 'px'; el.style.top = y + 'px'; }
    function moveCur(p, jump) {
      if (jump) cur.style.transition = 'none';
      put(cur, p[0], p[1]);
      if (jump) { void cur.offsetWidth; cur.style.transition = ''; }
    }
    function click(p) {
      cur.classList.remove('click'); void cur.offsetWidth; cur.classList.add('click');
      put(rip, p[0], p[1]); rip.classList.remove('go'); void rip.offsetWidth; rip.classList.add('go');
    }
    function focus(i, k, tk) {
      const F = PAGES[i].foci[k], p = pt(i, F.f);
      hl.classList.remove('on'); tag.classList.remove('on');
      const [tx, ty] = camera(p[0], p[1], ZOOM);
      later(() => {
        put(hl, p[0], p[1]); put(tag, p[0], p[1]); tagB.textContent = F.t;
        const cw = view.clientWidth, ch = view.clientHeight, u = cw / 100, bw = tagB.parentNode.offsetWidth;
        const sx = p[0] * ZOOM + tx, sy = p[1] * ZOOM + ty;                 // where the target sits on screen
        const cx = clamp(sx, bw / 2 + 2 * u, cw - bw / 2 - 2 * u);          // keep the label fully on screen
        tag.style.setProperty('--sh', (cx - sx) + 'px');
        tag.classList.toggle('below', !!F.below || sy < ch * .34);
        hl.classList.add('on'); tag.classList.add('on');
      }, 520, tk);
    }
    function unfocus() { hl.classList.remove('on'); tag.classList.remove('on'); camera(0, 0, 1); }

    function setInfo(i, instant) {
      const set = () => {
        const d = INFO[i];
        capN.textContent = '0' + (i + 1); capT.textContent = d.t; capS.textContent = d.s;
        $('b', chipA).textContent = d.a[0]; $('span:not(.ic)', chipA).textContent = d.a[1];
        $('b', chipB).textContent = d.b[0]; $('span:not(.ic)', chipB).textContent = d.b[1];
        dots.forEach((b, n) => { b.classList.remove('on'); if (n === i) { void b.offsetWidth; b.classList.add('on'); } });
      };
      if (instant || reduce) { set(); return; }
      [cap, chipA, chipB].forEach(e => e.classList.add('sw'));
      setTimeout(() => { set(); [cap, chipA, chipB].forEach(e => e.classList.remove('sw')); }, 260);
    }

    function showPage(i, origin, tk) {
      const prev = idx >= 0 ? pages[idx] : null, np = pages[i], first = !prev;
      idx = i;
      pages.forEach(p => { if (p !== np && p !== prev) { p.classList.remove('on', 'recede', 'first', 'picked'); p.style.cssText = ''; } });
      if (prev) prev.style.zIndex = 1;
      np.style.zIndex = 2; np.classList.remove('recede', 'picked'); np.dataset.t0 = Date.now(); np.classList.add('on');
      np.classList.remove('kb'); void np.offsetWidth; np.classList.add('kb');
      if (first) { np.classList.add('first'); }
      else if (origin) {
        const R = Math.hypot(view.clientWidth, view.clientHeight);
        np.style.transition = 'none'; np.style.clipPath = `circle(0px at ${origin[0]}px ${origin[1]}px)`; void np.offsetWidth;
        np.style.transition = 'clip-path 1.25s cubic-bezier(.65,0,.2,1)'; np.style.clipPath = `circle(${R}px at ${origin[0]}px ${origin[1]}px)`;
        prev.classList.add('recede');
        later(() => { np.style.clipPath = ''; np.style.transition = ''; prev.classList.remove('on', 'recede', 'picked'); prev.style.zIndex = ''; }, 1350, tk);
      }
      camera(0, 0, 1); hl.classList.remove('on'); tag.classList.remove('on');
      setInfo(i, first);
      if (reduce) return;
      const P = PAGES[i], off = first ? 700 : 0, n = P.foci.length, tf = k => off + 1300 + k * 2000, tu = tf(n) - 300 + (P.extra || 0);
      cap.style.setProperty('--dd', ((tu + 1450) / 1000).toFixed(2) + 's');
      later(() => moveCur(pt(i, P.foci[0].f)), off + 250, tk);
      P.foci.forEach((F, k) => {
        if (k > 0) later(() => moveCur(pt(i, F.f)), tf(k), tk);
        later(() => focus(i, k, tk), tf(k), tk);
        if (F.pick) later(() => { click(pt(i, F.f)); np.classList.add('picked'); }, (k ? tf(k) : off + 250) + 1150, tk);
      });
      later(() => { unfocus(); moveCur(pt(i, P.act)); }, tu, tk);
      later(() => click(pt(i, P.act)), tu + 1150, tk);
      later(() => showPage((i + 1) % pages.length, pt(i, P.act), tk), tu + 1450, tk);
    }

    function start() {
      if (running) return; running = true; const tk = ++token; clearT();
      lap.classList.remove('lit', 'logo', 'appin', 'loaded');
      if (reduce) { lap.classList.add('lit', 'appin', 'loaded'); idx = -1; showPage(0, null, tk); return; }
      later(() => lap.classList.add('lit'), 80, tk);
      later(() => lap.classList.add('logo'), 380, tk);
      later(() => lap.classList.add('appin'), 2050, tk);
      later(() => { moveCur([view.clientWidth * .16, view.clientHeight * .92], true); idx = -1; showPage(0, null, tk); }, 2250, tk);
      later(() => lap.classList.add('loaded'), 3000, tk);
    }
    function stop() {
      if (!running) return; running = false; token++; clearT();
      lap.classList.remove('lit', 'logo', 'appin', 'loaded');
      pages.forEach(p => { p.classList.remove('on', 'recede', 'first', 'kb', 'picked'); p.style.cssText = ''; });
      hl.classList.remove('on'); tag.classList.remove('on'); camera(0, 0, 1); idx = -1;
    }

    /* live exam timers on the question page */
    (function () {
      const qp = pages.find(p => p.classList.contains('pq')); if (!qp) return;
      const clk = $('.pq-clk b', qp), tm = $('.pq-tm b', qp), fmt = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
      setInterval(() => {
        if (!qp.classList.contains('on')) { clk.textContent = '29:38'; tm.textContent = '0:05'; return; }
        const e = Math.max(0, Math.floor((Date.now() - (+qp.dataset.t0 || Date.now())) / 1000 - 1));
        clk.textContent = fmt(Math.max(0, 29 * 60 + 38 - e)); tm.textContent = fmt(Math.min(70, 5 + e));
      }, 1000);
    })();
    dots.forEach((b, n) => b.addEventListener('click', () => {
      if (!running || idx < 0) return; const tk = ++token; clearT();
      showPage(n, [view.clientWidth / 2, view.clientHeight / 2], tk);
    }));

    /* the lid is scrubbed by scroll: closed as it enters, fully open by mid-screen */
    let ticking = false;
    function onScroll() {
      ticking = false;
      const r = lap.getBoundingClientRect(), vh = innerHeight;
      let p = clamp((vh * .96 - r.top) / (vh * .62), 0, 1);
      if (reduce) p = 1;
      lastP = p;
      const e = p * p * (3 - 2 * p);
      lap.style.setProperty('--lo', (1 - e).toFixed(4));
      lap.style.setProperty('--gx', (10 + clamp((vh - r.top) / (vh + r.height), 0, 1) * 80).toFixed(1) + '%');
      const visible = r.bottom > 60 && r.top < vh * .92;
      if (visible && p > .94) start(); else if (!visible || p < .6) stop();
    }
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();

    /* pointer: gentle 3D tilt (desktop pointers only) */
    if (fine && !reduce) {
      lap.addEventListener('pointermove', e => {
        const r = lap.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        tilt.style.setProperty('--ry', (px * 6).toFixed(2) + 'deg'); tilt.style.setProperty('--rx', (-py * 3.5).toFixed(2) + 'deg');
      });
      lap.addEventListener('pointerleave', () => { tilt.style.setProperty('--ry', '0deg'); tilt.style.setProperty('--rx', '0deg'); });
    }
  })();

  /* ======================================================================
     PRICE — ₹1,299 rolls in digit by digit, then a hairline and the plan line
     settle beneath it. Plays each time the card scrolls into view.
     ====================================================================== */
  (function () {
    const px = $('#px'), card = $('#pc'); if (!px || !card) return;
    // odometer drums: each digit is a column of 0-9, 0-9; rolling = sliding to row 10+digit
    $$('.odo', px).forEach(o => {
      const v = o.dataset.v, withComma = !!o.dataset.c;
      o.innerHTML = v.split('').map((d, i) => {
        const sep = withComma && i === 1 ? '<span class="od-c">,</span>' : '';
        const cells = Array.from({ length: 20 }, (_, k) => `<span>${k % 10}</span>`).join('');
        return `${sep}<span class="od" style="--dg:${10 + +d};--i:${i}"><span class="od-r">${cells}</span></span>`;
      }).join('');
    });
    let t = 0;
    const settle = () => { px.classList.remove('px-idle'); px.classList.add('p4'); };
    const rewind = () => { clearTimeout(t); px.classList.remove('p4', 'px-done'); px.classList.add('px-idle'); };
    if (reduce) { px.classList.remove('px-idle'); px.classList.add('p4', 'px-done'); return; }
    px.classList.add('px-idle');
    new IntersectionObserver(es => { if (es[0].isIntersecting) { clearTimeout(t); t = setTimeout(settle, 200); } else rewind(); }, { threshold: .6 }).observe(card);
  })();
  return () => { dead = true; undo.forEach((f) => f()); timers.forEach((i) => window.clearTimeout(i)); ticks.forEach((i) => window.clearInterval(i)); frames.forEach((i) => window.cancelAnimationFrame(i)); };
}
