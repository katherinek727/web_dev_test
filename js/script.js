// script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Landing Page Loaded Successfully');

    // 1. Anchor Buttons Smooth Scroll
    const anchorButtons = document.querySelectorAll('a[href^="#"], button[data-target]');

    anchorButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href') || this.getAttribute('data-target');

            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // 2. bender section slider
    const slides = Array.from(document.querySelector('.stages_slider').children)
        .filter(child => child.nodeType === 1); // Only element nodes

    const dots = document.querySelectorAll('.slider-dots .dot');
    const prev = document.querySelector('.slider-arrow.left');
    const next = document.querySelector('.slider-arrow.right');

    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.style.display = 'none');
        dots.forEach(dot => dot.classList.remove('active'));
        slides[index].style.display = 'block';
        dots[index].classList.add('active');
    }

    // Initialize
    showSlide(currentIndex);

    // Arrows
    next.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {  // stop at last slide
            currentIndex++;
            showSlide(currentIndex);
        }
    });

    prev.addEventListener('click', () => {
        if (currentIndex > 0) {  // stop at first slide
            currentIndex--;
            showSlide(currentIndex);
        }
    });

    // Dots
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            currentIndex = idx;
            showSlide(currentIndex);
        });
    });

    // 3. lecture section Slider
    document.addEventListener('DOMContentLoaded', function () {
        const slider = document.getElementById('slider');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const currentEl = document.getElementById('currentSlide');
        const currentE2 = document.getElementById('currentSlide2');

        const totalCards = 6;
        let currentIndex = 0;
        let autoInterval = null;
        let isMoving = false;

        function getCardWidth() {
            const card = slider.querySelector('.player-card');
            return card ? card.offsetWidth + 20 : 360; // gap 20px
        }

        function setupInfiniteLoop() {
            const cards = Array.from(slider.children);

            for (let i = 0; i < 2; i++) {
                cards.forEach(card => {
                    slider.insertBefore(card.cloneNode(true), slider.firstChild);
                });
            }

            for (let i = 0; i < 2; i++) {
                cards.forEach(card => {
                    slider.appendChild(card.cloneNode(true));
                });
            }
        }

        setupInfiniteLoop();

        function updateCurrentPage() {
            const realIndex = currentIndex % totalCards;
            currentEl.textContent = realIndex + 1;
            currentE2.textContent = realIndex + 1;
        }

        function moveToIndex(index, smooth = true) {
            if (isMoving) return;
            isMoving = true;

            const cardWidth = getCardWidth();
            slider.style.transition = smooth ? 'transform 0.6s ease-in-out' : 'none';
            slider.style.transform = `translateX(-${index * cardWidth}px)`;

            setTimeout(() => {
                isMoving = false;
            }, smooth ? 650 : 10);
        }

        function nextSlide() {
            currentIndex++;
            moveToIndex(currentIndex);

            if (currentIndex >= totalCards * 3) {
                setTimeout(() => {
                    currentIndex = currentIndex % totalCards;
                    moveToIndex(currentIndex, false);
                }, 600);
            }
            updateCurrentPage();
        }

        function prevSlide() {
            currentIndex--;
            moveToIndex(currentIndex);

            if (currentIndex < totalCards * 2) {
                setTimeout(() => {
                    currentIndex += totalCards;
                    moveToIndex(currentIndex, false);
                }, 600);
            }
            updateCurrentPage();
        }

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });

        function startAutoSlide() {
            if (autoInterval) clearInterval(autoInterval);
            autoInterval = setInterval(nextSlide, 4000);
        }

        function resetAutoSlide() {
            if (autoInterval) clearInterval(autoInterval);
            startAutoSlide();
        }

        function init() {
            currentIndex = totalCards * 2;
            moveToIndex(currentIndex, false);
            updateCurrentPage();

            setTimeout(() => {
                startAutoSlide();
            }, 800);
        }

        init();

        window.addEventListener('resize', () => {
            moveToIndex(currentIndex, false);
        });
    });
    console.log('🔗 Smooth scroll anchors ready');
});