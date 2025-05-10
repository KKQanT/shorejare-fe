// Content script for ShareJore AI Extension
console.log('ShareJore AI content script loaded');

// Message handling from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ANALYZE_PAGE') {
    // Example: Get page content
    const pageContent = document.body.innerText;
    sendResponse({
      success: true,
      text: pageContent.substring(0, 100) + '...' // Send only a preview
    });
  }
  
  return true; // Indicate async response
});

// Example: Send a message to the background script
function sendToBackground(data: any) {
  chrome.runtime.sendMessage(
    { type: 'CONTENT_DATA', data },
    (response) => {
      console.log('Response from background:', response);
    }
  );
}

// Example: Add your content script logic here
// This could be listening for page changes, adding UI elements, etc.

export {}; 