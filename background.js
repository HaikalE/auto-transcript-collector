// Chrome Extension: URL Monitor for ?o= parameters
// v3.0 - URL Collector & Display with clickable links

// Global state
let isMonitoring = false;
let collectedUrls = [];
let stats = { detected: 0, total: 0 };

// Initialize extension
async function initialize() {
  console.log('🚀 URL Monitor initializing...');
  
  try {
    const localData = await chrome.storage.local.get(['collectedUrls', 'stats']);
    
    collectedUrls = localData.collectedUrls || [];
    stats = localData.stats || { detected: 0, total: 0 };
    
    isMonitoring = false;
    
    console.log('📊 URLs loaded:', collectedUrls.length);
    console.log('📈 Stats loaded:', stats);
    console.log('✅ URL Monitor initialized');
  } catch (error) {
    console.error('❌ Initialization error:', error);
    collectedUrls = [];
    stats = { detected: 0, total: 0 };
  }
}

// URL structure for storage
function createUrlEntry(url, timestamp = Date.now()) {
  try {
    const urlObj = new URL(url);
    const oParam = urlObj.searchParams.get('o');
    
    return {
      id: timestamp,
      url: url,
      domain: urlObj.hostname,
      oParam: oParam,
      timestamp: timestamp,
      timeString: new Date(timestamp).toLocaleTimeString()
    };
  } catch (error) {
    console.error('Error creating URL entry:', error);
    return null;
  }
}

// NON-BLOCKING listener for completed requests
const requestListener = (details) => {
  try {
    console.log('🎯 URL with ?o= detected:', details.url);
    
    // Create URL entry
    const urlEntry = createUrlEntry(details.url);
    if (!urlEntry) return;
    
    // Check if URL already exists (avoid duplicates)
    const exists = collectedUrls.some(item => item.url === details.url);
    if (exists) {
      console.log('🔄 URL already exists, skipping...');
      return;
    }
    
    // Add to collection
    collectedUrls.unshift(urlEntry); // Add to beginning for newest first
    
    // Limit collection size (keep last 100 URLs)
    if (collectedUrls.length > 100) {
      collectedUrls = collectedUrls.slice(0, 100);
    }
    
    // Update stats
    stats.detected++;
    stats.total = collectedUrls.length;
    
    // Save to storage
    saveData();
    
    // Send to popup
    updatePopup('urlDetected', urlEntry);
    
  } catch (error) {
    console.error('❌ Error in request listener:', error);
  }
};

// Save data to storage
function saveData() {
  try {
    chrome.storage.local.set({ 
      collectedUrls: collectedUrls, 
      stats: stats 
    });
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Update popup with new data
function updatePopup(action, data = null) {
  chrome.runtime.sendMessage({
    action: action,
    data: data,
    stats: stats,
    urls: collectedUrls.slice(0, 20) // Send latest 20 URLs
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
  console.log('✅ URL monitoring STARTED');
  return true;
}

// STOP monitoring  
function stopMonitoring() {
  if (!isMonitoring) return false;
  
  chrome.webRequest.onCompleted.removeListener(requestListener);
  isMonitoring = false;
  console.log('⏹️ URL monitoring STOPPED');
  return true;
}

// Clear collected URLs
function clearUrls() {
  collectedUrls = [];
  stats = { detected: 0, total: 0 };
  saveData();
  console.log('🗑️ URLs cleared');
}

// Export URLs as text
function exportUrls() {
  try {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `urls-with-o-param-${timestamp}.txt`;
    
    let content = `URLs with ?o= parameter - Exported: ${new Date().toLocaleString()}\n`;
    content += `Total URLs: ${collectedUrls.length}\n\n`;
    
    collectedUrls.forEach((item, index) => {
      content += `${index + 1}. [${item.timeString}] ${item.domain}\n`;
      content += `   ${item.url}\n\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const blobUrl = URL.createObjectURL(blob);
    
    chrome.downloads.download({
      url: blobUrl,
      filename: filename
    });
    
    console.log('✅ URLs exported:', filename);
    return true;
  } catch (error) {
    console.error('❌ Export failed:', error);
    return false;
  }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    switch (message.action) {
      case 'toggleMonitoring':
        let success = false;
        
        if (message.isActive) {
          success = startMonitoring();
        } else {
          success = stopMonitoring();
        }
        
        sendResponse({ success: success });
        break;

      case 'getState':
        sendResponse({
          isActive: isMonitoring,
          stats: stats,
          urls: collectedUrls.slice(0, 20) // Latest 20 URLs
        });
        break;
        
      case 'clearUrls':
        clearUrls();
        sendResponse({ success: true });
        break;
        
      case 'exportUrls':
        const exportSuccess = exportUrls();
        sendResponse({ success: exportSuccess });
        break;
        
      case 'getMoreUrls':
        const start = message.start || 0;
        const limit = message.limit || 20;
        const moreUrls = collectedUrls.slice(start, start + limit);
        sendResponse({ urls: moreUrls, hasMore: start + limit < collectedUrls.length });
        break;
        
      case 'openUrl':
        if (message.url) {
          chrome.tabs.create({ url: message.url });
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: 'No URL provided' });
        }
        break;
        
      default:
        console.warn('Unknown action:', message.action);
        sendResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    console.error('❌ Error handling message:', error);
    sendResponse({ success: false, error: error.message });
  }
  
  return true;
});

// Initialize when extension loads
chrome.runtime.onStartup.addListener(initialize);
chrome.runtime.onInstalled.addListener(initialize);
initialize();

console.log('🎯 URL Monitor v3.0 - Network Request Collector for ?o= parameters');
console.log('💡 Automated DevTools Network inspector for specific URLs');