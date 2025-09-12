// UI Interactions and Effects for Pets Therapy Landing Page
// Non-module version for better compatibility

(function() {
    'use strict';

    // Get configuration from global scope
    const config = window.PetsTherapyConfig;
    const { featuredPets, criticalImages } = config;

    class UIInteractionManager {
        constructor() {
            this.intersectionObserver = null;
        }

        initialize() {
            this.initializeFeaturedPets();
            this.initializeScrollEffects();
            this.initializeInteractivity();
            this.initializePerformanceOptimizations();
        }

        initializeFeaturedPets() {
            const grid = document.getElementById('featuredPetsGrid');
            if (!grid) return;

            featuredPets.forEach(pet => {
                const petCard = this.createFeaturedPetCard(pet);
                grid.appendChild(petCard);
            });

            // Add promotional tile for 60+ pets
            const promoTile = this.createPromoTile();
            grid.appendChild(promoTile);
        }

        createFeaturedPetCard(pet) {
            const card = document.createElement('div');
            card.className = 'featured-pet-card';
            card.dataset.species = pet.id;

            card.innerHTML = `
                <div class="featured-pet-image">
                    <img src="./assets/pets/${pet.id}_front-0.png" alt="${pet.name}" />
                </div>
                <div class="featured-pet-name">${pet.name}</div>
                <div class="featured-pet-category">${pet.category}</div>
            `;

            this.setupPetCardInteractions(card, pet);
            return card;
        }

        setupPetCardInteractions(card, pet) {
            const img = card.querySelector('img');

            card.addEventListener('mouseenter', () => {
                if (img) {
                    img.style.filter = 'drop-shadow(0 0 15px rgba(255, 45, 146, 0.5))';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (img) {
                    img.style.filter = '';
                }
            });

            // Add click interaction for non-ape pets
            if (pet.id !== 'ape') {
                card.addEventListener('click', () => {
                    if (img) {
                        this.triggerPetClickAnimation(img);
                    }
                });
            }
        }

        createPromoTile() {
            const tile = document.createElement('div');
            tile.className = 'featured-pet-card promo-tile';

            tile.innerHTML = `
                <div class="promo-tile-content">
                    <div class="promo-icon">
                        <span class="promo-number">60+</span>
                        <div class="promo-pets-preview">
                            <span class="promo-emoji">🦖</span>
                            <span class="promo-emoji">🐱</span>
                            <span class="promo-emoji">🐑</span>
                            <span class="promo-emoji">🐸</span>
                        </div>
                    </div>
                    <div class="promo-text">
                        <h3 class="promo-title">60+ Pets Waiting</h3>
                        <p class="promo-description">Discover the complete collection of digital companions that will roam your Mac desktop</p>
                        <div class="promo-cta">
                            <span class="promo-arrow">→</span>
                            Download Now
                        </div>
                    </div>
                </div>
            `;

            this.setupPromoTileInteractions(tile);
            return tile;
        }

        setupPromoTileInteractions(tile) {
            tile.addEventListener('click', () => {
                const downloadSection = document.getElementById('download');
                if (downloadSection) {
                    downloadSection.scrollIntoView({ behavior: 'smooth' });
                }

                tile.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    tile.style.transform = '';
                }, 150);
            });

            tile.addEventListener('mouseenter', () => {
                tile.style.transform = 'translateY(-10px) scale(1.02)';
            });

            tile.addEventListener('mouseleave', () => {
                tile.style.transform = '';
            });
        }

        triggerPetClickAnimation(petElement) {
            const bounceSequence = [
                { transform: 'scale(1.3) rotate(5deg)', duration: 0 },
                { transform: 'scale(1.1) rotate(0deg)', duration: 200 },
                { transform: 'scale(1.0)', duration: 400 }
            ];

            bounceSequence.forEach(({ transform, duration }) => {
                setTimeout(() => {
                    petElement.style.transform = transform;
                }, duration);
            });

            petElement.style.filter = 'drop-shadow(0 0 20px rgba(255, 45, 146, 0.8))';
            setTimeout(() => {
                petElement.style.filter = '';
            }, 1000);
        }

        initializeScrollEffects() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            this.intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            }, observerOptions);

            // Observe elements that should fade in
            const animatedElements = document.querySelectorAll('.pet-card, .feature, .download-card');
            animatedElements.forEach(el => {
                this.intersectionObserver.observe(el);
            });
        }

        initializeInteractivity() {
            this.setupSmoothScrolling();
            this.setupPetCardHoverEffects();
            this.setupDownloadButtonInteractions();
        }

        setupSmoothScrolling() {
            const navLinks = document.querySelectorAll('a[href^="#"]');
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(link.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }

        setupPetCardHoverEffects() {
            const petCards = document.querySelectorAll('.pet-card');
            petCards.forEach(card => {
                const petImage = card.querySelector('.pet-preview');

                card.addEventListener('mouseenter', () => {
                    if (petImage) {
                        this.addHoverGlow(petImage);
                    }
                });

                card.addEventListener('mouseleave', () => {
                    if (petImage) {
                        this.removeHoverGlow(petImage);
                    }
                });
            });
        }

        setupDownloadButtonInteractions() {
            const downloadButtons = document.querySelectorAll('.btn-primary');
            downloadButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    // Only prevent default for demo links
                    if (button.getAttribute('href') === '#' || button.getAttribute('href') === '#download') {
                        e.preventDefault();
                        this.showDownloadModal();
                    }
                    // Real App Store links work normally
                });
            });
        }

        addHoverGlow(element) {
            element.style.filter = 'drop-shadow(0 0 15px rgba(255, 45, 146, 0.5))';
        }

        removeHoverGlow(element) {
            element.style.filter = '';
        }

        showDownloadModal() {
            // Simple alert for demo - could be replaced with a proper modal
            alert('Download coming soon! This is a demo landing page for the Pets Therapy app.');
        }

        initializePerformanceOptimizations() {
            this.preloadCriticalImages();
        }

        preloadCriticalImages() {
            criticalImages.forEach(src => {
                const img = new Image();
                img.src = src;
            });
        }

        // Utility method to add idle animation to any element
        addIdleAnimation(element) {
            const animations = ['wiggle', 'bounce', 'pulse'];
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];

            element.classList.add(randomAnimation);

            setTimeout(() => {
                element.classList.remove(randomAnimation);
            }, 1000);
        }

        // Clean up resources
        destroy() {
            if (this.intersectionObserver) {
                this.intersectionObserver.disconnect();
                this.intersectionObserver = null;
            }
        }
    }

    // Expose to global scope
    window.PetsTherapyUI = {
        UIInteractionManager,
        // Utility functions for external use
        triggerPetAnimation: function(petElement) {
            const manager = new UIInteractionManager();
            manager.triggerPetClickAnimation(petElement);
        },
        addIdleAnimation: function(petElement) {
            const manager = new UIInteractionManager();
            manager.addIdleAnimation(petElement);
        },
        showDownloadModal: function() {
            const manager = new UIInteractionManager();
            manager.showDownloadModal();
        }
    };
})();