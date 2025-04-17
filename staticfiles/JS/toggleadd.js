document.addEventListener("DOMContentLoaded", function () {
    const toggleDropdown = document.getElementById("toggleDropdown");
    const dropdownMenu = document.getElementById("eventdropdown-menu");
    const addEventBtn = document.getElementById("addmyEventBtn");
    const removeEventBtn = document.getElementById("removeEventBtn");
    let eventId = null;
    const eventElement = document.querySelector(".event-actions");
    if (eventElement) {
        eventId = eventElement.getAttribute("data-event-id");
    }




    if (toggleDropdown) {
        toggleDropdown.addEventListener("click", function (event) {
            event.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
        });
    }

    if (dropdownMenu) {
        document.addEventListener("click", function (event) {
            if (!dropdownMenu.contains(event.target) && !toggleDropdown.contains(event.target)) {
                dropdownMenu.style.display = "none";
            }
        });
    }

    // Handle "Add to My Events" button click
    if (addEventBtn) {
        addEventBtn.addEventListener("click", function (event) {
            event.preventDefault();
            fetch(`/save-event/${eventId}/`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCSRFToken(),  // CSRF token for security
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        dropdownMenu.style.display = "none";
                        showNotification("Event has been added!");
                        addEventBtn.disabled = true;
                        removeEventBtn.disabled = false;
                    } else {
                        alert("Error: " + data.message);
                    }
                })
                .catch(error => console.error("Error:", error));
        });
    }

    
    if (removeEventBtn) {
        removeEventBtn.addEventListener("click", function (event) {
            event.preventDefault();
            fetch(`/remove-event/${eventId}/`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCSRFToken(),
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        dropdownMenu.style.display = "none";
                        showNotification("Event has been removed!")
                        addEventBtn.disabled = false;
                        removeEventBtn.disabled = true;

                    } else {
                        alert("Error: " + data.message);
                    }
                })
                .catch(error => console.error("Error:", error));
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


        setTimeout(function () {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    function getCSRFToken() {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            document.cookie.split(';').forEach(cookie => {
                let trimmedCookie = cookie.trim();
                if (trimmedCookie.startsWith("csrftoken=")) {
                    cookieValue = trimmedCookie.substring(10);
                }
            });
        }
        return cookieValue;
    }
});
