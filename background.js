// Contentstack Dark Mode Background Script

chrome.runtime.onInstalled.addListener(function() {
  // Initialize storage
  chrome.storage.sync.set({ darkModeEnabled: false });
});

// Handle extension icon click
chrome.action.onClicked.addListener(function(tab) {
  // This will open the popup, no additional action needed
});

// Listen for tab updates to ensure dark mode persists
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('app.contentstack.com')) {
    // Check if dark mode is enabled and reapply if necessary
    chrome.storage.sync.get(['darkModeEnabled'], function(result) {
      if (result.darkModeEnabled) {
        chrome.tabs.sendMessage(tabId, {
          action: 'toggleDarkMode',
          enabled: true
        }).catch(() => {
          // Ignore errors if content script isn't ready yet
        });
      }
    });
  }
}); 