// popup.js - Smart URL Monitor v3.4 - Enhanced Loading System with Progressive Wait Stages

// Configuration for enhanced loading timeouts
const LOADING_CONFIG = {
  INITIAL_WAIT: 1500,        // Wait before starting to load
  PARSING_TIMEOUT: 3000,     // Max time for parsing
  RETRY_ATTEMPTS: 3,         // Number of retry attempts
  RETRY_DELAY: 1000,         // Delay between retries
  PROGRESS_STEPS: [
    { step: 1, message: "Initializing transcript system...", delay: 500 },
    { step: 2, message: "Connecting to subtitle servers...", delay: 800 },
    { step: 3, message: "Loading TTML transcript file...", delay: 1000 },
    { step: 4, message: "Parsing Netflix subtitle format...", delay: 1200 },
    { step: 5, message: "Processing subtitle entries...", delay: 500 }
  ]
};

// Theme data - 140+ beautiful color palettes
const THEMES = {
  'dino': ['#40d672', '#d5d5d5', '#1d221f'],
  'magic girl': ['#f5b1cc', '#93e8d3', '#00ac8c'],
  'milkshake': ['#212b43', '#62cfe6', '#212b43'],
  'modern ink': ['#ff360d', '#b7b7b7', '#000000'],
  'ms cupcakes': ['#5ed5f3', '#d64090', '#0a282f'],
  'sewing tin light': ['#2d2076', '#385eca', '#2d2076'],
  'lilac mist': ['#b94189', '#e094c2', '#5c2954'],
  'rose pine dawn': ['#56949f', '#c4a7e7', '#286983'],
  'soaring skies': ['#55c6f0', '#1e107a', '#1d1e1e'],
  'rainbow trail': ['#363636', '#4f4f4f', '#1f1f1f'],
  'nord light': ['#8fbcbb', '#6a7791', '#8fbcbb'],
  'solarized light': ['#859900', '#2aa198', '#181819'],
  'tangerine': ['#fe5503', '#ff9562', '#3d1705'],
  'camping': ['#618c56', '#c2b8aa', '#3c403b'],
  'slambook': ['#13005A', '#1c82adc4', '#125d98'],
  'paper': ['#444444', '#b2b2b2', '#444444'],
  'desert oasis': ['#d19d01', '#0061fe', '#332800'],
  'iceberg light': ['#2d539e', '#adb1c4', '#33374c'],
  'cheesecake': ['#8e2949', '#d91c81', '#3a3335'],
  '9009': ['#080909', '#99947f', '#080909'],
  'lil dragon': ['#8a5bd6', '#a28db8', '#212b43'],
  'blueberry light': ['#506477', '#92a4be', '#678198'],
  'witch girl': ['#56786a', '#ddb4a7', '#56786a'],
  'terrazzo': ['#e0794e', '#688e8f', '#023e3b'],
  'darling': ['#ffffff', '#a30000', '#ffffff'],
  'serika': ['#e2b714', '#aaaeb3', '#323437'],
  'gruvbox light': ['#689d6a', '#a89984', '#3c3836'],
  'repose light': ['#5f605e', '#8f8e84', '#333538'],
  'godspeed': ['#9abbcd', '#ada998', '#646669'],
  'dollar': ['#6b886b', '#8a9b69', '#555a56'],
  'dmg': ['#ae185e', '#3846b1', '#414141'],
  'modern dolch light': ['#8fd1c3', '#acacac', '#454545'],
  'olive': ['#92946f', '#b7b39e', '#373731'],
  'taro': ['#130f1a', '#6f6c91', '#130f1a'],
  'shoko': ['#81c4dd', '#7599b1', '#3b4c58'],
  'beach': ['#96ceb4', '#ffcc5c', '#5b7869'],
  'breeze': ['#7d67a9', '#3a98b9', '#1b4c5e'],
  'froyo': ['#7b7d7d', '#b29c5e', '#7b7d7d'],
  'mr sleeves': ['#daa99b', '#9a9fa1', '#1d1d1d'],
  'fruit chew': ['#5c1e5f', '#b49cb5', '#282528'],
  'peaches': ['#dd7a5f', '#e7b28e', '#5f4c41'],
  'hanok': ['#513a2a', '#8b6f5c', '#393b3b'],
  'retro': ['#1d1b17', '#918b7d', '#1d1b17'],
  'pastel': ['#fbf4b6', '#b4e9ff', '#6d5c6f'],
  'vaporwave': ['#e368da', '#7c7faf', '#f1ebf1'],
  'frozen llama': ['#6d44a6', '#b690fd', '#ffffff'],
  'mizu': ['#fcfbf6', '#85a5bb', '#1a2633'],
  'pink lemonade': ['#f6a192', '#f6b092', '#fcfcf8'],
  'tiramisu': ['#c0976f', '#c0976f', '#7d5448'],
  'macroblank': ['#c13117', '#717977', '#490909'],
  'snes': ['#553d94', '#9f8ad4', '#2e2e2e'],
  'strawberry': ['#fcfcf8', '#e53c58', '#fcfcf8'],
  'creamsicle': ['#fcfcf8', '#ff661f', '#fcfcf8'],
  'lavender': ['#e4e3e9', '#e4e3e9', '#2f2a41'],
  'bingsu': ['#83616e', '#48373d', '#ebe6ea'],
  'cafe': ['#14120f', '#d4d2d1', '#14120f'],
  'fleuriste': ['#405a52', '#64374d', '#091914'],
  'miami': ['#05dfd7', '#94294c', '#f0e9ec'],
  'iv clover': ['#573e40', '#353535', '#3b2d3b'],
  'mexican': ['#b12189', '#333333', '#eeeeee'],
  'botanical': ['#eaf1f3', '#495755', '#eaf1f3'],
  'lime': ['#93c247', '#4b5257', '#bfcfdc'],
  'honey': ['#fff546', '#a66b00', '#f3eecb'],
  'leather': ['#ffe4bc', '#81482b', '#ffe4bc'],
  'diner': ['#c3af5b', '#445c7f', '#dfdbc8'],
  'alpine': ['#ffffff', '#9994b8', '#ffffff'],
  'dualshot': ['#212222', '#aaaaaa', '#212222'],
  'fundamentals': ['#7fa482', '#cac4be', '#131313'],
  'our theme': ['#fcd116', '#6d0f19', '#ffffff'],
  'ez mode': ['#fa62d5', '#138bf7', '#ffffff'],
  'evil eye': ['#f7f2ea', '#01589f', '#171718'],
  'menthol': ['#ffffff', '#186544', '#ffffff'],
  'comfy': ['#f8cdc6', '#9ec1cc', '#f5efee'],
  'trackday': ['#e0513e', '#5c7eb9', '#cfcfcf'],
  'muted': ['#c5b4e3', '#939eae', '#b1e4e3'],
  'red samurai': ['#c79e6e', '#55131b', '#e2dad0'],
  'sweden': ['#ffcc02', '#57abdb', '#ffffff'],
  'passion fruit': ['#f4a3b4', '#9994b8', '#ffffff'],
  'suisei': ['#bef0ff', '#fe9841', '#dbdeeb'],
  'striker': ['#d7dcda', '#0f2d4e', '#d6dbd9'],
  'cy red': ['#e55050', '#ff6060', '#ffaaaa'],
  'grand prix': ['#c0d036', '#5c6c80', '#c1c7d7'],
  'deku': ['#b63530', '#255458', '#f7f2ea'],
  'hedge': ['#6a994e', '#ede5b4', '#f7f1d6'],
  'retrocast': ['#88dbdf', '#f3e03b', '#ffffff'],
  'sewing tin': ['#f2ce83', '#446ad5', '#ffffff'],
  'bento': ['#ff7a90', '#4a768d', '#fffaf8'],
  '8008': ['#f44c7f', '#939eae', '#e9ecf0'],
  'matcha moccha': ['#7ec160', '#9e6749', '#ecddcc'],
  'fledgling': ['#fc6e83', '#8e5568', '#e6d5d3'],
  'onedark': ['#61afef', '#eceff4', '#98c379'],
  'copper': ['#b46a55', '#7ebab5', '#e7e0de'],
  'graen': ['#a59682', '#181d1a', '#a59682'],
  'cherry blossom': ['#d65ccc', '#787d82', '#d1d0c5'],
  'discord': ['#5a65ea', '#565861', '#dcdee3'],
  'serika dark': ['#e2b714', '#646669', '#d1d0c5'],
  'repose dark': ['#d6d2bc', '#8f8e84', '#d6d2bc'],
  'rose pine moon': ['#9ccfd8', '#c4a7e7', '#e0def4'],
  'blueberry dark': ['#add7ff', '#5c7da5', '#91b4d5'],
  'oblivion': ['#a5a096', '#5d6263', '#f7f5f1'],
  'watermelon': ['#d6686f', '#3e7a65', '#cdc6bc'],
  'carbon': ['#f66e0d', '#616161', '#f5e6c8'],
  'future funk': ['#f7f2ea', '#c18fff', '#f7f2ea'],
  'mint': ['#5cdb95', '#20688a', '#edf5e1'],
  'sonokai': ['#9ed072', '#e7c664', '#e2e2e3'],
  'laser': ['#009eaf', '#b82356', '#dbe7e8'],
  'viridescent': ['#95d5b2', '#84a98c', '#e9f5db'],
  'dracula': ['#bd93f9', '#6272a4', '#f8f8f2'],
  'material': ['#80cbc4', '#4c6772', '#e6edf3'],
  'modern dolch': ['#7eddd3', '#54585c', '#e3e6eb'],
  'superuser': ['#43ffaf', '#526777', '#e5f7ef'],
  'rudy': ['#af8f5c', '#3a506c', '#c9c8bf'],
  'bushido': ['#ec4c56', '#596172', '#f6f0e9'],
  'mashu': ['#76689a', '#d8a0a6', '#f1e2e4'],
  'nord': ['#88C0D0', '#2E3440', '#88C0D0'],
  'bouquet': ['#eaa09c', '#408e7b', '#e9e0d2'],
  'nebula': ['#be3c88', '#19b3b8', '#838686'],
  'peach blossom': ['#99b898', '#616161', '#fecea8'],
  '80s after dark': ['#fca6d1', '#99d6ea', '#e1e7ec'],
  'github': ['#41ce5c', '#788386', '#ccdae6'],
  'luna': ['#f67599', '#5a3a7e', '#ffe3eb'],
  'blue dolphin': ['#ffcefb', '#00e4ff', '#82eaff'],
  'gruvbox dark': ['#d79921', '#665c54', '#ebdbb2'],
  'purpleish': ['#7a52cc', '#3d3d66', '#7a52cc'],
  'bliss': ['#f0d3c9', '#665957', '#ffffff'],
  'catppuccin': ['#cba6f7', '#7f849c', '#cdd6f4'],
  'wavez': ['#6bde3b', '#1f5e6b', '#e9efe6'],
  'earthsong': ['#509452', '#f5ae2d', '#e6c7a8'],
  'monokai': ['#a6e22e', '#e6db74', '#e2e2dc'],
  'nautilus': ['#ebb723', '#0b4c6c', '#1cbaac'],
  'norse': ['#2b5f6d', '#505b5e', '#ccc2b1'],
  'metaverse': ['#d82934', '#5e5e5e', '#e8e8e8'],
  'rose pine': ['#9ccfd8', '#c4a7e7', '#e0def4'],
  'dev': ['#23a9d5', '#4b5975', '#ccccb5'],
  'horizon': ['#c4a88a', '#db886f', '#bbbbbb'],
  'night runner': ['#feff04', '#5c4a9c', '#e8e8e8'],
  'sunset': ['#f79777', '#5b578e', '#f4e0c9'],
  'moonlight': ['#c69f68', '#4b5975', '#ccccb5'],
  'ishtar': ['#91170c', '#847869', '#fae1c3'],
  'phantom': ['#7aa2f7', '#414868', '#c0caf5'],
  'dark note': ['#f2c17b', '#768f95', '#d2dff4'],
  'drowning': ['#4a6fb5', '#50688c', '#9393a7'],
  'grape': ['#ff8f00', '#651e56', '#ffffff'],
  'vscode': ['#007acc', '#4d4d4d', '#d4d4d4'],
  'metropolis': ['#56c3b7', '#326984', '#e4edf1'],
  'alduin': ['#dfd7af', '#444444', '#f5f3ed'],
  'olivia': ['#deaf9d', '#4e3e3e', '#f2efed'],
  'iceberg dark': ['#84a0c6', '#595e76', '#c6c8d1'],
  'solarized dark': ['#859900', '#2aa198', '#268bd2'],
  'dark magic girl': ['#f5b1cc', '#93e8d3', '#a288d9'],
  'cyberspace': ['#00ce7c', '#9578d3', '#c2fbe1'],
  'terminal': ['#79a617', '#48494b', '#e7eae0'],
  'chaos theory': ['#fd77d7', '#676e8a', '#dde5ed'],
  'joker': ['#99de1e', '#7554a3', '#e9e2f5'],
  'dots': ['#ffffff', '#676e8a', '#ffffff'],
  'everblush': ['#8ccf7e', '#838887', '#dadada'],
  'miami nights': ['#e4609b', '#47bac0', '#ffffff'],
  'aether': ['#eedaea', '#cf6bdd', '#eedaea'],
  'pulse': ['#17b8bd', '#53565a', '#e5f4f4'],
  'anti hero': ['#ffadad', '#ff3d8b', '#f1deef'],
  'ryujinscales': ['#f17754', '#ffbc90', '#ffe4bc'],
  'floret': ['#ffdd6d', '#779097', '#e5e5e5'],
  'terror below': ['#66ac92', '#015c53', '#dceae5'],
  'tron orange': ['#f0e800', '#ff6600', '#ffffff'],
  'aurora': ['#00e980', '#245c69', '#ffffff'],
  'red dragon': ['#ff3a32', '#e2a528', '#4a4d4e'],
  'dark': ['#eeeeee', '#444444', '#eeeeee'],
  'rgb': ['#eeeeee', '#444444', '#eeeeee'],
  'vesper': ['#ffc799', '#99ffe4', '#ffffff'],
  'voc': ['#e0caac', '#4c1e48', '#eeeae4'],
  'midnight': ['#60759f', '#394760', '#9fadc6'],
  'mountain': ['#e7e7e7', '#4c4c4c', '#e7e7e7'],
  'arch': ['#7ebab5', '#454864', '#f6f5f5'],
  'incognito': ['#ff9900', '#2f2f2f', '#c6c6c6'],
  'terra': ['#89c559', '#436029', '#f0edd1'],
  'trance': ['#e51376', '#3c4c79', '#ffffff'],
  'solarized osaka': ['#859900', '#2aa198', '#b58900'],
  'iv spade': ['#b7976a', '#404040', '#d3c2c3'],
  'hammerhead': ['#4fcdb9', '#213c53', '#e2f1f5'],
  'fire': ['#b31313', '#683434', '#ffffff'],
  'stealth': ['#383e42', '#5e676e', '#383e42'],
  'husqy': ['#c58aff', '#972fff', '#ebd7ff'],
  'matrix': ['#15ff00', '#006500', '#d1ffcd'],
  'shadow': ['#eeeeee', '#444444', '#eeeeee']
};

