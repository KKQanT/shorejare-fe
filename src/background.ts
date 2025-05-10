/// <reference types="chrome" />

// Background script for ShareJore AI Extension
console.log('Background script loaded');

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  
  // Initialize storage with default values if needed
  chrome.storage.sync.get(['settings'], (result) => {
    if (!result.settings) {
      chrome.storage.sync.set({
        settings: {
          enabled: true,
          // Add other default settings here
        }
      });
    }
  });
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((
  message: any, 
  sender: chrome.runtime.MessageSender, 
  sendResponse: (response?: any) => void
) => {
  console.log('Received message:', message);
  
  if (message.type === 'FETCH_DATA') {
    // Handle data fetching here
    sendResponse({ success: true, data: 'Sample data' });
  }
  
  // Return true to indicate you'll respond asynchronously
  return true;
});

export {}; 