document.addEventListener("DOMContentLoaded", () => {



  // this is for to save the user login data in the local storage
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
    const heroLoginBtn = document.getElementById("hero-login-btn");
    if (heroLoginBtn) {
      heroLoginBtn.style.display = "none";
    }
    const heroEventBtn = document.getElementById("hero-event-btn");
    if (heroEventBtn) {
      heroEventBtn.style.display = "inline";
    }
    loggedin = true;
  } else {

    document.getElementById("event-btn").style.display = "none";
    document.getElementById("user-profile").style.display = "none";
    document.getElementById("event-login-btn").style.display = "block";
    document.getElementById("login-btn").style.display = "block";
    const heroLoginBtn = document.getElementById("hero-login-btn");
    if (heroLoginBtn) {
      heroLoginBtn.style.display = "inline";
    }
    const heroEventBtn = document.getElementById("hero-event-btn");
    if (heroEventBtn) {
      heroEventBtn.style.display = "none";
    }
    loggedin = false;
  }


  document.getElementById('show-nav-btn').addEventListener('click', (e) => {

    verticalnavBar = document.getElementById("vertical-navbar");
    e.preventDefault();

  });




  
  const navbarBtn = document.getElementById("show-nav-btn");
  const navbarContainer = document.getElementById("navbar-container");
    function showNavbar() {
      console.log("Showing nav bar");
      navbarContainer.style.display = "flex";
      navbarContainer.style.zIndex = "2000";
      document.body.classList.add("no-scroll");
    }
    navbarBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showNavbar();
    });
  








  //this is so that when the contact button is pressed the contact form will open
  const contactBtn = document.getElementById("contact-btn");
  const contactFooterBtn = document.getElementById("contact-footer-btn");
  const contactContainer = document.getElementById("contact-container");
  const closeContactBtn = document.getElementById("close-contact-btn");
  function showContactForm() {
    contactContainer.style.display = "flex";
    contactContainer.style.zIndex = "2000";
    document.body.classList.add("no-scroll");
  }
  contactBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showContactForm();
  });
  contactFooterBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showContactForm();
  });
  closeContactBtn.addEventListener("click", () => {
    contactContainer.style.display = "none";
    document.body.classList.remove("no-scroll");
  });

  [contactContainer,navbarContainer].forEach((container) => {
      if (container) {
        container.addEventListener("click", (e) => {
          if (e.target === container) {
            container.style.display = "none";
            document.body.classList.remove("no-scroll");
          }
        });
      }
    });


  //this is so that the user can contact the admin even without the login
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
    //empty email
    if (email.value.trim() === '') {
      emailEmpty.style.display = 'block';
      contact_valid = false;
    } else {
      emailEmpty.style.display = 'none';
      email.style.border = '';
    }

    //empty name
    if (name.value.trim() === '') {
      nameEmpty.style.display = 'block';
      contact_valid = false;
    }
    else {
      nameEmpty.style.display = 'none';
      name.style.border = '';
    }

    //empty message
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
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
        });
    }
  });




  //to remove error when focus on the text area
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


    //to show login form
    function showLoginForm() {
      loginContainer.style.display = "flex";
      signupContainer.style.display = "none";
      otpContainer.style.display = "none";
      registerContainer.style.display = "none";
      contactContainer.style.display = "none";
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



    // to link to sigmup/login/register form
    signupLink.addEventListener("click", (e) => {
      e.preventDefault();
      signupContainer.style.display = "flex";
      loginContainer.style.display = "none";
      otpContainer.style.display = 'none';
      registerContainer.style.display = "none";
      contactContainer.style.display = "none";
      signupContainer.style.zIndex = "2000";
      document.body.classList.add("no-scroll");
    });
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginContainer.style.display = "flex";
      signupContainer.style.display = "none";
      otpContainer.style.display = "none";
      registerContainer.style.display = "none";
      contactContainer.style.display = "none";
      loginContainer.style.zIndex = "2000";
      document.body.classList.add("no-scroll");
    });
    otploginLink.addEventListener("click", (e) => {
      e.preventDefault();
      signupContainer.style.display = "flex";
      loginContainer.style.display = "none";
      otpContainer.style.display = 'none';
      registerContainer.style.display = "none";
      contactContainer.style.display = "none";
      signupContainer.style.zIndex = "2000";
      document.body.classList.add("no-scroll");
    });
    registerloginLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginContainer.style.display = "flex";
      signupContainer.style.display = "none";
      otpContainer.style.display = "none";
      registerContainer.style.display = "none";
      contactContainer.style.display = "none";
      loginContainer.style.zIndex = "2000";
      document.body.classList.add("no-scroll");
    });





    //to close every pages
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


    //to toggle between the show password and hide password needed to be add in the future
    document.querySelectorAll(".toggle-password").forEach((toggleBtn) => {
      toggleBtn.addEventListener("click", () => {
        const passwordInput = toggleBtn.previousElementSibling;
        const type = passwordInput.type === "password" ? "text" : "password";
        passwordInput.type = type;
        toggleBtn.textContent = type === "password" ? "👁️" : "🙈";
      });
    });


    //to handle login/signup/otp from after submitting
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
              console.log(generatedOTP);
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




    // to toggle between the name of organization and name of user
    const organizerRadio = document.getElementById('organizer');
    const attenderRadio = document.getElementById('attender');
    let orgname_req = true;
    let username_req = false;
    function toggleFields() {
      const organizernameField = document.getElementById('organizername');
      const usernameField = document.getElementById('username');
      const emptyusername = document.getElementById('empty-username');
      const emptyorgname = document.getElementById('empty-nameoforg');

      if (organizerRadio.checked) {
        organizernameField.style.display = 'block';
        orgname_req = true;
        usernameField.style.display = 'none';
        emptyorgname.style.display = 'none';
        emptyusername.style.display = 'none';
        username_req = false;
        usernameField.value = '';
      } else if (attenderRadio.checked) {
        usernameField.style.display = 'block';
        username_req = true;
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




    //to handle register form
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
            console.log("Account Creation sucessful")
            window.location.reload();
          })
          .catch(error => {
            console.error('Error:', error);
          });

      }
    });




    //to remove the error when focusing on the area
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



  //this is csrftoken which is used to send data to the back end
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