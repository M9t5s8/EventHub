document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const heroLoginBtn = document.getElementById("hero-login-btn");
  const eventLoginBtn = document.getElementById("event-login-btn");
  const closeLoginBtn = document.getElementById("close-login-btn");
  const loginContainer = document.getElementById("login-container");
  const SignUpOTP = document.getElementById("next-signup-page");
  const signupContainer = document.getElementById("signup-container");
  const closeSignupBtn = document.getElementById("close-signup-btn");
  const closeOTPBtn = document.getElementById("close-otp-btn");
  const otpContainer = document.getElementById("otp-container");
  const backToSignup = document.getElementById("back-to-signup");
  const signupLink = document.getElementById("signup-link");
  const loginLink = document.getElementById("login-link");

  function showLoginForm() {
    loginContainer.style.display = "flex";
    signupContainer.style.display = "none";
    otpContainer.style.display = "none";
    loginContainer.style.zIndex = "2000";
    document.body.classList.add("no-scroll");
  }

  //to activate the login page
  if (heroLoginBtn) {
    heroLoginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showLoginForm();
    });
  }
  eventLoginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showLoginForm();
  });
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showLoginForm();
  });








  //this will do the link down the bottom of the page
  signupLink.addEventListener("click", (e) => {
    e.preventDefault();
    signupContainer.style.display = "flex";
    loginContainer.style.display = "none";
    otpContainer.style.display = 'none';
    signupContainer.style.zIndex = "2000";
    document.body.classList.add("no-scroll");
  });
  loginLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginContainer.style.display = "flex";
    signupContainer.style.display = "none";
    otpContainer.style.display = "none";
    loginContainer.style.zIndex = "2000";
    document.body.classList.add("no-scroll");
  });
  backToSignup.addEventListener("click", (e) => {
    e.preventDefault();
    loginContainer.style.display = "none";
    signupContainer.style.display = "flex";
    otpContainer.style.display = "none";
    loginContainer.style.zIndex = "2000";
    document.body.classList.add("no-scroll");
  });




  //to close the pages when clicking cross mark
  closeLoginBtn.addEventListener("click", () => {
    loginContainer.style.display = "none";
    document.body.classList.remove("no-scroll");
  });
  closeSignupBtn.addEventListener("click", () => {
    signupContainer.style.display = "none";
    document.body.classList.remove("no-scroll");
  });
  closeOTPBtn.addEventListener("click", () => {
    otpContainer.style.display = "none";
    document.body.classList.remove("no-scroll");
  });



  //when clicking outside the page wil close the page
  [loginContainer, signupContainer, otpContainer].forEach((container) => {
    container.addEventListener("click", (e) => {
      if (e.target === container) {
        container.style.display = "none";
        document.body.classList.remove("no-scroll");
      }
    });
  });


  document.querySelectorAll(".toggle-password").forEach((toggleBtn) => {
    toggleBtn.addEventListener("click", () => {

      const passwordInput = toggleBtn.previousElementSibling;


      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;


      toggleBtn.textContent = type === "password" ? "👁️" : "🙈";
    });
  });





  document.getElementById('form-login').addEventListener('submit', function (event) {
    event.preventDefault();
    //to get email and password
    const email = document.getElementById('email-login');
    const password = document.getElementById('password-login');

    // Get error message elements
    const emailEmpty = document.getElementById('empty-email');
    const passwordEmpty = document.getElementById('empty-password');
    const passwordShort = document.getElementById('short-password');
    let valid = true;

    // Check if email is empty
    if (email.value.trim() === '') {
      emailEmpty.style.display = 'block';
      valid = false;
    } else {
      emailEmpty.style.display = 'none';
      email.style.border = '';
    }

    // Check if password is empty
    if (password.value.trim() === '') {
      passwordEmpty.style.display = 'block';
      valid = false;
    }
    else {
      passwordEmpty.style.display = 'none';
      password.style.border = '';

      if (password.value.length < 8 || password.value.length > 15) {
        passwordShort.style.display = 'block';
        valid = false;
      }
      else {
        passwordShort.style.display = 'none';
      }
    }


    if (valid) {
      alert('Form Submitted Successfully');
    }
  });









  document.getElementById('form-signup').addEventListener('submit', function (event) {
    event.preventDefault();
    //to get email and password
    const email = document.getElementById('email-signup');
    const password = document.getElementById('password-signup');
    const confirmPassword = document.getElementById('confirm-password');

    // Get error message elements
    const emailEmpty = document.getElementById('empty-email-signup');
    const passwordEmpty = document.getElementById('empty-password-signup');
    const passwordShort = document.getElementById('short-password-signup');
    const passwordCompare = document.getElementById('password-not-same-signup');
    const confirmpasswordCompare = document.getElementById('confirmpassword-not-same-signup');
    let signup_valid = true;
    if (email.value.trim() === '') {
      emailEmpty.style.display = 'block';
      signup_valid = false;
    } else {
      emailEmpty.style.display = 'none';
      email.style.border = '';
    }
    if (password.value.trim() === '') {
      passwordEmpty.style.display = 'block';
      signup_valid = false;
    }
    else {
      passwordEmpty.style.display = 'none';
      password.style.border = '';

      if (password.value.length < 8 || password.value.length > 15) {
        passwordShort.style.display = 'block';
        signup_valid = false;
      }
      else {
        passwordShort.style.display = 'none';
      }
    }
    if (password.value !== confirmPassword.value) {
      confirmpasswordCompare.style.display = 'block';
      signup_valid = false;
    } else {
      passwordCompare.style.display = 'none';
    }


    if (signup_valid) {
      signupContainer.style.display = "none";
      loginContainer.style.display = "none";
      otpContainer.style.display = "flex";
      otpContainer.style.zIndex = "2000";
      document.body.classList.add("no-scroll");
    }
  });








  document.getElementById('email-login').addEventListener('focus', function () {
    const emailEmpty = document.getElementById('empty-email');
    if (emailEmpty.style.display === 'block') {
      emailEmpty.style.display = 'none';
    }
  });
  document.getElementById('password-login').addEventListener('focus', function () {
    const passwordEmpty = document.getElementById('empty-password');
    const shortPassword = document.getElementById('short-password');
    // Hide error messages when focused
    if (passwordEmpty.style.display === 'block') {
      passwordEmpty.style.display = 'none';
    }
    if (shortPassword.style.display === 'block') {
      shortPassword.style.display = 'none';
    }
  });



  document.getElementById('email-signup').addEventListener('focus', function () {
    const emailEmpty = document.getElementById('empty-email-signup');
    if (emailEmpty.style.display === 'block') {
      emailEmpty.style.display = 'none';
    }
  });
  document.getElementById('password-signup').addEventListener('focus', function () {
    const passwordEmpty = document.getElementById('empty-password-signup');
    const shortPassword = document.getElementById('short-password-signup');
    const passwordCompare = document.getElementById('password-not-same-signup');
    // Hide error messages when focused
    if (passwordEmpty.style.display === 'block') 
    {
      passwordEmpty.style.display = 'none';
    }
    if (shortPassword.style.display === 'block') 
    {
      shortPassword.style.display = 'none';
    }
    if(passwordCompare.style.display==='block')
    {
      passwordCompare.style.display='none';
    }
  });
  document.getElementById('confirm-password').addEventListener('focus', function () {
    const confirmpasswordCompare = document.getElementById('confirmpassword-not-same-signup');
    // Hide error messages when focused
    if (confirmpasswordCompare.display === 'block') {
      confirmpasswordCompare.style.display = 'none';
    }
  });


});