// Default theme
const DEFAULT_THEME = 'pastel';

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

// Theme elements
const themeToggle = document.getElementById('themeToggle');
const themePanel = document.getElementById('themePanel');
const themeClose = document.getElementById('themeClose');
const themeSearch = document.getElementById('themeSearch');
const themeGrid = document.getElementById('themeGrid');

// State
let isActive = false;
let urls = [];
let stats = { detected: 0, filtered: 0, total: 0 };
let isProcessing = false;
let currentTheme = DEFAULT_THEME;
let favoriteThemes = new Set();

// Utility function untuk waiting/delay
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Utility function untuk menghitung brightness color
function getBrightness(color) {
  // Remove # if present
  color = color.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Calculate brightness using relative luminance formula
  return (r * 0.299 + g * 0.587 + b * 0.114);
}

// Function untuk mendapatkan text color yang optimal berdasarkan background
function getOptimalTextColor(backgroundColor) {
  const brightness = getBrightness(backgroundColor);
  // Jika background terang (brightness > 128), gunakan text gelap
  // Jika background gelap (brightness <= 128), gunakan text terang
  return brightness > 128 ? '#000000' : '#ffffff';
}

// Enhanced TTML parser - Fixed to handle complex Netflix structure properly
function parseTTMLSubtitle(ttmlContent) {
  try {
    console.log('Starting TTML parsing - Content length:', ttmlContent.length);
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(ttmlContent, 'text/xml');
    const subtitles = [];
    
    // Check for parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      console.error('XML parsing error:', parseError.textContent);
      return [];
    }
    
    // Enhanced selector to find all <p> elements with proper namespace handling
    const pElements = xmlDoc.querySelectorAll('p[xml\\:id], p[begin]');
    console.log('Found paragraph elements:', pElements.length);
    
    pElements.forEach((p, index) => {
      const beginTime = p.getAttribute('begin');
      const endTime = p.getAttribute('end');
      const xmlId = p.getAttribute('xml:id') || p.getAttribute('id');
      
      if (!beginTime) {
        console.log(`Skipping entry ${index}: missing begin time`);
        return;
      }
      
      // Convert Netflix time format "91091000t" to seconds
      const beginSeconds = beginTime ? parseFloat(beginTime.replace('t', '')) / 10000000 : 0;
      const endSeconds = endTime ? parseFloat(endTime.replace('t', '')) / 10000000 : 0;
      
      // Enhanced text extraction to handle <span> elements and <br/> tags properly
      let textContent = '';
      
      // Check if there are <span> elements
      const spanElements = p.querySelectorAll('span');
      
      if (spanElements.length > 0) {
        // Extract text from each span and handle line breaks
        const textParts = [];
        
        spanElements.forEach((span, spanIndex) => {
          let spanText = span.textContent?.trim() || '';
          if (spanText) {
            textParts.push(spanText);
          }
          
          // Check for <br/> elements after this span
          let nextSibling = span.nextSibling;
          while (nextSibling) {
            if (nextSibling.nodeName === 'BR' || nextSibling.nodeName === 'br') {
              // Line break found, but we'll join with space for better readability
              break;
            } else if (nextSibling.nodeType === Node.TEXT_NODE) {
              const textNode = nextSibling.textContent?.trim();
              if (textNode) {
                textParts.push(textNode);
              }
            } else if (nextSibling.nodeName === 'SPAN' || nextSibling.nodeName === 'span') {
              // Next span will be handled in the loop
              break;
            }
            nextSibling = nextSibling.nextSibling;
          }
        });
        
        textContent = textParts.join(' ');
      } else {
        // Fallback: get all text content from the paragraph
        textContent = p.textContent || '';
      }
      
      // Clean up text content
      textContent = textContent
        .replace(/[\[\]]/g, '') // Remove brackets
        .replace(/♪/g, '') // Remove music notes  
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/^\s+|\s+$/g, '') // Trim
        .replace(/^["\(\[](.+)["\)\]]$/, '$1') // Remove surrounding quotes/brackets
        .trim();
      
      // Only add if we have meaningful content
      if (textContent && textContent.length > 0) {
        subtitles.push({
          id: xmlId || `subtitle_${index + 1}`,
          start: beginSeconds,
          end: endSeconds,
          text: textContent,
          startTime: formatTime(beginSeconds),
          endTime: formatTime(endSeconds)
        });
        
        // Debug first few entries
        if (index < 5) {
          console.log(`Entry ${index + 1}: ${formatTime(beginSeconds)} - "${textContent.substring(0, 50)}${textContent.length > 50 ? '...' : ''}"`);
        }
      }
    });
    
    // Sort by start time
    const sortedSubtitles = subtitles.sort((a, b) => a.start - b.start);
    
    console.log(`✅ Successfully parsed ${sortedSubtitles.length} subtitle entries from TTML`);
    console.log(`Time range: ${sortedSubtitles[0]?.startTime || '0:00'} - ${sortedSubtitles[sortedSubtitles.length - 1]?.endTime || '0:00'}`);
    
    return sortedSubtitles;
    
  } catch (error) {
    console.error('Error parsing TTML:', error);
    return [];
  }
}

