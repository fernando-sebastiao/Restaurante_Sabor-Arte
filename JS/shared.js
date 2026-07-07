(function () {
  const storageKey = "saborArteTheme";
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function getSavedTheme() {
    try {
      return localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      return;
    }
  }

  function resolveInitialTheme() {
    const savedTheme = getSavedTheme();
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return prefersDark.matches ? "dark" : "light";
  }

  function updateToggle(button, theme) {
    const isDark = theme === "dark";
    button.setAttribute("aria-label", isDark ? "Ativar modo claro" : "Ativar modo escuro");
    button.setAttribute("title", isDark ? "Modo claro" : "Modo escuro");
    button.textContent = isDark ? "☀" : "☾";
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      updateToggle(button, theme);
    });
  }

  function createThemeToggle() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.dataset.themeToggle = "true";

    const nav = document.querySelector(".nav");
    if (nav) {
      nav.appendChild(button);
    } else {
      button.classList.add("floating");
      document.body.appendChild(button);
    }

    updateToggle(button, root.dataset.theme || resolveInitialTheme());

    button.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      saveTheme(nextTheme);
    });
  }

  function setupScrollReveals() {
    const revealSelectors = [
      ".page-title",
      "main > section",
      ".features article",
      ".signature-grid article",
      ".menu-toolbar",
      ".menu-section",
      ".dish-card",
      ".gallery-toolbar",
      ".gallery-item",
      ".panel",
      ".contact-card",
      ".about-hero > *",
      ".values article",
      ".testimonials-grid article",
      ".review-cta",
      ".add-review-section",
      ".landing-content > *",
      ".not-found-content > *"
    ];

    const elements = Array.from(document.querySelectorAll(revealSelectors.join(",")));
    if (elements.length === 0) return;

    elements.forEach((element, index) => {
      element.classList.add("reveal-on-scroll");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
    });

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    elements.forEach((element) => observer.observe(element));
  }

  applyTheme(resolveInitialTheme());

  document.addEventListener("DOMContentLoaded", () => {
    createThemeToggle();
    setupScrollReveals();
  });
})();
