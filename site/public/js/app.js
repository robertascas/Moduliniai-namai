/* Šiltas karkasas: meniu, kopijavimas ir užklausos forma. */
(function () {
  "use strict";

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

  // Užklausa
  var form = document.getElementById("uzklausa");
  if (!form) return;
  var hash = location.hash.slice(1);
  var pre = hash && document.getElementById("t-" + hash);
  if (pre) pre.checked = true;

  function val(name) { var c = form.querySelector('input[name="' + name + '"]:checked'); return c ? c.value : ""; }
  function syncType() {
    var t = val("tipas");
    form.querySelectorAll("[data-only]").forEach(function (fs) { fs.hidden = fs.dataset.only !== t; });
    var extra = t === "pirtis" ? 1 : 0;
    form.querySelectorAll("[data-step-num]").forEach(function (n, i) { n.textContent = "0" + (3 + i + extra); });
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
    var rows = [["Domina", tipas ? tipas.dataset.label : ""], ["Įrengimas", val("irengimas")]];
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