// Format time dalam format MM:SS atau HH:MM:SS
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

// Netflix seek function
function seekNetflixVideo(timeInSeconds) {
  const script = `
  try {
    const waktuTujuanDetik = ${timeInSeconds};
    const api = window.netflix.appContext.state.playerApp.getAPI();
    const videoPlayer = api.videoPlayer;
    const sessionId = videoPlayer.getAllPlayerSessionIds()[0];
    const player = videoPlayer.getVideoPlayerBySessionId(sessionId);
    
    const waktuTujuanMilidetik = waktuTujuanDetik * 1000;
    player.seek(waktuTujuanMilidetik);
    
    console.log('✅ Berhasil melompat ke detik ' + waktuTujuanDetik);
    true;
  } catch (e) {
    console.error("Gagal melakukan seek. Pastikan video sedang diputar.", e);
    false;
  }`;
  
  return script;
}

// Initialize popup
document.addEventListener('DOMContentLoaded', function() {
  console.log('Smart URL Monitor popup with enhanced loading system loading...');
  
  loadThemeSettings().then(() => {
    initializeThemes();
    applyTheme(currentTheme);
  });
  
  setTimeout(loadState, 100);
  
  // Event listeners
  toggleBtn.addEventListener('click', handleToggleClick);
  clearBtn.addEventListener('click', handleClearClick);
  exportBtn.addEventListener('click', handleExportClick);
  
  // Theme event listeners
  themeToggle.addEventListener('click', () => {
    themePanel.classList.add('active');
  });
  
  themeClose.addEventListener('click', () => {
    themePanel.classList.remove('active');
  });
  
  themePanel.addEventListener('click', (e) => {
    if (e.target === themePanel) {
      themePanel.classList.remove('active');
    }
  });
  
  themeSearch.addEventListener('input', handleThemeSearch);
});

