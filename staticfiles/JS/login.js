document.addEventListener("DOMContentLoaded", () => {

  // logout function
  document.getElementById('logout-btn').addEventListener('click', function (event) {
    event.preventDefault();
    if (confirm("Are you sure you want to log out?")) {
      fetch('/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
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



  const contactContainer = document.getElementById("contact-container");
  document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('contact-name');
    const email = document.getElementById('email-contact');
    const message = document.getElementById('message-contact');
    let contact_valid = true;
    if (email.value.trim() === '') {
      showError("email-contact-error","Empty Email!");
      contact_valid = false;
    }
    if (name.value.trim() === '') {
      showError("name-contact-error","Empty Name!");
      contact_valid = false;
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
          contactContainer.style.display = "none";
          document.body.classList.remove("no-scroll");
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
        });
    }
  });


  let generatedOTP;
  let user_email, user_password;
  const signupContainer = document.getElementById("signup-container");
  const otpContainer = document.getElementById("otp-container");
  const registerContainer = document.getElementById("register-container");
  const loadingContainer = document.getElementById("loading-container");


  //login form
  const loginForm = document.getElementById("form-login");
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email-login");
    const password = document.getElementById("password-login");
    
    let loginValid = true;
    if (!validateInput(email, "email-login-error", 5, 100, { empty: "Email is required!" })) {
      loginValid = false;
    }

    if (!validateInput(password, "password-login-error", 6, 20, { empty: "Password is required!" })) {
      loginValid = false;
    }
    loadingContainer.style.display = "flex";
    if (loginValid) {
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
          loadingContainer.style.display = "none";
          if (!data.email_exists) {
            showError("email-login-error", "Email does not exists!");
            email.value = "";
          } else {
            if (!data.correct_pass) {
              password.value = "";
              showError("password-login-error", "Incorrect Password");
            } else {
              window.location.href = '/';
            }
          }
        })
        .catch((error) => {
          loadingContainer.style.display = "none";
          console.error("Error:", error);

        });
    }
  });

  //signup form
  const signupForm = document.getElementById("form-signup");
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email-signup");
    const password = document.getElementById("password-signup");
    const confirmpassword = document.getElementById("confirm-password");
    let signupValid = true;

    
    if (!validateInput(email, "email-signup-error", 5, 100, { empty: "Email is required!" })) {
      signupValid = false;
    }

    
    if (!validateInput(password, "password-signup-error", 8, 15, { empty: "Password is required!" })) {
      signupValid = false;
    }

    
    if (!validateInput(confirmpassword, "confirm-password-signup-error", 8, 15, { empty: "Confirm password is required!" })) {
      signupValid = false;
    }

    
    if (password.value.trim() !== confirmpassword.value.trim()) {
      confirmpassword.value = "";
      showError("confirm-password-signup-error", "Password does not match!");
      signupValid = false;
    }

    loadingContainer.style.display = "flex";
    if (signupValid) {
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
          loadingContainer.style.display = "none";
          if (data.email_exists) {
            email.value = '';
            showError("email-signup-error", "Email already exists!");
          } else {
            document.getElementById("email-register").value = data.email_signup;
            user_email = data.email_signup;
            user_password = data.password_signup;
            signupContainer.style.display = "none";
            sendOtp(user_email);
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  });

  //resend otp 
  document.getElementById("resend-otp-link").addEventListener("click", function (event) {
    event.preventDefault();
    otpContainer.style.display = "none";
    sendOtp(user_email);
  });

  //otp successfull
  function sendOtp(email) {
    loadingContainer.style.display = "flex"
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
        loadingContainer.style.display = "none";
        if (data.success) {
          generatedOTP = data.otp;
          loadingContainer.style.display = "none";
          otpContainer.style.display = "flex";
          document.body.classList.add("no-scroll");
        } else {
          console.error("OTP sending failed.");
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  //otp form
  const otpForm = document.getElementById("form-otp");
  otpForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const otp = document.getElementById("otp");
    let otpValid = true;
    if (otp.value.trim() === '') {
      showError("signup-otp-error", "OTP is required!")
      otpValid = false;
    }
    if (otp.value != generatedOTP) {
      showError("signup-otp-error", "OTP doesnot match!")
      otpValid = false;
    }
    if (otpValid) {
      otpContainer.style.display = "none";
      registerContainer.style.display = "flex";
      registerContainer.style.zIndex = "2000";
      document.body.classList.add("no-scroll");
    }
  });

  //register form
  const registerForm = document.getElementById('register-form');
  registerForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username');
    const organizer = document.getElementById('organizer');
    const attendee = document.getElementById('attender');


    let registerValid = true;
    if (!validateInput(username, "username-register-error", 5, 20, { empty: "Username is required!" })) {
      registerValid = false;
    }
    loadingContainer.style.display = "flex"
    if (registerValid) {
      const selectedRole = organizer.checked ? 'organizer' : 'attendee';
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
          role: selectedRole,
        }),
      })
        .then((response) => response.json())
        .then(data => {
          loadingContainer.style.display = "none";
          if(data.success){
            window.location.href = '/';
          }else{
            if(data.username_taken){
              showError("username-register-error","Username already taken!");
            }
          }
          
        })
        .catch(error => {
          console.error('Error:', error);
        });

    }
  });


  // For Login Form
  hideErrorOnFocus("email-login", "email-login-error");
  hideErrorOnFocus("password-login", "password-login-error");

  // For Signup Form
  hideErrorOnFocus("email-signup", "email-signup-error");
  hideErrorOnFocus("password-signup", "password-signup-error");
  hideErrorOnFocus("confirm-password", "confirm-password-signup-error");

  // For OTP Form
  hideErrorOnFocus("otp", "signup-otp-error");

  // For Register Form
  hideErrorOnFocus("username", "username-register-error");
  hideErrorOnFocus("organizername", "orgname-register-error");


  function validateInput(input, errorElementId, minLength = 0, maxLength = Infinity, messages = {}) {
    const value = input.value.trim();
    let message = "";
    let valid = true
    if (value === "") {
      message = messages.empty || "This field is required!";
      valid = false;
    } else if (value.length < minLength) {
      message = messages.minLength || `Minimum ${minLength} characters required!`;
      valid = false;
    } else if (value.length > maxLength) {
      message = messages.maxLength || `Maximum ${maxLength} characters allowed!`;
      valid = false;
    }

    showError(errorElementId, message);

    return valid;
  }

  function showError(inputId, message) {
    const errorSpan = document.getElementById(inputId);
    if (message) {
      errorSpan.textContent = message;
      errorSpan.style.visibility = "visible";
    } else {
      errorSpan.style.visibility = "hidden";
    }
  }
  function hideErrorOnFocus(inputId, errorId) {
    const inputElement = document.getElementById(inputId);
    const errorElement = document.getElementById(errorId);

    if (!inputElement || !errorElement) {
      return;
    }
    inputElement.addEventListener("focus", function () {
      if (errorElement.style.visibility === "visible") {
        errorElement.style.visibility = "hidden";
      }
    });
  }


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