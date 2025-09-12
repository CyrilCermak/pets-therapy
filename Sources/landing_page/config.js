// Configuration data for Pets Therapy Landing Page
// Non-module version for better compatibility

window.PetsTherapyConfig = {
    // Animal showcase configurations
    animalConfigs: {
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
    },

    // Featured pets data for the showcase grid
    featuredPets: [
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
    ],

    // Asset paths configuration
    assetPaths: {
        pets: './assets/pets/',
        backgrounds: {
            light: './assets/pets/mountains-0.png',
            dark: './assets/pets/mountains_night-0.png'
        }
    },

    // Animation settings
    animationSettings: {
        defaultFps: 10,
        maxFps: 20,
        smoothMovementFps: 60, // For position updates
        frameInterval: 16, // ~60fps for smooth movement
        bounceEffectDuration: 600,
        glowEffectDuration: 1000
    },

    // Preload priority images for better performance
    criticalImages: [
        './assets/pets/mountains-0.png',
        './assets/pets/mountains_night-0.png',
        // Hero section pets
        './assets/pets/ape_front-0.png',
        './assets/pets/ape_walk-0.png',
        './assets/pets/ape_walk-1.png',
        './assets/pets/ape_walk-2.png',
        './assets/pets/ape_walk-3.png',
        './assets/pets/ape_walk-4.png',
        './assets/pets/ape_walk-5.png',
        './assets/pets/ape_walk-6.png',
        './assets/pets/ape_walk-7.png',
        // Main showcase pets - initial frames
        './assets/pets/trex_yellow_front-0.png',
        './assets/pets/sheep_black_front-0.png',
        './assets/pets/ape_chef_front-0.png',
        './assets/pets/cat_blue_front-0.png',
        // Walking animation first frames
        './assets/pets/trex_yellow_walk-0.png',
        './assets/pets/sheep_black_walk-0.png',
        './assets/pets/ape_chef_walk-0.png',
        './assets/pets/cat_blue_walk-0.png',
        // Featured pets grid - most popular
        './assets/pets/cat_front-0.png',
        './assets/pets/panda_front-0.png',
        './assets/pets/betta_front-0.png',
        './assets/pets/crow_front-0.png',
        './assets/pets/frog_front-0.png',
        './assets/pets/shiba_front-0.png'
    ]
};