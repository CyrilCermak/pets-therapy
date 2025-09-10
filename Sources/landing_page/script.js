// Pets Therapy Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeThemeDetection();
    initializeThemeToggle();
    initializePetWalkingAnimations();
    initializeTrexShowcase();
    initializeSheepBlackShowcase();
    initializeApeChefShowcase();
    initializeCatBlueShowcase();
    initializeFeaturedPets();
    initializeScrollEffects();
    initializeInteractivity();
});

// Theme Detection and Background Management
function initializeThemeDetection() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeToggleState(savedTheme === 'dark');
    } else if (systemPrefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeToggleState(true);
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeToggleState(false);
    }

    updateBackground();

    // Listen for system theme changes only if no manual preference is set
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeToggleState(e.matches);
            updateBackground();
        }
    });
}

// Theme Toggle Functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-switch');

    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            const isDark = this.checked;
            const theme = isDark ? 'dark' : 'light';

            // Save preference
            localStorage.setItem('theme', theme);

            // Apply theme
            document.documentElement.setAttribute('data-theme', theme);

            // Update background
            updateBackground();

            // Add transition effect
            document.body.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        });
    }
}

function updateThemeToggleState(isDark) {
    const themeToggle = document.getElementById('theme-switch');
    if (themeToggle) {
        themeToggle.checked = isDark;
    }
}

function updateBackground() {
    const backgroundElement = document.querySelector('.background-mountains');
    const currentTheme = document.documentElement.getAttribute('data-theme');

    if (backgroundElement) {
        const imagePath = currentTheme === 'dark'
            ? './assets/pets/mountains_night-0.png'
            : './assets/pets/mountains-0.png';
        backgroundElement.style.backgroundImage = `url('${imagePath}')`;

        // Force hardware acceleration for iOS
        backgroundElement.style.webkitTransform = 'translate3d(0, 0, 0)';
        backgroundElement.style.transform = 'translate3d(0, 0, 0)';
        backgroundElement.style.webkitBackfaceVisibility = 'hidden';
        backgroundElement.style.backfaceVisibility = 'hidden';

        // Ensure fixed positioning works on iOS
        backgroundElement.style.position = 'fixed';
        backgroundElement.style.width = '100vw';
        backgroundElement.style.height = '100vh';
        backgroundElement.style.top = '0';
        backgroundElement.style.left = '0';
    }
}

// Generic Animal Showcase System
class AnimalAnimationSystem {
    constructor(config) {
        this.animalId = config.animalId;
        this.animalImage = document.getElementById(config.imageId);
        this.animalPet = document.getElementById(config.petId);
        this.assetPrefix = config.assetPrefix;
        this.currentAnimation = null;
        this.currentFrame = 0;
        this.animationTimer = null;
        this.movementTimer = null;
        this.autoScheduleTimer = null;
        this.isUserControlled = false;

        // Walking animation state
        this.position = 0;
        this.direction = 1; // 1 for right, -1 for left
        this.isGoingLeft = false;
        this.walkSpeed = config.walkSpeed || 0.7;

        // Animation configurations
        this.animations = config.animations;
        this.specialAnimations = config.specialAnimations || [];

        this.currentLoops = 0;

        // Preload all animation frames
        this.preloadAnimations().then(() => {
            // For ape_chef, start with idle since it has complex front animation
            if (this.animalId === 'ape_chef') {
                this.startAnimation('idle');
                this.scheduleRandomAnimations();
            } else {
                // Start with walking animation after preloading for all other animals
                this.startWalkingAnimation();
                this.scheduleRandomAnimations();
            }
        });

        // Add resize listener to recalculate bounds on screen changes
        window.addEventListener('resize', () => {
            this.recalculateBounds();
        });
    }

