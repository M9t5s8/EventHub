document.addEventListener("DOMContentLoaded", () => {
    const billboardContainer = document.querySelector('.billboard-container');
    if (billboardContainer) {
        const slides = document.querySelectorAll('.billboard-subcontainer');
        const slideIndicators = document.querySelector('.slide-indicators');
        let currentIndex = 0;
        const totalSlides = slides.length;


        function createPagination() {
            slideIndicators.innerHTML = ''; 
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlide();
                });
                slideIndicators.appendChild(dot);
            }
        }


        function updateSlide() {
            slides.forEach((slide, index) => {
                slide.style.display = index === currentIndex ? 'block' : 'none';
            });
            updateIndicators();
        }


        function updateIndicators() {
            const dots = slideIndicators.querySelectorAll('.dot');
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentIndex]) {
                dots[currentIndex].classList.add('active');
            }
        }

        function autoSlide() {
            setInterval(() => {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateSlide();
            }, 5000);
        }

        const next = document.querySelector(".next");
        if (next) {
            next.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateSlide();
            });

        }

        const previous = document.querySelector(".previous");
        if (previous) {
            previous.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                updateSlide();
            });
        }


        createPagination();
        updateSlide();
        autoSlide();
    }
});