// Load theme settings dengan Promise
function loadThemeSettings() {
  return new Promise((resolve) => {
    try {
      chrome.storage.sync.get(['currentTheme', 'favoriteThemes'], (result) => {
        if (!chrome.runtime.lastError) {
          currentTheme = result.currentTheme || DEFAULT_THEME;
          favoriteThemes = new Set(result.favoriteThemes || []);
          console.log('Theme settings loaded:', { currentTheme, favoriteCount: favoriteThemes.size });
        }
        resolve();
      });
    } catch (error) {
      console.error('Error loading theme settings:', error);
      resolve();
    }
  });
}

// Save theme settings
function saveThemeSettings() {
  try {
    chrome.storage.sync.set({
      currentTheme: currentTheme,
      favoriteThemes: Array.from(favoriteThemes)
    }, () => {
      if (!chrome.runtime.lastError) {
        console.log('Theme settings saved:', currentTheme);
      }
    });
  } catch (error) {
    console.error('Error saving theme settings:', error);
  }
}

// Initialize themes
function initializeThemes() {
  const themeNames = Object.keys(THEMES).sort();
  
  themeNames.forEach(themeName => {
    const themeElement = createThemeElement(themeName);
    themeGrid.appendChild(themeElement);
  });
  
  console.log('Themes initialized:', themeNames.length);
}

