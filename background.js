// Chrome Extension: Auto Transcript Collector
// RESOURCE-EFFICIENT VERSION - Only monitors when explicitly started

// Global state
let isMonitoring = false;
let currentMode = 'clipboard';
let stats = { detected: 0, processed: 0 };
let requestListener = null;

// Initialize extension - DEFAULT OFF untuk save resources
chrome.runtime.onStartup.addListener(initialize);
chrome.runtime.onInstalled.addListener(initialize);

function initialize() {
  // Load saved settings
  chrome.storage.sync.get(['mode'], function(result) {
    if (result.mode) {
      currentMode = result.mode;
    }
  });
  
  chrome.storage.local.get(['stats'], function(result) {
    if (result.stats) {
      stats = result.stats;
    }
  });
  
  // IMPORTANT: Extension starts in OFF state untuk save resources
  isMonitoring = false;
  console.log('🚀 Auto Transcript Collector initialized - MONITORING OFF (resource-efficient)');
}

// Create webRequest listener function
function createRequestListener() {
  return function(details) {
    console.log('🎯 URL transkrip terdeteksi:', details.url);
    
    // Update stats
    stats.detected++;
    stats.lastActivity = Date.now();
    saveStats();
    
    // Send stats update ke popup
    chrome.runtime.sendMessage({
      action: 'statsUpdate',
      stats: stats,
      type: 'detected'
    }).catch(() => {});
    
    // Process berdasarkan mode yang aktif
    if (currentMode === 'clipboard') {
      copyContentToClipboard(details.url);
    } else {
      downloadContentAsFile(details.url);
    }
  };
}

// START monitoring - Enable webRequest listener
function startMonitoring() {
  if (!isMonitoring) {
    requestListener = createRequestListener();
    
    chrome.webRequest.onBeforeRequest.addListener(
      requestListener,
      { urls: ["*://*/*?o=*"] }  // Only URLs with ?o= parameter
    );
    
    isMonitoring = true;
    console.log('✅ Monitoring STARTED - Resource usage: ACTIVE');
  }
}

// STOP monitoring - Remove webRequest listener
function stopMonitoring() {
  if (isMonitoring && requestListener) {
    chrome.webRequest.onBeforeRequest.removeListener(requestListener);
    requestListener = null;
    isMonitoring = false;
    console.log('⏹️ Monitoring STOPPED - Resource usage: MINIMAL');
  }
}

// Save statistics
function saveStats() {
  chrome.storage.local.set({ stats: stats });
}

/**
 * Copy content to clipboard via content script
 */
async function copyContentToClipboard(url) {
  try {
    console.log('📋 Processing for clipboard:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const content = await response.text();
    
    // Get active tab and inject script
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tabs.length > 0) {
      await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (text) => navigator.clipboard.writeText(text),
        args: [content]
      });
    }
    
    console.log('✅ Content copied to clipboard!');
    
    // Update stats
    stats.processed++;
    saveStats();
    
    // Send success ke popup
    chrome.runtime.sendMessage({
      action: 'statsUpdate',
      stats: stats,
      type: 'processed'
    }).catch(() => {});
    
  } catch (error) {
    console.error('❌ Clipboard error:', error);
  }
}

/**
 * Download content as file
 */
function downloadContentAsFile(url) {
  const timestamp = new Date().getTime();
  const filename = `transkrip-${timestamp}.txt`;
  
  console.log('💾 Downloading:', url);
  
  chrome.downloads.download({
    url: url,
    filename: filename
  }, function(downloadId) {
    if (chrome.runtime.lastError) {
      console.error('❌ Download error:', chrome.runtime.lastError.message);
    } else {
      console.log('✅ File downloaded:', filename);
      
      // Update stats
      stats.processed++;
      saveStats();
      
      // Send success ke popup
      chrome.runtime.sendMessage({
        action: 'statsUpdate',
        stats: stats,
        type: 'processed'
      }).catch(() => {});
    }
  });
}

// Handle messages dari popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
  if (message.action === 'toggleMonitoring') {
    if (message.isActive) {
      startMonitoring();
    } else {
      stopMonitoring();
    }
    
    // Update mode if provided
    if (message.mode) {
      currentMode = message.mode;
      chrome.storage.sync.set({ mode: currentMode });
    }
    
    sendResponse({ success: true });
  }
  
  else if (message.action === 'setMode') {
    currentMode = message.mode;
    chrome.storage.sync.set({ mode: currentMode });
    console.log('🔄 Mode updated to:', currentMode);
    sendResponse({ success: true });
  }
  
  else if (message.action === 'getState') {
    sendResponse({
      isActive: isMonitoring,
      mode: currentMode,
      stats: stats
    });
  }
  
  return true; // Indicates async response
});

// Initialize on load
initialize();

console.log('🎯 Auto Transcript Collector ready - Resource-efficient mode');
console.log('💡 Monitoring is OFF by default - Click START to begin');