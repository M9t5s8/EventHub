document.addEventListener("DOMContentLoaded", function () {

    const filterBtn = document.getElementById("filter-btn");
    const resetFilter = document.getElementById('reset-filters');
    const searchBtn = document.getElementById("search-btn");

    function getCurrentURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            sort: urlParams.get('sort') || 'recent',
            ticket: urlParams.get('ticket') || '',
            status: urlParams.get('status') || 'active',
            searchBy: urlParams.get('search-by') || 'title',
            q: urlParams.get('q') || ''
        };
    }
    filterBtn.addEventListener("click", function () {
        
        applyFilters();
    });
    if (resetFilter) {
        resetFilter.addEventListener('click', function () {

            document.getElementById("sort").value = 'recent';
            document.getElementById("ticket-filter").value = '';
            document.getElementById("status-filter").value = 'active';
            document.getElementById("search-by").value = 'title';
            document.querySelector('input[name="q"]').value = '';
            window.location.href = '/events/';
        });
    }




    if (searchBtn) {
        searchBtn.addEventListener('click', function (event) {
            event.preventDefault();
            console.log("Searching");
            applyFilters();
            applySearch();
        });
    }
    function applyFilters() {
        const sortValue = document.getElementById("sort").value;
        const ticketFilter = document.getElementById("ticket-filter").value;
        const statusFilter = document.getElementById("status-filter").value;
        const searchBy = document.getElementById("search-by").value;
        const searchQuery = document.querySelector('input[name="q"]').value.trim(); // Trim to remove extra spaces

        let url = '/events/';
        const params = new URLSearchParams();

        if (sortValue) params.set('sort', sortValue);
        if (ticketFilter) params.set('ticket', ticketFilter);
        if (statusFilter) params.set('status', statusFilter);
        if (searchBy) params.set('search-by', searchBy);
        if (searchQuery) params.set('q', searchQuery);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        
        history.pushState({ path: url }, '', url);

        
        fetchEvents(url);
    }






    function applySearch() {
        const searchQuery = document.querySelector('input[name="q"]').value;
        const currentParams = getCurrentURLParams();
        let url = '/events/';
        const params = new URLSearchParams();
        if (currentParams.sort) params.set('sort', currentParams.sort);
        if (currentParams.ticket) params.set('ticket', currentParams.ticket);
        if (currentParams.status) params.set('status', currentParams.status);
        if (currentParams.searchBy) params.set('search-by', currentParams.searchBy);
        if (searchQuery) {
            params.set('q', encodeURIComponent(searchQuery));
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            history.pushState({ path: url }, '', url);
            fetchEvents(url);
        }

    }

















    function fetchEvents(url) {

        fetch(url, {
            headers: { "X-Requested-With": "XMLHttpRequest" },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data || !data.events) {
                    throw new Error("Invalid JSON response");
                }
                renderEvents(data.events);
            })
            .catch(error => console.error("Error fetching events:", error));
    }
    function timeAgo(date) {
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (seconds < 60) return `Just Now`;
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hrs ago`;
        if (days < 30) return `${days} days ago`;
        if (months < 12) return `${months} mons ago`;
        return `${years} yrs ago`;
    }





    function renderEvents(events) {
        const eventContainer = document.querySelector(".event-show-sub-container");
        eventContainer.innerHTML = ""; 
    
        if (events.length > 0) {
            const eventHTML = events.map(event => {
                const eventDate = new Date(`${event.event_date}T${event.event_time}`); 
                const formattedDate = new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                }).format(eventDate);
    
                const formattedTime = new Intl.DateTimeFormat('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                }).format(eventDate);
    
                return `
                    <div class="event">
                        <div class="user-time">
                            <div class="organizer-profile">
                                <div class="profile-image-wrapper">
                                    ${event.organizer_profile ? `<img src="${event.organizer_profile}" alt="Organizer Image" class="profile-img">` : ""}
                                </div>
                                <div class="organizer-info">
                                    <a href="/" class="organizer-name">${event.organizer_name || 'Unknown'}</a>
                                    <p class="event-created-time">${timeAgo(new Date(event.created_at))}</p>
                                </div>
                                <div class="more-option">
                                    ${event.user_role === 'admin' ? `
                                        <button class="ellipsis-button"><i class="fas fa-ellipsis-v"></i></button>
                                        <div class="dropdown-menu">
                                            <ul>
                                                <li><a href="{% url 'edit_event' event.event_id %}">Edit Event</a></li>
                                                <li><a href="#" class="delete-event" data-id="${event.event_id}">Delete Event</a></li>
                                                <li><a href="#">View Profile</a></li>
                                            </ul>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="event-image">
                            ${event.event_image ? `<img src="${event.event_image}" alt="Event Image">` : ""}
                        </div>
                        <div class="event-title">
                            <p>${event.title || 'No Title'}</p>
                        </div>
                        <div class="event-datetime">
                            <p class="event-date">${formattedDate}</p>
                            <p class="event-time">${formattedTime}</p>
                        </div>
                        <div class="event-lotick">
                            <p class="event-location">${event.location || 'Unknown Location'}</p>
                            <p class="event-ticket">${event.has_ticket ? 'available' : 'free'}</p>
                        </div>
                        <div class="inspect-div">
                            <button class="inspect" onclick="window.location.href='/events/detail/${event.id}/'">Inspect</button>
                        </div>
                    </div>
                `;
            }).join(""); 
    
            eventContainer.innerHTML = eventHTML; // Append all events at once
        } else {
            eventContainer.innerHTML = `<p class="event-not-found" id="event-not-found">No events available at the moment.</p>`;
        }
    }
    


});
