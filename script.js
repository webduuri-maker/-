(function () {
  const pages = document.querySelectorAll(".page");
  const navLinks = document.querySelectorAll(".nav-link");
  const scrollButtons = document.querySelectorAll("[data-scroll-target]");
  const accordionTriggers = document.querySelectorAll(".accordion-trigger");
  const audioCards = document.querySelectorAll(".audio-card");
  const yearSpan = document.getElementById("year");

  // Оныг тохируулах
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Хуудас солих функц
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

  // URL hash-аар навигаци хийх
  function handleHashNavigation() {
    const hash = window.location.hash.replace("#", "");
    const targetId = hash || "home";
    showPage(targetId);
    setActiveNav(targetId);
  }

  window.addEventListener("hashchange", handleHashNavigation);
  handleHashNavigation();

  // Товчлуурын scroll
  scrollButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-scroll-target').replace('#', '');
      window.location.hash = targetId;
    });
  });

  // Аккордион
  accordionTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      const panelId = trigger.getAttribute("aria-controls");
      const panel = document.getElementById(panelId);

      trigger.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });

  // Аудио картын идэвхжүүлэлт
  audioCards.forEach((card) => {
    const audio = card.querySelector("audio");
    if (!audio) return;

    audio.addEventListener("play", () => {
      audioCards.forEach(c => c.classList.remove("is-playing"));
      card.classList.add("is-playing");
    });

    audio.addEventListener("pause", () => card.classList.remove("is-playing"));
  });

  // Form-ын dummy илгээлт
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Таны зурвасыг хүлээн авлаа. Баярлалаа!");
      contactForm.reset();
    });
  }
})();
