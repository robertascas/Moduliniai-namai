/* Šiltas karkasas: meniu, kopijavimas ir užklausos forma. */
(function () {
  "use strict";

  // Atidarius puslapį visada pradėti nuo viršaus (nebent nuoroda veda į konkrečią vietą)
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  function toTop() {
    var id = location.hash.slice(1);
    if (id && document.getElementById(id)) return;
    window.scrollTo(0, 0);
  }
  toTop();
  window.addEventListener("pageshow", toTop);
  window.addEventListener("load", function () { setTimeout(toTop, 0); });

  // Meniu mobiliajame
  var tog = document.querySelector(".nav-toggle"), nav = document.getElementById("nav");
  if (tog && nav) {
    tog.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") !== "true";
      nav.setAttribute("data-open", open ? "true" : "false");
      tog.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // El. pašto kopijavimas
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]");
    if (!b) return;
    var done = function () { b.textContent = "Nukopijuota"; setTimeout(function () { b.textContent = "Kopijuoti"; }, 1600); };
    var fallback = function () {
      var t = b.previousElementSibling; if (!t) return;
      var r = document.createRange(); r.selectNodeContents(t);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(b.dataset.copy).then(done, fallback);
    else fallback();
  });

  // Modelio nuotraukų peržiūra ir fasado stiliai
  var vImg = document.getElementById("viewer-img");
  function show(src, alt) { if (vImg) { vImg.src = src; vImg.alt = alt; } }
  document.addEventListener("click", function (e) {
    var t = e.target.closest(".thumb");
    if (t) {
      show(t.dataset.src, t.dataset.alt);
      document.querySelectorAll(".thumb").forEach(function (x) { x.setAttribute("aria-pressed", x === t ? "true" : "false"); });
      return;
    }
    var c = e.target.closest("[data-style-src]");
    if (c) {
      show(c.dataset.styleSrc, c.dataset.styleAlt);
      document.querySelectorAll("[data-style-src]").forEach(function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
      document.querySelectorAll(".thumb").forEach(function (x) { x.setAttribute("aria-pressed", x.dataset.src === c.dataset.styleSrc ? "true" : "false"); });
      if (window.matchMedia("(max-width: 960px)").matches && vImg) vImg.scrollIntoView({ block: "center" });
    }
  });

  // Išplanavimų skirtukai
  document.querySelectorAll("[data-tabs]").forEach(function (box) {
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
    function sel(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false"); t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { sel(t); });
      t.addEventListener("keydown", function (e) {
        var k = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!k) return;
        var n = tabs[(i + k + tabs.length) % tabs.length]; sel(n); n.focus();
      });
    });
  });

  // Modelių filtras pagal plotą
  var filt = document.querySelector("[data-filters]");
  if (filt) {
    filt.addEventListener("click", function (e) {
      var b = e.target.closest("[data-f]"); if (!b) return;
      filt.querySelectorAll("[data-f]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      var r = b.dataset.f === "all" ? [0, 9999] : b.dataset.f.split("-").map(Number);
      document.querySelectorAll("[data-series]").forEach(function (s) {
        var any = false;
        s.querySelectorAll(".mcard").forEach(function (c) { var a = +c.dataset.area, on = a >= r[0] && a <= r[1]; c.hidden = !on; if (on) any = true; });
        s.hidden = !any;
      });
    });
  }

  // Galerijos peržiūra
  var lb = document.getElementById("lightbox");
  if (lb && lb.showModal) {
    var lbImg = document.getElementById("lb-img");
    document.addEventListener("click", function (e) {
      var a = e.target.closest("[data-lightbox]");
      if (a) { e.preventDefault(); lbImg.src = a.getAttribute("href"); lbImg.alt = a.dataset.alt || ""; lb.showModal(); return; }
      if (e.target.closest("[data-lb-close]") || e.target === lb) lb.close();
    });
  }

  // Užklausa
  var form = document.getElementById("uzklausa");
  if (!form) return;
  var hash = location.hash.slice(1);
  var pre = hash && document.getElementById("t-" + hash);
  if (pre) pre.checked = true;
  var modSel = document.getElementById("u-modelis");
  if (hash && modSel && modSel.querySelector('option[value="' + hash + '"]')) {
    document.getElementById("t-namas").checked = true;
    modSel.value = hash;
  }

  function val(name) { var c = form.querySelector('input[name="' + name + '"]:checked'); return c ? c.value : ""; }
  function syncType() {
    var t = val("tipas");
    form.querySelectorAll("[data-only]").forEach(function (fs) { fs.hidden = fs.dataset.only !== t; });
    var n = 2;
    form.querySelectorAll("fieldset").forEach(function (fs, i) {
      if (i === 0 || fs.hidden) return;
      var num = fs.querySelector("[data-step-num]") || fs.querySelector("legend span");
      if (num) num.textContent = "0" + n++;
    });
  }
  form.addEventListener("change", syncType);
  syncType();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
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
    var sum = document.getElementById("u-santrauka");
    if (!ok) { sum.hidden = true; first.focus(); return; }

    var tipas = form.querySelector('input[name="tipas"]:checked');
    var rows = [["Domina", tipas ? tipas.dataset.label : ""]];
    if (val("tipas") === "namas" && modSel && modSel.value) rows.push(["Modelis", modSel.options[modSel.selectedIndex].text]);
    rows.push(["Įrengimas", val("irengimas")]);
    if (val("tipas") === "pirtis") {
      var pr = Array.prototype.map.call(form.querySelectorAll('input[name="priedai"]:checked'), function (x) { return x.value; });
      rows.push(["Pirtis", [val("krosnele")].concat(pr).join(", ")]);
    }
    rows.push(["Projektas", val("projektas")]);
    rows.push(["Vieta", document.getElementById("u-vieta").value.trim() || "Nenurodyta"]);
    rows.push(["Kontaktai", document.getElementById("u-vardas").value.trim() + ", " + document.getElementById("u-tel").value.trim() + ", " + document.getElementById("u-pastas").value.trim()]);
    var msg = document.getElementById("u-zinute").value.trim();
    if (msg) rows.push(["Žinutė", msg]);

    var dl = document.getElementById("u-santrauka-dl");
    dl.innerHTML = "";
    rows.forEach(function (r) {
      var dt = document.createElement("dt"), dd = document.createElement("dd");
      dt.textContent = r[0]; dd.textContent = r[1];
      dl.appendChild(dt); dl.appendChild(dd);
    });
    sum.hidden = false;
    sum.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  });
})();
