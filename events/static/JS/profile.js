document.addEventListener('DOMContentLoaded', function () {

    const editForm = document.getElementById('form-profile-change');
    const passwordContainer=document.getElementById("password-container");
    const loadingContainer = document.getElementById("loading-container");

    if (editForm) {
        editForm.addEventListener('submit', function (event) {
            event.preventDefault();

            
            const username = document.getElementById('name');
            const email = document.getElementById('email');
            const profilePicture = document.getElementById('event_image').files[0];

            

            if (username.value.trim() === '') {
                showError("username-edit-error", "Username is Empty!");
                passwordValid = false;
            }
            const formData = new FormData();
            formData.append('username', username.value);  

            if (profilePicture) {
                formData.append('profile_picture', profilePicture);
            }

            loadingContainer.style.display = "flex";
            fetch('/update_profile/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCSRFToken(),
                },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    loadingContainer.style.display = "none";
                    if (data.success) {
                        console.log("Profile uploaded successfully");
                        showNotification("Profile Updated Successfully!");
                        const usernameElement1 = document.querySelector('.downbar-name p');
                        usernameElement1.textContent = 'Hi, ' + data.username;
                        const usernameElement2 = document.querySelector('.profile-container .username');
                        if (usernameElement2) {
                            usernameElement2.textContent = data.username;
                        }
                        if (profilePicture) {
                            const reader = new FileReader();
                            reader.onload = function (e) {
                                document.querySelector('.profile-img').src = e.target.result;
                            };
                            reader.readAsDataURL(profilePicture);
                        }
                        const profilePicElement = document.querySelector('#user-profile img');
                        if (profilePicElement) {
                            profilePicElement.src = data.profile_picture;  // Update image source
                        }
                    } else {
                        if(data.username_taken){
                            showError("username-edit-error","Username already taken!");
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while updating the profile.');
                });
        });
    }

    const PasswordForm = document.getElementById('form-password');
    if (PasswordForm) {
        PasswordForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            console.log('Form submitted');
            const oldPassword = document.getElementById('old-pass');
            const newPassword = document.getElementById('new-pass');
            const reenterPassword = document.getElementById('reenter-pass');

            let passwordValid = true;
            if (oldPassword.value.trim() === '') {
                showError("old-password-error", "Old Password is Empty!");
                passwordValid = false;
            }
            if (newPassword.value.trim() === '') {
                showError("new-password-error", "New Password is Empty!");
                passwordValid = false;
            }
            if (reenterPassword.value.trim() === '') {
                showError("reenter-password-error", "Re-enter Password is Empty!");
                passwordValid = false;
            }
            if (reenterPassword.value.trim() !== "" && newPassword.value.trim() !== "") {
                if (reenterPassword.value.trim() !== newPassword.value.trim()) {
                    showError("reenter-password-error", "New Password does not match!");
                    passwordValid = false;
                }
            }
            if (oldPassword.value.trim() !== "" && newPassword.value.trim() !== "") {
                if (oldPassword.value.trim() === newPassword.value.trim()) {
                    showError("new-password-error","Password is same as old!");
                }
            }

            if (!passwordValid) return;
            loadingContainer.style.display = "flex";
            try {
                const formData = new FormData();
                formData.append('old_password', oldPassword.value);
                formData.append('new_password', newPassword.value);

                const response = await fetch('/change_password/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCSRFToken(),
                    },
                    body: formData
                });

                const data = await response.json();
                if (data.success) {
                    loadingContainer.style.display = "none";
                    passwordContainer.style.display = "none";
                    document.body.classList.remove("no-scroll");
                    showNotification("Password changed successfully!")
                } else {
                    if (data.password_not_match) {
                        oldPassword.value="";
                        showError("old-password-error", "Password incorrect!");
                    }
                }   
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while changing the password.');
            }
        });
    }

    hideErrorOnFocus("old-pass", "old-password-error");
    hideErrorOnFocus("new-pass", "new-password-error");
    hideErrorOnFocus("reenter-pass", "reenter-password-error");
    hideErrorOnFocus("name","username-edit-error");
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
        document.getElementById(inputId).addEventListener("focus", function () {
            const errorElement = document.getElementById(errorId);
            if (errorElement.style.visibility === "visible") {
                errorElement.style.visibility = "hidden";
            }
        });
    }
    function showNotification(message) {
       
        const notification = document.createElement('div');
        notification.classList.add('added-noti-container');
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('show');
        }, 0); 
        setTimeout(function() {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500); 
        }, 3000);
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
