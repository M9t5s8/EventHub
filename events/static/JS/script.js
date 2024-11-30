document.addEventListener("DOMContentLoaded", () => {
  const herologinBtn = document.getElementById("hero-login-btn");
  // Function to show the login form and adjust navbar z-index
  function showLoginForm() {
    loginContainer.style.display = "flex";
    signupContainer.style.display = "none"; // Hide signup form
    navbar.style.zIndex = "0"; // Lower the z-index of the navbar
    document.body.classList.add("no-scroll"); // Disable scrolling
  }

  // this is for to control the login button of the hero section
  herologinBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showLoginForm();
  });
});
