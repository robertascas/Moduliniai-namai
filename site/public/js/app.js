/* Moduliniai namai: prototipo logika.
   Kainynas ateina iš <script id="kainynas" type="application/json">. Kainyno demo puslapyje
   pakeistos kainos laikomos šios naršyklės localStorage ir pritaikomos visiems puslapiams. */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var OVR_KEY = "mn-kainynas-v1";
  var dataEl = document.getElementById("kainynas");
  if (!dataEl) return;
  var BASE = JSON.parse(dataEl.textContent);

  /* ---------- Kainynas ---------- */
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function readOverrides() {
    try { return JSON.parse(localStorage.getItem(OVR_KEY)) || null; } catch (e) { return null; }
  }
  function writeOverrides(o) {
    try {
      if (o) localStorage.setItem(OVR_KEY, JSON.stringify(o)); else localStorage.removeItem(OVR_KEY);
      return true;
    } catch (e) { return false; }
  }
  function applyOverrides(base, o) {
    var k = clone(base);
    if (!o) return k;
    ["apdaila", "fasadai", "stogai"].forEach(function (list) {
      k[list].forEach(function (it) {
        var v = o[list] && o[list][it.id];
        if (typeof v === "number" && isFinite(v)) it.kainaM2 = v;
      });
    });
    k.papildomi.forEach(function (it) {
      var v = o.papildomi && o.papildomi[it.id];
      if (v && typeof v === "object") {
        ["pastovi", "uzM2", "uzModuli"].forEach(function (f) { if (typeof v[f] === "number" && isFinite(v[f])) it[f] = v[f]; });
      }
    });
    if (typeof o.pvm === "number" && isFinite(o.pvm)) k.pvm = o.pvm;
    return k;
  }
  var K = applyOverrides(BASE, readOverrides());
  var MW = K.moduloPlotis, MH = K.moduloAukstis;

  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return list[0]; }
  var eur = new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  var mm = new Intl.NumberFormat("lt-LT", { maximumFractionDigits: 0 });
  var m2f = new Intl.NumberFormat("lt-LT", { maximumFractionDigits: 1 });
  function money(v) { return eur.format(Math.round(v / 10) * 10); }

  function extraPrice(p, m) { return p.pastovi + p.uzM2 * m.plotas + p.uzModuli * m.moduliai; }
  function fromPrice(m) {
    var min = Infinity;
    K.apdaila.forEach(function (a) { min = Math.min(min, a.kainaM2); });
    return m.plotas * min;
  }

  function calc(cfg) {
    var m = byId(K.modeliai, cfg.model), a = byId(K.apdaila, cfg.apdaila);
    var f = byId(K.fasadai, cfg.fasadas), s = byId(K.stogai, cfg.stogas);
    var lines = [
      { pav: m.pavadinimas + ", " + a.pavadinimas.toLowerCase() + " apdaila", det: m.plotas + " m² × " + eur.format(a.kainaM2), suma: m.plotas * a.kainaM2 }
    ];
    if (f.kainaM2) lines.push({ pav: "Fasadas: " + f.pavadinimas.toLowerCase(), det: m.plotas + " m² × " + eur.format(f.kainaM2), suma: m.plotas * f.kainaM2 });
    if (s.kainaM2) lines.push({ pav: s.pavadinimas + " stogas", det: m.plotas + " m² × " + eur.format(s.kainaM2), suma: m.plotas * s.kainaM2 });
    var extras = K.papildomi.filter(function (p) { return cfg.papildomi.indexOf(p.id) !== -1; });
    extras.forEach(function (p) { lines.push({ pav: p.pavadinimas, det: "", suma: extraPrice(p, m), extra: true }); });
    var net = lines.reduce(function (t, l) { return t + l.suma; }, 0);
    var weeks = 2 + m.gamyba + a.papildomosSavaites + 2 + (cfg.papildomi.indexOf("projektas") !== -1 ? 6 : 0);
    return { m: m, a: a, f: f, s: s, lines: lines, net: net, vat: net * K.pvm, gross: net * (1 + K.pvm), weeks: [weeks, weeks + 3] };
  }

  /* ---------- SVG pagalbinės ---------- */
  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    if (attrs) for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function clear(svg) { while (svg.firstChild) svg.removeChild(svg.firstChild); }
  function f2(n) { return Math.round(n * 100) / 100; }

  /* ---------- Aksonometrija ---------- */
  var ROOF = { top: "#4B515B", side: "#353A42", edge: "#23272D" };
  var TOP_FACE = "#C9CED6";

  function drawAxo(svg, o) {
    var m = o.model, n = m.moduliai, W = n * MW, L = m.ilgis, H = MH;
    var col = o.fasadas.spalvos, wood = o.fasadas.id !== "tinkas";
    var s = 20, c = Math.cos(Math.PI / 6) * s, k = Math.sin(Math.PI / 6) * s;
    var EX = 1.7, RZ = 4.2;
    function P(x, y, z) { return [f2((x - y) * c), f2((x + y) * k - z * s)]; }
    var bb = [Infinity, Infinity, -Infinity, -Infinity];
    function grow(pt, offs) {
      offs.forEach(function (d) {
        bb[0] = Math.min(bb[0], pt[0] + d[0]); bb[1] = Math.min(bb[1], pt[1] + d[1]);
        bb[2] = Math.max(bb[2], pt[0] + d[0]); bb[3] = Math.max(bb[3], pt[1] + d[1]);
      });
    }
    function poly(parent, pts3, attrs, offs) {
      var pts = pts3.map(function (p) { return P(p[0], p[1], p[2]); });
      pts.forEach(function (p) { grow(p, offs || [[0, 0]]); });
      attrs = attrs || {};
      attrs.points = pts.map(function (p) { return p.join(","); }).join(" ");
      return el("polygon", attrs, parent);
    }
    function line(parent, a, b, attrs, offs) {
      var p1 = P(a[0], a[1], a[2]), p2 = P(b[0], b[1], b[2]);
      grow(p1, offs || [[0, 0]]); grow(p2, offs || [[0, 0]]);
      attrs = attrs || {};
      attrs.x1 = p1[0]; attrs.y1 = p1[1]; attrs.x2 = p2[0]; attrs.y2 = p2[1];
      return el("line", attrs, parent);
    }
    function glass(parent, quad, offs) {
      poly(parent, quad, { fill: "var(--glass)" }, offs);
      // atspindys
      var a = quad[0], b = quad[1], d = quad[3];
      function lerp(t, u) { return [a[0] + (b[0] - a[0]) * t + (d[0] - a[0]) * u, a[1] + (b[1] - a[1]) * t + (d[1] - a[1]) * u, a[2] + (b[2] - a[2]) * t + (d[2] - a[2]) * u]; }
      poly(parent, [lerp(0.15, 0), lerp(0.42, 0), lerp(0.12, 1), lerp(0, 1)], { fill: "var(--glass-hi)", opacity: ".28" }, offs);
    }

    clear(svg);
    svg.setAttribute("data-exploded", o.exploded ? "true" : "false");

    // Sklypas
    var gx0 = -2.2, gy0 = -2.2, gx1 = W + 2.2, gy1 = L + 2.8;
    var ground = el("g", null, svg);
    poly(ground, [[gx0, gy0, 0], [gx1, gy0, 0], [gx1, gy1, 0], [gx0, gy1, 0]], { fill: "var(--ground)" });
    for (var gx = Math.ceil(gx0); gx <= gx1; gx++) line(ground, [gx, gy0, 0], [gx, gy1, 0], { stroke: "var(--ground-line)", "stroke-width": 1 });
    for (var gy = Math.ceil(gy0); gy <= gy1; gy++) line(ground, [gx0, gy, 0], [gx1, gy, 0], { stroke: "var(--ground-line)", "stroke-width": 1 });
    poly(ground, [[0, 0, 0], [W, 0, 0], [W, L, 0], [0, L, 0]], { fill: "none", stroke: "var(--cobalt)", "stroke-width": 1.4, "stroke-dasharray": "5 4" });
    poly(ground, [[0.1, 0.1, 0], [W + 0.7, 0.1, 0], [W + 0.7, L + 0.5, 0], [0.1, L + 0.5, 0]], { fill: "var(--ink)", opacity: ".07" });

    // Matmenys
    if (o.dims) {
      var dg = el("g", { class: "dims" }, ground);
      var dy = L + 1.6, dx = W + 1.5;
      var dimAttr = { stroke: "var(--ink-2)", "stroke-width": 1 };
      line(dg, [0, dy, 0], [W, dy, 0], dimAttr);
      line(dg, [0, dy - 0.3, 0], [0, dy + 0.3, 0], dimAttr);
      line(dg, [W, dy - 0.3, 0], [W, dy + 0.3, 0], dimAttr);
      var mid = P(W / 2, dy, 0);
      var t1 = el("text", { x: mid[0], y: mid[1] - 5, "text-anchor": "middle", "font-size": 11, "font-family": "IBM Plex Mono, monospace", fill: "var(--ink-2)", transform: "rotate(30 " + mid[0] + " " + mid[1] + ")" }, dg);
      t1.textContent = mm.format(W * 1000);
      line(dg, [dx, 0, 0], [dx, L, 0], dimAttr);
      line(dg, [dx - 0.3, 0, 0], [dx + 0.3, 0, 0], dimAttr);
      line(dg, [dx - 0.3, L, 0], [dx + 0.3, L, 0], dimAttr);
      var mid2 = P(dx, L / 2, 0);
      var t2 = el("text", { x: mid2[0], y: mid2[1] - 5, "text-anchor": "middle", "font-size": 11, "font-family": "IBM Plex Mono, monospace", fill: "var(--ink-2)", transform: "rotate(-30 " + mid2[0] + " " + mid2[1] + ")" }, dg);
      t2.textContent = mm.format(L * 1000);
    }

    // Moduliai (nuo tolimiausio iki artimiausio)
    var groups = [];
    for (var i = 0; i < n; i++) {
      var off = [i * EX * c, i * EX * k];
      var offs = [[0, 0], off];
      var g = el("g", { class: "mod" }, svg);
      g.dataset.dx = off[0]; g.dataset.dy = off[1];
      var x0 = i * MW, x1 = x0 + MW;
      // viršus, šonas, galas
      poly(g, [[x0, 0, H], [x1, 0, H], [x1, L, H], [x0, L, H]], { fill: TOP_FACE, stroke: "var(--ink)", "stroke-width": .8, "stroke-linejoin": "round" }, offs);
      poly(g, [[x1, 0, 0], [x1, L, 0], [x1, L, H], [x1, 0, H]], { fill: col[1] }, offs);
      poly(g, [[x0, L, 0], [x1, L, 0], [x1, L, H], [x0, L, H]], { fill: col[0] }, offs);
      if (wood) {
        var bo = { stroke: col[1], "stroke-width": .7, opacity: ".55" };
        for (var by = 0.22; by < L; by += 0.22) line(g, [x1, by, 0], [x1, by, H], { stroke: "rgba(0,0,0,.18)", "stroke-width": .6 }, offs);
        for (var bx = x0 + 0.22; bx < x1; bx += 0.22) line(g, [bx, L, 0], [bx, L, H], bo, offs);
      }
      // langai gale (svetainės pusė)
      glass(g, [[x0 + 0.45, L, 0.3], [x1 - 0.45, L, 0.3], [x1 - 0.45, L, 2.55], [x0 + 0.45, L, 2.55]], offs);
      line(g, [x0 + MW / 2, L, 0.3], [x0 + MW / 2, L, 2.55], { stroke: col[1], "stroke-width": 2 }, offs);
      // langai šone (matomas tik paskutinio modulio, bet piešiame visiems)
      [[0.18, 1.3], [0.48, 1.3], [0.78, 2.1]].forEach(function (w) {
        var yc = w[0] * L, half = w[1] / 2;
        var z0 = w[1] > 2 ? 0.3 : 0.95;
        glass(g, [[x1, yc + half, z0], [x1, yc - half, z0], [x1, yc - half, 2.35], [x1, yc + half, 2.35]], offs);
      });
      // kontūrai
      poly(g, [[x1, 0, 0], [x1, L, 0], [x1, L, H], [x1, 0, H]], { fill: "none", stroke: "var(--ink)", "stroke-width": .8, "stroke-linejoin": "round" }, offs);
      poly(g, [[x0, L, 0], [x1, L, 0], [x1, L, H], [x0, L, H]], { fill: "none", stroke: "var(--ink)", "stroke-width": .8, "stroke-linejoin": "round" }, offs);
      // modulio žymė
      var lp = P(x0 + MW / 2, L / 2, H);
      var lg = el("g", { class: "mod-label" }, g);
      el("rect", { x: lp[0] - 19, y: lp[1] - 9, width: 38, height: 18, fill: "var(--cobalt)" }, lg);
      var lt = el("text", { x: lp[0], y: lp[1] + 4, "text-anchor": "middle", "font-size": 11, "font-weight": 600, "font-family": "IBM Plex Mono, monospace", fill: "var(--cobalt-ink)" }, lg);
      lt.textContent = "M-0" + (i + 1);
      groups.push(g);
    }

    // Stogas
    var roofOff = [(n - 1) * EX / 2 * c, (n - 1) * EX / 2 * k - RZ * s];
    var roffs = [[0, 0], roofOff];
    var rg = el("g", { class: "roof" }, svg);
    rg.dataset.dx = roofOff[0]; rg.dataset.dy = roofOff[1];
    if (o.stogas === "plokscias") {
      var e = 0.18, t = 0.32;
      poly(rg, [[-e, -e, H + t], [W + e, -e, H + t], [W + e, L + e, H + t], [-e, L + e, H + t]], { fill: ROOF.top }, roffs);
      poly(rg, [[W + e, -e, H], [W + e, L + e, H], [W + e, L + e, H + t], [W + e, -e, H + t]], { fill: ROOF.side }, roffs);
      poly(rg, [[-e, L + e, H], [W + e, L + e, H], [W + e, L + e, H + t], [-e, L + e, H + t]], { fill: ROOF.edge }, roffs);
    } else {
      var ov = 0.35, tg = Math.tan(22 * Math.PI / 180), Hr = (W / 2) * tg, ez = H - ov * tg;
      var gable = [[0, L, H], [W, L, H], [W / 2, L, H + Hr]];
      poly(rg, gable, { fill: col[0], stroke: "var(--ink)", "stroke-width": .8, "stroke-linejoin": "round" }, roffs);
      if (wood) {
        for (var gxx = 0.22; gxx < W; gxx += 0.22) {
          var top = H + Hr - Math.abs(gxx - W / 2) * tg;
          line(rg, [gxx, L, H], [gxx, L, top], { stroke: col[1], "stroke-width": .7, opacity: ".55" }, roffs);
        }
      }
      if (W >= 7) glass(rg, [[W / 2 - 1.1, L, H + 0.2], [W / 2 + 1.1, L, H + 0.2], [W / 2 + 1.1, L, H + Hr - 1.1 * tg - 0.25], [W / 2 - 1.1, L, H + Hr - 1.1 * tg - 0.25]], roffs);
      poly(rg, [[-ov, -ov, ez], [-ov, L + ov, ez], [W / 2, L + ov, H + Hr], [W / 2, -ov, H + Hr]], { fill: ROOF.side, stroke: ROOF.edge, "stroke-width": .8 }, roffs);
      poly(rg, [[W / 2, -ov, H + Hr], [W / 2, L + ov, H + Hr], [W + ov, L + ov, ez], [W + ov, -ov, ez]], { fill: ROOF.top, stroke: ROOF.edge, "stroke-width": .8 }, roffs);
      for (var sy = 0.6; sy < L + ov; sy += 0.6) line(rg, [W / 2, sy, H + Hr], [W + ov, sy, ez], { stroke: ROOF.edge, "stroke-width": .6, opacity: ".7" }, roffs);
      line(rg, [W / 2, -ov, H + Hr], [W / 2, L + ov, H + Hr], { stroke: ROOF.edge, "stroke-width": 1.6 }, roffs);
    }

    var pad = 14;
    svg.setAttribute("viewBox", f2(bb[0] - pad) + " " + f2(bb[1] - pad) + " " + f2(bb[2] - bb[0] + pad * 2) + " " + f2(bb[3] - bb[1] + pad * 2));
    setExploded(svg, !!o.exploded);
  }

  function setExploded(svg, on) {
    svg.setAttribute("data-exploded", on ? "true" : "false");
    svg.querySelectorAll(".mod, .roof").forEach(function (g) {
      g.style.transform = on ? "translate(" + g.dataset.dx + "px," + g.dataset.dy + "px)" : "translate(0px,0px)";
    });
  }

  /* ---------- Planas ---------- */
  var WET = /^(Vonia|WC)/;
  function drawPlan(svg, m, o) {
    o = o || {};
    var W = m.moduliai * MW, L = m.ilgis, pad = o.dims ? 1.25 : 0.25;
    clear(svg);
    svg.setAttribute("viewBox", f2(-pad) + " " + f2(-pad) + " " + f2(W + pad * 2) + " " + f2(L + pad * 2));
    m.patalpos.forEach(function (r) {
      el("rect", { x: r.x, y: r.y, width: r.w, height: r.h, class: "plan-room" + (WET.test(r.pav) ? " wet" : "") }, svg);
    });
    for (var i = 1; i < m.moduliai; i++) el("line", { x1: i * MW, y1: 0, x2: i * MW, y2: L, class: "plan-join" }, svg);
    // langai
    var win = { fill: "var(--surface)", stroke: "var(--ink)", "stroke-width": .04 };
    for (var j = 0; j < m.moduliai; j++) {
      var x0 = j * MW;
      el("rect", Object.assign({ x: x0 + 0.45, y: L - 0.1, width: MW - 0.9, height: 0.2 }, win), svg);
      el("rect", Object.assign({ x: x0 + 1.2, y: -0.1, width: 1.2, height: 0.2 }, win), svg);
    }
    el("rect", Object.assign({ x: W - 0.1, y: L * 0.78 - 1.05, width: 0.2, height: 2.1 }, win), svg);
    el("rect", { x: 0, y: 0, width: W, height: L, class: "plan-outline" }, svg);

    if (o.labels) {
      m.patalpos.forEach(function (r) {
        var area = r.w * r.h, fs = o.fs || 0.34;
        var name = r.pav, cw = fs * 0.52;
        if (name.length * cw > r.w - 0.3) name = name.split(/[ ,]/)[0];
        if (name.length * cw > r.w - 0.3 || r.h < 1.1) name = "";
        var cx = r.x + r.w / 2, cy = r.y + r.h / 2;
        if (name) {
          var t = el("text", { x: cx, y: cy - 0.06, "text-anchor": "middle", class: "plan-label", "font-size": fs, "font-weight": 600 }, svg);
          t.textContent = name;
        }
        var a = el("text", { x: cx, y: name ? cy + fs * 1.15 : cy + fs * 0.35, "text-anchor": "middle", class: "plan-area", "font-size": fs * 0.85 }, svg);
        a.textContent = m2f.format(area) + " m²";
      });
    }
    if (o.dims) {
      var d = -0.7;
      el("line", { x1: 0, y1: d, x2: W, y2: d, class: "plan-dim" }, svg);
      el("line", { x1: 0, y1: d - 0.15, x2: 0, y2: d + 0.15, class: "plan-dim" }, svg);
      el("line", { x1: W, y1: d - 0.15, x2: W, y2: d + 0.15, class: "plan-dim" }, svg);
      var tw = el("text", { x: W / 2, y: d - 0.2, "text-anchor": "middle", class: "plan-dim-text", "font-size": 0.32 }, svg);
      tw.textContent = mm.format(W * 1000);
      el("line", { x1: d, y1: 0, x2: d, y2: L, class: "plan-dim" }, svg);
      el("line", { x1: d - 0.15, y1: 0, x2: d + 0.15, y2: 0, class: "plan-dim" }, svg);
      el("line", { x1: d - 0.15, y1: L, x2: d + 0.15, y2: L, class: "plan-dim" }, svg);
      var tl = el("text", { x: d - 0.2, y: L / 2, "text-anchor": "middle", class: "plan-dim-text", "font-size": 0.32, transform: "rotate(-90 " + (d - 0.2) + " " + L / 2 + ")" }, svg);
      tl.textContent = mm.format(L * 1000);
      for (var q = 0; q < m.moduliai; q++) {
        var mt = el("text", { x: q * MW + MW / 2, y: L + 0.62, "text-anchor": "middle", class: "plan-dim-text", "font-size": 0.3, fill: "var(--cobalt)" }, svg);
        mt.textContent = "M-0" + (q + 1);
      }
    }
  }

  /* ---------- Inicializacija ---------- */
  function axoFromEl(svg) {
    var m = byId(K.modeliai, svg.dataset.model);
    drawAxo(svg, {
      model: m,
      fasadas: byId(K.fasadai, svg.dataset.fasadas || "maumedis"),
      stogas: svg.dataset.stogas || "slaitinis",
      exploded: svg.dataset.start === "exploded",
      dims: svg.dataset.dims === "true"
    });
  }

  document.querySelectorAll("svg[data-axo]").forEach(function (svg) {
    axoFromEl(svg);
    if (svg.dataset.start === "exploded") {
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setTimeout(function () { setExploded(svg, false); syncExplodeBtn(svg); }, reduce ? 0 : 700);
    }
  });
  document.querySelectorAll("svg[data-plan]").forEach(function (svg) {
    drawPlan(svg, byId(K.modeliai, svg.dataset.plan), { labels: svg.dataset.labels === "true", dims: svg.dataset.dims === "true" });
  });

  function syncExplodeBtn(svg) {
    document.querySelectorAll('[data-explode-for="' + svg.id + '"]').forEach(function (b) {
      var on = svg.getAttribute("data-exploded") === "true";
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.querySelector("span").textContent = on ? "Surinkti namą" : "Išskaidyti į modulius";
    });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-explode-for]");
    if (b) {
      var svg = document.getElementById(b.dataset.explodeFor);
      setExploded(svg, svg.getAttribute("data-exploded") !== "true");
      syncExplodeBtn(svg);
      return;
    }
    var sw = e.target.closest("[data-swatch-for]");
    if (sw) {
      var target = document.getElementById(sw.dataset.swatchFor);
      var wasExploded = target.getAttribute("data-exploded") === "true";
      target.dataset.fasadas = sw.dataset.fasadas;
      target.dataset.start = wasExploded ? "exploded" : "";
      axoFromEl(target);
      document.querySelectorAll('[data-swatch-for="' + target.id + '"]').forEach(function (x) { x.setAttribute("aria-pressed", x === sw ? "true" : "false"); });
      var lab = document.querySelector('[data-swatch-label="' + target.id + '"]');
      if (lab) lab.textContent = byId(K.fasadai, sw.dataset.fasadas).pavadinimas;
      return;
    }
    var cp = e.target.closest("[data-copy]");
    if (cp) {
      var txt = cp.dataset.copy;
      var done = function () { cp.textContent = "Nukopijuota"; setTimeout(function () { cp.textContent = "Kopijuoti"; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { selectText(cp.previousElementSibling); });
      else selectText(cp.previousElementSibling);
    }
  });
  function selectText(node) {
    if (!node) return;
    var r = document.createRange(); r.selectNodeContents(node);
    var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
  }

  // Kainos „nuo“ (atnaujinamos pagal kainyną)
  document.querySelectorAll("[data-from-price]").forEach(function (n) {
    n.textContent = money(fromPrice(byId(K.modeliai, n.dataset.fromPrice)));
  });
  document.querySelectorAll("[data-finish-price]").forEach(function (n) {
    var parts = n.dataset.finishPrice.split(":");
    var m = byId(K.modeliai, parts[0]), a = byId(K.apdaila, parts[1]);
    n.textContent = money(m.plotas * a.kainaM2);
  });
  document.querySelectorAll("[data-rate]").forEach(function (n) {
    var parts = n.dataset.rate.split(":");
    n.textContent = eur.format(byId(K[parts[0]], parts[1]).kainaM2) + "/m²";
  });

  // Navigacija mobiliajame
  var tog = document.querySelector(".nav-toggle"), nav = document.getElementById("nav");
  if (tog && nav) {
    tog.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") !== "true";
      nav.setAttribute("data-open", open ? "true" : "false");
      tog.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Katalogo filtrai
  var filt = document.querySelector("[data-filters]");
  if (filt) {
    filt.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-f]");
      if (!b) return;
      filt.querySelectorAll("button[data-f]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      var f = b.dataset.f;
      document.querySelectorAll("[data-cat-item]").forEach(function (it) {
        var a = +it.dataset.area, show = f === "all" || (f === "small" && a < 70) || (f === "mid" && a >= 70 && a < 110) || (f === "large" && a >= 110);
        it.hidden = !show;
      });
    });
  }

  /* ---------- Formos ---------- */
  function validate(form) {
    var ok = true, first = null;
    form.querySelectorAll("[required]").forEach(function (inp) {
      var v = inp.type === "checkbox" ? inp.checked : inp.value.trim() !== "";
      if (v && inp.type === "email") v = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value.trim());
      if (v && inp.type === "tel") v = inp.value.replace(/\D/g, "").length >= 8;
      inp.setAttribute("aria-invalid", v ? "false" : "true");
      var err = form.querySelector('[data-err-for="' + inp.id + '"]');
      if (err) err.hidden = v;
      if (!v) { ok = false; if (!first) first = inp; }
    });
    if (first) first.focus();
    return ok;
  }
  document.querySelectorAll("form[data-lead-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = validate(form);
      var msg = form.querySelector("[data-ok]");
      if (msg) msg.hidden = !ok;
    });
  });
  var leadModel = document.getElementById("lf-model");
  if (leadModel && location.hash) {
    var hm = location.hash.slice(1);
    if (K.modeliai.some(function (m) { return m.id === hm; })) leadModel.value = hm;
  }

  /* ---------- Konfigūratorius ---------- */
  var cfgForm = document.getElementById("cfg");
  if (cfgForm) {
    var stage = document.getElementById("cfg-axo");
    var planSvg = document.getElementById("cfg-plan");
    var exploded = false;
    var hashModel = location.hash.slice(1);
    if (K.modeliai.some(function (m) { return m.id === hashModel; })) {
      var r = document.getElementById("cfg-model-" + hashModel);
      if (r) r.checked = true;
    }
    // kainos prie pasirinkimų
    cfgForm.querySelectorAll("[data-opt-price]").forEach(function (n) {
      var p = n.dataset.optPrice.split(":");
      if (p[0] === "papildomi") n.dataset.ex = p[1];
    });

    function readCfg() {
      var v = function (name) { var c = cfgForm.querySelector('input[name="' + name + '"]:checked'); return c ? c.value : null; };
      return {
        model: v("model"), apdaila: v("apdaila"), fasadas: v("fasadas"), stogas: v("stogas"),
        papildomi: Array.prototype.map.call(cfgForm.querySelectorAll('input[name="papildomi"]:checked'), function (x) { return x.value; })
      };
    }
    var lastModel = null;
    function update() {
      var cfg = readCfg(), r = calc(cfg);
      drawAxo(stage, { model: r.m, fasadas: r.f, stogas: cfg.stogas, exploded: exploded, dims: true });
      if (lastModel !== cfg.model) { drawPlan(planSvg, r.m, { labels: false, dims: false }); lastModel = cfg.model; }
      // kainos prie pasirinkimų
      cfgForm.querySelectorAll("[data-opt-price]").forEach(function (n) {
        var p = n.dataset.optPrice.split(":"), txt;
        if (p[0] === "model") txt = "nuo " + money(fromPrice(byId(K.modeliai, p[1])));
        else if (p[0] === "apdaila") txt = eur.format(byId(K.apdaila, p[1]).kainaM2) + "/m²";
        else if (p[0] === "fasadai" || p[0] === "stogai") { var v = byId(K[p[0]], p[1]).kainaM2; txt = v ? "+" + money(v * r.m.plotas) : "įskaičiuota"; }
        else if (p[0] === "papildomi") txt = "+" + money(extraPrice(byId(K.papildomi, p[1]), r.m));
        n.textContent = txt;
      });
      var bd = document.getElementById("cfg-breakdown");
      bd.innerHTML = "";
      r.lines.forEach(function (l) {
        var d = document.createElement("div");
        d.innerHTML = "<dt></dt><dd></dd>";
        d.firstChild.textContent = l.pav;
        d.lastChild.textContent = money(l.suma);
        bd.appendChild(d);
      });
      var vatRow = document.createElement("div");
      vatRow.innerHTML = "<dt>PVM " + Math.round(K.pvm * 100) + " %</dt><dd></dd>";
      vatRow.lastChild.textContent = money(r.vat);
      bd.appendChild(vatRow);
      var sum = document.createElement("div"); sum.className = "sum";
      sum.innerHTML = "<dt>Iš viso su PVM</dt><dd></dd>";
      sum.lastChild.textContent = money(r.gross);
      bd.appendChild(sum);
      document.getElementById("cfg-total").textContent = money(r.net);
      document.getElementById("cfg-weeks").textContent = r.weeks[0] + "–" + r.weeks[1] + " sav.";
      document.getElementById("cfg-name").textContent = r.m.pavadinimas;
      document.getElementById("cfg-sub").textContent = r.m.plotas + " m² · " + r.m.moduliai + " mod. · " + r.f.pavadinimas.toLowerCase() + " · " + r.s.pavadinimas.toLowerCase() + " stogas";
      return r;
    }
    cfgForm.addEventListener("change", update);
    update();

    var exBtn = document.getElementById("cfg-explode");
    exBtn.addEventListener("click", function () {
      exploded = !exploded;
      setExploded(stage, exploded);
      exBtn.setAttribute("aria-pressed", exploded ? "true" : "false");
      exBtn.querySelector("span").textContent = exploded ? "Surinkti namą" : "Išskaidyti į modulius";
    });

    // Pasiūlymas
    var reqForm = document.getElementById("offer-form");
    var offerSec = document.getElementById("offer-section");
    reqForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(reqForm)) return;
      var cfg = readCfg(), r = calc(cfg);
      buildOffer(r, cfg, {
        name: reqForm.querySelector("#of-name").value.trim(),
        phone: reqForm.querySelector("#of-phone").value.trim(),
        email: reqForm.querySelector("#of-email").value.trim(),
        place: reqForm.querySelector("#of-place").value.trim()
      });
      offerSec.hidden = false;
      offerSec.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  }

  function buildOffer(r, cfg, who) {
    var now = new Date(), until = new Date(now.getTime() + 30 * 864e5);
    var df = new Intl.DateTimeFormat("lt-LT", { year: "numeric", month: "2-digit", day: "2-digit" });
    var no = "MN-" + now.getFullYear() + "-" + String(Math.floor(1000 + Math.random() * 9000));
    var set = function (id, v) { var n = document.getElementById(id); if (n) n.textContent = v; };
    set("of-no", no);
    set("of-date", df.format(now));
    set("of-valid", df.format(until));
    set("of-client", who.name);
    set("of-contacts", who.phone + " · " + who.email);
    set("of-place-out", who.place || "Nenurodyta");
    set("of-model", r.m.pavadinimas + ", " + r.m.plotas + " m²");
    set("of-spec", r.m.moduliai + " mod. · " + r.a.pavadinimas.toLowerCase() + " apdaila · " + r.f.pavadinimas.toLowerCase() + " · " + r.s.pavadinimas.toLowerCase() + " stogas");
    set("of-weeks", r.weeks[0] + "–" + r.weeks[1] + " savaitės nuo sutarties pasirašymo");
    var tb = document.getElementById("of-lines");
    tb.innerHTML = "";
    r.lines.forEach(function (l, idx) {
      var tr = document.createElement("tr");
      tr.innerHTML = "<td></td><td></td><td></td>";
      tr.children[0].textContent = String(idx + 1);
      tr.children[1].textContent = l.pav + (l.det ? " (" + l.det + ")" : "");
      tr.children[2].textContent = money(l.suma);
      tb.appendChild(tr);
    });
    set("of-net", money(r.net));
    set("of-vat-label", "PVM " + Math.round(K.pvm * 100) + " %");
    set("of-vat", money(r.vat));
    set("of-gross", money(r.gross));
    drawAxo(document.getElementById("of-axo"), { model: r.m, fasadas: r.f, stogas: cfg.stogas, exploded: false, dims: false });
    drawPlan(document.getElementById("of-plan"), r.m, { labels: true, dims: true, fs: 0.3 });
  }

  /* ---------- Kainyno demo ---------- */
  var adm = document.getElementById("admin");
  if (adm) {
    adm.querySelectorAll("input[data-k]").forEach(function (inp) {
      var p = inp.dataset.k.split(":");
      if (p[0] === "pvm") inp.value = Math.round(K.pvm * 100);
      else if (p[0] === "papildomi") inp.value = byId(K.papildomi, p[1])[p[2]];
      else inp.value = byId(K[p[0]], p[1]).kainaM2;
    });
    var status = document.getElementById("admin-status");
    adm.addEventListener("submit", function (e) {
      e.preventDefault();
      var o = { apdaila: {}, fasadai: {}, stogai: {}, papildomi: {} };
      var bad = false;
      adm.querySelectorAll("input[data-k]").forEach(function (inp) {
        var v = Number(String(inp.value).replace(",", "."));
        if (!isFinite(v) || v < 0 || inp.value === "") { inp.setAttribute("aria-invalid", "true"); bad = true; return; }
        inp.setAttribute("aria-invalid", "false");
        var p = inp.dataset.k.split(":");
        if (p[0] === "pvm") o.pvm = v / 100;
        else if (p[0] === "papildomi") { o.papildomi[p[1]] = o.papildomi[p[1]] || {}; o.papildomi[p[1]][p[2]] = v; }
        else o[p[0]][p[1]] = v;
      });
      if (bad) { status.style.color = "var(--err)"; status.textContent = "Patikrinkite pažymėtus laukus: įrašykite skaičių be raidžių."; return; }
      var saved = writeOverrides(o);
      status.style.color = "";
      status.textContent = saved ? "Išsaugota. Atidarykite konfigūratorių, kad pamatytumėte naujas kainas." : "Ši naršyklė neleidžia išsaugoti duomenų. Pabandykite ne privačiame lange.";
    });
    document.getElementById("admin-reset").addEventListener("click", function () {
      writeOverrides(null);
      K = applyOverrides(BASE, null);
      adm.querySelectorAll("input[data-k]").forEach(function (inp) {
        var p = inp.dataset.k.split(":");
        if (p[0] === "pvm") inp.value = Math.round(K.pvm * 100);
        else if (p[0] === "papildomi") inp.value = byId(K.papildomi, p[1])[p[2]];
        else inp.value = byId(K[p[0]], p[1]).kainaM2;
        inp.setAttribute("aria-invalid", "false");
      });
      status.style.color = "";
      status.textContent = "Atkurtas pradinis kainynas.";
    });
  }
})();
