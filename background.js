// Chrome Extension: Auto Transcript Collector
// Mendeteksi URL dengan parameter ?o= dan mengambil konten transkrip

// Global state
let currentMode = 'clipboard'; // 'clipboard' atau 'download'
let stats = {
  detected: 0,
  processed: 0,
  lastActivity: null
};

// Load settings saat extension start
chrome.runtime.onStartup.addListener(loadSettings);
chrome.runtime.onInstalled.addListener(loadSettings);

// Load settings dari storage
function loadSettings() {
  chrome.storage.sync.get(['mode'], function(result) {
    if (result.mode) {
      currentMode = result.mode;
    }
    console.log('🔧 Settings loaded, current mode:', currentMode);
  });
  
  chrome.storage.local.get(['stats'], function(result) {
    if (result.stats) {
      stats = result.stats;
    }
    console.log('📊 Stats loaded:', stats);
  });
}

// Save statistics
function saveStats() {
  chrome.storage.local.set({ stats: stats });
}

// Update statistics
function updateStats(type) {
  if (type === 'detected') {
    stats.detected++;
  } else if (type === 'processed') {
    stats.processed++;
  }
  stats.lastActivity = Date.now();
  saveStats();
}

// Listener untuk memantau semua permintaan jaringan
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    console.log('🎯 URL transkrip terdeteksi:', details.url);
    
    // Update stats
    updateStats('detected');
    
    // Send message ke popup jika terbuka
    chrome.runtime.sendMessage({
      action: 'urlDetected',
      url: details.url
    }).catch(() => {
      // Popup mungkin tidak terbuka, ignore error
    });
    
    // Process berdasarkan mode yang aktif
    if (currentMode === 'clipboard') {
      copyContentToClipboard(details.url);
    } else {
      downloadContentAsFile(details.url);
    }
  },
  // Filter URL yang spesifik - hanya URL dengan parameter ?o=
  { urls: ["*://*/*?o=*"] }
);

/**
 * Fungsi 1: Mengambil konten dari URL dan menyalin ke clipboard
 * @param {string} url - URL transkrip yang akan diambil kontennya
 */
async function copyContentToClipboard(url) {
  try {
    console.log('📋 Mengambil konten untuk clipboard dari:', url);
    
    // Fetch konten dari URL
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Baca respons sebagai teks
    const content = await response.text();
    
    // Untuk clipboard, kita perlu menggunakan content script
    // karena navigator.clipboard tidak tersedia di service worker
    await copyToClipboardViaContentScript(content);
    
    console.log('✅ Konten berhasil disalin ke clipboard!');
    console.log('📏 Panjang konten:', content.length, 'karakter');
    
    // Update stats
    updateStats('processed');
    
    // Send message ke popup
    chrome.runtime.sendMessage({
      action: 'processCompleted',
      type: 'clipboard',
      success: true
    }).catch(() => {});
    
  } catch (error) {
    console.error('❌ Error saat mengambil atau menyalin konten:', error);
    
    // Send error message ke popup
    chrome.runtime.sendMessage({
      action: 'processCompleted',
      type: 'clipboard',
      success: false,
      error: error.message
    }).catch(() => {});
  }
}

/**
 * Copy ke clipboard via content script
 * @param {string} content - Konten yang akan disalin
 */
async function copyToClipboardViaContentScript(content) {
  // Get active tab
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tabs.length > 0) {
    // Inject content script untuk copy ke clipboard
    await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (text) => {
        navigator.clipboard.writeText(text);
      },
      args: [content]
    });
  } else {
    // Fallback: create temporary tab untuk clipboard operation
    const tab = await chrome.tabs.create({ url: 'data:text/html,<html><body></body></html>', active: false });
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text) => {
        navigator.clipboard.writeText(text);
      },
      args: [content]
    });
    
    // Close temporary tab after a short delay
    setTimeout(() => {
      chrome.tabs.remove(tab.id);
    }, 1000);
  }
}

/**
 * Fungsi 2: Mengunduh konten dari URL sebagai file
 * @param {string} url - URL transkrip yang akan diunduh
 */
function downloadContentAsFile(url) {
  // Generate timestamp untuk nama file unik
  const timestamp = new Date().getTime();
  const filename = `transkrip-${timestamp}.txt`;
  
  console.log('💾 Mengunduh konten dari:', url);
  
  // Download file menggunakan Chrome Downloads API
  chrome.downloads.download({
    url: url,
    filename: filename
  }, function(downloadId) {
    // Periksa apakah ada error
    if (chrome.runtime.lastError) {
      console.error('❌ Error saat mengunduh file:', chrome.runtime.lastError.message);
      
      // Send error message ke popup
      chrome.runtime.sendMessage({
        action: 'processCompleted',
        type: 'download',
        success: false,
        error: chrome.runtime.lastError.message
      }).catch(() => {});
    } else {
      console.log('✅ File berhasil diunduh!');
      console.log('🆔 Download ID:', downloadId);
      console.log('📄 Nama file:', filename);
      
      // Update stats
      updateStats('processed');
      
      // Send success message ke popup
      chrome.runtime.sendMessage({
        action: 'processCompleted',
        type: 'download',
        success: true,
        filename: filename,
        downloadId: downloadId
      }).catch(() => {});
    }
  });
}

// Handle messages dari popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Message received:', message);
  
  if (message.action === 'updateMode') {
    currentMode = message.mode;
    console.log('🔄 Mode updated to:', currentMode);
    
    // Save ke storage
    chrome.storage.sync.set({ mode: currentMode });
    
    sendResponse({ success: true });
  }
  
  if (message.action === 'getStats') {
    sendResponse({ stats: stats });
  }
  
  if (message.action === 'resetStats') {
    stats = {
      detected: 0,
      processed: 0,
      lastActivity: null
    };
    saveStats();
    sendResponse({ success: true });
  }
  
  return true; // Indicates we will send a response asynchronously
});

// Load settings saat start
loadSettings();

// Log ketika service worker dimuat
console.log('🚀 Auto Transcript Collector service worker dimuat dan siap!');
console.log('🎯 Mencari URL dengan parameter ?o=');
console.log('📋 Mode aktif:', currentMode);