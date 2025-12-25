document.addEventListener('DOMContentLoaded', () => {
    const carouselTrack = document.getElementById('carousel-track');
    const carouselWrapper = document.getElementById('carousel-wrapper');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const carouselIndicators = document.getElementById('carousel-indicators');

    let currentSlide = 0;
    let imgElements = [];
    let totalImages = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalImages) % totalImages;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalImages;
        updateCarousel();
    });

    let autoplayInterval;
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalImages;
            updateCarousel();
        }, 5000);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }

    if (window.matchMedia('(hover: hover)').matches) {
        carouselWrapper.addEventListener('mouseenter', stopAutoplay);
        carouselWrapper.addEventListener('mouseleave', startAutoplay);
    }

    async function fetchImagesFromAPI() {
        const response = await fetch('/getcarrouselimages');
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des images');
        }
        return response.json();
    }

    function createImageElements(images) {
        return images.map(image => {
            const img = document.createElement('img');
            img.src = `./${image.path}`;
            img.alt = image.name;
            img.className = 'w-full h-full object-contain';
            img.style.display = 'none'; // cachées par défaut
            return img;
        });
    }

    function updateCarousel() {
        imgElements.forEach((img, index) => {
            img.style.display = index === currentSlide ? 'block' : 'none';
        });

        const indicators = carouselIndicators.children;
        Array.from(indicators).forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.className = 'h-1.5 w-6 rounded-full bg-purple-600 transition-all';
            } else {
                indicator.className = 'h-1.5 w-1.5 rounded-full bg-gray-300 transition-all';
            }
        });
    }

    async function preloadImages(images) {
        const preloadPromises = images.map(image => {
            const img = new Image();
            img.src = `./${image.path}`;
            return img.decode(); // 🔥 décodage forcé
        });

        images.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = `h-1.5 rounded-full transition-all ${index === 0 ? 'w-6 bg-purple-600' : 'w-1.5 bg-gray-300'}`;
            indicator.addEventListener('click', () => goToSlide(index));
            carouselIndicators.appendChild(indicator);
        });

        await Promise.all(preloadPromises);
    }

    function setupTouchEvents() {
        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });

        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoplay();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                currentSlide = (currentSlide + 1) % totalImages;
            } else {
                currentSlide = (currentSlide - 1 + totalImages) % totalImages;
            }
            updateCarousel();
        }
    }

    async function initCarousel() {
        try {
            const images = await fetchImagesFromAPI();

            if (!images || images.length === 0) {
                throw new Error('Aucune image trouvée');
            }

            // Préchargement + décodage AVANT affichage
            await preloadImages(images);

            imgElements = createImageElements(images);
            totalImages = imgElements.length;

            // Ajout au DOM UNE SEULE FOIS
            imgElements.forEach(img => carouselTrack.appendChild(img));

            // Affiche la première image instantanément
            updateCarousel();

            startAutoplay();
            setupTouchEvents();
        } catch (error) {
            console.error('Erreur carousel:', error);
        }
    }

    initCarousel();
});

