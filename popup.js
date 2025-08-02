// popup.js - Smart URL Monitor v3.1 - Professional Edition

// Elements
const toggleBtn = document.getElementById('toggleBtn');
const clearBtn = document.getElementById('clearBtn');
const exportBtn = document.getElementById('exportBtn');
const totalCount = document.getElementById('totalCount');
const filteredCount = document.getElementById('filteredCount');
const statusText = document.getElementById('statusText');
const statusDot = document.getElementById('statusDot');
const urlList = document.getElementById('urlList');
const emptyState = document.getElementById('emptyState');

// State
let isActive = false;
let urls = [];
let stats = { detected: 0, filtered: 0, total: 0 };
let isProcessing = false;

// Initialize popup
document.addEventListener('DOMContentLoaded', function() {
  console.log('Smart URL Monitor popup loading...');
  
  setTimeout(loadState, 100);
  
  // Event listeners
  toggleBtn.addEventListener('click', handleToggleClick);
  clearBtn.addEventListener('click', handleClearClick);
  exportBtn.addEventListener('click', handleExportClick);
});

// Load state from background
function loadState() {
  try {
    chrome.runtime.sendMessage({ action: 'getState' }, function(response) {
      if (chrome.runtime.lastError) {
        console.error('Error loading state:', chrome.runtime.lastError.message);
        isActive = false;
        urls = [];
        stats = { detected: 0, filtered: 0, total: 0 };
      } else if (response) {
        isActive = response.isActive || false;
        urls = response.urls || [];
        stats = response.stats || { detected: 0, filtered: 0, total: 0 };
      }
      
      updateUI();
      renderUrlList();
      console.log('State loaded:', { isActive, urlCount: urls.length, stats });
    });
  } catch (error) {
    console.error('Error in loadState:', error);
    isActive = false;
    urls = [];
    stats = { detected: 0, filtered: 0, total: 0 };
    updateUI();
    renderUrlList();
  }
}

// Handle toggle monitoring
function handleToggleClick() {
  if (isProcessing) return;
  
  isProcessing = true;
  toggleBtn.disabled = true;
  toggleBtn.textContent = isActive ? 'STOPPING...' : 'STARTING...';
  
  const newState = !isActive;
  
  try {
    chrome.runtime.sendMessage({
      action: 'toggleMonitoring',
      isActive: newState
    }, function(response) {
      isProcessing = false;
      toggleBtn.disabled = false;
      
      if (chrome.runtime.lastError) {
        console.error('Toggle error:', chrome.runtime.lastError.message);
        showNotification('Error: ' + chrome.runtime.lastError.message, 'error');
      } else if (response && response.success) {
        isActive = newState;
        console.log('Toggle successful, new state:', isActive);
        showNotification(
          isActive ? 'Smart monitoring started successfully' : 'Monitoring stopped',
          'success'
        );
      } else {
        console.error('Toggle failed:', response);
        showNotification('Failed to toggle monitoring', 'error');
      }
      
      updateUI();
    });
  } catch (error) {
    console.error('Exception in toggle:', error);
    isProcessing = false;
    toggleBtn.disabled = false;
    showNotification('Error: ' + error.message, 'error');
    updateUI();
  }
}

// Handle clear URLs
function handleClearClick() {
  if (confirm('Clear all collected URLs and reset filter statistics?')) {
    chrome.runtime.sendMessage({ action: 'clearUrls' }, function(response) {
      if (response && response.success) {
        urls = [];
        stats = { detected: 0, filtered: 0, total: 0 };
        updateUI();
        renderUrlList();
        showNotification('URLs cleared and statistics reset successfully', 'success');
      }
    });
  }
}

// Handle export URLs
function handleExportClick() {
  if (urls.length === 0) {
    showNotification('No quality URLs available for export', 'warning');
    return;
  }
  
  chrome.runtime.sendMessage({ action: 'exportUrls' }, function(response) {
    if (response && response.success) {
      showNotification(`${urls.length} quality URLs exported successfully`, 'success');
    } else {
      showNotification('Export operation failed', 'error');
    }
  });
}

// Update UI elements
function updateUI() {
  try {
    // Update toggle button
    if (isActive) {
      toggleBtn.className = 'control-btn stop-btn';
      toggleBtn.textContent = 'STOP MONITORING';
      statusText.innerHTML = '<span class="status-indicator status-active"></span>ACTIVE';
    } else {
      toggleBtn.className = 'control-btn start-btn';
      toggleBtn.textContent = 'START MONITORING';
      statusText.innerHTML = '<span class="status-indicator status-inactive"></span>INACTIVE';
    }
    
    // Update stats
    totalCount.textContent = stats.total || 0;
    filteredCount.textContent = stats.filtered || 0;
    
    console.log('UI updated:', { isActive, stats });
    
  } catch (error) {
    console.error('Error updating UI:', error);
  }
}

