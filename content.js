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
    
    /* Preserve only specific types of content from inversion */
    /* Images, videos, and media content - BUT exclude navigation logos */
    .contentstack-dark-mode img:not([src*="logo"]):not([alt*="logo"]):not(.header__list--org_banner_cover img),
    .contentstack-dark-mode video,
    .contentstack-dark-mode iframe,
    .contentstack-dark-mode canvas,
    .contentstack-dark-mode embed,
    .contentstack-dark-mode object {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    
    /* Let navigation logos be inverted for better visibility in dark mode */
    .contentstack-dark-mode [class*="header"] img[src*="logo"],
    .contentstack-dark-mode [class*="navbar"] img[src*="logo"],
    .contentstack-dark-mode [class*="nav"] img[src*="logo"],
    .contentstack-dark-mode [class*="banner"] img[src*="logo"],
    .contentstack-dark-mode img[alt="logo"] {
      filter: none !important; /* Let them be inverted by the global filter */
    }
    
    /* Preserve branded logos and complex graphics */
    .contentstack-dark-mode [class*="logo"] svg,
    .contentstack-dark-mode [class*="Logo"] svg,
    .contentstack-dark-mode [class*="brand"] svg,
    .contentstack-dark-mode [class*="Brand"] svg,
    .contentstack-dark-mode [data-test-id*="logo"] svg,
    .contentstack-dark-mode [aria-label*="logo" i] svg,
    .contentstack-dark-mode .avatar svg,
    .contentstack-dark-mode [class*="avatar"] svg,
    .contentstack-dark-mode .profile-image svg,
    .contentstack-dark-mode [class*="profile"] svg {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    
    /* Preserve complex SVG illustrations and graphics */
    .contentstack-dark-mode svg[class*="illustration"],
    .contentstack-dark-mode svg[class*="graphic"],
    .contentstack-dark-mode svg[class*="chart"],
    .contentstack-dark-mode svg[class*="diagram"] {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    
    /* Preserve background images */
    .contentstack-dark-mode [style*="background-image"] {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    
    /* Handle Contentstack specific branded elements */
    .contentstack-dark-mode .cs-logo,
    .contentstack-dark-mode [class*="contentstack"] img,
    .contentstack-dark-mode [class*="Contentstack"] img {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    
    /* Improve contrast for text elements */
    .contentstack-dark-mode {
      background-color: #1a1a1a !important;
    }
    
    /* SIMPLIFIED LOG DARK MODE - Let global inversion work naturally */
    
    /* No special handling needed - logs will be inverted with everything else */
    /* This creates dark backgrounds and light text automatically */
    
    /* Handle code blocks and syntax highlighting (excluding logs) */
    .contentstack-dark-mode pre:not([class*="logs"] *):not([class*="log"] *),
    .contentstack-dark-mode code:not([class*="logs"] *):not([class*="log"] *),
    .contentstack-dark-mode .monaco-editor,
    .contentstack-dark-mode [class*="syntax"],
    .contentstack-dark-mode [class*="Code"],
    .contentstack-dark-mode [class*="editor"]:not([class*="logs"]):not([class*="log"]) {
      filter: invert(1) hue-rotate(180deg) !important;
      background-color: #2d2d2d !important;
    }
    
    /* Handle maps and special interactive content */
    .contentstack-dark-mode [class*="map"],
    .contentstack-dark-mode [id*="map"],
    .contentstack-dark-mode .leaflet-container,
    .contentstack-dark-mode .google-maps,
    .contentstack-dark-mode [class*="Map"] {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    
    /* Preserve color-coded status indicators and badges */
    .contentstack-dark-mode [class*="status"][style*="background"],
    .contentstack-dark-mode [class*="badge"][style*="background"],
    .contentstack-dark-mode [class*="label"][style*="background"],
    .contentstack-dark-mode [class*="tag"][style*="background"] {
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