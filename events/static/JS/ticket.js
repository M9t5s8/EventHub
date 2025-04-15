document.addEventListener("DOMContentLoaded", function () {
    const incrementButtons = document.querySelectorAll('.increment');
    const decrementButtons = document.querySelectorAll('.decrement');
    // const buyticketContainer = document.getElementById("buy-ticket-container");
    // const qrContainer = document.getElementById("qr-code-container");
    const closeBuyTicketBtn = document.getElementById("close-buy-ticket-btn");
    const buyticketBtn = document.getElementById("open-buy-ticket-btn");
    const totalPriceInput = document.getElementById("buy-ticket-total-price");
    // const generatedQRCodeContainer = document.getElementById("generated-qr-code");
    // const buyTicketForm = document.getElementById("buy-ticket-form");
    const loadingContainer = document.getElementById("loading-container");
    const paymentContainer = document.getElementById('payment-container');
    let totalPrice = 0;
    const tickets = {};


    incrementButtons.forEach(button => {
        button.addEventListener('click', function () {
            const ticketId = this.getAttribute('data-ticket-id');
            const ticketPrice = parseFloat(this.getAttribute('data-ticket-price'));
            const quantitySpan = document.querySelector(`.ticket-quantity[data-ticket-id="${ticketId}"]`);
            const ticketNumberContainer = document.getElementById(`ticket-number-container-${ticketId}`);
            let currentQuantity = parseInt(quantitySpan.textContent);


            if (ticketNumberContainer.style.display === 'flex' && currentQuantity < 5) {
                currentQuantity++;
                quantitySpan.textContent = currentQuantity;
                updateTotalPrice(ticketPrice);
                tickets[ticketId] = currentQuantity;
            }
        });
    });


    decrementButtons.forEach(button => {
        button.addEventListener('click', function () {
            const ticketId = this.getAttribute('data-ticket-id');
            const ticketPrice = parseFloat(this.getAttribute('data-ticket-price'));
            const quantitySpan = document.querySelector(`.ticket-quantity[data-ticket-id="${ticketId}"]`);
            const ticketNumberContainer = document.getElementById(`ticket-number-container-${ticketId}`);
            let currentQuantity = parseInt(quantitySpan.textContent);


            if (ticketNumberContainer.style.display === 'flex' && currentQuantity > 0) {
                currentQuantity--;
                quantitySpan.textContent = currentQuantity;
                updateTotalPrice(-ticketPrice);
                tickets[ticketId] = currentQuantity;
            }
        });
    });


    const addButtons = document.querySelectorAll('.add-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', function () {
            const ticketId = this.getAttribute('data-ticket-id');
            const ticketPrice = parseFloat(this.getAttribute('data-ticket-price'));
            const ticketNumberContainer = document.getElementById(`ticket-number-container-${ticketId}`);



            ticketNumberContainer.style.display = 'flex';

            updateTotalPrice(ticketPrice);
            tickets[ticketId] = 1;


            this.style.display = 'none';
        });
    });


    if (buyticketBtn && paymentContainer) {
        buyticketBtn.addEventListener("click", function () {
            if (totalPrice > 0) {
                paymentContainer.style.display = "flex";
                paymentContainer.style.zIndex = "2000";
                // buyticketContainer.style.display = "flex";
                // buyticketContainer.style.zIndex = "2000";
                document.body.classList.add("no-scroll");
            }
        });
    }


    if (closeBuyTicketBtn && buyticketContainer) {
        closeBuyTicketBtn.addEventListener("click", function () {
            buyticketContainer.style.display = "none";
            document.body.classList.remove("no-scroll");
        });
    }


    function updateTotalPrice(ticketPrice) {
        totalPrice += ticketPrice;
        totalPriceInput.value = `Rs ${totalPrice.toFixed(2)}`;


        const totalPriceElement = document.getElementById('total-price');
        totalPriceElement.textContent = `Rs ${totalPrice.toFixed(2)}`;
    }

    document.getElementById('payment-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const fullName = document.getElementById('buy-ticket-full-name');
        const email = document.getElementById('buy-ticket-email');
        let totalPriceRaw = document.getElementById('buy-ticket-total-price').value.trim();
        let totalPrice = totalPriceRaw.replace(/[^\d.]/g, '');
        totalPrice = parseInt(parseFloat(totalPrice));
        const eventId = document.getElementById("event_id").value;
        let formValid = true;


        if (!validateInput(fullName, "buy-ticket-name-error", 5, 100, { empty: "Full name is required!" })) {
            formValid = false;
        }

        if (!validateInput(email, "buy-ticket-email-error", 5, 100, { empty: "Email is required!" })) {
            formValid = false;
        }


        if (!validateTickets()) {
            formValid = false;
        }
        loadingContainer.style.display = "flex";
        if (formValid) {

            const ticketsData = [];
            for (const ticketId in tickets) {
                if (tickets.hasOwnProperty(ticketId)) {
                    ticketsData.push({
                        ticketId: ticketId,
                        quantity: tickets[ticketId]
                    });
                }
            }
            try {

                const signatureResponse = await fetch('/generate-signature/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        total_amount: totalPrice,
                        product_code: 'EPAYTEST'
                    })
                });

                const signatureData = await signatureResponse.json();

                if (!signatureData.signature || !signatureData.transaction_uuid) {
                    alert("Error generating payment signature. Please try again.");
                    loadingContainer.style.display = "none";
                    return;
                }


                const orderResponse = await fetch("/api/submit_ticket_order", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCSRFToken(),
                    },
                    body: JSON.stringify({
                        eventID: eventId,
                        fullName: fullName.value,
                        email: email.value,
                        tickets: ticketsData,
                        totalPrice: totalPrice,
                        transactionUUID: signatureData.transaction_uuid
                    })
                });

                const orderData = await orderResponse.json();
                loadingContainer.style.display = 'none';
                if (!orderData.success) {
                    alert("Failed to save order data. Please try again.");
                    return;
                }





                const form = document.createElement('form');
                form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
                form.method = 'POST';

                const addField = (name, value) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = name;
                    input.value = value;
                    form.appendChild(input);
                    console.log(name + ": " + value);
                };

                addField('amount', totalPrice);
                addField('tax_amount', 0);
                addField('total_amount', totalPrice);
                addField('transaction_uuid', signatureData.transaction_uuid);
                addField('product_code', 'EPAYTEST');
                addField('product_service_charge', 0);
                addField('product_delivery_charge', 0);
                addField('success_url', 'http://127.0.0.1:8000/payment-success/');
                addField('failure_url', 'http://127.0.0.1:8000/payment-fail/?event_id=${event_id}');
                addField('signed_field_names', 'total_amount,transaction_uuid,product_code');
                addField('signature', signatureData.signature);

                document.body.appendChild(form);
                form.submit();



            } catch (error) {
                console.error("Error:", error);
                alert("There was an error processing your request.");
            }




















        }

    });

    // buyTicketForm.addEventListener("submit", function (event) {
    //     event.preventDefault();
    //     const eventID=document.getElementById("event_id");
    //     const fullName = document.getElementById("buy-ticket-full-name");
    //     const email = document.getElementById("buy-ticket-email");
    //     let formValid = true;


    //     if (!validateInput(fullName, "buy-ticket-name-error", 5, 100, { empty: "Full name is required!" })) {
    //         formValid = false;
    //     }

    //     if (!validateInput(email, "buy-ticket-email-error", 5, 100, { empty: "Email is required!" })) {
    //         formValid = false;
    //     }


    //     if (!validateTickets()) {
    //         formValid = false;
    //     }
    //     loadingContainer.style.display="flex";
    //     if (formValid) {

    //         const ticketsData = [];
    //         for (const ticketId in tickets) {
    //             if (tickets.hasOwnProperty(ticketId)) {
    //                 ticketsData.push({
    //                     ticketId: ticketId,
    //                     quantity: tickets[ticketId]
    //                 });
    //             }
    //         }


    //         const formData = {
    //             eventID: eventID.value,
    //             fullName: fullName.value,
    //             email: email.value,
    //             tickets: ticketsData,
    //             totalPrice:totalPrice
    //         };


    //         fetch("/api/submit_ticket_order", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "X-CSRFToken": getCSRFToken(),
    //             },
    //             body: JSON.stringify(formData)
    //         })
    //         .then(response => response.json())
    //         .then(data => {
    //             loadingContainer.style.display="none";
    //             if (data.success) {
    //                 buyticketContainer.style.display="none";
    //                 const qrImage = document.getElementById("generated-qr");
    //                 qrImage.src = `/media/${data.qr_code_url}`; 
    //                 qrImage.style.display = "block";
    //                 qrContainer.style.display="flex"


    //                 // showNotification("Ticket Purchased Successfully!");
    //                 // buyTicketForm.reset();

    //             } else {
    //                 alert("There was an error processing your request.");
    //             }
    //         })
    //         .catch(error => {
    //             loadingContainer.style.display="none";
    //             console.error("Error:", error);
    //             alert("There was an error sending the data.");
    //         });
    //     }
    // });


    window.onload = function() {
        // Check if the URL has the 'payment' query parameter with value 'success'
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('payment');
        
        if (paymentStatus === 'success') {
            showNotification("Ticket has been Purchased!");
        }
        if(paymentStatus=== 'failed') {
            showNotification("Ticket Purchase Failed!");
        }
        const newUrl = window.location.href.split('?')[0]; 
            history.pushState({}, '', newUrl); 
    }










    // const closeQRButton = document.getElementById("close-qr-code-btn");
    // closeQRButton.addEventListener("click", function () {
    //     qrCodeContainer.style.display = "none";
    // });
    function validateTickets() {
        if (Object.keys(tickets).length === 0) {
            alert("You need to select at least one ticket.");
            return false;
        }

        for (const ticketId in tickets) {
            if (tickets.hasOwnProperty(ticketId)) {
                const quantity = tickets[ticketId];
                if (quantity <= 0) {
                    alert(`Quantity for ticket ID ${ticketId} must be greater than 0.`);
                    return false;
                }
            }
        }

        return true;
    }



    hideErrorOnFocus("buy-ticket-full-name", "buy-ticket-name-error");
    hideErrorOnFocus("buy-ticket-email", "buy-ticket-email-error");


    function validateInput(input, errorElementId, minLength = 0, maxLength = Infinity, messages = {}) {
        const value = input.value.trim();
        let message = "";
        let valid = true;

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
