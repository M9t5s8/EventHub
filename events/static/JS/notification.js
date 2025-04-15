document.addEventListener('DOMContentLoaded', function () {
    const notificationLinks = document.querySelectorAll('.notification-link, .noti-click-here');

    notificationLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); 

            const markAsReadUrl = this.href; 
            const targetUrl = this.getAttribute('data-target-url'); 

            
            fetch(markAsReadUrl, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            }).then(response => {
                if (response.ok) {
                    
                    const notificationItem = this.closest('.notification-item');
                    if (notificationItem) {
                        notificationItem.classList.remove('unread-notification');
                        notificationItem.classList.add('read-notification');
                    }

                   
                    if (targetUrl) {
                        if (this.target === '_blank') {
                            window.open(targetUrl, '_blank');
                        } else {
                            window.location.href = targetUrl;
                        }
                    } else {
                        console.warn('No target URL found!');
                    }
                }
            }).catch(error => {
                console.error('Error:', error);
                if (targetUrl) {
                    window.location.href = targetUrl;
                }
            });
        });
    });
});
