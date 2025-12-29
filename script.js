// Baynbaraat Aylguu – Interaction Script
// Vanilla JS only, calm and minimal

document.addEventListener("DOMContentLoaded", function () {
  setupSmoothNavigation();
  setupUserGuideAccordion();
  setupAudioInteractions();
});

/**
 * Smooth scrolling for main navigation links
 */
function setupSmoothNavigation() {
  var nav = document.querySelector('nav[aria-label="Main navigation"]');
  if (!nav) return;

  var links = nav.querySelectorAll('a[href^="#"]');
  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      var target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      // Optional small offset for visual comfort
      // You can adjust if you add a fixed header later
      setTimeout(function () {
        window.scrollBy(0, -10);
      }, 400);
    });
  });
}

/**
 * Simple accordion behavior for User Guide steps
 * Enhances the "Step-by-Step Path" articles
 */
function setupUserGuideAccordion() {
  var guideSection = document.querySelector(
    '#user-guide section[aria-label="Step by step guide"]'
  );
  if (!guideSection) return;

  var items = guideSection.querySelectorAll("article");
  if (!items.length) return;

  items.forEach(function (item, index) {
    var header = item.querySelector("header");
    var title = header ? header.querySelector("h4") : null;
    var content = null;

    // Assume the first paragraph after the header is the main content
    var paragraphs = item.querySelectorAll("p");
    if (paragraphs.length > 0) {
      content = paragraphs[0];
    }

    if (!header || !title || !content) return;

    // Hide all but the first by default
    var isInitiallyOpen = index === 0;
    item.dataset.open = isInitiallyOpen ? "true" : "false";
    content.style.display = isInitiallyOpen ? "block" : "none";

    // Make header act like a button
    header.setAttribute("role", "button");
    header.setAttribute("tabindex", "0");
    header.setAttribute("aria-expanded", String(isInitiallyOpen));

    header.addEventListener("click", function () {
      toggleAccordionItem(item, content, header);
    });

    header.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleAccordionItem(item, content, header);
      }
    });
  });
}

function toggleAccordionItem(item, content, header) {
  var isOpen = item.dataset.open === "true";
  var newState = !isOpen;

  item.dataset.open = newState ? "true" : "false";
  header.setAttribute("aria-expanded", String(newState));
  content.style.display = newState ? "block" : "none";
}

/**
 * Audio interaction for "Let’s Listen to Long Songs"
 * - Ensures only one audio element plays at a time
 */
function setupAudioInteractions() {
  var listenSection = document.querySelector("#listen-long-songs");
  if (!listenSection) return;

  var audioElements = listenSection.querySelectorAll("audio");
  if (!audioElements.length) return;

  audioElements.forEach(function (audio) {
    audio.addEventListener("play", function () {
      pauseOtherAudio(audioElements, audio);
    });
  });
}

function pauseOtherAudio(allAudios, current) {
  allAudios.forEach(function (audio) {
    if (audio !== current && !audio.paused) {
      audio.pause();
    }
  });
}
