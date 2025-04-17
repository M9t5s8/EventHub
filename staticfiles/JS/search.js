// document.addEventListener("DOMContentLoaded", () => {
//     const searchInput = document.getElementById("search-input");
//     const searchBtn = document.getElementById("search-btn");
//     const clearBtn = document.getElementById("clear-btn");

    
//     function toggleButtonsAfterSearch(event) {
//       if (searchInput.value.trim() !== "") {
//         event.preventDefault(); 
//         searchBtn.style.display = "none";
//         clearBtn.style.display = "inline-block";
//       }
//     }

    
//     function clearSearch() {
//       searchInput.value = "";
//       searchBtn.style.display = "inline-block";
//       clearBtn.style.display = "none";
//     }

//     searchBtn.addEventListener("click", toggleButtonsAfterSearch);
//     clearBtn.addEventListener("click", clearSearch);
  
// });