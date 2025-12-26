const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("sideMenu");
const closeBtn = document.getElementById("closeBtn");

// нээх
hamburger.addEventListener("click", () => {
  sideMenu.classList.add("show");
});

// хаах (X)
closeBtn.addEventListener("click", () => {
  sideMenu.classList.remove("show");
});

// гадна дарвал хаагдана
document.addEventListener("click", (e) => {
  if (
    sideMenu.classList.contains("show") &&
    !sideMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    sideMenu.classList.remove("show");
  }
});
