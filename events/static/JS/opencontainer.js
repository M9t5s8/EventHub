document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.querySelectorAll(".login-container-open");
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
    function showContainer(containerToShow) {
        const containers = [loginContainer, signupContainer, otpContainer, registerContainer];
        containers.forEach(container => {
            container.style.display = "none";
        });
        containerToShow.style.display = "flex";
        containerToShow.style.zIndex = "2000";
        document.body.classList.add("no-scroll");
    }


    loginBtn.forEach(loginBtn => {
        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showContainer(loginContainer);
        });
    });

    signupLink.addEventListener("click", (e) => {
        e.preventDefault();
        showContainer(signupContainer);
    });
    loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        showContainer(loginContainer);
    });
    otploginLink.addEventListener("click", (e) => {
        e.preventDefault();
        showContainer(otpContainer);
    });
    registerloginLink.addEventListener("click", (e) => {
        e.preventDefault();
        showContainer(registerContainer);
    });



    function closeContainer(container) {
        container.style.display = "none";
        document.body.classList.remove("no-scroll");
    }
    closeLoginBtn.addEventListener("click", () => closeContainer(loginContainer));
    closeSignupBtn.addEventListener("click", () => closeContainer(signupContainer));
    closeOTPBtn.addEventListener("click", () => closeContainer(otpContainer));
    closeRegisterBtn.addEventListener("click", () => closeContainer(registerContainer));

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




















    // open profile when clicking icon or picture
    const profileContainer = document.getElementById("profile-container");
    const profileBtn = document.getElementById('user-profile');
    if(profileBtn){
        profileBtn.addEventListener('click', function (event) {
            event.preventDefault();
            if (profileContainer.style.display === "block") {
                profileContainer.style.display = "none";
            } else {
                profileContainer.style.display = "block";
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


