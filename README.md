# Contentstack Dark Mode Extension

A simple Chrome extension that provides a dark mode toggle specifically for Contentstack applications (app.contentstack.com).

## Features

- 🌙 Simple on/off toggle for dark mode
- 🎯 Works exclusively on Contentstack apps (app.contentstack.com)
- 💾 Remembers your preference across sessions
- ⚡ Smooth transitions and professional UI
- 🔄 Handles dynamic content loading

## Installation

### Step 1: Prepare Icons
First, convert the SVG icon to PNG files:

**Option A: Using the script (requires ImageMagick)**
```bash
# Install ImageMagick if you don't have it
brew install imagemagick  # macOS
# or
sudo apt-get install imagemagick  # Ubuntu

# Run the conversion script
chmod +x convert-icons.sh
./convert-icons.sh
```

**Option B: Manual conversion**
- Use an online converter like [CloudConvert](https://cloudconvert.com/svg-to-png)
- Convert `icons/icon.svg` to PNG files:
  - `icons/icon-16.png` (16x16 pixels)
  - `icons/icon-32.png` (32x32 pixels)
  - `icons/icon-48.png` (48x48 pixels)
  - `icons/icon-128.png` (128x128 pixels)

### Step 2: Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select this folder containing the extension files
5. The extension should now appear in your extensions list

### Step 3: Use the Extension

1. Navigate to any Contentstack app page (app.contentstack.com)
2. Click the extension icon in your Chrome toolbar
3. Toggle the dark mode switch
4. Enjoy your dark Contentstack experience!

## How It Works

This extension uses a CSS filter approach similar to the popular dark-mode extension but is specifically optimized for Contentstack:

- **Content Script**: Injects dark mode styles when enabled
- **Background Script**: Handles persistence and tab management
- **Popup Interface**: Provides the toggle control
- **Selective Application**: Only activates on Contentstack domains

## File Structure

```
Dark Mode/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface
├── popup.js              # Popup functionality
├── content.js            # Content script for dark mode
├── background.js         # Background service worker
├── dark-mode.css         # Additional CSS styles
├── convert-icons.sh      # Icon conversion script
├── README.md             # This file
└── icons/
    ├── icon.svg          # Original SVG icon
    ├── icon-16.png       # 16x16 PNG icon
    ├── icon-32.png       # 32x32 PNG icon
    ├── icon-48.png       # 48x48 PNG icon
    └── icon-128.png      # 128x128 PNG icon
```

## Customization

To modify the dark mode appearance, edit the styles in `content.js` within the `createDarkModeStyles()` function. The extension uses CSS filters for a universal dark mode effect while preserving images and specific UI elements.

## Troubleshooting

**Extension doesn't appear**: Make sure you have all the required PNG icon files.

**Dark mode not working**: Ensure you're on a Contentstack page (app.contentstack.com).

**Style issues**: The extension preserves images and logos - if something looks wrong, it may need custom CSS rules.

## Development

This extension is built with:
- Manifest V3 (latest Chrome extension format)
- Vanilla JavaScript (no dependencies)
- CSS filters for dark mode implementation
- Chrome Storage API for persistence