    preloadAnimations() {
        const preloadPromises = [];

        Object.keys(this.animations).forEach(animName => {
            const frameCount = this.animations[animName].frames;
            for (let i = 0; i < frameCount; i++) {
                const promise = new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    // For ape_chef idle, use front animation frames
                    const framePrefix = (this.animalId === 'ape_chef' && animName === 'idle') ? 'front' : animName;
                    img.src = `assets/pets/${this.assetPrefix}_${framePrefix}-${i}.png`;
                });
                preloadPromises.push(promise);
            }
        });

        return Promise.all(preloadPromises).then(() => {
            // Remove loading state when preloading is complete
            if (this.animalImage) {
                this.animalImage.style.opacity = '1';
                this.animalImage.style.filter = '';
                this.animalImage.style.transition = 'opacity 0.5s ease, filter 0.5s ease';
            }
        }).catch(error => {
            console.warn(`Some ${this.animalId} animation frames failed to load:`, error);
            // Still remove loading state even if some frames failed
            if (this.animalImage) {
                this.animalImage.style.opacity = '1';
                this.animalImage.style.filter = '';
            }
        });
    }

    startAnimation(animationName, userTriggered = false) {
        if (!this.animations[animationName]) return;

        // Clear existing animation timer
        if (this.animationTimer) {
            clearInterval(this.animationTimer);
        }
        if (this.autoScheduleTimer && userTriggered) {
            clearTimeout(this.autoScheduleTimer);
        }

        this.currentAnimation = animationName;
        this.currentFrame = 0;
        this.currentLoops = 0;
        this.isUserControlled = userTriggered;

        // Update UI button states - only highlight special animations, clear for walk/idle
        if (animationName === 'walk' || animationName === 'idle') {
            this.updateButtonStates(null); // Clear all button states for default animations
        } else {
            this.updateButtonStates(animationName); // Highlight button for special animations
        }

        // Handle walking animation specially - don't stop movement, just change frames
        if (animationName === 'walk') {
            this.startWalkingAnimation();
            return;
        } else {
            // For special animations, pause walking but keep position
            this.pauseWalkingMovement();
        }

        // Add visual effects
        if (userTriggered) {
            this.addAnimationEffects(animationName);
        }

        const config = this.animations[animationName];
        const frameInterval = 1000 / config.fps;

        this.animationTimer = setInterval(() => {
            this.updateFrame();
        }, frameInterval);
    }

    updateFrame() {
        if (!this.currentAnimation) return;

        const config = this.animations[this.currentAnimation];
        // For ape_chef idle, use front animation frames
        const framePrefix = (this.animalId === 'ape_chef' && this.currentAnimation === 'idle') ? 'front' : this.currentAnimation;
        const imagePath = `assets/pets/${this.assetPrefix}_${framePrefix}-${this.currentFrame}.png`;

        this.animalImage.src = imagePath;
        this.currentFrame++;

        // Check if animation cycle is complete
        if (this.currentFrame >= config.frames) {
            this.currentFrame = 0;
            this.currentLoops++;

            // Check if we've completed required loops
            if (config.loops > 0 && this.currentLoops >= config.loops) {
                this.completeAnimation();
            }
        }
    }

    completeAnimation() {
        clearInterval(this.animationTimer);
        this.animationTimer = null;

        // Clear button states when animation completes
        this.updateButtonStates(null);

        // Return to appropriate default animation after special animations
        setTimeout(() => {
            if (this.animalId === 'ape_chef') {
                this.startAnimation('idle');
            } else {
                this.startWalkingAnimation();
            }
            if (this.isUserControlled) {
                // Reset user control after a delay
                setTimeout(() => {
                    this.isUserControlled = false;
                    this.scheduleRandomAnimations();
                }, 3000);
            } else {
                this.scheduleRandomAnimations();
            }
        }, 500);
    }

    startWalkingAnimation() {
        this.currentAnimation = 'walk';

        // Get container bounds
        const container = this.animalPet.closest(`.${this.animalId}-display-area`) || this.animalPet.closest('.animal-display-area');
        const containerWidth = container ? container.offsetWidth : 400;
        const animalWidth = this.animalImage ? this.animalImage.offsetWidth : 200; // Responsive animal image width
        const maxPosition = containerWidth - animalWidth;

        // Initialize position if not set
        if (this.position === 0) {
            this.position = Math.random() * maxPosition;
        }

        // Start frame animation
        const config = this.animations.walk;
        const frameInterval = 1000 / config.fps;

        this.animationTimer = setInterval(() => {
            const imagePath = `assets/pets/${this.assetPrefix}_walk-${this.currentFrame}.png`;
            this.animalImage.src = imagePath;
            this.currentFrame = (this.currentFrame + 1) % config.frames;
        }, frameInterval);

        // Start movement animation
        this.movementTimer = setInterval(() => {
            this.updatePosition();
        }, 16); // ~60fps for smooth movement

        // Set initial position and styling
        this.animalPet.style.position = 'absolute';
        this.animalPet.style.left = this.position + 'px';
        this.animalPet.style.bottom = '2rem';
        this.animalPet.style.transform = this.isGoingLeft ? 'scaleX(-1)' : 'scaleX(1)';
    }

    pauseWalkingMovement() {
        if (this.movementTimer) {
            clearInterval(this.movementTimer);
            this.movementTimer = null;
        }
    }

    updatePosition() {
        // Get container bounds
        const container = this.animalPet.closest(`.${this.animalId}-display-area`) || this.animalPet.closest('.animal-display-area');
        const containerWidth = container ? container.offsetWidth : 400;
        const animalWidth = this.animalImage ? this.animalImage.offsetWidth : 200; // Responsive animal image width
        const maxPosition = containerWidth - animalWidth;

        // Update position
        this.position += this.direction * this.walkSpeed;

        // Check bounds and change direction
        if (this.position >= maxPosition && this.direction > 0) {
            this.direction = -1;
            this.isGoingLeft = true;
        } else if (this.position <= 0 && this.direction < 0) {
            this.direction = 1;
            this.isGoingLeft = false;
        }

        // Apply position and flip
        this.animalPet.style.left = this.position + 'px';
        this.animalPet.style.transform = this.isGoingLeft ? 'scaleX(-1)' : 'scaleX(1)';
    }

    scheduleRandomAnimations() {
        if (this.isUserControlled) return;

        // Schedule next random animation
        const delay = 5000 + Math.random() * 10000; // 5-15 seconds
        this.autoScheduleTimer = setTimeout(() => {
            if (!this.isUserControlled) {
                this.triggerRandomAnimation();
            }
        }, delay);
    }

    triggerRandomAnimation() {
        if (this.specialAnimations.length > 0) {
            const randomAnim = this.specialAnimations[Math.floor(Math.random() * this.specialAnimations.length)];
            this.startAnimation(randomAnim);
        }
    }

    updateButtonStates(activeAnimation) {
        const buttons = document.querySelectorAll(`#${this.animalId}Showcase .animation-btn`);
        console.log(activeAnimation)
        console.log(buttons)
        buttons.forEach(btn => {
            if (btn.dataset.animation === activeAnimation) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
                // Clear any inline styles that might override CSS
                btn.style.background = '';
                btn.style.color = '';
            }
        });
    }

    addAnimationEffects(animationName) {
        // Remove any existing animation effects
        this.animalImage.classList.remove('animal-bounce', 'animal-glow', `${this.animalId}-${animationName}-active`);

        // Add base effects
        this.animalImage.classList.add('animal-bounce', 'animal-glow');

        // Add animation-specific effects
        setTimeout(() => {
            this.animalImage.classList.add(`${this.animalId}-${animationName}-active`);
        }, 300);

        // Remove all effects after animation completes
        setTimeout(() => {
            this.animalImage.classList.remove('animal-bounce', 'animal-glow', `${this.animalId}-${animationName}-active`);
        }, 2000);
    }

    triggerUserAnimation(animationName) {
        this.startAnimation(animationName, true);
    }

    recalculateBounds() {
        // Recalculate container bounds when window is resized
        const container = this.animalPet.closest(`.${this.animalId}-display-area`) || this.animalPet.closest('.animal-display-area');
        if (container) {
            const containerWidth = container.offsetWidth;
            const animalWidth = this.animalImage ? this.animalImage.offsetWidth : 200; // Responsive animal image width
            const maxPosition = containerWidth - animalWidth;

            // Adjust position if it's out of bounds
            if (this.position > maxPosition) {
                this.position = maxPosition;
                this.animalPet.style.left = this.position + 'px';
            }
        }
    }
}

