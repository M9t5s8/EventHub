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
});