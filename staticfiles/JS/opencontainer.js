
document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.querySelectorAll(".login-container-open");
    const passwordBtn = document.getElementById("change-pass-btn");
    const loginContainer = document.getElementById("login-container");
    const signupContainer = document.getElementById("signup-container");
    const otpContainer = document.getElementById("otp-container");
    const registerContainer = document.getElementById("register-container");
    const rsvpContainer = document.getElementById("rsvp-container");
    const event1Container = document.getElementById("event1-container");
    const filterContainer = document.getElementById("filter-container");
    const passwordContainer = document.getElementById("password-container");
    const ratingContainer = document.getElementById("rating-container");
    const qrContainer=document.getElementById("qr-code-container");
    const paymentContainer=document.getElementById('payment-container');

    const loginForm = document.getElementById("form-login");
    const signupForm = document.getElementById("form-signup");
    const otpForm = document.getElementById("form-otp");
    const registerForm = document.getElementById("form-register");
    const passwordForm = document.getElementById("form-password");

    const filterBtn = document.getElementById("filter-btn");
    const filterResetBtn = document.getElementById("reset-filters");
    const filterOpenBtn = document.getElementById("open-filter");
    const rsvpBtn = document.getElementById("rsvp-open-btn");
    const eventBtn = document.getElementById("add-event-btn");
    const ratingBtn = document.getElementById("rating-open-btn");


    const closeSignupBtn = document.getElementById("close-signup-btn");
    const closeOTPBtn = document.getElementById("close-otp-btn");
    const closeLoginBtn = document.getElementById("close-login-btn");
    const closeRegisterBtn = document.getElementById("close-register-btn");
    const closeRsvpBtn = document.getElementById("close-rsvp-btn");
    const closeEventBtn = document.getElementById("close-event-add-btn");
    const closeFilterBtn = document.getElementById("close-filter-btn");
    const closePasswordBtn = document.getElementById("close-password-btn");
    const closeRatingBtn = document.getElementById("close-rating-btn");
    const closeQRBtn=document.getElementById("close-qr-code-btn");
    const closePaymentBtn=document.getElementById("close-payment-btn");

    const signupLink = document.getElementById("signup-link");
    const loginLink = document.getElementById("login-link");
    const otploginLink = document.getElementById("otp-to-signup");
    const registerloginLink = document.getElementById("register-to-login");
    function showContainer(containerToShow) {

        const containers = [
            loginContainer, signupContainer, otpContainer, registerContainer, rsvpContainer, event1Container, filterContainer, passwordContainer, ratingContainer
        ];


        containers.forEach(container => {
            if (container) {
                container.style.display = "none";
            }
        });


        if (containerToShow) {
            containerToShow.style.display = "flex";
            containerToShow.style.zIndex = "2000";
            document.body.classList.add("no-scroll");
        }
    }
    function resetForms() {
        const forms = [
            loginForm, signupForm, otpForm, passwordForm, registerForm
        ];

        forms.forEach(form => {
            if (form) {
                form.reset();
            }
        });
    }


    if (loginBtn) {
        loginBtn.forEach(loginBtn => {
            loginBtn.addEventListener("click", (e) => {
                e.preventDefault();
                resetForms(loginForm);
                showContainer(loginContainer);

            });
        });
    }
    if (rsvpBtn) {
        rsvpBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showContainer(rsvpContainer);
        });
    }
    if (passwordBtn) {
        passwordBtn.addEventListener("click", (e) => {
            e.preventDefault();
            resetForms(passwordForm);
            showContainer(passwordContainer);
        });
    }
    if (eventBtn) {
        eventBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showContainer(event1Container);
        });
    }
    if (signupLink) {
        signupLink.addEventListener("click", (e) => {
            e.preventDefault();
            resetForms(signupForm);
            showContainer(signupContainer);

        });
    }
    if (ratingBtn) {
        ratingBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showContainer(ratingContainer);
        });
    }
    if (loginLink) {
        loginLink.addEventListener("click", (e) => {
            e.preventDefault();
            resetForms(loginForm);
            showContainer(loginContainer);

        });
    }
    if (otploginLink) {
        otploginLink.addEventListener("click", (e) => {
            e.preventDefault();
            resetForms(otpForm);
            showContainer(otpContainer);
        });
    }
    if (registerloginLink) {
        registerloginLink.addEventListener("click", (e) => {
            e.preventDefault();
            resetForms(registerForm);
            showContainer(registerContainer);
        });
    }
    if (filterOpenBtn) {
        filterOpenBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showContainer(filterContainer);
        });
    }




    function closeContainer(container) {
        container.style.display = "none";
        document.body.classList.remove("no-scroll");
    }
    if (closeLoginBtn) closeLoginBtn.addEventListener("click", () => closeContainer(loginContainer));
    if (closeSignupBtn) closeSignupBtn.addEventListener("click", () => closeContainer(signupContainer));
    if (closeOTPBtn) closeOTPBtn.addEventListener("click", () => closeContainer(otpContainer));
    if (closeRegisterBtn) closeRegisterBtn.addEventListener("click", () => closeContainer(registerContainer));
    if (closeRsvpBtn) closeRsvpBtn.addEventListener("click", () => closeContainer(rsvpContainer));
    if (closeEventBtn) closeEventBtn.addEventListener("click", () => closeContainer(event1Container));
    if (closeFilterBtn) closeFilterBtn.addEventListener("click", () => closeContainer(filterContainer));
    if (filterBtn) filterBtn.addEventListener("click", () => closeContainer(filterContainer));
    if (closePasswordBtn) closePasswordBtn.addEventListener("click", () => closeContainer(passwordContainer));
    if (filterResetBtn) filterResetBtn.addEventListener("click", () => closeContainer(filterContainer));
    if (closeRatingBtn) closeRatingBtn.addEventListener("click", () => closeContainer(ratingContainer));
    if (closeQRBtn) closeQRBtn.addEventListener("click",() => closeContainer(qrContainer));
    if (closePaymentBtn) closePaymentBtn.addEventListener("click",() => closeContainer(paymentContainer));
    [loginContainer, signupContainer, otpContainer, registerContainer, rsvpContainer, event1Container, filterContainer, passwordContainer, ratingContainer,qrContainer,paymentContainer].forEach((container) => {
        if (container) {
            container.addEventListener("click", (e) => {
                if (e.target === container) {
                    container.style.display = "none";
                    document.body.classList.remove("no-scroll");
                }
            });
        }
    });



    const togglePasswordFields = [
        { toggle: "togglePasswordLogin", input: "password-login" },
        { toggle: "togglePasswordSignup", input: "password-signup" },
        { toggle: "toggleConfirmPassword", input: "confirm-password" },
        { toggle: "togglePasswordold", input: "old-pass" },
        { toggle: "togglePasswordnew", input: "new-pass" },
        { toggle: "togglePasswordreenter", input: "reenter-pass" },
    ];

    togglePasswordFields.forEach(({ toggle, input }) => {
        const toggleElement = document.getElementById(toggle);
        const inputElement = document.getElementById(input);

        if (toggleElement) {
            toggleElement.addEventListener("click", function () {
                const currentType = inputElement.getAttribute('type');


                if (currentType === "password") {
                    inputElement.setAttribute('type', 'text');
                    toggleElement.classList.remove("fa-eye");
                    toggleElement.classList.add("fa-eye-slash");
                } else {
                    inputElement.setAttribute('type', 'password');
                    toggleElement.classList.remove("fa-eye-slash");
                    toggleElement.classList.add("fa-eye");
                }
            });
        }
    });















    
    const profileContainer = document.getElementById("profile-container");
    const profileBtn = document.getElementById('user-profile');

    if (profileBtn) {
        profileBtn.addEventListener('click', function (event) {
            event.preventDefault();
            if (profileContainer.style.display === "block") {
                profileContainer.style.display = "none";
            } else {
                profileContainer.style.display = "block";
            }
        });
        document.addEventListener('click', function (event) {
            if (!profileContainer.contains(event.target) && !profileBtn.contains(event.target)) {
                profileContainer.style.display = "none";
            }
        });
    }







    
    const navbarBtn = document.getElementById("show-nav-btn"); 
    const navbarContainer = document.getElementById("mobile-navbar"); 
    const closeNavbarBtn = document.getElementById("close-nav-btn");

    
    function showNavbar() {
        console.log("Showing nav bar");
        navbarContainer.style.display = "block";
        document.body.classList.add("no-scroll"); 
    }

    
    function hideNavbar() {
        console.log("Hiding nav bar");
        navbarContainer.style.display = "none"; 
        document.body.classList.remove("no-scroll");
    }

   
    navbarBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showNavbar();
    });

    
    closeNavbarBtn.addEventListener("click", (e) => {
        e.preventDefault();
        hideNavbar();
    });

   
    window.addEventListener("click", (e) => {
        if (navbarContainer.style.display === "flex" && !navbarContainer.contains(e.target) && e.target !== navbarBtn) {
            hideNavbar();
        }
    });






    const contactBtn = document.getElementById("contact-btn");
    const contactFooterBtn = document.getElementById("contact-footer-btn");
    const contactContainer = document.getElementById("contact-container");
    const closeContactBtn = document.getElementById("close-contact-btn");


    function toggleContactForm(isVisible) {
        if (isVisible) {
            contactContainer.style.display = "flex";
            contactContainer.style.zIndex = "2000";
            document.body.classList.add("no-scroll");
        } else {
            contactContainer.style.display = "none";
            document.body.classList.remove("no-scroll");
        }
    }


    [contactBtn, contactFooterBtn].forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            toggleContactForm(true);
        });
    });


    closeContactBtn.addEventListener("click", () => {
        toggleContactForm(false);
    });




















});


