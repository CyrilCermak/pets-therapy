# Pets Therapy Landing Page

A beautiful, interactive landing page for the Pets Therapy Mac app, showcasing adorable digital companions with animated backgrounds and engaging pet displays.

## Features

- **Dynamic Mountain Backgrounds**: Automatically switches between day and night mountain scenes based on system theme
- **Interactive Pet Showcase**: Floating animated pets (ape and ape_chef) that respond to clicks
- **Responsive Design**: Optimized for desktop, tablet, and mobile viewing
- **Smooth Animations**: CSS animations and JavaScript interactions for engaging user experience
- **Dark/Light Mode Support**: Automatically adapts to user's system preferences
- **Accessibility Features**: Focus indicators and reduced motion support

## File Structure

```
landing_page/
├── index.html          # Main HTML file
├── styles.css          # CSS styling and animations
├── script.js           # Interactive JavaScript functionality
└── README.md           # This file
```

## Setup

1. **Prerequisites**: Ensure the `PetsAssets` folder is in the correct relative path (`../../PetsAssets/`)
2. **Required Assets**:
   - `mountains-0.png` (light mode background)
   - `mountains_night-0.png` (dark mode background)
   - `ape_front-0.png` (ape pet image)
   - `ape_chef_front-0.png` (ape chef pet image)

3. **Local Development**: Simply open `index.html` in a web browser

## Usage

### Viewing the Page
- Open `index.html` in any modern web browser
- The page will automatically detect your system's theme preference
- All animations and interactions are enabled by default

### Interactive Elements
- **Pet Images**: Click on the floating pets in the hero section for bounce animations
- **Pet Cards**: Hover over pet cards to see glow effects
- **Navigation**: Click on navigation buttons for smooth scrolling
- **Download Buttons**: Currently show demo alerts (can be customized for real downloads)

### Customization

#### Adding More Pets
To add additional pets to the showcase:

1. **Add to Hero Section** (`index.html`):
```html
<div class="floating-pet" id="new-pet">
    <img src="../../PetsAssets/new_pet_front-0.png" alt="New Pet" class="pet-image" data-species="new_pet">
</div>
```

2. **Add Pet Card** (`index.html`):
```html
<div class="pet-card" data-species="new_pet">
    <div class="pet-card-image">
        <img src="../../PetsAssets/new_pet_front-0.png" alt="New Pet" class="pet-preview">
    </div>
    <div class="pet-card-content">
        <h3 class="pet-name">New Pet</h3>
        <p class="pet-description">Description of the new pet...</p>
        <div class="pet-tags">
            <span class="pet-tag">Tag1</span>
            <span class="pet-tag">Tag2</span>
        </div>
        <div class="pet-animations">
            <span class="animation-badge">Front</span>
            <span class="animation-badge">Walk</span>
        </div>
    </div>
</div>
```

3. **Update CSS** for additional floating pet positioning if needed

#### Customizing Colors
Main color variables are defined in `:root` in `styles.css`:
```css
:root {
    --text-primary: #1a1a1a;
    --text-secondary: #666;
    --accent-primary: #667eea;
    --accent-secondary: #764ba2;
    /* ... */
}
```

#### Modifying Animations
- **Float Animation**: Adjust timing in `@keyframes float` in `styles.css`
- **Pet Interactions**: Modify `triggerPetAnimation()` function in `script.js`
- **Scroll Effects**: Customize parallax speed in `updateParallax()` function

## Technical Details

### CSS Features
- CSS Grid and Flexbox for responsive layouts
- CSS Custom Properties for theming
- CSS animations for floating pets and interactions
- Media queries for responsive design
- Backdrop filters for glassmorphism effects

### JavaScript Features
- Theme detection and dynamic background switching
- Intersection Observer for scroll animations
- Event delegation for interactive elements
- Performance optimizations with requestAnimationFrame
- Image preloading for better performance

### Browser Compatibility
- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- CSS Grid and Flexbox support required
- JavaScript ES6+ features used

### Performance Considerations
- Images are preloaded for smooth user experience
- Animations use `transform` and `opacity` for GPU acceleration
- Scroll events are throttled using `requestAnimationFrame`
- Reduced motion support for accessibility

## Customization Examples

### Change Download Links
Update the href attributes in the download buttons:
```html
<a href="https://apps.apple.com/your-app" class="btn btn-primary">
```

### Add Real Download Functionality
Replace the `showDownloadModal()` function in `script.js`:
```javascript
function showDownloadModal() {
    window.location.href = 'https://your-download-link.com';
}
```

### Modify Pet Showcase Layout
Adjust the grid in `styles.css`:
```css
.pets-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
}
```

## Deployment

### GitHub Pages
1. Ensure all asset paths are correct
2. Push to a GitHub repository
3. Enable GitHub Pages in repository settings

### Web Hosting
1. Upload all files maintaining the directory structure
2. Ensure the `PetsAssets` folder is accessible at the correct relative path
3. Configure web server to serve static files

### CDN Integration
For better performance, consider hosting images on a CDN and updating the image paths accordingly.

## Contributing

When adding new features:
1. Maintain the existing code style
2. Test on multiple browsers and devices
3. Ensure accessibility standards are met
4. Update this README with any new functionality

## License

This landing page is part of the Pets Therapy project. Please refer to the main project license for usage terms.