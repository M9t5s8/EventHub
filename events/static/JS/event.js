document.addEventListener("DOMContentLoaded", () => {




    const eventBtn = document.getElementById("add-event-btn");
    const closeeventBtn = document.getElementById("close-event-add-btn");


    const event1Container = document.getElementById("event1-container");

    function showEventContainer() {
        event1Container.style.display = "flex";
        event1Container.style.zIndex = "2000";
        document.body.classList.add("no-scroll");
    }

    eventBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showEventContainer();
    });


    closeeventBtn.addEventListener("click", () => {
        event1Container.style.display = "none";
        document.body.classList.remove("no-scroll");
    });
    [event1Container].forEach((container) => {
        if (container) {
            container.addEventListener("click", (e) => {
                if (e.target === container) {
                    container.style.display = "none";
                    document.body.classList.remove("no-scroll");
                }
            });
        }
    });




    document.getElementById('form-event').addEventListener('submit', function (event) {
        event.preventDefault();
        const title = document.getElementById('event-title');
        const description=document.getElementById('event-description');
        const date = document.getElementById('event-date');
        const time = document.getElementById('event-time');
        const location = document.getElementById('event-location');
        const titleEmpty = document.getElementById('empty-event-title');
        const dateEmpty = document.getElementById('empty-event-date');
        const timeEmpty = document.getElementById('empty-event-time');
        const locationEmpty = document.getElementById('empty-event-location');
        const descriptionEmpty=document.getElementById('empty-event-description');
        let event_valid = true;
        if (title.value.trim() === '') {
            titleEmpty.style.display = 'block';
            event_valid = false;
        } else {
            titleEmpty.style.display = 'none';
        }

        if(description.value.trim()===''){
            descriptionEmpty.style.display='block'
            event_valid=false;
        }
        else{
            descriptionEmpty.style.display='none'
        }
        if (date.value.trim() === '') {
            dateEmpty.style.display = 'block';
            event_valid = false;
        } else {
            dateEmpty.style.display = 'none';
        }

        if (time.value.trim() === '') {
            timeEmpty.style.display = 'block';
            event_valid = false;
        } else {
            timeEmpty.style.display = 'none';
        }

        if (location.value.trim() === '') {
            locationEmpty.style.display = 'block';
            event_valid = false;
        } else {
            locationEmpty.style.display = 'none';
        }

        if (event_valid) {
            fetch('/add_event/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({
                    event_name: title.value,
                    event_description:description.value,
                    event_date: date.value,
                    event_time: time.value,
                    event_location: location.value,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.reload();
                    } else {
                        alert('Failed to add event.');
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    });

    document.getElementById('event-title').addEventListener('focus', function () {
        const titleEmpty = document.getElementById('empty-event-title');


        if (titleEmpty.style.display === 'block') {
            titleEmpty.style.display = 'none';
        }
    });
    document.getElementById('event-description').addEventListener('focus', function () {
        const descriptionEmpty = document.getElementById('empty-event-description');
        if (descriptionEmpty.style.display === 'block') {
            descriptionEmpty.style.display = 'none';
        }
    });
    document.getElementById('event-date').addEventListener('focus', function () {
        const dateEmpty = document.getElementById('empty-event-date');

        if (dateEmpty.style.display === 'block') {
            dateEmpty.style.display = 'none';
        }
    });
    document.getElementById('event-time').addEventListener('focus', function () {
        const timeEmpty = document.getElementById('empty-event-time');

        if (timeEmpty.style.display === 'block') {
            timeEmpty.style.display = 'none';
        }
    });
    document.getElementById('event-location').addEventListener('focus', function () {
        const locationEmpty = document.getElementById('empty-event-location');
        if (locationEmpty.style.display === 'block') {
            locationEmpty.style.display = 'none';
        }
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