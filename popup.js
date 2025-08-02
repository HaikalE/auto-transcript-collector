// popup.js - FIXED VERSION - No more crashes!

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
let isProcessing = false; // Prevent double clicks

// Initialize popup
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎉 Popup loading...');
  
  // Load state dengan timeout untuk prevent freeze
  setTimeout(loadState, 100);
  
  // Event listeners dengan proper error handling
  toggleBtn.addEventListener('click', handleToggleClick);
  clipboardBtn.addEventListener('click', () => handleModeClick('clipboard'));
  downloadBtn.addEventListener('click', () => handleModeClick('download'));
});

// Load state dari background dengan timeout protection
function loadState() {
  try {
    chrome.runtime.sendMessage({ action: 'getState' }, function(response) {
      if (chrome.runtime.lastError) {
        console.error('Error loading state:', chrome.runtime.lastError.message);
        // Set default state jika error
        isActive = false;
        currentMode = 'clipboard';
        stats = { detected: 0, processed: 0 };
      } else if (response) {
        isActive = response.isActive || false;
        currentMode = response.mode || 'clipboard';
        stats = response.stats || { detected: 0, processed: 0 };
      }
      
      updateUI();
      console.log('✅ State loaded:', { isActive, currentMode, stats });
    });
  } catch (error) {
    console.error('Error in loadState:', error);
    // Fallback ke default state
    isActive = false;
    currentMode = 'clipboard';
    stats = { detected: 0, processed: 0 };
    updateUI();
  }
}

// Handle toggle click dengan protection
function handleToggleClick() {
  if (isProcessing) {
    console.log('⏳ Already processing, ignoring click');
    return;
  }
  
  isProcessing = true;
  toggleBtn.disabled = true;
  toggleBtn.textContent = isActive ? '⏳ STOPPING...' : '⏳ STARTING...';
  
  console.log('🔄 Toggle clicked, current state:', isActive);
  
  const newState = !isActive;
  
  try {
    chrome.runtime.sendMessage({
      action: 'toggleMonitoring',
      isActive: newState,
      mode: currentMode
    }, function(response) {
      isProcessing = false;
      toggleBtn.disabled = false;
      
      if (chrome.runtime.lastError) {
        console.error('❌ Toggle error:', chrome.runtime.lastError.message);
        showNotification('❌ Error: ' + chrome.runtime.lastError.message, 'error');
      } else if (response && response.success) {
        isActive = newState;
        console.log('✅ Toggle successful, new state:', isActive);
        showNotification(
          isActive ? '✅ Monitoring started!' : '⏹️ Monitoring stopped!',
          'success'
        );
      } else {
        console.error('❌ Toggle failed:', response);
        showNotification('❌ Failed to toggle monitoring', 'error');
      }
      
      updateUI();
    });
  } catch (error) {
    console.error('❌ Exception in toggle:', error);
    isProcessing = false;
    toggleBtn.disabled = false;
    showNotification('❌ Error: ' + error.message, 'error');
    updateUI();
  }
}

// Handle mode click dengan protection
function handleModeClick(mode) {
  if (isProcessing) {
    console.log('⏳ Processing, ignoring mode click');
    return;
  }
  
  console.log('🎯 Mode clicked:', mode);
  currentMode = mode;
  
  try {
    chrome.runtime.sendMessage({
      action: 'setMode',
      mode: currentMode
    }, function(response) {
      if (chrome.runtime.lastError) {
        console.error('Error setting mode:', chrome.runtime.lastError.message);
      } else {
        console.log('✅ Mode set to:', currentMode);
      }
    });
  } catch (error) {
    console.error('Error in setMode:', error);
  }
  
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

// Update UI dengan error protection
function updateUI() {
  try {
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
    clipboardBtn.classList.remove('active');
    downloadBtn.classList.remove('active');
    
    if (currentMode === 'clipboard') {
      clipboardBtn.classList.add('active');
    } else {
      downloadBtn.classList.add('active');
    }
    
    // Update stats
    detectedCount.textContent = stats.detected || 0;
    processedCount.textContent = stats.processed || 0;
    
    console.log('🔄 UI updated:', { isActive, currentMode, stats });
    
  } catch (error) {
    console.error('❌ Error updating UI:', error);
  }
}

// Show notification dengan error protection
function showNotification(message, type) {
  try {
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
      pointer-events: none;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.style.transition = 'all 0.3s ease';
      notification.style.opacity = '1';
    }, 10);
    
    // Remove after 2 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = '0';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 2000);
    
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

// Listen for messages dengan error protection
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    if (message.action === 'statsUpdate') {
      stats = message.stats || stats;
      updateUI();
      
      // Visual feedback untuk detection
      if (message.type === 'detected' && statusCircle) {
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
  } catch (error) {
    console.error('Error handling message:', error);
  }
});

console.log('🎉 Simple Auto Transcript Collector popup loaded - FIXED VERSION!');