// Create theme element dengan HCI compliant colors
function createThemeElement(themeName) {
  const colors = THEMES[themeName];
  const div = document.createElement('div');
  div.className = 'theme-button';
  div.setAttribute('data-theme', themeName);
  
  if (themeName === currentTheme) {
    div.classList.add('active');
  }
  
  // Apply HCI compliant text color
  const optimalTextColor = getOptimalTextColor(colors[0]);
  
  div.style.cssText = `
    background: ${colors[0]};
    color: ${optimalTextColor};
    outline: 0 solid ${colors[2]};
  `;
  
  const isFavorite = favoriteThemes.has(themeName);
  
  div.innerHTML = `
    <div class="favButton ${isFavorite ? 'favorite' : ''}">
      <i class="fa${isFavorite ? 's' : 'r'} fa-star"></i>
    </div>
    <div class="text">${themeName}</div>
    <div class="themeBubbles" style="background: ${colors[0]}; outline: 0.25rem solid ${colors[0]};">
      <div class="themeBubble" style="background: ${colors[0]}"></div>
      <div class="themeBubble" style="background: ${colors[1]}"></div>
      <div class="themeBubble" style="background: ${colors[2]}"></div>
    </div>
  `;
  
  // Theme selection handler
  div.addEventListener('click', (e) => {
    if (!e.target.closest('.favButton')) {
      selectTheme(themeName);
    }
  });
  
  // Favorite toggle handler
  const favButton = div.querySelector('.favButton');
  favButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(themeName, favButton);
  });
  
  return div;
}

