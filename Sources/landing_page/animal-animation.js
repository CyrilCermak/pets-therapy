// Animal Animation System for Pets Therapy Landing Page
// Non-module version for better compatibility

(function() {
    'use strict';

    // Get configuration from global scope
    const config = window.PetsTherapyConfig;
    const { animalConfigs, assetPaths, animationSettings } = config;

    class AnimalAnimationSystem {
        constructor(animalConfig) {
            this.animalId = animalConfig.animalId;
            this.animalImage = document.getElementById(animalConfig.imageId);
            this.animalPet = document.getElementById(animalConfig.petId);
            this.assetPrefix = animalConfig.assetPrefix;
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
            this.walkSpeed = animalConfig.walkSpeed || 0.7;

            // Animation configurations
            this.animations = animalConfig.animations;
            this.specialAnimations = animalConfig.specialAnimations || [];
            this.currentLoops = 0;

            this.init();
        }

        async init() {
            try {
                await this.preloadAnimations();
                this.startDefaultAnimation();
                this.scheduleRandomAnimations();
                this.setupResizeListener();
            } catch (error) {
                console.warn(`Failed to initialize ${this.animalId} animation system:`, error);
                this.showFallbackState();
            }
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
                        const framePrefix = (this.animalId === 'ape_chef' && animName === 'idle') ? 'front' : animName;
                        img.src = `${assetPaths.pets}${this.assetPrefix}_${framePrefix}-${i}.png`;
                    });
                    preloadPromises.push(promise);
                }
            });

            return Promise.all(preloadPromises).then(() => {
                this.setImageReady();
            }).catch(error => {
                console.warn(`Some ${this.animalId} animation frames failed to load:`, error);
                this.setImageReady();
            });
        }

        setImageReady() {
            if (this.animalImage) {
                this.animalImage.style.opacity = '1';
                this.animalImage.style.filter = '';
                this.animalImage.style.transition = 'opacity 0.5s ease, filter 0.5s ease';
            }
        }

        showFallbackState() {
            if (this.animalImage) {
                this.animalImage.style.opacity = '0.7';
                this.animalImage.style.filter = 'grayscale(50%)';
            }
        }

        startDefaultAnimation() {
            if (this.animalId === 'ape_chef') {
                this.startAnimation('idle');
            } else {
                this.startWalkingAnimation();
            }
        }

        startAnimation(animationName, userTriggered = false) {
            if (!this.animations[animationName]) {
                console.warn(`Animation '${animationName}' not found for ${this.animalId}`);
                return;
            }

            this.clearTimers();
            
            this.currentAnimation = animationName;
            this.currentFrame = 0;
            this.currentLoops = 0;
            this.isUserControlled = userTriggered;

            this.updateButtonStates(animationName);

            if (animationName === 'walk') {
                this.startWalkingAnimation();
                return;
            } else {
                this.pauseWalkingMovement();
            }

            if (userTriggered) {
                this.addAnimationEffects(animationName);
            }

            const animConfig = this.animations[animationName];
            const frameInterval = 1000 / animConfig.fps;

            this.animationTimer = setInterval(() => {
                this.updateFrame();
            }, frameInterval);
        }

        updateFrame() {
            if (!this.currentAnimation || !this.animalImage) return;

            const animConfig = this.animations[this.currentAnimation];
            const framePrefix = (this.animalId === 'ape_chef' && this.currentAnimation === 'idle') ? 'front' : this.currentAnimation;
            const imagePath = `${assetPaths.pets}${this.assetPrefix}_${framePrefix}-${this.currentFrame}.png`;

            this.animalImage.src = imagePath;
            this.currentFrame++;

            if (this.currentFrame >= animConfig.frames) {
                this.currentFrame = 0;
                this.currentLoops++;

                if (animConfig.loops > 0 && this.currentLoops >= animConfig.loops) {
                    this.completeAnimation();
                }
            }
        }

        completeAnimation() {
            this.clearTimers();
            this.updateButtonStates(null);

            setTimeout(() => {
                this.startDefaultAnimation();
                if (this.isUserControlled) {
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
            this.setupWalkingBounds();
            this.startFrameAnimation();
            this.startMovementAnimation();
        }

        setupWalkingBounds() {
            const container = this.animalPet.closest(`.${this.animalId}-display-area`) || 
                             this.animalPet.closest('.animal-display-area');
            const containerWidth = container ? container.offsetWidth : 400;
            const animalWidth = this.animalImage ? this.animalImage.offsetWidth : 200;
            const maxPosition = containerWidth - animalWidth;

            if (this.position === 0) {
                this.position = Math.random() * maxPosition;
            }

            this.animalPet.style.position = 'absolute';
            this.animalPet.style.left = this.position + 'px';
            this.animalPet.style.bottom = '2rem';
            this.animalPet.style.transform = this.isGoingLeft ? 'scaleX(-1)' : 'scaleX(1)';
        }

        startFrameAnimation() {
            const animConfig = this.animations.walk;
            const frameInterval = 1000 / animConfig.fps;

            this.animationTimer = setInterval(() => {
                if (this.animalImage) {
                    const imagePath = `${assetPaths.pets}${this.assetPrefix}_walk-${this.currentFrame}.png`;
                    this.animalImage.src = imagePath;
                    this.currentFrame = (this.currentFrame + 1) % animConfig.frames;
                }
            }, frameInterval);
        }

        startMovementAnimation() {
            this.movementTimer = setInterval(() => {
                this.updatePosition();
            }, animationSettings.frameInterval);
        }

        updatePosition() {
            const container = this.animalPet.closest(`.${this.animalId}-display-area`) || 
                             this.animalPet.closest('.animal-display-area');
            const containerWidth = container ? container.offsetWidth : 400;
            const animalWidth = this.animalImage ? this.animalImage.offsetWidth : 200;
            const maxPosition = containerWidth - animalWidth;

            this.position += this.direction * this.walkSpeed;

            if (this.position >= maxPosition && this.direction > 0) {
                this.direction = -1;
                this.isGoingLeft = true;
            } else if (this.position <= 0 && this.direction < 0) {
                this.direction = 1;
                this.isGoingLeft = false;
            }

            this.animalPet.style.left = this.position + 'px';
            this.animalPet.style.transform = this.isGoingLeft ? 'scaleX(-1)' : 'scaleX(1)';
        }

        pauseWalkingMovement() {
            if (this.movementTimer) {
                clearInterval(this.movementTimer);
                this.movementTimer = null;
            }
        }

        scheduleRandomAnimations() {
            if (this.isUserControlled) return;

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
            buttons.forEach(btn => {
                if (btn.dataset.animation === activeAnimation) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                    btn.style.background = '';
                    btn.style.color = '';
                }
            });
        }

        addAnimationEffects(animationName) {
            if (!this.animalImage) return;

            this.animalImage.classList.remove('animal-bounce', 'animal-glow', `${this.animalId}-${animationName}-active`);
            this.animalImage.classList.add('animal-bounce', 'animal-glow');

            setTimeout(() => {
                this.animalImage.classList.add(`${this.animalId}-${animationName}-active`);
            }, 300);

            setTimeout(() => {
                this.animalImage.classList.remove('animal-bounce', 'animal-glow', `${this.animalId}-${animationName}-active`);
            }, 2000);
        }

        triggerUserAnimation(animationName) {
            this.startAnimation(animationName, true);
        }

        recalculateBounds() {
            const container = this.animalPet.closest(`.${this.animalId}-display-area`) || 
                             this.animalPet.closest('.animal-display-area');
            if (container) {
                const containerWidth = container.offsetWidth;
                const animalWidth = this.animalImage ? this.animalImage.offsetWidth : 200;
                const maxPosition = containerWidth - animalWidth;

                if (this.position > maxPosition) {
                    this.position = maxPosition;
                    this.animalPet.style.left = this.position + 'px';
                }
            }
        }

        setupResizeListener() {
            window.addEventListener('resize', () => {
                this.recalculateBounds();
            });
        }

        clearTimers() {
            if (this.animationTimer) {
                clearInterval(this.animationTimer);
                this.animationTimer = null;
            }
            if (this.autoScheduleTimer) {
                clearTimeout(this.autoScheduleTimer);
                this.autoScheduleTimer = null;
            }
        }

        destroy() {
            this.clearTimers();
            this.pauseWalkingMovement();
        }
    }

    // Animal showcase management
    class AnimalShowcaseManager {
        constructor() {
            this.animalSystems = new Map();
        }

        initializeAnimal(animalId) {
            const animalConfig = animalConfigs[animalId];
            if (!animalConfig) {
                console.warn(`No configuration found for animal: ${animalId}`);
                return null;
            }

            // Show loading state
            const animalImage = document.getElementById(animalConfig.imageId);
            if (animalImage) {
                animalImage.style.opacity = '0.5';
                animalImage.style.filter = 'blur(2px)';
            }

            const animalSystem = new AnimalAnimationSystem(animalConfig);
            this.animalSystems.set(animalId, animalSystem);

            this.setupAnimationButtons(animalId);
            this.setupIntersectionObserver(animalId);

            return animalSystem;
        }

        setupAnimationButtons(animalId) {
            const showcase = document.getElementById(`${animalId}Showcase`);
            if (!showcase) return;

            const animationButtons = showcase.querySelectorAll('.animation-btn');
            animationButtons.forEach(button => {
                button.addEventListener('click', (e) => this.handleAnimationButtonClick(e, animalId));
                this.setupButtonHoverEffects(button);
            });
        }

        handleAnimationButtonClick(event, animalId) {
            const button = event.currentTarget;
            const animationName = button.dataset.animation;
            const animalSystem = this.animalSystems.get(animalId);

            if (animalSystem && animalSystem.animalImage && animalSystem.animalImage.style.opacity !== '0.5') {
                animalSystem.triggerUserAnimation(animationName);
                this.addButtonClickEffect(button);
            }
        }

        setupButtonHoverEffects(button) {
            button.addEventListener('mouseenter', () => {
                if (!button.classList.contains('active')) {
                    button.style.transform = 'translateY(-2px)';
                }
            });

            button.addEventListener('mouseleave', () => {
                if (!button.classList.contains('active')) {
                    button.style.transform = '';
                }
            });
        }

        addButtonClickEffect(button) {
            button.style.transform = 'scale(0.95)';
            button.style.boxShadow = '0 0 20px rgba(255, 45, 146, 0.6)';

            setTimeout(() => {
                button.style.transform = '';
                button.style.boxShadow = '';
            }, 300);
        }

        setupIntersectionObserver(animalId) {
            const showcase = document.getElementById(`${animalId}Showcase`);
            if (!showcase) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(showcase);
        }

        getAnimalSystem(animalId) {
            return this.animalSystems.get(animalId);
        }

        triggerAnimalAnimation(animalId, animationName) {
            const system = this.animalSystems.get(animalId);
            if (system) {
                system.triggerUserAnimation(animationName);
            }
        }

        getCurrentAnimation(animalId) {
            const system = this.animalSystems.get(animalId);
            return system ? system.currentAnimation : null;
        }

        destroy() {
            this.animalSystems.forEach(system => system.destroy());
            this.animalSystems.clear();
        }
    }

    // Legacy hero pet animation (simplified)
    class HeroPetAnimationManager {
        constructor() {
            this.walkingPets = new Map();
        }

        initializeHeroPets() {
            const petImages = document.querySelectorAll('.pet-image[data-species="ape"]');
            petImages.forEach((img, index) => {
                if (img.dataset.species === 'ape') {
                    this.startWalkingAnimation(img, index);
                }
            });

            // Add click interactions for non-walking pets
            const otherPets = document.querySelectorAll('.pet-image:not([data-species="ape"])');
            otherPets.forEach(img => {
                img.addEventListener('click', () => this.triggerPetAnimation(img));
            });
        }

        startWalkingAnimation(apeElement, index) {
            const fps = animationSettings.defaultFps;
            const speed = 0.7;
            const frameInterval = 1000 / fps;

            const walkFrames = [
                `${assetPaths.pets}ape_walk-0.png`,
                `${assetPaths.pets}ape_walk-1.png`,
                `${assetPaths.pets}ape_walk-2.png`,
                `${assetPaths.pets}ape_walk-3.png`,
                `${assetPaths.pets}ape_walk-4.png`,
                `${assetPaths.pets}ape_walk-5.png`,
                `${assetPaths.pets}ape_walk-6.png`,
                `${assetPaths.pets}ape_walk-7.png`
            ];

            let currentFrame = 0;
            let position = 0;
            let direction = 1;
            let isGoingLeft = false;

            const container = apeElement.closest('.hero-pets-showcase');
            const containerWidth = container ? container.offsetWidth : window.innerWidth;
            const apeWidth = apeElement.offsetWidth || 120;
            const maxPosition = containerWidth - apeWidth;

            position = (index * 100) % maxPosition;

            const updateFrame = () => {
                apeElement.src = walkFrames[currentFrame];
                currentFrame = (currentFrame + 1) % walkFrames.length;
            };

            const updatePosition = () => {
                position += direction * speed;

                if (position >= maxPosition && direction > 0) {
                    direction = -1;
                    isGoingLeft = true;
                } else if (position <= 0 && direction < 0) {
                    direction = 1;
                    isGoingLeft = false;
                }

                const parentElement = apeElement.closest('.floating-pet');
                if (parentElement) {
                    parentElement.style.left = position + 'px';
                    apeElement.style.transform = isGoingLeft ? 'scaleX(-1)' : 'scaleX(1)';
                }
            };

            const frameTimer = setInterval(updateFrame, frameInterval);
            const movementTimer = setInterval(updatePosition, animationSettings.frameInterval);

            // Store timers and set initial position
            apeElement._walkingTimers = { frame: frameTimer, movement: movementTimer };
            const parentElement = apeElement.closest('.floating-pet');
            if (parentElement) {
                parentElement.style.position = 'absolute';
                parentElement.style.left = position + 'px';
            }

            this.walkingPets.set(apeElement, { frameTimer, movementTimer });
        }

        triggerPetAnimation(petElement) {
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
            }, animationSettings.glowEffectDuration);
        }

        stopWalkingAnimation(apeElement) {
            if (apeElement._walkingTimers) {
                clearInterval(apeElement._walkingTimers.frame);
                clearInterval(apeElement._walkingTimers.movement);
                delete apeElement._walkingTimers;
            }
            this.walkingPets.delete(apeElement);
        }

        handleResize() {
            // Restart walking animations with new bounds
            const apeImages = document.querySelectorAll('.pet-image[data-species="ape"]');
            apeImages.forEach((img, index) => {
                this.stopWalkingAnimation(img);
                setTimeout(() => {
                    this.startWalkingAnimation(img, index);
                }, 100);
            });
        }

        destroy() {
            this.walkingPets.forEach((timers, element) => {
                this.stopWalkingAnimation(element);
            });
            this.walkingPets.clear();
        }
    }

    // Expose classes to global scope
    window.PetsTherapyAnimations = {
        AnimalAnimationSystem,
        AnimalShowcaseManager,
        HeroPetAnimationManager
    };
})();