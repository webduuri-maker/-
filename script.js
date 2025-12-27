const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("sideMenu");
const closeBtn = document.getElementById("closeBtn");

// Нээх
hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  sideMenu.classList.add("show");
});

// Хаах (X)
closeBtn.addEventListener("click", () => {
  sideMenu.classList.remove("show");
});

// Menu дотор дарвал хаахгүй (линк ажиллана)
sideMenu.addEventListener("click", (e) => {
  e.stopPropagation();
});

// Гадна дарвал хаагдана
document.addEventListener("click", () => {
  sideMenu.classList.remove("show");
});
