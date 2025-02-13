document.addEventListener("DOMContentLoaded", () => {



  // logout code
  document.getElementById('logout-btn').addEventListener('click', function (event) {
    event.preventDefault();
    if (confirm("Are you sure you want to log out?")) {
      fetch('/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(), // Ensure CSRF token is correctly fetched
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            window.location.href = '/';
          } else {
            alert('Logout failed: ' + data.error);
          }
        })
        .catch(error => {
          console.error('Error logging out:', error);
          alert('An error occurred while logging out.');
        });
    }
  });


































  document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('contact-name');
    const email = document.getElementById('email-contact');
    const message = document.getElementById('message-contact');
    const nameEmpty = document.getElementById('empty-name-contact');
    const emailEmpty = document.getElementById('empty-email-contact');
    const emptyMessage = document.getElementById('empty-message-contact');
    const shortMessage = document.getElementById('message-length');
    let contact_valid = true;
    if (email.value.trim() === '') {
      emailEmpty.style.display = 'block';
      contact_valid = false;
    } else {
      emailEmpty.style.display = 'none';
      email.style.border = '';
    }
    if (name.value.trim() === '') {
      nameEmpty.style.display = 'block';
      contact_valid = false;
    } else {
      nameEmpty.style.display = 'none';
      name.style.border = '';
    }
    if (message.value.trim() === '') {
      emptyMessage.style.display = 'block';
      contact_valid = false;
    } else {
      emptyMessage.style.display = 'none';
      message.style.border = '';
      if (message.value.length < 10 || message.value.length > 100) {
        shortMessage.style.display = 'block';
        contact_valid = false;
      }
      else {
        shortMessage.style.display = 'none';
      }
    }
    if (contact_valid) {
      fetch('/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({
          email: email.value,
          name: name.value,
          message: message.value,
        }),
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to send contact data');
          }
        })
        .then(data => {
          console.log("Contact successful");
          window.location.reload();
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
        });
    }
  });
  document.getElementById('email-contact').addEventListener('focus', function () {
    const emailEmpty = document.getElementById('empty-email-contact');
    if (emailEmpty.style.display === 'block') {
      emailEmpty.style.display = 'none';
    }
  });
  document.getElementById('contact-name').addEventListener('focus', function () {
    const nameEmpty = document.getElementById('empty-name-contact');
    if (nameEmpty.style.display === 'block') {
      nameEmpty.style.display = 'none';
    }
  });
  document.getElementById('message-contact').addEventListener('focus', function () {
    const messageEmpty = document.getElementById('empty-message-contact');
    const messageShort = document.getElementById('message-length');
    if (messageEmpty.style.display === 'block') {
      messageEmpty.style.display = 'none';
    }
    if (messageShort.style.display === 'block') {
      messageShort.style.display = 'none';
    }
  });







  let generatedOTP;
  let user_email, user_password;
  const loginContainer = document.getElementById("login-container");
  const signupContainer = document.getElementById("signup-container");
  const otpContainer = document.getElementById("otp-container");
  const registerContainer = document.getElementById("register-container");








  document.querySelectorAll(".toggle-password").forEach((toggleBtn) => {
    toggleBtn.addEventListener("click", () => {
      const passwordInput = toggleBtn.previousElementSibling;
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      toggleBtn.textContent = type === "password" ? "👁️" : "🙈";
    });
  });












  const toggleError = (element, condition) => {
    element.style.display = condition ? "block" : "none";
  };


  const validateInput = (input, errorElement, minLength = 0, maxLength = Infinity) => {
    const value = input.value.trim();
    const isValid = value !== "" && value.length >= minLength && value.length <= maxLength;
    toggleError(errorElement, !isValid);
    return isValid;
  };








  const loginForm = document.getElementById("form-login");
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email-login");
    const password = document.getElementById("password-login");

    const emailValid = validateInput(email, document.getElementById("empty-email"));
    const passwordValid = validateInput(password, document.getElementById("empty-password"), 8, 15);

    if (emailValid && passwordValid) {
      fetch("/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({ email: email.value, password: password.value }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Login Response Data:", data); // Debugging Line

          if (typeof data.email_exists === "undefined") {
            console.error("emailexists is missing in the response!");
          }

          if (!data.email_exists) {
            console.log("Email does not exist:", data.email_exists);
            email.value = "";
            toggleError(document.getElementById("no-email-login"), true);
          } else {
            if (!data.correct_pass) {
              toggleError(document.getElementById("incorrect_password"), true);
            } else {
              window.location.href = '/';
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error);

        });
    }
  });




















  const signupForm = document.getElementById("form-signup");
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email-signup");
    const password = document.getElementById("password-signup");
    const confirmPassword = document.getElementById("confirm-password");
    const emailValid = validateInput(email, document.getElementById("empty-email-signup"));
    const passwordValid = validateInput(
      password,
      document.getElementById("empty-password-signup"),
      8,
      15
    );
    const passwordsMatch = password.value === confirmPassword.value;
    toggleError(
      document.getElementById("password-not-same-signup"),
      !passwordsMatch
    );
    if (emailValid && passwordValid && passwordsMatch) {
      fetch("/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({ email: email.value, password: password.value }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.email_exists) {
            toggleError(document.getElementById("exists-email-signup"), true);
          } else {
            document.getElementById("email-register").value = data.email_signup;
            user_email = data.email_signup;
            user_password = data.password_signup;
            sendOtp(user_email);
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  });
  document.getElementById("resend-otp-link").addEventListener("click", function (event) {
    event.preventDefault();
    sendOtp(user_email); 
  });
  

  function sendOtp(email) {
    fetch("/send-otp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(),
      },
      body: JSON.stringify({ email: email })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          generatedOTP = data.otp;
          console.log("OTP:", generatedOTP);
          signupContainer.style.display = "none";
          loginContainer.style.display = "none";
          otpContainer.style.display = "flex";
          otpContainer.style.zIndex = "2000";
          document.body.classList.add("no-scroll");
        } else {
          console.error("OTP sending failed.");
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  const otpForm = document.getElementById("form-otp");
  otpForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const otp = document.getElementById("otp");
    const otpValid = validateInput(otp, document.getElementById("empty-otp")) &&
      generatedOTP == otp.value;
    toggleError(document.getElementById("not-match-otp"), generatedOTP != otp.value);
    if (otpValid) {
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
    const orgnameLabel = document.getElementById('orgname-label');
    const usernameLabel = document.getElementById('username-label');
    const organizernameField = document.getElementById('organizername');
    const usernameField = document.getElementById('username');
    const emptyusername = document.getElementById('empty-username');
    const emptyorgname = document.getElementById('empty-nameoforg');
    if (organizerRadio.checked) {
      organizernameField.style.display = 'block';
      orgname_req = true;
      orgnameLabel.style.display = 'block';
      usernameLabel.style.display = 'none';
      usernameField.style.display = 'none';
      emptyorgname.style.display = 'none';
      emptyusername.style.display = 'none';
      username_req = false;
      usernameField.value = '';
    } else if (attenderRadio.checked) {
      usernameField.style.display = 'block';
      username_req = true;
      orgnameLabel.style.display = 'none';
      usernameLabel.style.display = 'block';
      organizernameField.style.display = 'none';
      emptyorgname.style.display = 'none';
      emptyusername.style.display = 'none';
      orgname_req = false;
      organizernameField.value = '';
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
    const attendee = document.getElementById('attender');

    const usernameError = document.getElementById('empty-username');
    const organizernameError = document.getElementById('empty-nameoforg');



    let isValid = true;


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
      const selectedRole = organizer.checked ? 'organizer' : 'attendee';
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
          console.log("Account Creation sucessful")
          window.location.reload();
        })
        .catch(error => {
          console.error('Error:', error);
        });

    }
  });
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

  function getCSRFToken() {
    const name = 'csrftoken';
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === name) return value;
    }
    return '';
  }
});