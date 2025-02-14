document.addEventListener("DOMContentLoaded", () => {
    const ellipsisBtn = document.getElementById("ellipsis-button");
    if (ellipsisBtn) {
        ellipsisBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            const dropdown = document.getElementById("dropdown-menu");


            dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
        });
        document.addEventListener("click", function (event) {
            const dropdown = document.getElementById("dropdown-menu");
            const button = document.getElementById("ellipsis-button");

            if (!button.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.style.display = "none";
            }
        });
    }

    document.querySelectorAll(".delete-event").forEach((button) => {
        button.addEventListener("click", function () {
            const eventId = this.dataset.id;

            if (confirm("Are you sure you want to delete this event?")) {
                fetch(`/delete-event/${eventId}/`, {
                    method: "DELETE",
                    headers: {
                        "X-CSRFToken": getCSRFToken(),
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.success) {
                            this.closest(".event").remove();
                        } else {
                            alert("Failed to delete event.");
                        }
                    })
                    .catch((error) => console.error("Error:", error));
            }
        });
    });
    document.getElementById('form-edit-events').addEventListener('submit', function (event) {
        event.preventDefault();
        const title = document.getElementById('title');
        const date = document.getElementById('event_date');
        const time = document.getElementById('event_time');
        const location = document.getElementById('location');
        const eventImage = document.getElementById('event_image');
        const isBillboard = document.getElementById('is_billboard');
        const eventId = document.getElementById('event_id').value;

        let event_valid = true;
        if (event_valid) {
            console.log("Hello");
            const formData = new FormData();
            formData.append('event_id', eventId);
            formData.append('event_name', title.value);
            formData.append('event_date', date.value);
            formData.append('event_time', time.value);
            formData.append('event_location', location.value);
            formData.append('is_billboard', isBillboard.checked ? 'True' : 'False');
            if (eventImage.files[0]) formData.append('event_image', eventImage.files[0]);


            fetch(`/edit_event/${eventId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCSRFToken(),
                },
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.href = `/events/detail/${eventId}/`;
                    } else {
                        alert('Failed to edit event: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while editing the event.');
                });
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