document.addEventListener("DOMContentLoaded", () => {
    const ellipsisButtons = document.querySelectorAll(".ellipsis-button");

    ellipsisButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            const clickedDropdown = this.nextElementSibling; 

           
            document.querySelectorAll(".dropdown-menu").forEach(dropdown => {
                if (dropdown !== clickedDropdown) {
                    dropdown.style.display = "none";
                }
            });
            clickedDropdown.style.display = (clickedDropdown.style.display === "block") ? "none" : "block";

           
            event.stopPropagation();
        });
    });

   
    document.addEventListener("click", function (event) {
        if (!event.target.closest(".dropdown-menu") && !event.target.closest(".ellipsis-button")) {
            document.querySelectorAll(".dropdown-menu").forEach(dropdown => {
                dropdown.style.display = "none";
            });
        }
    });







    const deleteEvent = document.querySelectorAll(".delete-event");
    if (deleteEvent) {
        deleteEvent.forEach((button) => {
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