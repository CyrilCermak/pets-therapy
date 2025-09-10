// Pets Therapy Landing Page - Main Script
// Clean, modular initialization and coordination (Non-ES6 module version)

(function() {
    'use strict';

    class PetsTherapyApp {
        constructor() {
            // Wait for other scripts to load
            this.waitForDependencies().then(() => {
                this.animalShowcaseManager = new window.PetsTherapyAnimations.AnimalShowcaseManager();
                this.heroPetManager = new window.PetsTherapyAnimations.HeroPetAnimationManager();
                this.uiManager = new window.PetsTherapyUI.UIInteractionManager();
                this.isInitialized = false;
            });
        }

        async waitForDependencies() {
            // Wait for config and other modules to be available
            return new Promise((resolve) => {
                const checkDependencies = () => {
                    if (window.PetsTherapyConfig && 
                        window.PetsTherapyAnimations && 
                        window.PetsTherapyUI) {
                        resolve();
                    } else {
                        setTimeout(checkDependencies, 50);
                    }
                };
                checkDependencies();
            });
        }

        async initialize() {
            if (this.isInitialized) return;

            try {
                // Initialize UI interactions first
                this.uiManager.initialize();

                // Initialize hero pets
                this.heroPetManager.initializeHeroPets();

                // Initialize animal showcases
                this.initializeAnimalShowcases();

                // Setup global event listeners
                this.setupEventListeners();

                this.isInitialized = true;
                console.log('Pets Therapy app initialized successfully');
            } catch (error) {
                console.error('Failed to initialize Pets Therapy app:', error);
            }
        }

        initializeAnimalShowcases() {
            // Initialize all configured animals
            const animalConfigs = window.PetsTherapyConfig.animalConfigs;
            Object.keys(animalConfigs).forEach(animalId => {
                const system = this.animalShowcaseManager.initializeAnimal(animalId);
                if (system) {
                    // Store reference for external access
                    window[`${animalId}System`] = system;
                }
            });
        }

        setupEventListeners() {
            // Handle window resize for all animation systems
            window.addEventListener('resize', () => {
                this.handleResize();
            });

            // Handle visibility changes to pause/resume animations
            document.addEventListener('visibilitychange', () => {
                this.handleVisibilityChange();
            });
        }

        handleResize() {
            // Notify all managers about resize
            this.heroPetManager.handleResize();
            
            // Recalculate bounds for all animal systems
            const animalConfigs = window.PetsTherapyConfig.animalConfigs;
            Object.keys(animalConfigs).forEach(animalId => {
                const system = this.animalShowcaseManager.getAnimalSystem(animalId);
                if (system) {
                    system.recalculateBounds();
                }
            });
        }

        handleVisibilityChange() {
            // Could be used to pause/resume animations when tab is not visible
            // Currently not implemented but placeholder for future optimization
        }

        // Public API for external access
        getAPI() {
            return {
                // Theme functions (handled by shared.js)
                toggleTheme: () => {
                    const themeToggle = document.getElementById('theme-switch');
                    if (themeToggle) {
                        themeToggle.checked = !themeToggle.checked;
                        themeToggle.dispatchEvent(new Event('change'));
                    }
                },

                // Animal animation controls
                triggerAnimalAnimation: (animalId, animationName) => {
                    return this.animalShowcaseManager.triggerAnimalAnimation(animalId, animationName);
                },

                getCurrentAnimation: (animalId) => {
                    return this.animalShowcaseManager.getCurrentAnimation(animalId);
                },

                // Specific animal shortcuts
                triggerTrexAnimation: (animationName) => {
                    return this.animalShowcaseManager.triggerAnimalAnimation('trex', animationName);
                },

                triggerSheepBlackAnimation: (animationName) => {
                    return this.animalShowcaseManager.triggerAnimalAnimation('sheep_black', animationName);
                },

                triggerApeChefAnimation: (animationName) => {
                    return this.animalShowcaseManager.triggerAnimalAnimation('ape_chef', animationName);
                },

                triggerCatBlueAnimation: (animationName) => {
                    return this.animalShowcaseManager.triggerAnimalAnimation('cat_blue', animationName);
                },

                // Animation state getters
                getTrexCurrentAnimation: () => {
                    return this.animalShowcaseManager.getCurrentAnimation('trex');
                },

                getSheepBlackCurrentAnimation: () => {
                    return this.animalShowcaseManager.getCurrentAnimation('sheep_black');
                },

                getApeChefCurrentAnimation: () => {
                    return this.animalShowcaseManager.getCurrentAnimation('ape_chef');
                },

                getCatBlueCurrentAnimation: () => {
                    return this.animalShowcaseManager.getCurrentAnimation('cat_blue');
                },

                // UI utilities
                addIdleAnimation: (element) => {
                    return this.uiManager.addIdleAnimation(element);
                },

                showDownloadModal: () => {
                    return this.uiManager.showDownloadModal();
                }
            };
        }

        // Clean up resources
        destroy() {
            if (this.animalShowcaseManager) {
                this.animalShowcaseManager.destroy();
            }
            if (this.heroPetManager) {
                this.heroPetManager.destroy();
            }
            if (this.uiManager) {
                this.uiManager.destroy();
            }
            this.isInitialized = false;
        }
    }

    // Initialize the app when DOM is ready
    document.addEventListener('DOMContentLoaded', async () => {
        const app = new PetsTherapyApp();
        
        // Wait a bit for all dependencies to load, then initialize
        setTimeout(async () => {
            await app.initialize();
            
            // Expose API to global scope for backwards compatibility
            window.PetsTherapy = app.getAPI();
            
            // Store app instance for potential cleanup
            window._petsTherapyApp = app;
        }, 100);
    });

    // Handle page unload cleanup
    window.addEventListener('beforeunload', () => {
        if (window._petsTherapyApp) {
            window._petsTherapyApp.destroy();
        }
    });
})();