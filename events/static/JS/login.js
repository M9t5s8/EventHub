document.addEventListener("DOMContentLoaded", () => {

  let loggedin = true;
  document.getElementById('user-profile').addEventListener('click', function (event) {
    event.preventDefault();
    localStorage.removeItem('isLoggedIn');
    window.location.reload();
  });
  if (localStorage.getItem('isLoggedIn') === 'true') {
    document.getElementById("event-btn").style.display = "block";
    document.getElementById("user-profile").style.display = "block";
    document.getElementById("event-login-btn").style.display = "none";
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("hero-event-btn").style.display = "inline";
    document.getElementById("hero-login-btn").style.display = "none";
    loggedin = true;
  } else {
    document.getElementById("event-btn").style.display = "none";
    document.getElementById("user-profile").style.display = "none";
    document.getElementById("event-login-btn").style.display = "block";
    document.getElementById("login-btn").style.display = "block";
    document.getElementById("hero-event-btn").style.display = "none";
    document.getElementById("hero-login-btn").style.display = "inline";
    loggedin = false;
  }










//this is for the navigation bar when user doesnot login
  if (!loggedin) {
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

    const signupLink = document.getElementById("signup-link");
    const loginLink = document.getElementById("login-link");
    const otploginLink = document.getElementById("otp-to-signup");
    const registerloginLink = document.getElementById("register-to-login");

    function showLoginForm() {
      loginContainer.style.display = "flex";
      signupContainer.style.display = "none";
      otpContainer.style.display = "none";
      registerContainer.style.display = "none";
      loginContainer.style.zIndex = "2000";
      document.body.classList.add("no-scroll");
    }
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
    otploginLink.addEventListener("click", (e) => {
      e.preventDefault();
      signupContainer.style.display = "flex";
      loginContainer.style.display = "none";
      otpContainer.style.display = 'none';
      registerContainer.style.display = "none";
      signupContainer.style.zIndex = "2000";
      document.body.classList.add("no-scroll");
    });
    registerloginLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginContainer.style.display = "flex";
      signupContainer.style.display = "none";
      otpContainer.style.display = "none";
      registerContainer.style.display = "none";
      loginContainer.style.zIndex = "2000";
      document.body.classList.add("no-scroll");
    });

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
    [loginContainer, signupContainer, otpContainer, registerContainer].forEach((container) => {
      if (container) {
        container.addEventListener("click", (e) => {
          if (e.target === container) {
            container.style.display = "none";
            document.body.classList.remove("no-scroll");
          }
        });
      }
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
      const email = document.getElementById('email-login');
      const password = document.getElementById('password-login');
      const emailEmpty = document.getElementById('empty-email');
      const passwordEmpty = document.getElementById('empty-password');
      const passwordShort = document.getElementById('short-password');
      const noemailexistslogin = document.getElementById('no-email_exists_login');
      const incorrectpassword = document.getElementById('incorrect_password');
      let login_valid = true;
      if (email.value.trim() === '') {
        emailEmpty.style.display = 'block';
        login_valid = false;
      } else {
        emailEmpty.style.display = 'none';
        email.style.border = '';
      }
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
            if (data.email_not_exists) {
              console.log("Email not found");
              noemailexistslogin.style.display = 'block';
              email.value = '';
            } else {
              if (data.correct_pass) {
                localStorage.setItem('isLoggedIn', 'true');
                console.log("Login sucessful")
                window.location.reload();
              }
              else {
                console.log("Password Incorrect");
                incorrectpassword.style.display = 'block';
                password.value = '';
              }
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
          });
      }
    });

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
      const emailexixtsError = document.getElementById('exists-email-signup');
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
            if (data.check_for_email) {
              console.log("Email exists");
              emailexixtsError.style.display = 'block';
              email.value = '';
            } else {
              console.log("Email doesnot exists");
              document.getElementById('email-register').value = data.email_signup;
              generatedOTP = data.otp;
              user_email = data.email;
              user_password = data.password_signup;

              signupContainer.style.display = "none";
              loginContainer.style.display = "none";
              otpContainer.style.display = "flex";
              registerContainer.style.display = "none";
              otpContainer.style.zIndex = "2000";
              document.body.classList.add("no-scroll");
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
          });
      }
    });

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

    const organizerRadio = document.getElementById('organizer');
    const attenderRadio = document.getElementById('attender');
    let orgname_req = true;
    let username_req = false;
    function toggleFields() {
      const organizerNameField = document.getElementById('organizername');
      const usernameField = document.getElementById('username');
      const emptyusername = document.getElementById('empty-username');
      const emptyorgname = document.getElementById('empty-nameoforg');

      if (organizerRadio.checked) {
        organizerNameField.style.display = 'block';
        orgname_req = true;
        usernameField.style.display = 'none';
        emptyorgname.style.display = 'none';
        emptyusername.style.display = 'none';
        username_req = false;
        usernameField.value = '';
      } else if (attenderRadio.checked) {
        usernameField.style.display = 'block';
        username_req = true;
        organizerNameField.style.display = 'none';
        emptyorgname.style.display = 'none';
        emptyusername.style.display = 'none';
        orgname_req = false;
        organizerNameField.value = '';
      }
    }
    organizerRadio.addEventListener('change', toggleFields);
    attenderRadio.addEventListener('change', toggleFields);
    toggleFields();
    document.getElementById('register-form').addEventListener('submit', function (event) {
      event.preventDefault();
      const username = document.getElementById('username');
      const organizername = document.getElementById('organizername');
      const organizer = document.getElementById('organizer');
      const attender = document.getElementById('attender');

      const usernameError = document.getElementById('empty-username');
      const organizernameError = document.getElementById('empty-nameoforg');



      let isValid = true;

      // Check if username is provided
      if (username.value.trim() === '' && username_req) {
        usernameError.style.display = 'block';
        isValid = false;
      } else {
        usernameError.style.display = 'none';
      }
      if (organizername.value.trim() === '' && orgname_req) {
        organizernameError.style.display = 'block';
        isValid = false;
      } else {
        organizernameError.style.display = 'none';
      }


      if (isValid) {
        const selectedRole = organizer.checked ? 'organizer' : 'attender';
        console.log("Email:", user_email);
        console.log("Password:", user_password);
        console.log("Username:", username.value);
        console.log("Organizer name:", organizername.value);
        console.log("Selected Role:", selectedRole);
        fetch('/register/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
          },
          body: JSON.stringify({
            email: user_email,
            password: user_password,
            username: username.value,
            organizername: organizername.value,
            role: selectedRole,
          }),
        })
          .then(response => {

          })
          .then(data => {
            localStorage.setItem('isLoggedIn', 'true');
            console.log("Accoutn Creation sucessful")
            window.location.reload();
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

      if (!cookieValue) {
        console.error('CSRF token not found in cookies');
      }

      return cookieValue;
    }

    document.getElementById('email-login').addEventListener('focus', function () {
      const emailEmpty = document.getElementById('empty-email');
      const noemailexistslogin = document.getElementById('no-email_exists_login');

      if (emailEmpty.style.display === 'block') {
        emailEmpty.style.display = 'none';
      }
      if (noemailexistslogin.style.display === 'block') {
        noemailexistslogin.style.display = 'none';
      }
    });
    document.getElementById('password-login').addEventListener('focus', function () {
      const passwordEmpty = document.getElementById('empty-password');
      const shortPassword = document.getElementById('short-password');
      const incorrectpassword = document.getElementById('incorrect_password');
      // Hide error messages when focused
      if (passwordEmpty.style.display === 'block') {
        passwordEmpty.style.display = 'none';
      }
      if (shortPassword.style.display === 'block') {
        shortPassword.style.display = 'none';
      }
      if (incorrectpassword.style.display === 'block') {
        incorrectpassword.style.display = 'none';
      }
    });
    document.getElementById('email-signup').addEventListener('focus', function () {
      const emailEmpty = document.getElementById('empty-email-signup');
      const emailexixtsError = document.getElementById('exists-email-signup');
      if (emailEmpty.style.display === 'block') {
        emailEmpty.style.display = 'none';
      }
      if (emailexixtsError.style.display === 'block') {
        emailexixtsError.style.display = 'none';
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
    document.getElementById('username').addEventListener('focus', function () {
      const emptyusername = document.getElementById('empty-username');
      const emptyorgname = document.getElementById('empty-nameoforg');
      emptyusername.style.display = 'none';
      emptyorgname.style.display = 'none';
    });
    document.getElementById('organizername').addEventListener('focus', function () {
      const emptyusername = document.getElementById('empty-username');
      const emptyorgname = document.getElementById('empty-nameoforg');
      emptyusername.style.display = 'none';
      emptyorgname.style.display = 'none';
    });
  }
});