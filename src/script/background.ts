chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'CAPTURE_SCREEN') {

    chrome.windows.getCurrent((window) => {
      if (window.id) {
        chrome.tabs.captureVisibleTab(window.id, { format: 'png' }, async (dataUrl) => {
          if (chrome.runtime.lastError || !dataUrl) {
            console.error("Capture failed:", chrome.runtime.lastError);
            sendResponse({ success: false });
            return;
          }
          sendResponse({ success: true, dataUrl });
        })

      }
    })
    return true; // Keep message channel open for async response
  }
});
