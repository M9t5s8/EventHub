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


























});