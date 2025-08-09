# Smart URL Monitor

<div align="center">

![Version](https://img.shields.io/badge/version-3.5-blue)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green)
![Themes](https://img.shields.io/badge/themes-140+-purple)
![License](https://img.shields.io/badge/license-MIT-orange)

**Advanced URL monitoring extension with Netflix transcript viewer and 140+ customizable themes**

</div>

## 📸 Screenshots

<div align="center">
  <div>
    <h4>📊 Main Dashboard</h4>
    <img width="300" src="https://github.com/user-attachments/assets/35db5eee-907e-4a19-b662-e1c654fd51d8" alt="Main Dashboard - URL monitoring with statistics and filtering system">
  </div>
  
  <div>
    <h4>📺 Netflix Transcript Viewer</h4>
    <img width="300" src="https://github.com/user-attachments/assets/63948a2c-d306-43d0-a297-b6e7845fa766" alt="Netflix Transcript Viewer - Clickable timestamps with live highlighting">
  </div>
  
  <div>
    <h4>🎨 Theme Selector</h4>
    <img width="300" src="https://github.com/user-attachments/assets/4d732371-1afd-4a43-8480-f53f7f70cf8a" alt="Theme Selector - 140+ customizable color themes with search"/>

  </div>
  
  <div>
    <h4>🌈 Live Theme Preview</h4>
    <img width="300" src="https://github.com/user-attachments/assets/423469af-847a-4be9-843b-a1d32742de9b" alt="Live Theme Preview - Real-time theme switching and multiple windows">
  </div>
</div>

## ✨ Features

### 🎨 Theme System
- **140+ Color Themes** - Curated from design communities
- **Real-time Switching** - Instant preview and application
- **Search & Favorites** - Find and save preferred themes
- **HCI Compliant** - Optimal text contrast ratios
- **Persistent Settings** - Auto-save across sessions

### 📺 Netflix Transcript Viewer
- **TTML Parser** - Parse Netflix subtitle files
- **Clickable Timestamps** - Seek video to exact moments
- **Live Highlighting** - Synchronized with video playback
- **YouTube-style Interface** - Familiar transcript experience
- **Auto-detection** - Smart subtitle URL recognition

### 🔗 Smart URL Monitoring
- **Intelligent Filtering** - Focus on `?o=` parameter URLs
- **Download Prevention** - Block unwanted file types
- **Real-time Monitoring** - Visual feedback and notifications
- **Domain Categorization** - Organized URL classification
- **Analytics Dashboard** - Professional statistics view

## 🚀 Installation

1. Download the latest release or clone this repository
2. Open Chrome → `chrome://extensions/`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** → Select extension folder
5. Pin extension to toolbar for easy access

## 📖 Usage

<div>

### Theme Customization
1. Click the **palette icon** in extension header
2. Browse **140+ available themes**
3. Use **search** for specific styles
4. Click any theme for **instant application**
5. Mark **favorites** for quick access

### Netflix Transcript
1. Start monitoring and **browse Netflix**
2. Look for **transcript button** on Netflix URLs
3. Click to open **transcript viewer**
4. Click **timestamps** to seek video
5. Follow **live highlighting** during playback

</div>

## ⚙️ Configuration

### URL Filtering Rules
```javascript
// Auto-captured URLs:
✅ URLs with '?o=' parameter
✅ Streaming domains (netflix, youtube, etc.)
✅ Media files (.m3u8, .ts, .mp4)

// Auto-filtered URLs:
❌ Documents (.pdf, .doc, .txt)
❌ Archives (.zip, .rar, .7z)
❌ Executables (.exe, .msi, .dmg)
❌ Images (.jpg, .png, .gif)
```

### Theme Structure
Each theme consists of:
- **Primary** - Main background color
- **Secondary** - Card/container background  
- **Accent** - Text, borders, and highlights

## 🎯 Use Cases

| User Type | Benefits |
|-----------|----------|
| **Content Creators** | Monitor Netflix subtitles, extract transcripts, brand-matched themes |
| **Network Analysts** | Track streaming URLs, analyze delivery networks, export data |
| **UI/UX Designers** | 140+ color inspiration, HCI compliant combinations, interface reference |

## 📚 Technical Details

### Architecture
- **Manifest V3** - Latest Chrome extension standard
- **Service Worker** - Efficient background processing
- **Chrome APIs** - Storage, tabs, scripting, webRequest
- **Modern JavaScript** - ES6+ features and APIs

### Performance
- **Lightweight** - Minimal memory footprint
- **Efficient Filtering** - Optimized algorithms
- **Fast Theme Switching** - CSS variables for instant updates
- **Persistent Settings** - Chrome sync storage integration

## 📝 Version History

| Version | Features |
|---------|----------|
| **v3.5** | Enhanced TTML parser, live highlighting, improved debugging |
| **v3.3** | Netflix transcript integration, HCI compliant themes |
| **v3.2** | 140+ theme system, search & favorites functionality |
| **v3.1** | Smart filtering algorithms, analytics dashboard |

## 🛣️ Roadmap

### Planned Features
- **Custom Theme Creator** - Build your own color schemes
- **Theme Import/Export** - Share with community
- **Multi-language Transcripts** - Extended language support
- **AI-powered Categorization** - Smart URL classification
- **Mobile Support** - Chrome mobile compatibility

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch
3. **Follow** code style guidelines
4. **Test** thoroughly before submitting
5. **Submit** pull request with clear description

### Contributing Themes
- Follow format: `['primary', 'secondary', 'accent']`
- Ensure HCI compliance with proper contrast
- Test across different UI elements

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Communities** - Inspiring color palettes
- **Chrome Extension Platform** - Robust APIs
- **Open Source Community** - Collaborative development
- **User Feedback** - Continuous improvement

---

<div align="center">

**Smart URL Monitor** - Advanced Chrome Extension

*Intelligent URL monitoring with Netflix transcript viewer and 140+ themes*

</div>
