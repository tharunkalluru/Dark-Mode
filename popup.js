document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('darkModeToggle');
  const status = document.getElementById('status');
  
  // Load current state
  chrome.storage.sync.get(['darkModeEnabled'], function(result) {
    const isEnabled = result.darkModeEnabled || false;
    updateUI(isEnabled);
    updatePopupTheme(isEnabled);
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
            chrome.tabs.sendMessage(tabs[0].id, {
              action: 'toggleDarkMode',
              enabled: newState
            });
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