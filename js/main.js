(function () {
  "use strict";

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

  // ---- Ano no rodapé ----
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ---- Reveal on scroll ----
  var revealTargets = document.querySelectorAll(
    ".section, .tl-item, .card, .contact-item"
  );
  revealTargets.forEach(function (el) {
    el.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
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
    });
  }
})();
