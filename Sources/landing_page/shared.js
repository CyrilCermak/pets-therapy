// Shared JavaScript for Pets Therapy Landing Pages
// Theme Detection and Background Management

document.addEventListener('DOMContentLoaded', function() {
    initializeThemeDetection();
    initializeThemeToggle();
});

/**
 * Initialize theme detection based on saved preference or system setting
 */
function initializeThemeDetection() {
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

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeToggleState(e.matches);
            updateBackground();
        }
    });
}

/**
 * Initialize theme toggle switch functionality
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-switch');

    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            const isDark = this.checked;
            const theme = isDark ? 'dark' : 'light';

            localStorage.setItem('theme', theme);
            document.documentElement.setAttribute('data-theme', theme);
            updateBackground();

            // Add smooth transition effect
            document.body.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        });
    }
}

/**
 * Update the theme toggle switch state
 * @param {boolean} isDark - Whether dark theme is active
 */
function updateThemeToggleState(isDark) {
    const themeToggle = document.getElementById('theme-switch');
    if (themeToggle) {
        themeToggle.checked = isDark;
    }
}

/**
 * Update background image based on current theme
 */
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

/**
 * Get current theme
 * @returns {string} Current theme ('light' or 'dark')
 */
function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
}

/**
 * Set theme programmatically
 * @param {string} theme - Theme to set ('light' or 'dark')
 */
function setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
        console.warn('Invalid theme provided. Use "light" or "dark".');
        return;
    }

    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggleState(theme === 'dark');
    updateBackground();
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}
