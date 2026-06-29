/* ==========================================================================
   MoveMinds — Shared JavaScript
   Mobile nav, scroll reveal, animated counters, gallery lightbox,
   donate selector, and accessible form handling. No dependencies.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav__toggle");
    var menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    function close() {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) close();
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("in");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + "ms";
      observer.observe(el);
    });
  }

  /* ---------- Animated counters ---------- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-target")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1600;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll("[data-target]");
    if (!counters.length) return;

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (c) {
      observer.observe(c);
    });
  }

  /* ---------- Gallery lightbox ---------- */
  function initLightbox() {
    var gallery = document.querySelector(".gallery");
    if (!gallery) return;

    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Image preview");
    box.innerHTML =
      '<button class="lightbox__close" aria-label="Close image preview">&times;</button><img alt="">';
    document.body.appendChild(box);

    var img = box.querySelector("img");
    var closeBtn = box.querySelector(".lightbox__close");

    function open(src, alt) {
      img.src = src;
      img.alt = alt || "";
      box.classList.add("open");
      closeBtn.focus();
    }
    function close() {
      box.classList.remove("open");
    }

    gallery.querySelectorAll("img").forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        open(thumb.getAttribute("src"), thumb.getAttribute("alt"));
      });
    });
    closeBtn.addEventListener("click", close);
    box.addEventListener("click", function (e) {
      if (e.target === box) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- Donate page ---------- */
  function initDonate() {
    var amountGrid = document.querySelector(".amount-grid");
    if (!amountGrid) return;

    var customInput = document.getElementById("custom-amount");
    amountGrid.querySelectorAll(".amount-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        amountGrid
          .querySelectorAll(".amount-btn")
          .forEach(function (b) {
            b.classList.remove("active");
          });
        btn.classList.add("active");
        if (customInput) customInput.value = btn.getAttribute("data-amount");
      });
    });

    var toggles = document.querySelectorAll(".toggle-group button");
    toggles.forEach(function (t) {
      t.addEventListener("click", function () {
        toggles.forEach(function (x) {
          x.classList.remove("active");
        });
        t.classList.add("active");
      });
    });
  }

  /* ---------- Forms (client-side validation + success message) ---------- */
  function initForms() {
    document.querySelectorAll("form[data-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        var success = form.querySelector(".form-success");
        if (success) {
          success.classList.add("show");
          success.setAttribute("tabindex", "-1");
          success.focus();
        }
        form.reset();
        var active = form.querySelector(".amount-btn.active");
        if (active) active.classList.remove("active");
      });
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initReveal();
    initCounters();
    initLightbox();
    initDonate();
    initForms();
    initYear();
  });
})();