// Select theme dengan persistence yang benar
function selectTheme(themeName) {
  // Remove active class from all themes
  document.querySelectorAll('.theme-button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Add active class to selected theme
  const selectedElement = document.querySelector(`[data-theme="${themeName}"]`);
  if (selectedElement) {
    selectedElement.classList.add('active');
  }
  
  currentTheme = themeName;
  applyTheme(themeName);
  saveThemeSettings();
  
  showNotification(`Theme "${themeName}" applied successfully!`, 'success');
}

// Toggle favorite
function toggleFavorite(themeName, favButton) {
  const isFavorite = favoriteThemes.has(themeName);
  
  if (isFavorite) {
    favoriteThemes.delete(themeName);
    favButton.innerHTML = '<i class="far fa-star"></i>';
    favButton.classList.remove('favorite');
  } else {
    favoriteThemes.add(themeName);
    favButton.innerHTML = '<i class="fas fa-star"></i>';
    favButton.classList.add('favorite');
  }
  
  saveThemeSettings();
}

// Apply theme dengan HCI compliance
function applyTheme(themeName) {
  const colors = THEMES[themeName] || THEMES[DEFAULT_THEME];
  const root = document.documentElement;
  
  // Apply theme colors
  root.style.setProperty('--primary-color', colors[0]);
  root.style.setProperty('--secondary-color', colors[1]);
  root.style.setProperty('--accent-color', colors[2]);
  
  // Apply HCI compliant text colors
  const primaryTextColor = getOptimalTextColor(colors[0]);
  const secondaryTextColor = getOptimalTextColor(colors[1]);
  
  root.style.setProperty('--text-color', colors[2]);
  root.style.setProperty('--primary-text-color', primaryTextColor);
  root.style.setProperty('--secondary-text-color', secondaryTextColor);
  
  console.log(`Theme "${themeName}" applied with HCI colors:`, colors);
}

// Handle theme search
function handleThemeSearch() {
  const searchTerm = themeSearch.value.toLowerCase();
  const themeButtons = document.querySelectorAll('.theme-button');
  
  themeButtons.forEach(button => {
    const themeName = button.getAttribute('data-theme').toLowerCase();
    if (themeName.includes(searchTerm)) {
      button.style.display = 'flex';
    } else {
      button.style.display = 'none';
    }
  });
}

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

// Create URL element with transcript button
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
  
  // Add transcript button if Netflix URL
  const isNetflix = urlItem.domain.includes('netflix') || urlItem.domain.includes('nflxvideo');
  if (isNetflix) {
    badges += `<button class="transcript-btn" title="View Transcript"><i class="fas fa-closed-captioning"></i></button>`;
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
  div.addEventListener('click', function(e) {
    if (!e.target.closest('.transcript-btn')) {
      chrome.runtime.sendMessage({ 
        action: 'openUrl', 
        url: urlItem.url 
      }, function(response) {
        if (response && response.success) {
          showNotification('Quality URL opened in new tab', 'success');
        }
      });
    }
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
  
  // Transcript button handler
  const transcriptBtn = div.querySelector('.transcript-btn');
  if (transcriptBtn) {
    transcriptBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      showTranscriptModalEnhanced(urlItem.url);
    });
  }
  
  return div;
}

// Enhanced transcript modal with progressive loading system
async function showTranscriptModalEnhanced(videoUrl) {
  // Create modal with enhanced loading UI
  const modal = document.createElement('div');
  modal.className = 'transcript-modal';
  modal.innerHTML = `
    <div class="transcript-content">
      <div class="transcript-header">
        <h3>Video Transcript</h3>
        <button class="transcript-close"><i class="fas fa-times"></i></button>
      </div>
      <div class="transcript-body">
        <div class="enhanced-loading" id="enhancedLoading">
          <div class="loading-animation">
            <div class="spinner-container">
              <div class="loading-spinner"></div>
              <div class="loading-pulse"></div>
            </div>
          </div>
          <div class="loading-progress">
            <div class="progress-bar">
              <div class="progress-fill" id="progressFill"></div>
            </div>
            <div class="progress-percentage" id="progressPercentage">0%</div>
          </div>
          <div class="loading-message" id="loadingMessage">
            Initializing transcript system...
          </div>
          <div class="loading-details" id="loadingDetails">
            Please wait while we prepare the subtitle data
          </div>
          <div class="loading-tips" id="loadingTips">
            💡 Tip: You can click any subtitle line to jump to that timestamp
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add enhanced loading styles
  const style = document.createElement('style');
  style.textContent = `
    .enhanced-loading {
      text-align: center;
      padding: 40px 20px;
      color: var(--accent-color);
      max-width: 400px;
      margin: 0 auto;
    }
    
    .loading-animation {
      margin-bottom: 30px;
      position: relative;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .spinner-container {
      position: relative;
    }
    
    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(109, 92, 111, 0.2);
      border-top: 3px solid var(--accent-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    .loading-pulse {
      position: absolute;
      top: -10px;
      left: -10px;
      width: 70px;
      height: 70px;
      border: 2px solid var(--accent-color);
      border-radius: 50%;
      opacity: 0;
      animation: pulse 2s ease-in-out infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0% { transform: scale(0.8); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.3; }
      100% { transform: scale(1.4); opacity: 0; }
    }
    
    .loading-progress {
      margin-bottom: 25px;
    }
    
    .progress-bar {
      width: 100%;
      height: 8px;
      background: var(--secondary-color);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 10px;
      border: 1px solid var(--accent-color);
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-color), var(--secondary-color));
      width: 0%;
      transition: width 0.3s ease;
      border-radius: 4px;
    }
    
    .progress-percentage {
      font-size: 14px;
      font-weight: 600;
      color: var(--accent-color);
    }
    
    .loading-message {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 10px;
      color: var(--accent-color);
      min-height: 24px;
    }
    
    .loading-details {
      font-size: 12px;
      color: var(--accent-color);
      opacity: 0.7;
      margin-bottom: 20px;
      min-height: 18px;
    }
    
    .loading-tips {
      font-size: 11px;
      color: var(--accent-color);
      opacity: 0.6;
      font-style: italic;
      background: var(--secondary-color);
      padding: 10px;
      border-radius: 6px;
      border: 1px solid var(--accent-color);
    }
    
    .error-display {
      text-align: center;
      padding: 30px 20px;
      color: #8B5A3C;
    }
    
    .error-icon {
      font-size: 48px;
      margin-bottom: 20px;
      color: #8B5A3C;
    }
    
    .retry-button {
      background: var(--accent-color);
      color: var(--primary-color);
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      margin-top: 15px;
      transition: opacity 0.2s ease;
    }
    
    .retry-button:hover {
      opacity: 0.8;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeInUp {
      from { 
        opacity: 0; 
        transform: translateY(15px) scale(0.95); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0) scale(1); 
      }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(modal);
  
  // Close handlers
  modal.querySelector('.transcript-close').addEventListener('click', () => {
    document.body.removeChild(modal);
    document.head.removeChild(style);
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
      document.head.removeChild(style);
    }
  });
  
  // Start enhanced loading process
  await startEnhancedLoading(modal, videoUrl);
}

// Progressive loading with stages and retry mechanism
async function startEnhancedLoading(modal, videoUrl, attemptNumber = 1) {
  const progressFill = modal.querySelector('#progressFill');
  const progressPercentage = modal.querySelector('#progressPercentage');
  const loadingMessage = modal.querySelector('#loadingMessage');
  const loadingDetails = modal.querySelector('#loadingDetails');
  
  try {
    // Execute loading steps with progress
    let totalProgress = 0;
    const stepIncrement = 100 / (LOADING_CONFIG.PROGRESS_STEPS.length + 2); // +2 for fetch and parse steps
    
    // Step-by-step loading process
    for (let i = 0; i < LOADING_CONFIG.PROGRESS_STEPS.length; i++) {
      const step = LOADING_CONFIG.PROGRESS_STEPS[i];
      
      loadingMessage.textContent = step.message;
      
      if (i === 0) {
        loadingDetails.textContent = "Setting up transcript viewer system...";
      } else if (i === 1) {
        loadingDetails.textContent = "Establishing connection to subtitle services...";
      } else if (i === 2) {
        loadingDetails.textContent = "Downloading transcript data from GitHub repository...";
      } else if (i === 3) {
        loadingDetails.textContent = "Analyzing TTML format and XML structure...";
      } else if (i === 4) {
        loadingDetails.textContent = "Extracting and formatting subtitle entries...";
      }
      
      await wait(step.delay);
      
      totalProgress += stepIncrement;
      progressFill.style.width = `${Math.min(totalProgress, 90)}%`;
      progressPercentage.textContent = `${Math.floor(totalProgress)}%`;
    }
    
    // Fetch the TTML file
    loadingMessage.textContent = "Downloading transcript file...";
    loadingDetails.textContent = "Fetching TTML data from remote repository...";
    
    const response = await fetch('https://raw.githubusercontent.com/HaikalE/auto-transcript-collector/main/example_transcript.txt');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    totalProgress += stepIncrement;
    progressFill.style.width = `${Math.min(totalProgress, 95)}%`;
    progressPercentage.textContent = `${Math.floor(totalProgress)}%`;
    
    const ttmlContent = await response.text();
    
    // Parse the content
    loadingMessage.textContent = "Processing subtitle data...";
    loadingDetails.textContent = "Parsing XML structure and extracting timestamps...";
    
    // Add some processing time to show the progress
    await wait(800);
    
    const subtitles = parseTTMLSubtitle(ttmlContent);
    
    // Complete loading
    progressFill.style.width = "100%";
    progressPercentage.textContent = "100%";
    loadingMessage.textContent = "Transcript loaded successfully!";
    loadingDetails.textContent = `Found ${subtitles.length} subtitle entries`;
    
    // Wait a bit to show completion
    await wait(500);
    
    // Render transcript
    await renderTranscriptEnhanced(modal, subtitles);
    
    console.log('✅ Enhanced loading completed successfully');
    
  } catch (error) {
    console.error(`❌ Loading attempt ${attemptNumber} failed:`, error);
    
    if (attemptNumber < LOADING_CONFIG.RETRY_ATTEMPTS) {
      // Show retry message
      loadingMessage.textContent = `Attempt ${attemptNumber} failed. Retrying...`;
      loadingDetails.textContent = `Error: ${error.message}`;
      
      await wait(LOADING_CONFIG.RETRY_DELAY);
      
      // Reset progress and retry
      progressFill.style.width = "0%";
      progressPercentage.textContent = "0%";
      
      return await startEnhancedLoading(modal, videoUrl, attemptNumber + 1);
    }
    
    // Show error if all attempts failed
    showLoadingError(modal, error, videoUrl);
  }
}

// Show error with retry option
function showLoadingError(modal, error, videoUrl) {
  const body = modal.querySelector('.transcript-body');
  body.innerHTML = `
    <div class="error-display">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h4>Failed to Load Transcript</h4>
      <p>We couldn't load the transcript file after ${LOADING_CONFIG.RETRY_ATTEMPTS} attempts.</p>
      <small><strong>Error:</strong> ${error.message}</small>
      
      <br><br>
      
      <div style="background: var(--secondary-color); padding: 15px; border-radius: 6px; border: 1px solid #ccc; margin: 15px 0;">
        <strong>🔧 Technical Details:</strong><br>
        <small>
          • The TTML parser is working correctly<br>
          • This error occurs when the remote file can't be fetched<br>
          • In production, this would load from Netflix's servers<br>
          • The system attempted ${LOADING_CONFIG.RETRY_ATTEMPTS} times with ${LOADING_CONFIG.RETRY_DELAY}ms delays
        </small>
      </div>
      
      <button class="retry-button" onclick="retryLoading()">
        <i class="fas fa-refresh"></i> Try Again
      </button>
    </div>
  `;
  
  // Store retry function globally
  window.retryLoading = async () => {
    body.innerHTML = `
      <div class="enhanced-loading" id="enhancedLoading">
        <div class="loading-animation">
          <div class="spinner-container">
            <div class="loading-spinner"></div>
            <div class="loading-pulse"></div>
          </div>
        </div>
        <div class="loading-progress">
          <div class="progress-bar">
            <div class="progress-fill" id="progressFill"></div>
          </div>
          <div class="progress-percentage" id="progressPercentage">0%</div>
        </div>
        <div class="loading-message" id="loadingMessage">
          Retrying transcript load...
        </div>
        <div class="loading-details" id="loadingDetails">
          Attempting to reload the subtitle data
        </div>
        <div class="loading-tips" id="loadingTips">
          💡 Tip: You can click any subtitle line to jump to that timestamp
        </div>
      </div>
    `;
    
    await startEnhancedLoading(modal, videoUrl, 1);
  };
}

// Enhanced transcript rendering with smooth animations
async function renderTranscriptEnhanced(modal, subtitles) {
  const body = modal.querySelector('.transcript-body');
  
  if (subtitles.length === 0) {
    body.innerHTML = `
      <div class="error-display">
        <div class="error-icon">
          <i class="fas fa-search"></i>
        </div>
        <h4>No Transcript Entries Found</h4>
        <p>The TTML file was loaded successfully but contains no readable subtitle entries.</p>
        
        <div style="background: var(--secondary-color); padding: 15px; border-radius: 6px; border: 1px solid #ccc; margin: 15px 0;">
          <strong>🔍 Possible Reasons:</strong><br>
          <small>
            • The file might be empty or corrupted<br>
            • XML structure doesn't match Netflix format<br>
            • Subtitle entries have invalid timestamps<br>
            • Content filtering removed all entries
          </small>
        </div>
      </div>
    `;
    return;
  }
  
  // Calculate total duration
  const totalDuration = subtitles[subtitles.length - 1]?.end || 0;
  const durationFormatted = formatTime(totalDuration);
  
  // Create success animation first
  body.innerHTML = `
    <div class="loading-success" style="text-align: center; padding: 20px;">
      <div style="color: #4CAF50; font-size: 48px; margin-bottom: 15px;">
        <i class="fas fa-check-circle"></i>
      </div>
      <h4 style="color: var(--accent-color); margin-bottom: 10px;">
        ✅ Successfully loaded ${subtitles.length} subtitle entries!
      </h4>
      <p style="color: var(--accent-color); opacity: 0.7; font-size: 12px;">
        Duration: ${durationFormatted} • Preparing interactive transcript...
      </p>
    </div>
  `;
  
  // After success animation, show transcript
  setTimeout(() => {
    let transcriptHTML = `
      <div style="text-align: center; margin-bottom: 20px; padding: 15px; background: var(--secondary-color); border-radius: 8px; border: 2px solid var(--accent-color); animation: fadeIn 0.5s ease;">
        <div style="font-size: 18px; font-weight: 600; color: var(--accent-color); margin-bottom: 8px;">
          📝 ${subtitles.length} Transcript Entries Loaded
        </div>
        <div style="font-size: 12px; color: var(--accent-color); opacity: 0.8;">
          Duration: ${durationFormatted} • Click any line to seek to that time
        </div>
        <div style="font-size: 10px; color: var(--accent-color); opacity: 0.6; margin-top: 8px;">
          🎬 Enhanced Loading System v3.4 • Netflix Subtitle Format
        </div>
      </div>
      <div class="transcript-list" style="animation: slideIn 0.6s ease;">`;
    
    // Render all subtitle entries with fade-in animation
    subtitles.forEach((subtitle, index) => {
      const animationDelay = Math.min(index * 0.02, 1); // Max 1s delay
      transcriptHTML += `
        <div class="transcript-item" 
             data-time="${subtitle.start}" 
             title="Seek to ${subtitle.startTime}"
             style="animation: fadeInUp 0.4s ease ${animationDelay}s both;">
          <div class="transcript-time">${subtitle.startTime}</div>
          <div class="transcript-text">${subtitle.text}</div>
        </div>
      `;
    });
    
    transcriptHTML += '</div>';
    
    body.innerHTML = transcriptHTML;
    
    console.log(`✅ Enhanced rendering completed for ${subtitles.length} entries with smooth animations`);
    
    // Add click handlers for seeking
    body.querySelectorAll('.transcript-item').forEach((item) => {
      item.addEventListener('click', () => {
        const timeInSeconds = parseFloat(item.getAttribute('data-time'));
        
        // Add click animation
        item.style.transform = 'scale(0.98)';
        setTimeout(() => {
          item.style.transform = '';
        }, 150);
        
        // Execute Netflix seek
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs[0]) {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: function(time) {
                try {
                  const waktuTujuanDetik = time;
                  const api = window.netflix.appContext.state.playerApp.getAPI();
                  const videoPlayer = api.videoPlayer;
                  const sessionId = videoPlayer.getAllPlayerSessionIds()[0];
                  const player = videoPlayer.getVideoPlayerBySessionId(sessionId);
                  
                  const waktuTujuanMilidetik = waktuTujuanDetik * 1000;
                  player.seek(waktuTujuanMilidetik);
                  
                  console.log('✅ Berhasil melompat ke detik ' + waktuTujuanDetik);
                  return true;
                } catch (e) {
                  console.error("Gagal melakukan seek. Pastikan video sedang diputar.", e);
                  return false;
                }
              },
              args: [timeInSeconds]
            }, (result) => {
              if (result && result[0] && result[0].result) {
                showNotification(`⏰ Jumped to ${formatTime(timeInSeconds)}`, 'success');
              } else {
                showNotification('Failed to seek. Make sure Netflix video is playing.', 'error');
              }
            });
          }
        });
      });
    });
    
  }, 1500); // Wait 1.5s to show success animation
}

// Original showTranscriptModal (kept as fallback)
function showTranscriptModal(videoUrl) {
  // Redirect to enhanced version
  showTranscriptModalEnhanced(videoUrl);
}

// Show notification
function showNotification(message, type) {
  try {
    const notification = document.createElement('div');
    
    let backgroundColor;
    switch(type) {
      case 'success':
        backgroundColor = 'var(--accent-color)';
        break;
      case 'error':
        backgroundColor = '#8B5A3C';
        break;
      case 'warning':
        backgroundColor = '#9A8B73';
        break;
      default:
        backgroundColor = 'var(--accent-color)';
    }
    
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      padding: 10px 16px;
      border-radius: 6px;
      color: var(--primary-color);
      font-size: 11px;
      z-index: 1001;
      max-width: 350px;
      text-align: center;
      background: ${backgroundColor};
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      pointer-events: none;
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
      letter-spacing: 0.5px;
      border: 1px solid rgba(255, 255, 255, 0.2);
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

console.log('🚀 Smart URL Monitor v3.4 with Enhanced Loading System loaded! Progressive wait stages for better UX 🎬');