// Animal showcase configurations
const animalConfigs = {
    trex: {
        animalId: 'trex',
        imageId: 'trexImage',
        petId: 'trexPet',
        assetPrefix: 'trex_yellow',
        walkSpeed: 0.7,
        animations: {
            front: { frames: 15, loops: 2, fps: 10 },
            idle: { frames: 20, loops: -1, fps: 10 },
            eat: { frames: 10, loops: 4, fps: 10 },
            selfie: { frames: 11, loops: 2, fps: 10 },
            texting: { frames: 20, loops: 2, fps: 10 },
            roar: { frames: 14, loops: 3, fps: 10 },
            guitar: { frames: 19, loops: 3, fps: 10 },
            fireball: { frames: 13, loops: 2, fps: 10 },
            walk: { frames: 6, loops: -1, fps: 10 }
        },
        specialAnimations: ['eat', 'roar', 'guitar', 'selfie', 'texting', 'fireball']
    },
    sheep_black: {
        animalId: 'sheep_black',
        imageId: 'sheepBlackImage',
        petId: 'sheepBlackPet',
        assetPrefix: 'sheep_black',
        walkSpeed: 0.8,
        animations: {
            front: { frames: 9, loops: 2, fps: 10 },
            idle: { frames: 12, loops: -1, fps: 10 },
            eat: { frames: 38, loops: 3, fps: 10 },
            puke: { frames: 32, loops: 1, fps: 10 },
            walk: { frames: 8, loops: -1, fps: 10 }
        },
        specialAnimations: ['eat', 'puke']
    },
    ape_chef: {
        animalId: 'ape_chef',
        imageId: 'apeChefImage',
        petId: 'apeChefPet',
        assetPrefix: 'ape_chef',
        walkSpeed: 0.7,
        animations: {
            front: { frames: 33, loops: 5, fps: 10 },
            idle: { frames: 33, loops: -1, fps: 10 }, // Use front as idle
            eat: { frames: 32, loops: 5, fps: 10 },
            sleep: { frames: 8, loops: 20, fps: 10 },
            angry: { frames: 16, loops: 3, fps: 10 },
            walk: { frames: 8, loops: -1, fps: 10 }
        },
        specialAnimations: ['eat', 'sleep', 'angry']
    },
    cat_blue: {
        animalId: 'cat_blue',
        imageId: 'catBlueImage',
        petId: 'catBluePet',
        assetPrefix: 'cat_blue',
        walkSpeed: 0.8,
        animations: {
            front: { frames: 6, loops: 5, fps: 10 },
            idle: { frames: 6, loops: 2, fps: 10 },
            eat: { frames: 9, loops: 10, fps: 10 },
            sleep: { frames: 6, loops: 50, fps: 10 },
            walk: { frames: 8, loops: -1, fps: 10 }
        },
        specialAnimations: ['eat', 'sleep']
    }
};

