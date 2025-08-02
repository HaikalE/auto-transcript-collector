// Chrome Extension: Auto Transcript Collector
// v2.2 - PROPER FIX: Non-blocking architecture using onCompleted

// Global state
let isMonitoring = false;
let currentMode = 'clipboard';
let stats = { detected: 0, processed: 0 };

// Initialize extension with proper async pattern
async function initialize() {
  console.log('🚀 Extension initializing...');
  
  try {
    // Use Promise-based loading for cleaner code
    const settings = await chrome.storage.sync.get(['mode']);
    const localData = await chrome.storage.local.get(['stats']);

    currentMode = settings.mode || 'clipboard';
    stats = localData.stats || { detected: 0, processed: 0 };
    
    isMonitoring = false; // Always start in OFF state
    
    console.log('📋 Mode loaded:', currentMode);
    console.log('📊 Stats loaded:', stats);
    console.log('✅ Extension initialized - Monitoring OFF');
  } catch (error) {
    console.error('❌ Initialization error:', error);
    // Set fallback values
    currentMode = 'clipboard';
    stats = { detected: 0, processed: 0 };
  }
}

// NON-BLOCKING listener for completed requests - THE KEY FIX!
const requestListener = (details) => {
  // Only detect and update stats here - NO BLOCKING OPERATIONS!
  console.log('🎯 URL transkrip terdeteksi (onCompleted):', details.url);
  
  stats.detected++;
  stats.lastActivity = Date.now();
  saveStats();
  updatePopupStats('detected');

  // Process content ASYNCHRONOUSLY without blocking anything
  processContent(details.url);
};

// Separate async function for heavy work (fetch, copy, download)
async function processContent(url) {
  try {
    console.log('⚙️ Processing content from:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const content = await response.text();

    if (currentMode === 'clipboard') {
      await copyContentToClipboard(content);
    } else {
      await downloadContentAsFile(url);
    }

    // Update stats after successful processing
    stats.processed++;
    saveStats();
    updatePopupStats('processed');
    
    console.log('✅ Content processed successfully');

  } catch (error) {
    console.error(`❌ Failed to process content from ${url}:`, error);
  }
}

// Copy content to clipboard
async function copyContentToClipboard(text) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (contentToCopy) => navigator.clipboard.writeText(contentToCopy),
        args: [text]
      });
      console.log('✅ Content copied to clipboard!');
    } else {
      throw new Error('No active tab found');
    }
  } catch (error) {
    console.error('❌ Failed to copy to clipboard:', error);
  }
}

// Download content as file
async function downloadContentAsFile(url) {
  try {
    const timestamp = new Date().getTime();
    const filename = `transkrip-${timestamp}.txt`;
    
    chrome.downloads.download({
      url: url,
      filename: filename
    });
    
    console.log('✅ Download started:', filename);
  } catch (error) {
    console.error('❌ Failed to start download:', error);
  }
}

// Save statistics
function saveStats() {
  chrome.storage.local.set({ stats: stats });
}

// Update popup with minimal error handling
function updatePopupStats(type) {
  chrome.runtime.sendMessage({
    action: 'statsUpdate',
    stats: stats,
    type: type
  }).catch(error => {
    // Only log if it's not the common "popup not open" error
    if (!error.message.includes("Could not establish connection")) {
      console.warn("Message sending error:", error);
    }
  });
}

// START monitoring - Use onCompleted instead of onBeforeRequest!
function startMonitoring() {
  if (isMonitoring) return false;

  // THE KEY FIX: Use onCompleted which is NON-BLOCKING!
  chrome.webRequest.onCompleted.addListener(
    requestListener,
    { urls: ["*://*/*?o=*"] }
  );
  
  isMonitoring = true;
  console.log('✅ Monitoring STARTED (non-blocking)');
  return true;
}

// STOP monitoring
function stopMonitoring() {
  if (!isMonitoring) return false;
  
  chrome.webRequest.onCompleted.removeListener(requestListener);
  isMonitoring = false;
  console.log('⏹️ Monitoring STOPPED');
  return true;
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'toggleMonitoring':
      let success = false;
      
      if (message.isActive) {
        success = startMonitoring();
        if (success && message.mode) {
          currentMode = message.mode;
          chrome.storage.sync.set({ mode: currentMode });
        }
      } else {
        success = stopMonitoring();
      }
      
      sendResponse({ success: success });
      break;

    case 'setMode':
      currentMode = message.mode;
      chrome.storage.sync.set({ mode: currentMode });
      console.log('🔄 Mode updated to:', currentMode);
      sendResponse({ success: true });
      break;

    case 'getState':
      sendResponse({
        isActive: isMonitoring,
        mode: currentMode,
        stats: stats
      });
      break;
      
    default:
      console.warn('Unknown action:', message.action);
      sendResponse({ success: false, error: 'Unknown action' });
  }
  
  return true;
});

// Initialize when extension loads
chrome.runtime.onStartup.addListener(initialize);
chrome.runtime.onInstalled.addListener(initialize);
initialize();

console.log('🎯 Auto Transcript Collector v2.2 - NON-BLOCKING ARCHITECTURE');
console.log('💡 Using onCompleted instead of onBeforeRequest for stability');