// Render URL list
function renderUrlList() {
  try {
    if (urls.length === 0) {
      urlList.innerHTML = '';
      urlList.appendChild(emptyState);
      return;
    }
    
    // Hide empty state
    if (emptyState.parentNode) {
      emptyState.parentNode.removeChild(emptyState);
    }
    
    // Clear current list
    urlList.innerHTML = '';
    
    // Render URLs
    urls.forEach((urlItem, index) => {
      const urlElement = createUrlElement(urlItem, index);
      urlList.appendChild(urlElement);
    });
    
    console.log('URL list rendered:', urls.length, 'quality items');
    
  } catch (error) {
    console.error('Error rendering URL list:', error);
  }
}

// Create URL element with type indicators
function createUrlElement(urlItem, index) {
  const div = document.createElement('div');
  div.className = `url-item ${urlItem.urlType || 'stream'}`;
  div.setAttribute('data-url', urlItem.url);
  
  // Truncate long domains
  const domain = urlItem.domain.length > 30 ? 
    urlItem.domain.substring(0, 27) + '...' : urlItem.domain;
  
  // Truncate long URLs for preview
  const urlPreview = urlItem.url.length > 60 ? 
    urlItem.url.substring(0, 57) + '...' : urlItem.url;
  
  // Create badges
  let badges = '';
  if (urlItem.oParam) {
    const paramPreview = urlItem.oParam.length > 15 ? 
      urlItem.oParam.substring(0, 15) + '...' : urlItem.oParam;
    badges += `<span class="url-param">o=${paramPreview}</span>`;
  }
  if (urlItem.urlType && urlItem.urlType !== 'stream') {
    badges += `<span class="url-type">${urlItem.urlType}</span>`;
  }
  
  div.innerHTML = `
    <div class="url-header">
      <div class="url-domain">${domain}</div>
      <div class="url-time">${urlItem.timeString}</div>
    </div>
    <div class="url-preview">${urlPreview}</div>
    <div class="url-badges">${badges}</div>
  `;
  
  // Click handler to open URL
  div.addEventListener('click', function() {
    chrome.runtime.sendMessage({ 
      action: 'openUrl', 
      url: urlItem.url 
    }, function(response) {
      if (response && response.success) {
        showNotification('Quality URL opened in new tab', 'success');
      }
    });
  });
  
  // Right-click to copy URL
  div.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    navigator.clipboard.writeText(urlItem.url).then(() => {
      showNotification('URL copied to clipboard', 'success');
    }).catch(err => {
      console.error('Copy failed:', err);
    });
  });
  
  return div;
}

// Show notification
function showNotification(message, type) {
  try {
    const notification = document.createElement('div');
    
    let backgroundColor;
    switch(type) {
      case 'success':
        backgroundColor = '#6d5c6f';
        break;
      case 'error':
        backgroundColor = '#8B5A3C';
        break;
      case 'warning':
        backgroundColor = '#9A8B73';
        break;
      default:
        backgroundColor = '#6d5c6f';
    }
    
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      padding: 10px 16px;
      border-radius: 6px;
      color: #fbf4b6;
      font-size: 11px;
      z-index: 1000;
      max-width: 350px;
      text-align: center;
      background: ${backgroundColor};
      box-shadow: 0 4px 16px rgba(109, 92, 111, 0.3);
      pointer-events: none;
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
      letter-spacing: 0.5px;
      border: 1px solid rgba(251, 244, 182, 0.2);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.style.transition = 'all 0.3s ease';
      notification.style.opacity = '1';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = '0';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 3000);
    
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    if (message.action === 'urlDetected') {
      // Add new URL to the beginning of the list
      if (message.data) {
        urls.unshift(message.data);
        // Keep only latest 20 URLs for performance
        if (urls.length > 20) {
          urls = urls.slice(0, 20);
        }
      }
      
      // Update stats
      stats = message.stats || stats;
      
      // Update UI
      updateUI();
      renderUrlList();
      
      // Visual feedback with URL type
      const urlType = message.data.urlType || 'stream';
      showNotification(`Quality ${urlType} URL detected: ${message.data.domain}`, 'success');
    }
    
    if (message.action === 'stateUpdate') {
      isActive = message.isActive;
      stats = message.stats;
      urls = message.urls || [];
      updateUI();
      renderUrlList();
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
});

console.log('Smart URL Monitor popup loaded - Professional monitoring interface active');
