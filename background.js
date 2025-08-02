// Chrome Extension: Smart URL Monitor for ?o= parameters
// v3.1 - Smart filtering to avoid unwanted downloads

// Global state
let isMonitoring = false;
let collectedUrls = [];
let stats = { detected: 0, filtered: 0, total: 0 };

// Initialize extension
async function initialize() {
  console.log('🚀 Smart URL Monitor initializing...');
  
  try {
    const localData = await chrome.storage.local.get(['collectedUrls', 'stats']);
    
    collectedUrls = localData.collectedUrls || [];
    stats = localData.stats || { detected: 0, filtered: 0, total: 0 };
    
    isMonitoring = false;
    
    console.log('📊 URLs loaded:', collectedUrls.length);
    console.log('📈 Stats loaded:', stats);
    console.log('✅ Smart URL Monitor initialized');
  } catch (error) {
    console.error('❌ Initialization error:', error);
    collectedUrls = [];
    stats = { detected: 0, filtered: 0, total: 0 };
  }
}

// Smart URL filtering to avoid unwanted downloads
function shouldFilterUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    const hostname = urlObj.hostname.toLowerCase();
    
    // Filter out range requests (these auto-download files)
    if (pathname.includes('/range/')) {
      console.log('🚫 Filtered range request:', url);
      return true;
    }
    
    // Filter out chunk requests
    if (pathname.match(/\/\d+-\d+/)) {
      console.log('🚫 Filtered chunk request:', url);
      return true;
    }
    
    // Filter out segment requests
    if (pathname.includes('/segment/') || pathname.includes('/chunk/')) {
      console.log('🚫 Filtered segment request:', url);
      return true;
    }
    
    // Filter out manifest/playlist files that might auto-download
    if (pathname.includes('.m3u8') || pathname.includes('.mpd') || 
        pathname.includes('.manifest') || pathname.includes('/manifest/')) {
      console.log('🚫 Filtered manifest/playlist:', url);
      return true;
    }
    
    // Filter out direct media files that auto-download
    const mediaExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', 
                           '.mp3', '.wav', '.aac', '.ogg', '.m4a',
                           '.ts', '.m4s', '.webm'];
    
    if (mediaExtensions.some(ext => pathname.includes(ext))) {
      console.log('🚫 Filtered media file:', url);
      return true;
    }
    
    // Filter out very long numeric paths (usually auto-download chunks)
    const pathParts = pathname.split('/');
    for (const part of pathParts) {
      if (part.match(/^\d{6,}(-\d{6,})?$/)) {
        console.log('🚫 Filtered numeric chunk path:', url);
        return true;
      }
    }
    
    // Allow main streaming URLs (these are usually viewable)
    console.log('✅ URL passed filter:', url);
    return false;
    
  } catch (error) {
    console.error('Error filtering URL:', error);
    return false; // If error, don't filter (be permissive)
  }
}

// URL structure for storage
function createUrlEntry(url, timestamp = Date.now()) {
  try {
    const urlObj = new URL(url);
    const oParam = urlObj.searchParams.get('o');
    
    // Determine URL type
    let urlType = 'stream';
    if (urlObj.pathname.includes('/range/')) urlType = 'range';
    else if (urlObj.pathname.includes('/segment/')) urlType = 'segment';
    else if (urlObj.pathname.includes('/chunk/')) urlType = 'chunk';
    
    return {
      id: timestamp,
      url: url,
      domain: urlObj.hostname,
      oParam: oParam,
      urlType: urlType,
      timestamp: timestamp,
      timeString: new Date(timestamp).toLocaleTimeString()
    };
  } catch (error) {
    console.error('Error creating URL entry:', error);
    return null;
  }
}

// SMART listener for completed requests with filtering
const requestListener = (details) => {
  try {
    console.log('🔍 Checking URL with ?o=:', details.url);
    
    // Smart filtering to avoid unwanted downloads
    if (shouldFilterUrl(details.url)) {
      stats.filtered++;
      console.log('🚫 URL filtered (would cause unwanted download)');
      return;
    }
    
    console.log('✅ URL approved for collection:', details.url);
    
    // Create URL entry
    const urlEntry = createUrlEntry(details.url);
    if (!urlEntry) return;
    
    // Check if URL already exists (avoid duplicates)
    const exists = collectedUrls.some(item => item.url === details.url);
    if (exists) {
      console.log('🔄 URL already exists, skipping...');
      return;
    }
    
    // Add to collection (newest first)
    collectedUrls.unshift(urlEntry);
    
    // Limit collection size (keep last 50 URLs)
    if (collectedUrls.length > 50) {
      collectedUrls = collectedUrls.slice(0, 50);
    }
    
    // Update stats
    stats.detected++;
    stats.total = collectedUrls.length;
    
    // Save to storage
    saveData();
    
    // Send to popup
    updatePopup('urlDetected', urlEntry);
    
    console.log('🎯 Good URL added to collection');
    
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
  console.log('✅ Smart URL monitoring STARTED (with filtering)');
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
  stats = { detected: 0, filtered: 0, total: 0 };
  saveData();
  console.log('🗑️ URLs cleared');
}

// Export URLs as text with filtering info
function exportUrls() {
  try {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `smart-urls-with-o-param-${timestamp}.txt`;
    
    let content = `Smart URL Monitor Export - ${new Date().toLocaleString()}\n`;
    content += `Total Good URLs: ${collectedUrls.length}\n`;
    content += `URLs Filtered (avoided downloads): ${stats.filtered}\n`;
    content += `Note: Range/chunk URLs filtered to prevent unwanted downloads\n\n`;
    
    collectedUrls.forEach((item, index) => {
      content += `${index + 1}. [${item.timeString}] ${item.domain} (${item.urlType})\n`;
      content += `   ${item.url}\n\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const blobUrl = URL.createObjectURL(blob);
    
    chrome.downloads.download({
      url: blobUrl,
      filename: filename
    });
    
    console.log('✅ Smart URLs exported:', filename);
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

console.log('🎯 Smart URL Monitor v3.1 - Intelligent filtering to avoid unwanted downloads');
console.log('🛡️ Filters out range/chunk requests that cause auto-downloads');