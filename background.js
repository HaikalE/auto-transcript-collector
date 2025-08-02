// Chrome Extension: Auto Transcript Collector
// v2.3 - LIGHTWEIGHT: Only extract filename from URL (no file download!)

// Global state
let isMonitoring = false;
let currentMode = 'clipboard';
let stats = { detected: 0, processed: 0 };

// Initialize extension
async function initialize() {
  console.log('🚀 Extension initializing...');
  
  try {
    const settings = await chrome.storage.sync.get(['mode']);
    const localData = await chrome.storage.local.get(['stats']);

    currentMode = settings.mode || 'clipboard';
    stats = localData.stats || { detected: 0, processed: 0 };
    
    isMonitoring = false;
    
    console.log('📋 Mode loaded:', currentMode);
    console.log('📊 Stats loaded:', stats);
    console.log('✅ Extension initialized - FILENAME ONLY MODE');
  } catch (error) {
    console.error('❌ Initialization error:', error);
    currentMode = 'clipboard';
    stats = { detected: 0, processed: 0 };
  }
}

/**
 * Extract filename from URL string - SUPER LIGHTWEIGHT!
 * Example: 'http://example.com/path/transcript.txt?o=123' -> 'transcript.txt'
 * @param {string} urlString Full URL
 * @returns {string} Filename or empty string if not found
 */
function getFilenameFromUrl(urlString) {
  try {
    const url = new URL(urlString);
    const pathname = url.pathname; // -> '/path/to/file.txt'
    const parts = pathname.split('/'); // -> ['', 'path', 'to', 'file.txt']
    const filename = parts.pop() || ''; // -> 'file.txt'
    
    // If no extension found, try to extract from query params
    if (!filename || !filename.includes('.')) {
      const urlParams = new URLSearchParams(url.search);
      // Check if there's a filename in query params
      for (const [key, value] of urlParams) {
        if (value.includes('.') && (value.includes('.txt') || value.includes('.json') || value.includes('.xml'))) {
          return value;
        }
      }
      // Fallback: generate filename from URL
      return `transcript-${Date.now()}.txt`;
    }
    
    return filename;
  } catch (error) {
    console.error('Invalid URL:', urlString);
    return `transcript-${Date.now()}.txt`;
  }
}

// NON-BLOCKING listener for completed requests
const requestListener = (details) => {
  console.log('🎯 URL detected:', details.url);
  
  stats.detected++;
  stats.lastActivity = Date.now();
  saveStats();
  updatePopupStats('detected');

  // Process ONLY filename - NO FILE DOWNLOAD!
  processFilename(details.url);
};

// LIGHTWEIGHT function - only extracts filename from URL!
async function processFilename(url) {
  try {
    console.log('📝 Extracting filename from URL (no download)...');
    
    // 1. Get ONLY the filename - SUPER FAST operation!
    const filename = getFilenameFromUrl(url);

    if (!filename) {
      console.log('❌ Could not extract filename from URL:', url);
      return;
    }

    console.log('📄 Filename detected:', filename);

    // 2. Copy filename to clipboard OR save as list
    if (currentMode === 'clipboard') {
      await copyFilenameToClipboard(filename);
    } else {
      await saveFilenameToList(filename, url);
    }

    // 3. Update stats
    stats.processed++;
    saveStats();
    updatePopupStats('processed');
    
    console.log('✅ Filename processed successfully!');

  } catch (error) {
    console.error(`❌ Failed to process filename from ${url}:`, error);
  }
}

// Copy filename to clipboard
async function copyFilenameToClipboard(filename) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (textToCopy) => navigator.clipboard.writeText(textToCopy),
        args: [filename]
      });
      console.log('✅ Filename copied to clipboard:', filename);
    } else {
      throw new Error('No active tab found');
    }
  } catch (error) {
    console.error('❌ Failed to copy filename to clipboard:', error);
  }
}

// Save filename to downloadable list
async function saveFilenameToList(filename, originalUrl) {
  try {
    const timestamp = new Date().toISOString();
    const listContent = `${timestamp} - ${filename} - ${originalUrl}\n`;
    
    // Create blob and download as text file
    const blob = new Blob([listContent], { type: 'text/plain' });
    const blobUrl = URL.createObjectURL(blob);
    
    const downloadFilename = `filename-list-${Date.now()}.txt`;
    
    chrome.downloads.download({
      url: blobUrl,
      filename: downloadFilename
    });
    
    console.log('✅ Filename saved to list:', downloadFilename);
  } catch (error) {
    console.error('❌ Failed to save filename to list:', error);
  }
}

// Save statistics
function saveStats() {
  chrome.storage.local.set({ stats: stats });
}

// Update popup stats
function updatePopupStats(type) {
  chrome.runtime.sendMessage({
    action: 'statsUpdate',
    stats: stats,
    type: type
  }).catch(error => {
    if (!error.message.includes("Could not establish connection")) {
      console.warn("Message sending error:", error);
    }
  });
}

// START monitoring
function startMonitoring() {
  if (isMonitoring) return false;

  chrome.webRequest.onCompleted.addListener(
    requestListener,
    { urls: ["*://*/*?o=*"] }
  );
  
  isMonitoring = true;
  console.log('✅ Monitoring STARTED (filename extraction only)');
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

console.log('🎯 Auto Transcript Collector v2.3 - FILENAME EXTRACTION ONLY');
console.log('💡 No file downloads - just filename parsing for maximum speed!');