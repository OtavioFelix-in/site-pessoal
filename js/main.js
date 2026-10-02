(function () {
  "use strict";

  // ---- Transição suave entre páginas ----
  requestAnimationFrame(function () {
    document.body.classList.add("page-loaded");
  });

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a) return;
    var href = a.getAttribute("href");
    if (!href) return;
    if (a.target === "_blank" || a.hasAttribute("download")) return;
    if (href.charAt(0) === "#") return;
    if (/^(https?:)?\/\//.test(href) || href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) return;
    if (href.slice(-5) !== ".html") return;

    e.preventDefault();
    document.body.classList.remove("page-loaded");
    document.body.classList.add("page-leaving");
    setTimeout(function () {
      window.location.href = href;
    }, 180);
  });

  // ---- Tema claro/escuro (persistido em localStorage) ----
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var STORAGE_KEY = "of-theme";

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      /* localStorage indisponível — segue sem persistir */
    }
  }

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.setAttribute("data-theme", "dark");
    }
  }

  var stored = getStoredTheme();
  if (stored) {
    applyTheme(stored);
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      var next = current === "light" ? "dark" : "light";
      applyTheme(next);
      setStoredTheme(next);
    });
  }

  // ---- Idioma PT/EN ----
  var langToggle = document.getElementById("lang-toggle");
  var langLabel = document.getElementById("lang-toggle-label");
  var LANG_KEY = "of-lang";

  function getStoredLang() {
    try {
      return localStorage.getItem(LANG_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredLang(value) {
    try {
      localStorage.setItem(LANG_KEY, value);
    } catch (e) {
      /* localStorage indisponível — segue sem persistir */
    }
  }

  function applyLang(lang) {
    var nodes = document.querySelectorAll("[data-en], [data-en-html]");
    nodes.forEach(function (el) {
      if (lang === "en") {
        if (el.hasAttribute("data-en-html")) {
          if (!el.hasAttribute("data-pt-html")) {
            el.setAttribute("data-pt-html", el.innerHTML);
          }
          el.innerHTML = el.getAttribute("data-en-html");
        } else {
          if (!el.hasAttribute("data-pt")) {
            el.setAttribute("data-pt", el.textContent);
          }
          el.textContent = el.getAttribute("data-en");
        }
      } else {
        if (el.hasAttribute("data-pt-html")) {
          el.innerHTML = el.getAttribute("data-pt-html");
        } else if (el.hasAttribute("data-pt")) {
          el.textContent = el.getAttribute("data-pt");
        }
      }
    });
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
    if (langLabel) {
      langLabel.textContent = lang === "en" ? "PT" : "EN";
    }
    if (langToggle) {
      langToggle.setAttribute(
        "aria-label",
        lang === "en" ? "Mudar para português" : "Switch to English"
      );
    }
  }

  var storedLang = getStoredLang();
  if (storedLang) {
    applyLang(storedLang);
  }

  if (langToggle) {
    langToggle.addEventListener("click", function () {
      var current = document.documentElement.lang === "en" ? "en" : "pt";
      var next = current === "en" ? "pt" : "en";
      applyLang(next);
      setStoredLang(next);
    });
  }

  // ---- Menu mobile ----
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- Vídeo: o iframe do YouTube só carrega no clique ----
  document.querySelectorAll(".video-embed[data-yt]").forEach(function (box) {
    var btn = box.querySelector(".video-play");
    if (!btn) return;
    btn.addEventListener("click", function () {
      // Aberto direto do disco (file://) o YouTube recusa o embed (erro 153):
      // sem origem http(s) ele não identifica o site. Nesse caso abre no YouTube.
      if (location.protocol === "file:") {
        window.open("https://www.youtube.com/watch?v=" + box.getAttribute("data-yt"), "_blank", "noopener");
        return;
      }
      var iframe = document.createElement("iframe");
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.src =
        "https://www.youtube-nocookie.com/embed/" +
        box.getAttribute("data-yt") +
        "?autoplay=1&rel=0&modestbranding=1";
      iframe.title = "Apresentação — Otávio Felix da Silva";
      iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      box.replaceChildren(iframe);
    });
  });

  // ---- Ano no rodapé ----
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ---- Reveal on scroll ----
  var revealTargets = document.querySelectorAll(
    ".section, .tl-item, .card, .contact-item, .stat, .about-facts li, .about-row .about-photo, .about-body, .about-banner, .about-portrait, .about-intro-text, .skill-group"
  );
  revealTargets.forEach(function (el) {
    el.classList.add("reveal");
    // escalonamento: irmãos do mesmo tipo entram um depois do outro
    var idx = 0, sib = el.previousElementSibling;
    while (sib && idx < 6) {
      if (sib.classList.contains("reveal")) idx++;
      sib = sib.previousElementSibling;
    }
    if (idx) el.style.setProperty("--d", idx * 90 + "ms");
  });
  // entradas laterais na seção Sobre
  [".about-portrait", ".about-row .about-photo"].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) { el.classList.add("reveal-left"); });
  });
  [".about-intro-text", ".about-body"].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) { el.classList.add("reveal-right"); });
  });

  // ---- Contadores que sobem até o valor ----
  function countUp(el) {
    if (el.getAttribute("data-done")) return;
    el.setAttribute("data-done", "1");
    var target = el.getAttribute("data-count") === "years"
      ? new Date().getFullYear() - parseInt(el.getAttribute("data-since"), 10)
      : parseInt(el.getAttribute("data-count"), 10);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = target; return; }
    var start = null, dur = 1200;
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            if (entry.target.hasAttribute("data-count")) countUp(entry.target);
            entry.target.querySelectorAll("[data-count]").forEach(countUp);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
      el.querySelectorAll("[data-count]").forEach(countUp);
    });
  }

  // ---- Barra de progresso de leitura ----
  var navEl = document.getElementById("nav");
  if (navEl) {
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    navEl.appendChild(bar);
    var ticking = false;
    var updateBar = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ")";
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateBar); }
    }, { passive: true });
    updateBar();
  }
})();
