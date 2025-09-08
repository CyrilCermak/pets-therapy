// Pets Therapy Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeThemeDetection();
    initializeThemeToggle();
    initializePetWalkingAnimations();
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
            ? '../../PetsAssets/mountains_night-0.png'
            : '../../PetsAssets/mountains-0.png';
        backgroundElement.style.backgroundImage = `url('${imagePath}')`;
    }
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
        category: 'Prehistoric Pal',
        tags: ['dinos', 'memes'],
        description: 'Mighty dinosaur companion'
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
}

function createFeaturedPetCard(pet) {
    const card = document.createElement('div');
    card.className = 'featured-pet-card';
    card.dataset.species = pet.id;

    card.innerHTML = `
        <div class="featured-pet-image">
            <img src="../../PetsAssets/${pet.id}_front-0.png" alt="${pet.name}" />
        </div>
        <div class="featured-pet-name">${pet.name}</div>
        <div class="featured-pet-category">${pet.category}</div>
        <div class="featured-pet-tags">
            ${pet.tags.map(tag => `<span class="featured-pet-tag">${tag}</span>`).join('')}
        </div>
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
        '../../PetsAssets/ape_walk-0.png',
        '../../PetsAssets/ape_walk-1.png',
        '../../PetsAssets/ape_walk-2.png',
        '../../PetsAssets/ape_walk-3.png',
        '../../PetsAssets/ape_walk-4.png',
        '../../PetsAssets/ape_walk-5.png',
        '../../PetsAssets/ape_walk-6.png',
        '../../PetsAssets/ape_walk-7.png'
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

    // Download button interactions
    const downloadButtons = document.querySelectorAll('.btn-primary');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#' || this.getAttribute('href') === '#download') {
                e.preventDefault();
                showDownloadModal();
            }
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
        '../../PetsAssets/mountains-0.png',
        '../../PetsAssets/mountains_night-0.png',
        // Preload walk animation frames
        '../../PetsAssets/ape_walk-0.png',
        '../../PetsAssets/ape_walk-1.png',
        '../../PetsAssets/ape_walk-2.png',
        '../../PetsAssets/ape_walk-3.png',
        '../../PetsAssets/ape_walk-4.png',
        '../../PetsAssets/ape_walk-5.png',
        '../../PetsAssets/ape_walk-6.png',
        '../../PetsAssets/ape_walk-7.png'
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
    }
};
