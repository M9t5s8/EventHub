document.addEventListener("DOMContentLoaded", () => {
    const ticketCheckmark = document.getElementById("ticket-date");
    const ticketDateContainer = document.getElementById("custom-date-container");
    const loadingContainer = document.getElementById("loading-container");

    function toggleDateContainer() {

        if (ticketCheckmark.checked) {
            ticketDateContainer.style.display = "flex";
        } else {
            ticketDateContainer.style.display = "none";
        }
    }
    if (ticketCheckmark) {
        toggleDateContainer();
        ticketCheckmark.addEventListener("change", toggleDateContainer);
    }










    const editForm = document.getElementById('form-edit-events')
    if (editForm) {
        editForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const title = document.getElementById('title');
            const date = document.getElementById('event_date');
            const time = document.getElementById('event_time');
            const location = document.getElementById('location');
            const eventImage = document.getElementById('event_image');
            const isBillboard = document.getElementById('is_billboard');
            const isDeleted = document.getElementById('is_deleted');
            const eventId = document.getElementById('event_id').value;
            const tickettype = document.getElementById('ticket-typeno');

            let event_valid = true;
            loadingContainer.style.display = "flex";
            document.body.classList.add("no-scroll");
            if (event_valid) {
                const formData = new FormData();
                formData.append('event_id', eventId);
                formData.append('event_name', title.value);
                formData.append('event_date', date.value);
                formData.append('event_time', time.value);
                formData.append('event_location', location.value);
                if (isBillboard) {
                    formData.append('is_billboard', isBillboard.checked ? 'True' : 'False');
                }
                if (isDeleted) {
                    formData.append('is_deleted', isDeleted.checked ? 'True' : 'False');
                }
                if (tickettype) {
                    formData.append('tickettype', tickettype.value);
                }
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
                        loadingContainer.style.display = "none";
                        document.body.classList.remove("no-scroll");
                        if (data.success) {
                            showNotification("Event Updated Successfully!")
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
    }

    const ticketForm = document.getElementById('form-ticket-type')
    if (ticketForm) {
        ticketForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const ticketName = document.getElementById('ticket-name').value;
            const ticketPrice = document.getElementById('ticket-price').value;
            const ticketDateCheckbox = document.getElementById('ticket-date');
            const ticketStartDate = document.getElementById('ticket-start').value;
            const ticketEndDate = document.getElementById('ticket-end').value;
            const eventId = document.getElementById('event_id').value;

            let ticket_valid = true;
            if (ticketName.trim() === '') {
                showError("ticket-name-error", "Ticket name is required!");
                ticket_valid = false;
            }

            if (ticketPrice.trim() === '') {
                showError("ticket-price-error", "Price is required!");
                ticket_valid = false;
            }

            loadingContainer.style.display = "flex";
            if (ticket_valid) {
                let formData = new FormData();
                formData.append('event_id', eventId);
                formData.append('ticket_name', ticketName);
                formData.append('ticket_price', ticketPrice);
                formData.append('has_custom_date', ticketDateCheckbox.checked ? 'True' : 'False');

                if (ticketDateCheckbox.checked) {
                    formData.append('ticket_start_date', ticketStartDate);
                    formData.append('ticket_end_date', ticketEndDate);
                }

                fetch(`/register_ticket/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCSRFToken(),
                    },
                    body: formData,
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            loadingContainer.style.display = "none";
                            ticketForm.reset();
                            showNotification("Ticket Uploaded");
                            if (data.ticket_types_count == data.ticket_types) {
                                document.getElementById("ticket-form-container").style.display = 'none';
                            }
                            const noTicketsRow = document.getElementById('no-tickets-row');
                            if (noTicketsRow) {
                                noTicketsRow.style.display = 'none';
                            }


                            const ticketTableBody = document.querySelector('.ticket-table tbody');
                            if (ticketTableBody) {

                                const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td>${data.ticket_name}</td>
                                    <td>Rs ${data.ticket_price}</td>
                                `;
                                ticketTableBody.appendChild(row);
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('An error occurred while registering the ticket.');
                    });
            }
        });
    }




    function showError(inputId, message) {
        const errorSpan = document.getElementById(inputId);
        if (message) {
            errorSpan.textContent = message;
            errorSpan.style.visibility = "visible";
        } else {
            errorSpan.style.visibility = "hidden";
        }
    }

    hideErrorOnFocus("ticket-name", "ticket-name-error");
    hideErrorOnFocus("ticket-name", "ticket-price-error");

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
        const name = 'csrftoken';
        const cookies = document.cookie.split('; ');
        for (let cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key === name) return value;
        }
        return '';
    }
});