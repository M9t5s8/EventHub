const togglePasswordFields = [
    { toggle: "togglePasswordLogin", input: "password-login" },
    { toggle: "togglePasswordSignup", input: "password-signup" },
    { toggle: "toggleConfirmPassword", input: "confirm-password" }
];

togglePasswordFields.forEach(({ toggle, input }) => {
    const toggleElement = document.getElementById(toggle);
    const inputElement = document.getElementById(input);
    
    if (toggleElement) {
        toggleElement.addEventListener("click", function () {
            const currentType = inputElement.getAttribute('type');
            console.log("Current input type:", currentType); 
            
            // Toggle the password visibility
            if (currentType === "password") {
                inputElement.setAttribute('type', 'text');
                console.log("Icon change to 'eye-slash'");
                
                
                toggleElement.classList.remove("fa-eye");
                toggleElement.classList.add("fa-eye-slash");
            } else {
                inputElement.setAttribute('type', 'password');
                console.log("Icon change to 'eye'"); // Debugging
                
                
                toggleElement.classList.remove("fa-eye-slash");
                toggleElement.classList.add("fa-eye");
            }

            console.log("Updated input type:", inputElement.getAttribute('type'));  // Debugging
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.querySelectorAll(".login-container-open");
    const loginContainer = document.getElementById("login-container");
    const signupContainer = document.getElementById("signup-container");
    const otpContainer = document.getElementById("otp-container");
    const registerContainer = document.getElementById("register-container");
    const rsvpContainer = document.getElementById("rsvp-container");
    const event1Container = document.getElementById("event1-container");
    const rsvpBtn = document.getElementById("rsvp-container-open");
    const eventBtn = document.getElementById("add-event-btn");
    const closeSignupBtn = document.getElementById("close-signup-btn");
    const closeOTPBtn = document.getElementById("close-otp-btn");
    const closeLoginBtn = document.getElementById("close-login-btn");
    const closeRegisterBtn = document.getElementById("close-register-btn");
    const closeRsvpBtn = document.getElementById("close-rsvp-btn");
    const closeEventBtn = document.getElementById("close-event-add-btn");
    const signupLink = document.getElementById("signup-link");
    const loginLink = document.getElementById("login-link");
    const otploginLink = document.getElementById("otp-to-signup");
    const registerloginLink = document.getElementById("register-to-login");
    function showContainer(containerToShow) {
        const containers = [
            loginContainer, signupContainer, otpContainer, registerContainer, rsvpContainer, event1Container
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



    if (loginBtn) {
        loginBtn.forEach(loginBtn => {
            loginBtn.addEventListener("click", (e) => {
                e.preventDefault();
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
    if (eventBtn) {
        eventBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showContainer(event1Container);
        });
    }
    if (signupLink) {
        signupLink.addEventListener("click", (e) => {
            e.preventDefault();
            showContainer(signupContainer);
        });
    }
    if (loginLink) {
        loginLink.addEventListener("click", (e) => {
            e.preventDefault();
            showContainer(loginContainer);
        });
    }
    if (otploginLink) {
        otploginLink.addEventListener("click", (e) => {
            e.preventDefault();
            showContainer(otpContainer);
        });
    }
    if (registerloginLink) {
        registerloginLink.addEventListener("click", (e) => {
            e.preventDefault();
            showContainer(registerContainer);
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

    [loginContainer, signupContainer, otpContainer, registerContainer, rsvpContainer, event1Container].forEach((container) => {
        if (container) {
            container.addEventListener("click", (e) => {
                if (e.target === container) {
                    container.style.display = "none";
                    document.body.classList.remove("no-scroll");
                }
            });
        }
    });




















    // open profile when clicking icon or picture
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







    // show nav bar on mobile
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


