#!/bin/bash

# Pets Therapy Landing Page Launch Script
# This script opens the landing page in your default browser

echo "🐾 Launching Pets Therapy Landing Page..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Path to the HTML file
HTML_FILE="$SCRIPT_DIR/index.html"

# Check if the HTML file exists
if [ ! -f "$HTML_FILE" ]; then
    echo "❌ Error: index.html not found in $SCRIPT_DIR"
    exit 1
fi

# Check if required assets exist
ASSETS_DIR="$SCRIPT_DIR/../../PetsAssets"
if [ ! -d "$ASSETS_DIR" ]; then
    echo "⚠️  Warning: PetsAssets directory not found at $ASSETS_DIR"
    echo "   Some images may not display correctly"
fi

# Required asset files
REQUIRED_ASSETS=(
    "mountains-0.png"
    "mountains_night-0.png" 
    "ape_front-0.png"
    "ape_chef_front-0.png"
)

missing_assets=()
for asset in "${REQUIRED_ASSETS[@]}"; do
    if [ ! -f "$ASSETS_DIR/$asset" ]; then
        missing_assets+=("$asset")
    fi
done

if [ ${#missing_assets[@]} -gt 0 ]; then
    echo "⚠️  Warning: Missing required assets:"
    for asset in "${missing_assets[@]}"; do
        echo "   - $asset"
    done
    echo "   The landing page may not display correctly"
fi

# Open in browser
echo "🚀 Opening landing page in default browser..."

# Detect OS and open accordingly
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "$HTML_FILE"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "$HTML_FILE"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    # Windows
    start "$HTML_FILE"
else
    echo "❌ Unsupported operating system: $OSTYPE"
    echo "Please manually open: $HTML_FILE"
    exit 1
fi

echo "✅ Landing page opened successfully!"
echo ""
echo "📖 Features to test:"
echo "   • Click on the floating pets in the hero section"
echo "   • Hover over pet cards to see glow effects"
echo "   • Try switching between light/dark mode in your system"
echo "   • Test responsive design by resizing the browser"
echo "   • Check smooth scrolling with navigation buttons"
echo ""
echo "🔧 To customize the landing page:"
echo "   • Edit index.html for content changes"
echo "   • Modify styles.css for styling updates"
echo "   • Update script.js for interactive features"
echo ""
echo "📱 View at: file://$HTML_FILE"