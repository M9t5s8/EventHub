document.addEventListener("DOMContentLoaded", () => {
  const herologinBtn = document.getElementById("hero-login-btn");
  const navbar = document.querySelector(".navbar");

  function showLoginForm() {
    loginContainer.style.display = "flex";
    navbar.style.zIndex = "0"; // Lower the z-index of the navbar
    document.body.classList.add("no-scroll"); // Disable scrolling
  }
  herologinBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showLoginForm();
  });
});

