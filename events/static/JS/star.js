document.addEventListener("DOMContentLoaded", function () {
    const stars = document.querySelectorAll(".stars i");
    const ratingStatus = document.getElementById("rating-status");
    const ratingForm = document.getElementById("rating-form");
    const ratingInput = document.getElementById("rating-value");
    const loadingContainer = document.getElementById("loading-container");
    const ratingContainer = document.getElementById("rating-container");

    let selectedRating = parseInt(ratingInput.value) || 0;

    const statusMessages = {
        1: "Very Poor",
        2: "Poor",
        3: "Average",
        4: "Good",
        5: "Excellent"
    };

    
    function highlightStars(rating) {
        stars.forEach(star => {
            star.classList.remove("active");
            star.classList.replace("fas", "far");
        });

        for (let i = 0; i < rating; i++) {
            stars[i].classList.add("active");
            stars[i].classList.replace("far", "fas");
        }
    }

   
    highlightStars(selectedRating);
    ratingStatus.textContent = selectedRating > 0 ? statusMessages[selectedRating] : "";

    stars.forEach(star => {
        

        star.addEventListener("click", function () {
            const currentRating = parseInt(this.getAttribute("data-value"));

            if (selectedRating === currentRating) {
                selectedRating = 0; 
            } else {
                selectedRating = currentRating;
            }

           
            highlightStars(selectedRating);

           
            ratingStatus.textContent = selectedRating > 0 ? statusMessages[selectedRating] : "";

           
            ratingInput.value = selectedRating;
        });
    });


    ratingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const comment = document.getElementById("message-rating");
        let ratingValid = true;
        let selectedRating = document.getElementById("rating-value").value


        if (selectedRating < 1 || selectedRating > 5) {
            return;
        }

       
        loadingContainer.style.display = "flex";


        if (ratingValid) {
            fetch("/rate-event/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken(),
                },
                body: JSON.stringify({
                    event_id: document.getElementById("event_id").value,
                    rating_value: selectedRating,
                    comment: comment.value.trim()
                }),
            })
                .then(response => response.json())
                .then(data => {
                    loadingContainer.style.display = "none";
                    if (data.success) {

                        ratingContainer.style.display = "none";
                        document.body.classList.remove("no-scroll");
                        document.getElementById('avg-rating').textContent = data.average_rating.toFixed(1);


                        document.getElementById('total-rating').textContent = `${data.total_ratings} Votes`;

                    }
                })
                .catch(error => {
                    loadingContainer.style.display = "none";
                    console.error("Error:", error);
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
