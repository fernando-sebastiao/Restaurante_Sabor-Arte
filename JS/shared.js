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

  function setupMobileNavigation() {
    const nav = document.querySelector(".nav");
    const links = document.querySelector(".nav-links");
    if (!nav || !links || nav.querySelector(".nav-menu-toggle")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "nav-menu-toggle";
    button.setAttribute("aria-label", "Abrir menu de navegação");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    nav.appendChild(button);

    function setMenuState(isOpen) {
      nav.classList.toggle("nav-open", isOpen);
      button.setAttribute("aria-expanded", String(isOpen));
      button.setAttribute("aria-label", isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação");
    }

    button.addEventListener("click", () => {
      setMenuState(!nav.classList.contains("nav-open"));
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("nav-open") || nav.contains(event.target)) return;
      setMenuState(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuState(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) setMenuState(false);
    });
  }

  function createFloatingActions() {
    if (document.querySelector(".floating-actions")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "floating-actions";

    const backToTop = document.createElement("button");
    backToTop.type = "button";
    backToTop.className = "floating-action back-to-top";
    backToTop.setAttribute("aria-label", "Voltar para o topo");
    backToTop.setAttribute("title", "Voltar para o topo");
    backToTop.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const whatsapp = document.createElement("a");
    whatsapp.className = "floating-action whatsapp";
    whatsapp.href = "https://wa.me/244929516315";
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener";
    whatsapp.setAttribute("aria-label", "Falar no WhatsApp");
    whatsapp.setAttribute("title", "Falar no WhatsApp");
    whatsapp.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.01 3.2c-7.05 0-12.78 5.72-12.78 12.77 0 2.25.59 4.45 1.72 6.38L3.12 29l6.82-1.79a12.74 12.74 0 0 0 6.07 1.54c7.05 0 12.78-5.73 12.78-12.78S23.06 3.2 16.01 3.2Zm0 23.37c-1.9 0-3.76-.51-5.38-1.48l-.39-.23-4.04 1.06 1.08-3.94-.25-.41a10.55 10.55 0 0 1-1.62-5.6c0-5.84 4.76-10.59 10.6-10.59 2.83 0 5.49 1.1 7.49 3.1a10.52 10.52 0 0 1 3.1 7.49c0 5.84-4.75 10.6-10.59 10.6Zm5.81-7.93c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.72.16-.21.32-.82 1.03-1.01 1.24-.19.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.77-2.2-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.53-.72-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.07 1.3 3.28c.16.21 2.24 3.42 5.42 4.79.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.15-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z"/></svg>';

    wrapper.appendChild(backToTop);
    wrapper.appendChild(whatsapp);
    document.body.appendChild(wrapper);
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
    setupMobileNavigation();
    createFloatingActions();
    setupScrollReveals();
  });
})();