function initializeAnimalShowcase(animalId) {
    const config = animalConfigs[animalId];
    if (!config) return;

    // Show loading state
    const animalImage = document.getElementById(config.imageId);
    if (animalImage) {
        animalImage.style.opacity = '0.5';
        animalImage.style.filter = 'blur(2px)';
    }

    // Initialize animal animation system
    const animalSystem = new AnimalAnimationSystem(config);

    // Set up animation button handlers
    const showcase = document.getElementById(`${animalId}Showcase`);
    if (showcase) {
        const animationButtons = showcase.querySelectorAll('.animation-btn');
        animationButtons.forEach(button => {
            button.addEventListener('click', function() {
                const animationName = this.dataset.animation;

                // Only trigger if animal system is ready
                if (animalSystem && animalSystem.animalImage && animalSystem.animalImage.style.opacity !== '0.5') {
                    animalSystem.triggerUserAnimation(animationName);

                    // Add click feedback with ripple effect
                    this.style.transform = 'scale(0.95)';
                    this.style.boxShadow = '0 0 20px rgba(255, 45, 146, 0.6)';

                    setTimeout(() => {
                        this.style.transform = '';
                        this.style.boxShadow = '';
                    }, 300);

                    // Remove the problematic inline style override
                    // The CSS .active class will handle the styling
                }
            });

            // Add hover effects
            button.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'translateY(-2px)';
                }
            });

            button.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = '';
                }
            });
        });

        // Add showcase to intersection observer for fade-in
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        observer.observe(showcase);
    }

    // Store reference for external access
    window[`${animalId}System`] = animalSystem;

    return animalSystem;
}

function initializeTrexShowcase() {
    return initializeAnimalShowcase('trex');
}

function initializeSheepBlackShowcase() {
    return initializeAnimalShowcase('sheep_black');
}

function initializeApeChefShowcase() {
    return initializeAnimalShowcase('ape_chef');
}

function initializeCatBlueShowcase() {
    return initializeAnimalShowcase('cat_blue');
}

