// popup.js - Simple START/STOP interface for Auto Transcript Collector

// Elements
const statusCircle = document.getElementById('statusCircle');
const statusText = document.getElementById('statusText');
const statusSub = document.getElementById('statusSub');
const toggleBtn = document.getElementById('toggleBtn');
const clipboardBtn = document.getElementById('clipboardBtn');
const downloadBtn = document.getElementById('downloadBtn');
const detectedCount = document.getElementById('detectedCount');
const processedCount = document.getElementById('processedCount');
const extensionStatus = document.getElementById('extensionStatus');

// State
let isActive = false;
let currentMode = 'clipboard';
let stats = { detected: 0, processed: 0 };

// Initialize popup
document.addEventListener('DOMContentLoaded', function() {
  loadState();
  updateUI();
  
  // Event listeners
  toggleBtn.addEventListener('click', toggleMonitoring);
  clipboardBtn.addEventListener('click', () => setMode('clipboard'));
  downloadBtn.addEventListener('click', () => setMode('download'));
});

// Load state dari background
function loadState() {
  chrome.runtime.sendMessage({ action: 'getState' }, function(response) {
    if (response) {
      isActive = response.isActive || false;
      currentMode = response.mode || 'clipboard';
      stats = response.stats || { detected: 0, processed: 0 };
      updateUI();
    }
  });
}

// Update UI berdasarkan state
function updateUI() {
  // Update status circle
  if (isActive) {
    statusCircle.className = 'status-circle active';
    statusCircle.textContent = '🚀';
    statusText.textContent = 'MONITORING';
    statusSub.textContent = 'Scanning for transcript URLs...';
    toggleBtn.className = 'toggle-btn stop';
    toggleBtn.textContent = '⏹️ STOP MONITORING';
    extensionStatus.textContent = 'Active';
  } else {
    statusCircle.className = 'status-circle inactive';
    statusCircle.textContent = '⏸️';
    statusText.textContent = 'STOPPED';
    statusSub.textContent = 'Click START to begin monitoring';
    toggleBtn.className = 'toggle-btn start';
    toggleBtn.textContent = '🚀 START MONITORING';
    extensionStatus.textContent = 'Stopped';
  }
  
  // Update mode buttons
  clipboardBtn.classList.toggle('active', currentMode === 'clipboard');
  downloadBtn.classList.toggle('active', currentMode === 'download');
  
  // Update stats
  detectedCount.textContent = stats.detected;
  processedCount.textContent = stats.processed;
}

// Toggle monitoring on/off
function toggleMonitoring() {
  isActive = !isActive;
  
  // Send message ke background untuk enable/disable monitoring
  chrome.runtime.sendMessage({
    action: 'toggleMonitoring',
    isActive: isActive,
    mode: currentMode
  }, function(response) {
    if (response && response.success) {
      updateUI();
      
      // Visual feedback
      toggleBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        toggleBtn.style.transform = '';
      }, 150);
      
      // Show notification
      showNotification(
        isActive ? '✅ Monitoring started!' : '⏹️ Monitoring stopped!',
        'success'
      );
    } else {
      // Revert state jika gagal
      isActive = !isActive;
      showNotification('❌ Failed to toggle monitoring', 'error');
    }
  });
}

// Set mode (clipboard/download)
function setMode(mode) {
  currentMode = mode;
  
  // Send ke background
  chrome.runtime.sendMessage({
    action: 'setMode',
    mode: currentMode
  });
  
  updateUI();
  
  // Visual feedback
  const btn = mode === 'clipboard' ? clipboardBtn : downloadBtn;
  btn.style.transform = 'scale(0.95)';
  setTimeout(() => {
    btn.style.transform = '';
  }, 150);
  
  showNotification(
    `📋 Mode: ${mode === 'clipboard' ? 'Copy to Clipboard' : 'Download File'}`,
    'success'
  );
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
    padding: 8px 12px;
    border-radius: 4px;
    color: white;
    font-size: 11px;
    z-index: 1000;
    max-width: 250px;
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
  
  // Remove after 2 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(-50%) translateY(-10px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 2000);
}

// Listen for messages dari background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'statsUpdate') {
    stats = message.stats;
    updateUI();
    
    // Visual feedback untuk detection
    if (message.type === 'detected') {
      statusCircle.style.transform = 'scale(1.1)';
      setTimeout(() => {
        statusCircle.style.transform = '';
      }, 200);
    }
  }
  
  if (message.action === 'stateUpdate') {
    isActive = message.isActive;
    currentMode = message.mode;
    updateUI();
  }
});

console.log('🎉 Simple Auto Transcript Collector popup loaded!');