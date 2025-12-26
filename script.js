const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("sideMenu");
const closeBtn = document.getElementById("closeBtn");

// Hamburger нээх
hamburger.addEventListener("click", () => {
  sideMenu.classList.add("show");
});

// X товч дарвал хаагдана
closeBtn.addEventListener("click", () => {
  sideMenu.classList.remove("show");
});

// Гадна дарвал хаагдана
document.addEventListener("click", (e) => {
  if (
    sideMenu.classList.contains("show") &&
    !sideMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    sideMenu.classList.remove("show");
  }
});