// Featured Pets Data and Display
const featuredPets = [
    {
        id: 'ape',
        name: 'Ape',
        category: 'Forest Friend',
        tags: ['forest'],
        description: 'Playful forest companion'
    },
    {
        id: 'cat',
        name: 'Cat',
        category: 'House Companion',
        tags: ['cats'],
        description: 'Classic feline friend'
    },
    {
        id: 'panda',
        name: 'Panda',
        category: 'Zen Master',
        tags: ['forest'],
        description: 'Peaceful bamboo lover'
    },
    {
        id: 'trex',
        name: 'T-Rex',
        category: 'Prehistoric Superstar',
        tags: ['dinos', 'memes', 'advanced'],
        description: 'Ultimate digital companion with 8+ unique animations including roar, guitar, fireball, and selfie modes'
    },
    {
        id: 'sheep_black',
        name: 'Black Sheep',
        category: 'Forest Rebel',
        tags: ['forest', 'memes'],
        description: 'The rebel of the flock with eating and unique personality animations'
    },
    {
        id: 'ape_chef',
        name: 'Ape Chef',
        category: 'Culinary Master',
        tags: ['forest', 'chef'],
        description: 'Professional chef with cooking, sleeping, and emotional animations including angry outbursts'
    },
    {
        id: 'cat_blue',
        name: 'Blue Cat',
        category: 'Feline Friend',
        tags: ['cats'],
        description: 'Classic cat behavior with eating, sleeping, and idle animations - perfect feline companion'
    },
    {
        id: 'betta',
        name: 'Betta Fish',
        category: 'Aquatic Acrobat',
        tags: ['water'],
        description: 'Graceful swimming companion'
    },
    {
        id: 'crow',
        name: 'Crow',
        category: 'Sky Wanderer',
        tags: ['birds'],
        description: 'Intelligent flying friend'
    },
    {
        id: 'frog',
        name: 'Frog',
        category: 'Pond Hopper',
        tags: ['forest'],
        description: 'Cheerful amphibian buddy'
    },
    {
        id: 'shiba',
        name: 'Shiba Inu',
        category: 'Meme Legend',
        tags: ['memes', 'forest'],
        description: 'Much wow, very companion'
    }
];

function initializeFeaturedPets() {
    const grid = document.getElementById('featuredPetsGrid');
    if (!grid) return;

    featuredPets.forEach(pet => {
        const petCard = createFeaturedPetCard(pet);
        grid.appendChild(petCard);
    });

    // Add promotional tile for 60+ pets
    const promoTile = createPromoTile();
    grid.appendChild(promoTile);
}

function createFeaturedPetCard(pet) {
    const card = document.createElement('div');
    card.className = 'featured-pet-card';
    card.dataset.species = pet.id;

    card.innerHTML = `
        <div class="featured-pet-image">
            <img src="assets/pets/${pet.id}_front-0.png" alt="${pet.name}" />
        </div>
        <div class="featured-pet-name">${pet.name}</div>
        <div class="featured-pet-category">${pet.category}</div>
    `;

    // Add hover effect
    card.addEventListener('mouseenter', function() {
        const img = this.querySelector('img');
        if (img) {
            img.style.filter = 'drop-shadow(0 0 15px rgba(255, 45, 146, 0.5))';
        }
    });

    card.addEventListener('mouseleave', function() {
        const img = this.querySelector('img');
        if (img) {
            img.style.filter = '';
        }
    });

    // Add click interaction
    card.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (img && pet.id !== 'ape') {
            triggerPetAnimation(img);
        }
    });

    return card;
}

function createPromoTile() {
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

    // Add click handler to download
    tile.addEventListener('click', function() {
        // Scroll to download section
        const downloadSection = document.getElementById('download');
        if (downloadSection) {
            downloadSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Add click animation
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });

    // Add hover effects
    tile.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    tile.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });

    return tile;
}

// Pet Walking Animations
function initializePetWalkingAnimations() {
    const petImages = document.querySelectorAll('.pet-image[data-species="ape"]');

    petImages.forEach((img, index) => {
        // Start walking animation for ape pets
        if (img.dataset.species === 'ape') {
            startWalkingAnimation(img, index);
        }

        // Keep click interactions for other pets
        img.addEventListener('click', function() {
            if (this.dataset.species !== 'ape') {
                triggerPetAnimation(this);
            }
        });
    });
}

