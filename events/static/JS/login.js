document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const closeLoginBtn = document.getElementById("close-login-btn");
  const loginContainer = document.getElementById("login-container");

  const signupContainer = document.getElementById("signup-container");
  const closeSignupBtn = document.getElementById("close-signup-btn");

  const signupLink = document.getElementById("signup-link");
  const loginLink = document.getElementById("login-link");

  const navbar = document.querySelector(".navbar"); // Select the navigation bar

  // Function to show the login form and adjust navbar z-index
  function showLoginForm() {
    loginContainer.style.display = "flex";
    signupContainer.style.display = "none"; // Hide signup form
    navbar.style.zIndex = "0"; // Lower the z-index of the navbar
    document.body.classList.add("no-scroll"); // Disable scrolling
  }

  // Show login form from navbar login button
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showLoginForm();
  });
  // Close login form and reset navbar z-index
  closeLoginBtn.addEventListener("click", () => {
    loginContainer.style.display = "none";
    navbar.style.zIndex = "1"; // Reset the navbar z-index
    document.body.classList.remove("no-scroll"); // Enable scrolling again
  });

  // Show signup form
  signupLink.addEventListener("click", (e) => {
    e.preventDefault();
    signupContainer.style.display = "flex";
    loginContainer.style.display = "none"; // Hide login form
    navbar.style.zIndex = "0"; // Lower the z-index of the navbar
    document.body.classList.add("no-scroll"); // Disable scrolling
  });

  // Close signup form and reset navbar z-index
  closeSignupBtn.addEventListener("click", () => {
    signupContainer.style.display = "none";
    navbar.style.zIndex = "1"; // Reset the navbar z-index
    document.body.classList.remove("no-scroll"); // Enable scrolling again
  });

  // Switch to login form from signup form
  loginLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginContainer.style.display = "flex";
    signupContainer.style.display = "none";
    navbar.style.zIndex = "0"; // Lower the z-index of the navbar
    document.body.classList.add("no-scroll"); // Disable scrolling
  });

  // Close forms when clicking outside
  [loginContainer, signupContainer].forEach((container) => {
    container.addEventListener("click", (e) => {
      if (e.target === container) {
        container.style.display = "none";
        navbar.style.zIndex = "1"; // Reset the navbar z-index
        document.body.classList.remove("no-scroll"); // Enable scrolling again
      }
    });
  });

  // Toggle password visibility for both login and signup forms
  document.querySelectorAll(".toggle-password").forEach((toggleBtn) => {
    toggleBtn.addEventListener("click", () => {
      // Find the closest input of type password within the same form
      const passwordInput = toggleBtn.previousElementSibling;

      // Toggle the type between 'password' and 'text'
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;

      // Optionally, update the button icon or text
      toggleBtn.textContent = type === "password" ? "👁️" : "🙈";
    });
  });
});
