document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const heroLoginBtn = document.getElementById("hero-login-btn");
  const eventLoginBtn = document.getElementById("event-login-btn");



  let generatedOTP;

  const loginContainer = document.getElementById("login-container");
  const signupContainer = document.getElementById("signup-container");
  const otpContainer = document.getElementById("otp-container");
  const registerContainer = document.getElementById("register-container");



  const closeSignupBtn = document.getElementById("close-signup-btn");
  const closeOTPBtn = document.getElementById("close-otp-btn");
  const closeLoginBtn = document.getElementById("close-login-btn");
  const closeRegisterBtn = document.getElementById("close-register-btn");



  const backToSignup = document.getElementById("back-to-signup");
  const signupLink = document.getElementById("signup-link");
  const loginLink = document.getElementById("login-link");

  function showLoginForm() {
    loginContainer.style.display = "flex";
    signupContainer.style.display = "none";
    otpContainer.style.display = "none";
    registerContainer.style.display = "none";
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
    registerContainer.style.display = "none";
    signupContainer.style.zIndex = "2000";
    document.body.classList.add("no-scroll");
  });
  loginLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginContainer.style.display = "flex";
    signupContainer.style.display = "none";
    otpContainer.style.display = "none";
    registerContainer.style.display = "none";
    loginContainer.style.zIndex = "2000";
    document.body.classList.add("no-scroll");
  });
  backToSignup.addEventListener("click", (e) => {
    e.preventDefault();
    loginContainer.style.display = "none";
    signupContainer.style.display = "flex";
    otpContainer.style.display = "none";
    registerContainer.style.display = "none";
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
  closeRegisterBtn.addEventListener("click", () => {
    registerContainer.style.display = "none";
    document.body.classList.remove("no-scroll");
  });
  //to make sure when there is click outside the form form will close
  // [loginContainer, signupContainer, otpContainer, registerContainer].forEach((container) => {
  //   if (container) {
  //     container.addEventListener("click", (e) => {
  //       if (e.target === container) {
  //         container.style.display = "none";
  //         document.body.classList.remove("no-scroll");
  //       }
  //     });
  //   }
  // });



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
    let login_valid = true;

    // Check if email is empty
    if (email.value.trim() === '') {
      emailEmpty.style.display = 'block';
      login_valid = false;
    } else {
      emailEmpty.style.display = 'none';
      email.style.border = '';
    }

    // Check if password is empty
    if (password.value.trim() === '') {
      passwordEmpty.style.display = 'block';
      login_valid = false;
    }
    else {
      passwordEmpty.style.display = 'none';
      password.style.border = '';

      if (password.value.length < 8 || password.value.length > 15) {
        passwordShort.style.display = 'block';
        login_valid = false;
      }
      else {
        passwordShort.style.display = 'none';
      }
    }
    if (login_valid) {
      fetch('/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value
        }),
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to send login data');
          }
        })
        .then(data => {
          if (data.message) {
            alert(data.message); // Show success message from backend
          } else {
            alert("Unexpected response from server.");
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
        });
    }
  });








  // signup data to backend
  document.getElementById('form-signup').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email-signup');
    const password = document.getElementById('password-signup');
    const confirmPassword = document.getElementById('confirm-password');
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
      fetch('/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value
        }),
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to send signup data');
          }
        })
        .then(data => {
          document.getElementById('email-register').value = data.email_signup;
          generatedOTP = data.otp;
          user_email=data.email;
          user_password=data.password_signup;
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
        });
      signupContainer.style.display = "none";
      loginContainer.style.display = "none";
      otpContainer.style.display = "flex";
      registerContainer.style.display = "none";
      otpContainer.style.zIndex = "2000";
      document.body.classList.add("no-scroll");
    }
  });
  // otp data to backend
  document.getElementById('form-otp').addEventListener('submit', function (event) {
    event.preventDefault();
    const otp = document.getElementById('otp');
    const emptyOTP = document.getElementById('empty-otp');
    const notmatchOTP = document.getElementById('not-match-otp');
    let otp_valid = true;
    if (otp.value.trim() === '') {
      emptyOTP.style.display = "block";
      otp_valid = false;
    }
    else if (generatedOTP != otp.value) {
      notmatchOTP.style.display = "block";
      otp_valid = false;
    }
    if (otp_valid) {
      console.log("OTP:", otp.value);
      signupContainer.style.display = "none";
      loginContainer.style.display = "none";
      otpContainer.style.display = "none";
      registerContainer.style.display = "flex";
      registerContainer.style.zIndex = "2000";
      document.body.classList.add("no-scroll");
    }

  });

  document.getElementById('register-form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form elements
    const profileImage = document.getElementById('profile-image');
    const username = document.getElementById('username');
    const organizer = document.getElementById('organizer');
    const attender = document.getElementById('attender');

    const usernameError = document.getElementById('empty-username');

    let isValid = true;

    // Check if username is provided
    if (username.value.trim() === '') {
      usernameError.style.display = 'block';
      isValid = false;
    } else {
      usernameError.style.display = 'none';
    }


    if (isValid) {
      const selectedRole = organizer.checked ? 'organizer' : 'attender';
      console.log("Email:",user_email);
      console.log("Password:",user_password);
      console.log("Username:", username.value);
      console.log("Selected Role:", selectedRole);
      fetch('/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({
          email:user_email,
          password:user_password,
          username: username.value,
          role: selectedRole,
        }),
      })
        .then(response => {
          
        })
        .then(data => {
          console.log('Registration successful:');
          })
        .catch(error => {
          console.error('Error:', error);
         
        });

    }
  });











  function getCSRFToken() {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return cookieValue;
  }










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
    if (passwordEmpty.style.display === 'block') {
      passwordEmpty.style.display = 'none';
    }
    if (shortPassword.style.display === 'block') {
      shortPassword.style.display = 'none';
    }
    if (passwordCompare.style.display === 'block') {
      passwordCompare.style.display = 'none';
    }
  });
  document.getElementById('confirm-password').addEventListener('focus', function () {
    const confirmpasswordCompare = document.getElementById('confirmpassword-not-same-signup');
    if (confirmpasswordCompare.display === 'block') {
      confirmpasswordCompare.style.display = 'none';
    }
  });
  document.getElementById('otp').addEventListener('focus', function () {
    const emptyOTP = document.getElementById('empty-otp');
    const notmatchOTP = document.getElementById('not-match-otp');

    // Check and hide the elements if they are visible
    if (notmatchOTP.style.display === 'block') {
      notmatchOTP.style.display = 'none';
    }
    if (emptyOTP.style.display === 'block') {
      emptyOTP.style.display = 'none';
    }
  });

});







