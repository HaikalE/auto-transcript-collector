// popup.js - Interface untuk Auto Transcript Collector Extension

// Elements
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const currentMode = document.getElementById('currentMode');
const clipboardBtn = document.getElementById('clipboardBtn');
const downloadBtn = document.getElementById('downloadBtn');
const urlInput = document.getElementById('urlInput');
const copyManualBtn = document.getElementById('copyManualBtn');
const downloadManualBtn = document.getElementById('downloadManualBtn');
const detectedCount = document.getElementById('detectedCount');
const processedCount = document.getElementById('processedCount');
const lastActivity = document.getElementById('lastActivity');

// State management
let currentModeState = 'clipboard'; // 'clipboard' atau 'download'
let stats = {
  detected: 0,
  processed: 0,
  lastActivity: null
};

// Initialize popup
document.addEventListener('DOMContentLoaded', function() {
  loadSettings();
  loadStats();
  updateUI();
  
  // Event listeners
  clipboardBtn.addEventListener('click', () => setMode('clipboard'));
  downloadBtn.addEventListener('click', () => setMode('download'));
  copyManualBtn.addEventListener('click', () => processManualURL('copy'));
  downloadManualBtn.addEventListener('click', () => processManualURL('download'));
  
  // Auto-fill current tab URL if it contains ?o=
  getCurrentTabURL();
});

// Load settings dari chrome.storage
function loadSettings() {
  chrome.storage.sync.get(['mode'], function(result) {
    if (result.mode) {
      currentModeState = result.mode;
    }
    updateUI();
  });
}

// Load statistics dari chrome.storage
function loadStats() {
  chrome.storage.local.get(['stats'], function(result) {
    if (result.stats) {
      stats = result.stats;
      updateStats();
    }
  });
}

// Save settings ke chrome.storage
function saveSettings() {
  chrome.storage.sync.set({ mode: currentModeState });
  
  // Send message ke background script untuk update mode
  chrome.runtime.sendMessage({
    action: 'updateMode',
    mode: currentModeState
  });
}

// Update UI berdasarkan state
function updateUI() {
  // Update mode buttons
  clipboardBtn.classList.toggle('active', currentModeState === 'clipboard');
  downloadBtn.classList.toggle('active', currentModeState === 'download');
  
  // Update mode text
  currentMode.textContent = currentModeState === 'clipboard' ? 'Copy ke Clipboard' : 'Download File';
  
  // Update status
  statusDot.className = 'status-dot active';
  statusText.textContent = 'Extension Aktif';
}

// Update statistics display
function updateStats() {
  detectedCount.textContent = stats.detected;
  processedCount.textContent = stats.processed;
  
  if (stats.lastActivity) {
    const time = new Date(stats.lastActivity).toLocaleTimeString();
    lastActivity.textContent = time;
  }
}

// Set mode (clipboard/download)
function setMode(mode) {
  currentModeState = mode;
  updateUI();
  saveSettings();
  
  // Visual feedback
  const btn = mode === 'clipboard' ? clipboardBtn : downloadBtn;
  btn.style.transform = 'scale(0.95)';
  setTimeout(() => {
    btn.style.transform = '';
  }, 150);
}

// Get current tab URL untuk auto-fill
function getCurrentTabURL() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentURL = tabs[0].url;
    if (currentURL && currentURL.includes('?o=')) {
      urlInput.value = currentURL;
      urlInput.style.background = '#e8f5e8';
    }
  });
}

// Process manual URL
async function processManualURL(action) {
  const url = urlInput.value.trim();
  
  if (!url) {
    showNotification('Masukkan URL terlebih dahulu!', 'error');
    return;
  }
  
  if (!url.includes('?o=')) {
    showNotification('URL harus mengandung parameter ?o=', 'error');
    return;
  }
  
  // Disable buttons sementara
  copyManualBtn.disabled = true;
  downloadManualBtn.disabled = true;
  copyManualBtn.textContent = 'Processing...';
  downloadManualBtn.textContent = 'Processing...';
  
  try {
    if (action === 'copy') {
      await copyContentToClipboard(url);
      showNotification('✅ Konten berhasil disalin!', 'success');
    } else {
      await downloadContentAsFile(url);
      showNotification('✅ File berhasil diunduh!', 'success');
    }
    
    // Update stats
    stats.processed++;
    stats.lastActivity = Date.now();
    saveStats();
    updateStats();
    
  } catch (error) {
    console.error('Error processing URL:', error);
    showNotification('❌ Error: ' + error.message, 'error');
  } finally {
    // Re-enable buttons
    copyManualBtn.disabled = false;
    downloadManualBtn.disabled = false;
    copyManualBtn.textContent = 'Copy';
    downloadManualBtn.textContent = 'Download';
  }
}

// Copy content to clipboard
async function copyContentToClipboard(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const content = await response.text();
  await navigator.clipboard.writeText(content);
  
  console.log('✅ Content copied to clipboard:', content.length, 'characters');
}

// Download content as file
async function downloadContentAsFile(url) {
  return new Promise((resolve, reject) => {
    const timestamp = new Date().getTime();
    const filename = `transkrip-${timestamp}.txt`;
    
    chrome.downloads.download({
      url: url,
      filename: filename
    }, function(downloadId) {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        console.log('✅ File downloaded:', filename, 'ID:', downloadId);
        resolve(downloadId);
      }
    });
  });
}

// Save statistics
function saveStats() {
  chrome.storage.local.set({ stats: stats });
}

// Show notification
function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 15px;
    border-radius: 4px;
    color: white;
    font-size: 12px;
    z-index: 1000;
    max-width: 300px;
    text-align: center;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Animate in
  notification.style.opacity = '0';
  notification.style.transform = 'translateX(-50%) translateY(-10px)';
  setTimeout(() => {
    notification.style.transition = 'all 0.3s ease';
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(-50%) translateY(0)';
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(-50%) translateY(-10px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Listen for messages dari background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'urlDetected') {
    stats.detected++;
    stats.lastActivity = Date.now();
    saveStats();
    updateStats();
    
    // Visual feedback
    statusDot.style.boxShadow = '0 0 10px #4CAF50';
    setTimeout(() => {
      statusDot.style.boxShadow = '';
    }, 1000);
  }
  
  if (message.action === 'processCompleted') {
    stats.processed++;
    stats.lastActivity = Date.now();
    saveStats();
    updateStats();
  }
});

// Handle URL input changes
urlInput.addEventListener('input', function() {
  const url = this.value;
  if (url.includes('?o=')) {
    this.style.background = '#e8f5e8';
  } else {
    this.style.background = '';
  }
});

console.log('🎉 Auto Transcript Collector popup loaded!');