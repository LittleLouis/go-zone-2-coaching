/*let currentSlide = 0;
let totalSlides = 0;
let carouselImages = [];
let touchStartX = 0;
let touchEndX = 0;

const carouselTrack = document.getElementById('carousel-track');
const carouselWrapper = document.getElementById('carousel-wrapper');
const carouselLoading = document.getElementById('carousel-loading');
const carouselError = document.getElementById('carousel-error');
const carouselIndicators = document.getElementById('carousel-indicators');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');

async function fetchImagesFromAPI() {
    try {
        const response = await fetch('/getcarrouselimages');
        if (!response.ok) throw new Error('Erreur lors de la récupération des images');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

function createCarouselSlides(images) {
    carouselImages = images;
    totalSlides = images.length;

    images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'min-w-full flex-shrink-0 flex items-center justify-center';
        slide.innerHTML = `
            <div class="relative rounded-xl overflow-hidden shadow-lg" style="aspect-ratio: 16/9; max-height: 400px;">
                <img src="./${image.path}" 
                        alt="${image.name}" 
                        class="w-full h-full object-contain mx-auto"
                        loading="lazy">
            </div>
        `;
        carouselTrack.appendChild(slide);
    });

    images.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.className = `h-1.5 rounded-full transition-all ${index === 0 ? 'w-6 bg-purple-600' : 'w-1.5 bg-gray-300'}`;
        indicator.addEventListener('click', () => goToSlide(index));
        carouselIndicators.appendChild(indicator);
    });

    setupTouchEvents();
    updateCarousel();
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
            currentSlide = (currentSlide + 1) % totalSlides;
        } else {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        }
        updateCarousel();
    }
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function updateCarousel() {
    const offset = -currentSlide * 100;
    carouselTrack.style.transform = `translateX(${offset}%)`;

    const indicators = carouselIndicators.children;
    Array.from(indicators).forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.className = 'h-1.5 w-6 rounded-full bg-purple-600 transition-all';
        } else {
            indicator.className = 'h-1.5 w-1.5 rounded-full bg-gray-300 transition-all';
        }
    });
}

prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
});

nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
});

let autoplayInterval;
function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
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

async function initCarousel() {
    try {
        const images = await fetchImagesFromAPI();
        
        if (!images || images.length === 0) {
            throw new Error('Aucune image trouvée');
        }

        carouselLoading.style.display = 'none';
        carouselWrapper.classList.remove('hidden');
        
        createCarouselSlides(images);
        startAutoplay();
        
    } catch (error) {
        carouselLoading.style.display = 'none';
        carouselError.classList.remove('hidden');
        carouselError.querySelector('div').textContent = '❌ ' + error.message;
    }
}
<section id="carousel" class="py-16 bg-white">
<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">Performances des athlètes coachés</h2>
            </div>

            <div class="relative">
                <!-- Loading State -->
                <div id="carousel-loading" class="text-center py-16">
                    <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                    <p class="mt-3 text-gray-600">Chargement des images...</p>
                </div>

                <!-- Error State -->
                <div id="carousel-error" class="text-center py-16 hidden">
                    <div class="text-red-500 text-lg">❌ Erreur lors du chargement des images</div>
                </div>

                <!-- Carousel Container -->
                <div id="carousel-wrapper" class="hidden max-w-4xl mx-auto">
                    <div class="relative overflow-hidden rounded-xl touch-pan-y">
                        <!-- Carousel Track -->
                        <div id="carousel-track" class="flex transition-transform duration-500 ease-out touch-action-pan-y">
                            <!-- Les images seront ajoutées ici dynamiquement -->
                        </div>
                    </div>

                    <!-- Navigation Arrows (hidden on mobile) -->
                    <button id="carousel-prev" class="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all hover:scale-110 z-10">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <button id="carousel-next" class="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all hover:scale-110 z-10">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>

                    <!-- Indicators -->
                    <div id="carousel-indicators" class="flex justify-center gap-2 mt-4">
                        <!-- Les indicateurs seront ajoutés ici dynamiquement -->
                    </div>
                </div>
            </div>
        </div>
        </section>

initCarousel();*/

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

