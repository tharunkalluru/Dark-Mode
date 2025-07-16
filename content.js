// Contentstack Dark Mode Content Script

let darkModeEnabled = false;
let styleElement = null;

// Initialize dark mode state
chrome.storage.sync.get(['darkModeEnabled'], function(result) {
  darkModeEnabled = result.darkModeEnabled || false;
  if (darkModeEnabled) {
    enableDarkMode();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'toggleDarkMode') {
    darkModeEnabled = request.enabled;
    if (darkModeEnabled) {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
    sendResponse({ success: true });
  }
});

function enableDarkMode() {
  if (!styleElement) {
    createDarkModeStyles();
  }
  document.documentElement.classList.add('contentstack-dark-mode');
  
  // Apply to dynamically loaded content
  observeDOM();
}

function disableDarkMode() {
  document.documentElement.classList.remove('contentstack-dark-mode');
  if (styleElement) {
    styleElement.remove();
    styleElement = null;
  }
}

function createDarkModeStyles() {
  styleElement = document.createElement('style');
  styleElement.id = 'contentstack-dark-mode-styles';
  
  styleElement.textContent = `
    /* Contentstack Dark Mode Styles */
    .contentstack-dark-mode {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    
    /* Preserve images, videos, and certain elements */
    .contentstack-dark-mode img,
    .contentstack-dark-mode video,
    .contentstack-dark-mode iframe,
    .contentstack-dark-mode svg,
    .contentstack-dark-mode [style*="background-image"],
    .contentstack-dark-mode canvas,
    .contentstack-dark-mode embed,
    .contentstack-dark-mode object {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    
    /* Handle Contentstack specific elements */
    .contentstack-dark-mode .cs-logo,
    .contentstack-dark-mode .logo,
    .contentstack-dark-mode [class*="logo"],
    .contentstack-dark-mode .avatar,
    .contentstack-dark-mode [class*="avatar"],
    .contentstack-dark-mode .profile-image,
    .contentstack-dark-mode [class*="profile"] img {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    
    /* Improve contrast for text */
    .contentstack-dark-mode {
      background-color: #1a1a1a !important;
    }
    
    /* Handle code blocks and syntax highlighting */
    .contentstack-dark-mode pre,
    .contentstack-dark-mode code,
    .contentstack-dark-mode .monaco-editor,
    .contentstack-dark-mode [class*="code"],
    .contentstack-dark-mode [class*="syntax"] {
      filter: invert(1) hue-rotate(180deg) !important;
      background-color: #2d2d2d !important;
    }
    
    /* Handle maps and special content */
    .contentstack-dark-mode [class*="map"],
    .contentstack-dark-mode [id*="map"],
    .contentstack-dark-mode .leaflet-container,
    .contentstack-dark-mode .google-maps {
      filter: invert(1) hue-rotate(180deg) !important;
    }
  `;
  
  document.head.appendChild(styleElement);
}

function observeDOM() {
  // Observer for dynamically loaded content
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0 && darkModeEnabled) {
        // Reapply dark mode to new elements if needed
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            // Handle any specific Contentstack dynamic content here
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Handle page navigation in SPAs
let currentUrl = location.href;
setInterval(function() {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    // Re-apply dark mode if enabled
    if (darkModeEnabled) {
      setTimeout(enableDarkMode, 100);
    }
  }
}, 500); 