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