function startWalkingAnimation(apeElement, index) {
    // Animation settings from ape.json
    const fps = 10;
    const speed = 0.7;
    const frameInterval = 1000 / fps; // 100ms per frame

    // Walk animation frames
    const walkFrames = [
        'assets/pets/ape_walk-0.png',
        'assets/pets/ape_walk-1.png',
        'assets/pets/ape_walk-2.png',
        'assets/pets/ape_walk-3.png',
        'assets/pets/ape_walk-4.png',
        'assets/pets/ape_walk-5.png',
        'assets/pets/ape_walk-6.png',
        'assets/pets/ape_walk-7.png'
    ];

    // Animation state
    let currentFrame = 0;
    let position = 0;
    let direction = 1; // 1 for right, -1 for left
    let isGoingLeft = false;

    // Get container bounds
    const container = apeElement.closest('.hero-pets-showcase');
    const containerWidth = container ? container.offsetWidth : window.innerWidth;
    const apeWidth = apeElement.offsetWidth || 120;
    const maxPosition = containerWidth - apeWidth;

    // Stagger starting position for multiple apes
    position = (index * 100) % maxPosition;

    // Frame animation function
    function updateFrame() {
        apeElement.src = walkFrames[currentFrame];
        currentFrame = (currentFrame + 1) % walkFrames.length;
    }

    // Movement animation function
    function updatePosition() {
        // Update position
        position += direction * speed;

        // Check bounds and change direction
        if (position >= maxPosition && direction > 0) {
            direction = -1;
            isGoingLeft = true;
        } else if (position <= 0 && direction < 0) {
            direction = 1;
            isGoingLeft = false;
        }

        // Apply position and flip
        const parentElement = apeElement.closest('.floating-pet');
        if (parentElement) {
            parentElement.style.left = position + 'px';

            // FlipHorizontallyWhenGoingLeft capability
            if (isGoingLeft) {
                apeElement.style.transform = 'scaleX(-1)';
            } else {
                apeElement.style.transform = 'scaleX(1)';
            }
        }
    }

    // Start frame animation
    const frameTimer = setInterval(updateFrame, frameInterval);

    // Start movement animation (smoother than frame rate)
    const movementTimer = setInterval(updatePosition, 16); // ~60fps for smooth movement

    // Store timers for potential cleanup
    apeElement._walkingTimers = {
        frame: frameTimer,
        movement: movementTimer
    };

    // Set initial position
    const parentElement = apeElement.closest('.floating-pet');
    if (parentElement) {
        parentElement.style.position = 'absolute';
        parentElement.style.left = position + 'px';
    }
}

function stopWalkingAnimation(apeElement) {
    if (apeElement._walkingTimers) {
        clearInterval(apeElement._walkingTimers.frame);
        clearInterval(apeElement._walkingTimers.movement);
        delete apeElement._walkingTimers;
    }
}

// Legacy pet animation for non-walking pets
function triggerPetAnimation(petElement) {
    // Add a bounce effect when clicked
    petElement.style.transform = 'scale(1.3) rotate(5deg)';

    setTimeout(() => {
        petElement.style.transform = 'scale(1.1) rotate(0deg)';
    }, 200);

    setTimeout(() => {
        petElement.style.transform = 'scale(1.0)';
    }, 400);

    // Add a temporary glow effect with pink color
    petElement.style.filter = 'drop-shadow(0 0 20px rgba(255, 45, 146, 0.8))';
    setTimeout(() => {
        petElement.style.filter = '';
    }, 1000);
}

function addIdleAnimation(petElement) {
    const animations = ['wiggle', 'bounce', 'pulse'];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];

    petElement.classList.add(randomAnimation);

    setTimeout(() => {
        petElement.classList.remove(randomAnimation);
    }, 1000);
}

// Scroll Effects
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe pet cards and features
    const animatedElements = document.querySelectorAll('.pet-card, .feature, .download-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Interactive Features
function initializeInteractivity() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Pet card hover effects
    const petCards = document.querySelectorAll('.pet-card');
    petCards.forEach(card => {
        const petImage = card.querySelector('.pet-preview');

        card.addEventListener('mouseenter', function() {
            if (petImage) {
                addHoverGlow(petImage);
            }
        });

        card.addEventListener('mouseleave', function() {
            if (petImage) {
                removeHoverGlow(petImage);
            }
        });
    });

    // Download button interactions - let real URLs work, only prevent # links
    const downloadButtons = document.querySelectorAll('.btn-primary');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#' || this.getAttribute('href') === '#download') {
                e.preventDefault();
                showDownloadModal();
            }
            // Real App Store links will work normally without preventDefault
        });
    });
}

function addHoverGlow(element) {
    element.style.filter = 'drop-shadow(0 0 15px rgba(255, 45, 146, 0.5))';
}

