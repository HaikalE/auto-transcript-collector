// Chrome Extension: Auto Transcript Collector
// HOTFIX - Stable version with proper error handling

// Global state
let isMonitoring = false;
let currentMode = 'clipboard';
let stats = { detected: 0, processed: 0 };
let requestListener = null;

// Initialize extension
chrome.runtime.onStartup.addListener(initialize);
chrome.runtime.onInstalled.addListener(initialize);

function initialize() {
  console.log('🚀 Extension initializing...');
  
  // Load saved settings dengan error handling
  try {
    chrome.storage.sync.get(['mode'], function(result) {
      if (chrome.runtime.lastError) {
        console.error('Error loading mode:', chrome.runtime.lastError.message);
        currentMode = 'clipboard'; // fallback
      } else if (result.mode) {
        currentMode = result.mode;
      }
      console.log('📋 Mode loaded:', currentMode);
    });
    
    chrome.storage.local.get(['stats'], function(result) {
      if (chrome.runtime.lastError) {
        console.error('Error loading stats:', chrome.runtime.lastError.message);
        stats = { detected: 0, processed: 0 }; // fallback
      } else if (result.stats) {
        stats = result.stats;
      }
      console.log('📊 Stats loaded:', stats);
    });
  } catch (error) {
    console.error('Error in initialize:', error);
    // Set fallback values
    currentMode = 'clipboard';
    stats = { detected: 0, processed: 0 };
  }
  
  // IMPORTANT: Start dengan monitoring OFF
  isMonitoring = false;
  console.log('✅ Extension initialized - Monitoring OFF (resource-efficient)');
}

// Create webRequest listener function
function createRequestListener() {
  return function(details) {
    try {
      console.log('🎯 URL transkrip terdeteksi:', details.url);
      
      // Update stats dengan error handling
      stats.detected++;
      stats.lastActivity = Date.now();
      saveStats();
      
      // Send stats update ke popup (dengan error handling)
      try {
        chrome.runtime.sendMessage({
          action: 'statsUpdate',
          stats: stats,
          type: 'detected'
        });
      } catch (error) {
        console.log('Info: Popup not open, message not sent');
      }
      
      // Process berdasarkan mode yang aktif
      if (currentMode === 'clipboard') {
        copyContentToClipboard(details.url);
      } else {
        downloadContentAsFile(details.url);
      }
    } catch (error) {
      console.error('❌ Error in request listener:', error);
    }
  };
}

// START monitoring - Enable webRequest listener
function startMonitoring() {
  try {
    if (!isMonitoring) {
      requestListener = createRequestListener();
      
      chrome.webRequest.onBeforeRequest.addListener(
        requestListener,
        { urls: ["*://*/*?o=*"] }
      );
      
      isMonitoring = true;
      console.log('✅ Monitoring STARTED');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error starting monitoring:', error);
    return false;
  }
}

// STOP monitoring - Remove webRequest listener
function stopMonitoring() {
  try {
    if (isMonitoring && requestListener) {
      chrome.webRequest.onBeforeRequest.removeListener(requestListener);
      requestListener = null;
      isMonitoring = false;
      console.log('⏹️ Monitoring STOPPED');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error stopping monitoring:', error);
    return false;
  }
}

// Save statistics dengan error handling
function saveStats() {
  try {
    chrome.storage.local.set({ stats: stats });
  } catch (error) {
    console.error('Error saving stats:', error);
  }
}

// Copy content to clipboard
async function copyContentToClipboard(url) {
  try {
    console.log('📋 Processing for clipboard:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const content = await response.text();
    
    // Get active tab and inject script dengan error handling
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tabs.length > 0) {
      await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (text) => {
          try {
            navigator.clipboard.writeText(text);
          } catch (e) {
            console.error('Clipboard error:', e);
          }
        },
        args: [content]
      });
    }
    
    console.log('✅ Content copied to clipboard!');
    
    // Update stats
    stats.processed++;
    saveStats();
    
    // Send success ke popup
    try {
      chrome.runtime.sendMessage({
        action: 'statsUpdate',
        stats: stats,
        type: 'processed'
      });
    } catch (error) {
      console.log('Info: Popup not open');
    }
    
  } catch (error) {
    console.error('❌ Clipboard error:', error);
  }
}

// Download content as file
function downloadContentAsFile(url) {
  try {
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
        try {
          chrome.runtime.sendMessage({
            action: 'statsUpdate',
            stats: stats,
            type: 'processed'
          });
        } catch (error) {
          console.log('Info: Popup not open');
        }
      }
    });
  } catch (error) {
    console.error('❌ Download error:', error);
  }
}

// Handle messages dari popup dengan extensive error handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    console.log('📨 Message received:', message);
    
    if (message.action === 'toggleMonitoring') {
      let success = false;
      
      if (message.isActive) {
        success = startMonitoring();
      } else {
        success = stopMonitoring();
      }
      
      // Update mode if provided
      if (message.mode && success) {
        currentMode = message.mode;
        try {
          chrome.storage.sync.set({ mode: currentMode });
        } catch (error) {
          console.error('Error saving mode:', error);
        }
      }
      
      sendResponse({ success: success });
    }
    
    else if (message.action === 'setMode') {
      try {
        currentMode = message.mode;
        chrome.storage.sync.set({ mode: currentMode });
        console.log('🔄 Mode updated to:', currentMode);
        sendResponse({ success: true });
      } catch (error) {
        console.error('Error setting mode:', error);
        sendResponse({ success: false, error: error.message });
      }
    }
    
    else if (message.action === 'getState') {
      sendResponse({
        isActive: isMonitoring,
        mode: currentMode,
        stats: stats
      });
    }
    
    else {
      console.log('Unknown action:', message.action);
      sendResponse({ success: false, error: 'Unknown action' });
    }
    
  } catch (error) {
    console.error('❌ Error handling message:', error);
    sendResponse({ success: false, error: error.message });
  }
  
  return true; // Indicates async response
});

// Initialize on load
initialize();

console.log('🎯 Auto Transcript Collector ready - STABLE VERSION');
console.log('💡 Monitoring is OFF by default - Click START to begin');