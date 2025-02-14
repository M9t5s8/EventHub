document.addEventListener("DOMContentLoaded", () => {
    const billboardContainer = document.querySelector('.billboard-container');
    if (billboardContainer) {
        const slides = document.querySelectorAll('.billboard-subcontainer');
        const slideIndicators = document.querySelector('.slide-indicators');
        let currentIndex = 0;
        const totalSlides = slides.length;


        function createPagination() {
            slideIndicators.innerHTML = ''; // Clear existing dots
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlide();
                });
                slideIndicators.appendChild(dot);
            }
        }


        function updateSlide() {
            slides.forEach((slide, index) => {
                slide.style.display = index === currentIndex ? 'block' : 'none';
            });
            updateIndicators();
        }


        function updateIndicators() {
            const dots = slideIndicators.querySelectorAll('.dot');
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentIndex]) {
                dots[currentIndex].classList.add('active');
            }
        }

        function autoSlide() {
            setInterval(() => {
                currentIndex = (currentIndex + 1) % totalSlides; // Move to next slide
                updateSlide();
            }, 5000);
        }


        document.querySelector(".next").addEventListener('click', () => {
            console.log("Hello");
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlide();
        });


        document.querySelector(".previous").addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlide();
        });


        createPagination();
        updateSlide();
        autoSlide();
    }



    
    const event1Container = document.getElementById("event1-container");


    document.querySelectorAll('input[name="event-toggle"]').forEach((input) => {
        input.addEventListener('change', function () {
            const basicSection = document.getElementById('event-basic');
            const additionalSection = document.getElementById('event-extra-detail');
            basicSection.style.display = document.getElementById('basic').checked ? 'flex' : 'none';
            additionalSection.style.display = document.getElementById('additional').checked ? 'flex' : 'none';
        });
    });

    document.getElementById('has-ticket').addEventListener('change', function () {
        const ticketlabel = document.getElementById('ticket-label');
        const ticketPriceInput = document.getElementById('ticket-price');
        const displayStyle = this.checked ? 'block' : 'none';
        ticketlabel.style.display = displayStyle;
        ticketPriceInput.style.display = displayStyle;
        if (!this.checked) ticketPriceInput.value = '';
    });

    document.getElementById('form-event').addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('event-title');
        const description = document.getElementById('event-description');
        const date = document.getElementById('event-date');
        const time = document.getElementById('event-time');
        const location = document.getElementById('event-location');
        const ticketPrice = document.getElementById('ticket-price');
        const hasTicket = document.getElementById('has-ticket');
        const eventImage = document.getElementById('event-image');

        let event_valid = true;

        // Form validation
        if (title.value.trim() === '') {
            document.getElementById('empty-event-title').style.display = 'block';
            event_valid = false;
        } else document.getElementById('empty-event-title').style.display = 'none';

        if (description.value.trim() === '') {
            document.getElementById('empty-event-description').style.display = 'block';
            event_valid = false;
        } else document.getElementById('empty-event-description').style.display = 'none';

        if (date.value.trim() === '') {
            document.getElementById('empty-event-date').style.display = 'block';
            event_valid = false;
        } else document.getElementById('empty-event-date').style.display = 'none';

        if (time.value.trim() === '') {
            document.getElementById('empty-event-time').style.display = 'block';
            event_valid = false;
        } else document.getElementById('empty-event-time').style.display = 'none';

        if (location.value.trim() === '') {
            document.getElementById('empty-event-location').style.display = 'block';
            event_valid = false;
        } else document.getElementById('empty-event-location').style.display = 'none';

        if (event_valid) {
            const formData = new FormData();
            formData.append('event_name', title.value);
            formData.append('event_description', description.value);
            formData.append('event_date', date.value);
            formData.append('event_time', time.value);
            formData.append('event_location', location.value);
            formData.append('has_ticket', hasTicket.checked ? 'True' : 'False');
            if (hasTicket.checked) formData.append('ticket_price', ticketPrice.value);
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

    // Function to dynamically add event to the DOM
    function addEventToDOM(data) {
        const eventContainer = document.querySelector('.event-show-sub-container');

        const newEvent = document.createElement('div');
        newEvent.classList.add('event');
        newEvent.innerHTML = `
        <div class="user-time">
            <div class="organizer-profile">
                <div class="profile-image-wrapper">
                    <img src="${data.profile_picture}" alt="${data.username}" class="profile-img">
                </div>
                <div class="organizer-info">
                    <p class="organizer-name">${data.organizer_name}</p>
                    <p class="event-created-time">Just now</p>
                </div>
                ${data.role === 'admin' ? `
                <div class="more-option">
                    <button id="ellipsis-button"><i class="fas fa-ellipsis-v"></i></button>
                    <div id="dropdown-menu" class="dropdown-menu">
                        <ul>
                            <li><a href="#">Edit Event</a></li>
                            <li><a href="#">Delete Event</a></li>
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
            <p class="event-date">${data.event_date},</p>
            <p class="event-time">${data.event_time}</p>
        </div>
        <div class="event-lotick">
            <p class="event-location">${data.event_location}</p>
            <p class="event-ticket">
                ${data.has_ticket ? `Rs ${data.ticket_price}` : 'Free'}
            </p>
        </div>
        <div class="inspect-div">
            <button class="inspect" data-id="${data.event_id}"
                onclick="window.location.href='/event_detail/${data.event_id}/'">
                Inspect
            </button>
        </div>
        `;



        eventContainer.insertAdjacentElement('afterbegin', newEvent);


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
