document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('darkModeToggle');
  const status = document.getElementById('status');
  
  // Initialize with light mode immediately
  document.body.classList.add('light-mode');
  
  // Load current state
  chrome.storage.sync.get(['darkModeEnabled'], function(result) {
    const isEnabled = result.darkModeEnabled || false;
    updateUI(isEnabled);
    // Small delay to ensure initial state is set before transition
    setTimeout(() => {
      updatePopupTheme(isEnabled);
    }, 10);
  });
  
  // Handle toggle click
  toggle.addEventListener('click', function() {
    chrome.storage.sync.get(['darkModeEnabled'], function(result) {
      const currentState = result.darkModeEnabled || false;
      const newState = !currentState;
      
      // Save new state
      chrome.storage.sync.set({ darkModeEnabled: newState }, function() {
        updateUI(newState);
        updatePopupTheme(newState);
        
        // Send message to content script
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          if (tabs[0] && tabs[0].url.includes('app.contentstack.com')) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              { action: 'toggleDarkMode', enabled: newState },
              function () {
                // ignore errors when no receiving end exists
                if (chrome.runtime.lastError) {
                  /* no-op */
                }
              }
            );
          }
        });
      });
    });
  });
  
  function updateUI(isEnabled) {
    if (isEnabled) {
      toggle.classList.add('active');
      status.textContent = 'Dark mode enabled';
      status.className = 'status enabled';
    } else {
      toggle.classList.remove('active');
      status.textContent = 'Dark mode disabled';
      status.className = 'status disabled';
    }
  }
  
  function updatePopupTheme(isEnabled) {
    const body = document.body;
    if (isEnabled) {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
    }
    
    // Force a reflow to ensure CSS transitions trigger properly
    void body.offsetHeight;
  }
  
  // Check if we're on a Contentstack page
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0] && !tabs[0].url.includes('app.contentstack.com')) {
      status.textContent = 'Only works on Contentstack';
      status.className = 'status disabled';
      toggle.style.opacity = '0.5';
      toggle.style.pointerEvents = 'none';
    }
  });
}); 