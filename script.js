(function () {
  const pages = document.querySelectorAll(".page");
  const navLinks = document.querySelectorAll(".nav-link");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".site-nav");
  const scrollButtons = document.querySelectorAll("[data-scroll-target]");
  const accordionTriggers = document.querySelectorAll(".accordion-trigger");
  const yearSpan = document.getElementById("year");

  function setYear() {
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  function showPage(id) {
    pages.forEach((page) => {
      page.classList.toggle("page--active", page.id === id);
    });
  }

  function setActiveNav(id) {
    navLinks.forEach((link) => {
      const target = link.getAttribute("data-nav");
      link.classList.toggle("is-active", target === id);
    });
  }

  function handleHashNavigation() {
    const hash = window.location.hash.replace("#", "");
    const targetId = hash || "home";
    const exists = Array.from(pages).some((p) => p.id === targetId);
    const id = exists ? targetId : "home";
    showPage(id);
    setActiveNav(id);
  }

  function closeMobileNav() {
    if (navMenu && navToggle) {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  }

  // Navigation link clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("data-nav");
      if (!id) return;
      event.preventDefault();
      window.location.hash = id;
      showPage(id);
      setActiveNav(id);
      closeMobileNav();
      const topY = document.body.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: topY, behavior: "smooth" });
    });
  });

  // Mobile nav toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // CTA smooth scroll
  scrollButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetSelector = btn.getAttribute("data-scroll-target");
      const target = targetSelector ? document.querySelector(targetSelector) : null;
      if (!target) return;
      const id = target.id;
      if (id) {
        window.location.hash = id;
        showPage(id);
        setActiveNav(id);
        const topY = document.body.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: topY, behavior: "smooth" });
      }
    });
  });

  // Accordion behavior
  accordionTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      const panelId = trigger.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      // Close others
      accordionTriggers.forEach((otherTrigger) => {
        const otherPanelId = otherTrigger.getAttribute("aria-controls");
        const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute("aria-expanded", "false");
          if (otherPanel) {
            otherPanel.hidden = true;
          }
        }
      });

      // Toggle current
      trigger.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;
    });
  });

  window.addEventListener("hashchange", handleHashNavigation);

  // Initial load
  setYear();
  handleHashNavigation();
})();