function removeHoverGlow(element) {
    element.style.filter = '';
}

function showDownloadModal() {
    // Simple alert for now - could be replaced with a proper modal
    alert('Download coming soon! This is a demo landing page for the Pets Therapy app.');
}

// Add CSS for additional animations
const additionalStyles = `
    .wiggle {
        animation: wiggle 0.5s ease-in-out;
    }

    .bounce {
        animation: bounce 0.6s ease-in-out;
    }

    .pulse {
        animation: pulse 0.8s ease-in-out;
    }

    @keyframes wiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-5deg); }
        75% { transform: rotate(5deg); }
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .pet-card, .feature, .download-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .pet-image {
        transition: all 0.3s ease;
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
    }

    .floating-pet {
        position: absolute !important;
        z-index: 10;
    }

    .hero-pets-showcase {
        position: relative;
        overflow: hidden;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Performance optimizations
function optimizePerformance() {
    // Preload critical images including walk frames
    const criticalImages = [
        'assets/pets/mountains-0.png',
        'assets/pets/mountains_night-0.png',
        // Preload walk animation frames
        'assets/pets/ape_walk-0.png',
        'assets/pets/ape_walk-1.png',
        'assets/pets/ape_walk-2.png',
        'assets/pets/ape_walk-3.png',
        'assets/pets/ape_walk-4.png',
        'assets/pets/ape_walk-5.png',
        'assets/pets/ape_walk-6.png',
        'assets/pets/ape_walk-7.png',
        // Preload T-Rex front frame for initial display
        'assets/pets/trex_yellow_front-0.png'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize performance optimizations
optimizePerformance();

// Handle window resize to recalculate bounds
window.addEventListener('resize', function() {
    const apeImages = document.querySelectorAll('.pet-image[data-species="ape"]');
    apeImages.forEach(img => {
        // Restart walking animation with new bounds
        stopWalkingAnimation(img);
        setTimeout(() => {
            startWalkingAnimation(img, 0);
        }, 100);
    });

    // Also handle animal bounds recalculation
    Object.keys(animalConfigs).forEach(animalId => {
        const system = window[`${animalId}System`];
        if (system) {
            system.recalculateBounds();
        }
    });
});

// Export functions for potential external use
window.PetsTherapy = {
    startWalkingAnimation,
    stopWalkingAnimation,
    triggerPetAnimation,
    addIdleAnimation,
    showDownloadModal,
    toggleTheme: function() {
        const themeToggle = document.getElementById('theme-switch');
        if (themeToggle) {
            themeToggle.checked = !themeToggle.checked;
            themeToggle.dispatchEvent(new Event('change'));
        }
    },
    setTheme: function(theme) {
        if (theme === 'dark' || theme === 'light') {
            localStorage.setItem('theme', theme);
            document.documentElement.setAttribute('data-theme', theme);
            updateThemeToggleState(theme === 'dark');
            updateBackground();
        }
    },
    getTheme: function() {
        return document.documentElement.getAttribute('data-theme');
    },
    // Animal specific functions
    triggerAnimalAnimation: function(animalId, animationName) {
        const system = window[`${animalId}System`];
        if (system) {
            system.triggerUserAnimation(animationName);
        }
    },
    triggerTrexAnimation: function(animationName) {
        return this.triggerAnimalAnimation('trex', animationName);
    },
    triggerSheepBlackAnimation: function(animationName) {
        return this.triggerAnimalAnimation('sheep_black', animationName);
    },
    triggerApeChefAnimation: function(animationName) {
        return this.triggerAnimalAnimation('ape_chef', animationName);
    },
    triggerCatBlueAnimation: function(animationName) {
        return this.triggerAnimalAnimation('cat_blue', animationName);
    },
    getAnimalCurrentAnimation: function(animalId) {
        const system = window[`${animalId}System`];
        return system ? system.currentAnimation : null;
    },
    getTrexCurrentAnimation: function() {
        return this.getAnimalCurrentAnimation('trex');
    },
    getSheepBlackCurrentAnimation: function() {
        return this.getAnimalCurrentAnimation('sheep_black');
    },
    getApeChefCurrentAnimation: function() {
        return this.getAnimalCurrentAnimation('ape_chef');
    },
    getCatBlueCurrentAnimation: function() {
        return this.getAnimalCurrentAnimation('cat_blue');
    }
};
