document.addEventListener("DOMContentLoaded", () => {
    const event1Container = document.getElementById("event1-container");


    document.querySelectorAll('input[name="event-toggle"]').forEach((input) => {
        input.addEventListener('change', function () {
            const basicSection = document.getElementById('event-basic');
            const additionalSection = document.getElementById('event-extra-detail');
            basicSection.style.display = document.getElementById('basic').checked ? 'flex' : 'none';
            additionalSection.style.display = document.getElementById('additional').checked ? 'flex' : 'none';
        });
    });










    document.getElementById('form-event').addEventListener('submit', function (event) {
        event.preventDefault();
        const title = document.getElementById('event-title');
        const description = document.getElementById('event-description');
        const date = document.getElementById('event-date');
        const time = document.getElementById('event-time');
        const location = document.getElementById('event-location');
        const hasTicket = document.getElementById('has-ticket');
        const eventImage = document.getElementById('event-image');
        let event_valid = true;

        if (!validateInput(title, "title-event-error", 1, Infinity, { empty: "Title is required!" })) {
            event_valid = false;
        }
        
        if (!validateInput(description, "event-description-error", 1, Infinity, { empty: "Description is required!" })) {
            event_valid = false;
        }
        
        if (!validateInput(date, "event-date-error", 1, Infinity, { empty: "Date is required!" })) {
            event_valid = false;
        }
        
        if (!validateInput(time, "event-time-error", 1, Infinity, { empty: "Time is required!" })) {
            event_valid = false;
        }
        
        if (!validateInput(location, "event-location-error", 1, Infinity, { empty: "Location is required!" })) {
            event_valid = false;
        }



        if (event_valid) {
            const formData = new FormData();
            formData.append('event_name', title.value);
            formData.append('event_description', description.value);
            formData.append('event_date', date.value);
            formData.append('event_time', time.value);
            formData.append('event_location', location.value);
            formData.append('has_ticket', hasTicket.checked ? 'True' : 'False');
            if (eventImage.files[0]) formData.append('event_image', eventImage.files[0]);


            fetch('/add_event/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCSRFToken(),
                },
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById('form-event').reset();
                        const eventnotFound = document.getElementById('event-not-found');
                        if (eventnotFound) {
                            eventnotFound.style.display = 'none';
                        }
                        event1Container.style.display = "none";
                        document.body.classList.remove("no-scroll");
                        showNotification("Event Added Successfully!");
                        addEventToDOM(data);
                    } else {
                        alert('Failed to add event: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while adding the event.');
                });
        }
    });


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









    function addEventToDOM(data) {
        const eventContainer = document.querySelector('.event-show-sub-container');

        const newEvent = document.createElement('div');
        const eventDate = new Date(`${data.event_date}T${data.event_time}`);  // Combine date and time for formatting


        const formattedDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        }).format(eventDate);


        const formattedTime = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }).format(eventDate);




        newEvent.classList.add('event');
        newEvent.innerHTML = `
        <div class="user-time">
            <div class="organizer-profile">
                <div class="profile-image-wrapper">
                    <img src="${data.profile_picture}" alt="${data.username}" class="profile-img">
                </div>
                <div class="organizer-info">
                    <p class="organizer-name">${data.organizer_name}</p>
                    <p class="event-created-time">Just Now</p>
                </div>
                ${data.role === 'admin' ? `
                <div class="more-option">
                    <button id="ellipsis-button"><i class="fas fa-ellipsis-v"></i></button>
                    <div class="dropdown-menu">
                        <ul>
                            <li><a href="{% url 'edit_event' event.event_id %}">Edit Event</a></li>
                            <li><a href="#" class="delete-event" data-id="{{ event.event_id }}">Delete Event</a></li>
                            <li><a href="#">View Profile</a></li>
                        </ul>
                    </div>
                </div>` : ''}
            </div>
        </div>
        <div class="event-image">
            <img src="${data.event_image}" alt="${data.event_name}">
        </div>
        <div class="event-title">
            <p>${data.event_name}</p>
        </div>
        <div class="event-datetime">
        
            <p class="event-date">${formattedDate}</p>
            <p class="event-time">${formattedTime}</p>
        </div>
        <div class="event-lotick">
            <p class="event-location">${data.event_location}</p>
            <p class="event-ticket">
                ${data.has_ticket ? `available` : 'Free'}
            </p>
        </div>
        <div class="inspect-div">
            <button class="inspect" data-id="${data.event_id}"
                onclick="window.location.href='/events/detail/${data.event_id}/'">
                Inspect
            </button>
        </div>
        `;



        eventContainer.insertAdjacentElement('afterbegin', newEvent);


    }







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
        if (errorSpan) { 
            if (message) {
                errorSpan.textContent = message;
                errorSpan.style.visibility = "visible";
            } else {
                errorSpan.textContent = "";
                errorSpan.style.visibility = "hidden";
            }
        }
    }
    
    
    hideErrorOnFocus("event-title","title-event-error");
    hideErrorOnFocus("event-date","event-date-error");
    hideErrorOnFocus("event-time","event-time-error");
    hideErrorOnFocus("event-location","event-location-error");
    hideErrorOnFocus("event-description","event-description-error");
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
