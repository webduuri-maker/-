const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("sideMenu");
const closeBtn = document.getElementById("closeBtn");

hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  sideMenu.classList.add("show");
});

closeBtn.addEventListener("click", () => {
  sideMenu.classList.remove("show");
});

sideMenu.addEventListener("click", (e) => {
  e.stopPropagation();
});

document.addEventListener("click", () => {
  sideMenu.classList.remove("show");
});
