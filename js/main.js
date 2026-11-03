/* Solvecraft — shared interactions */
(function () {
  "use strict";

  /* Mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* Animated counters */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        cio.unobserve(el);
        var target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
        var start = null;
        function tick(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 1400, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* Fake-submit contact form (no backend) */
  document.querySelectorAll("form[data-mock-submit]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var success = form.parentElement.querySelector(".form-success");
      if (success) success.classList.add("show");
      form.reset();
    });
  });

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Hero mascot mouse movement on desktop */
  var hero = document.querySelector(".hero");
  var mascot = document.querySelector(".hero-visual .mascot");

  if (hero && mascot && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    hero.addEventListener("mousemove", function (e) {
      if (window.innerWidth <= 900) return;
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      mascot.style.setProperty("--mx", (x * 12).toFixed(1) + "px");
      mascot.style.setProperty("--my", (y * 8).toFixed(1) + "px");
    });

    hero.addEventListener("mouseleave", function () {
      mascot.style.setProperty("--mx", "0px");
      mascot.style.setProperty("--my", "0px");
    });
  }
})();
