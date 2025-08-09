# 🎬 Netflix Transcript Collector

<div align="center">

![Version](https://img.shields.io/badge/version-3.5-blue)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green)
![Netflix](https://img.shields.io/badge/Netflix-Compatible-red)
![Themes](https://img.shields.io/badge/themes-140+-purple)
![License](https://img.shields.io/badge/license-MIT-orange)

**Professional Netflix transcript collector with clickable timestamps, YouTube-style navigation, and 140+ beautiful themes**

*Turn Netflix into a professional learning platform with interactive transcripts!*

</div>

## 🚀 Why Netflix Transcript Collector?

Tired of rewinding Netflix videos to catch specific dialogue? Want to navigate videos like YouTube with clickable transcripts? This extension automatically **collects Netflix subtitles** and transforms them into **interactive transcripts** with clickable timestamps for instant video seeking!

## 📸 Screenshots

<div align="center">
  <div>
    <h4>🎬 Netflix Transcript Viewer</h4>
    <img width="300" src="https://github.com/user-attachments/assets/63948a2c-d306-43d0-a297-b6e7845fa766" alt="Netflix Transcript Viewer - Clickable timestamps with live highlighting">
  </div>
  
  <div>
    <h4>📊 Main Dashboard</h4>
    <img width="300" src="https://github.com/user-attachments/assets/35db5eee-907e-4a19-b662-e1c654fd51d8" alt="Main Dashboard - Netflix URL monitoring with transcript detection">
  </div>
  
  <div>
    <h4>🎨 Theme Selector</h4>
    <img width="300" src="https://github.com/user-attachments/assets/de91f275-8698-4fea-8934-5b54c4224a90" alt="Theme Selector - 140+ customizable color themes">
  </div>
  
  <div>
    <h4>🌈 Live Theme Preview</h4>
    <img width="300" src="https://github.com/user-attachments/assets/423469af-847a-4be9-843b-a1d32742de9b" alt="Live Theme Preview - Real-time theme switching">
  </div>
</div>

## ✨ Key Features

### 🎬 **Netflix Transcript Magic**
- **🔍 Auto-Detection** - Automatically finds Netflix subtitle files
- **📝 TTML Parser** - Converts Netflix subtitles to interactive transcripts
- **⏱️ Clickable Timestamps** - Click any line to jump to that moment
- **🔴 Live Highlighting** - Current subtitle highlighted in real-time
- **🎯 Precise Seeking** - Millisecond-accurate video navigation
- **📱 YouTube-Style UI** - Professional transcript viewer interface

### 🎨 **Beautiful Customization**
- **140+ Stunning Themes** - Curated color schemes from design communities
- **⚡ Real-time Switching** - Instant theme preview and application
- **⭐ Favorites System** - Save and organize your preferred themes
- **🔍 Smart Search** - Find themes by color or style
- **♿ HCI Compliant** - Optimal contrast ratios for accessibility
- **💾 Auto-Save** - Persistent settings across sessions

### 🛡️ **Smart URL Intelligence**
- **🎯 Netflix Focus** - Specifically optimized for Netflix streaming
- **🚫 Download Prevention** - Blocks unwanted media file downloads
- **📊 Real-time Analytics** - Professional monitoring dashboard
- **🔗 Quality Filtering** - Only captures relevant streaming URLs
- **📈 Visual Statistics** - Track collected transcripts and URLs

## 🚀 Quick Start

### Installation
1. **Download** the extension or clone this repository
2. **Open Chrome** → `chrome://extensions/`
3. **Enable Developer mode** (top-right toggle)
4. **Load unpacked** → Select the extension folder
5. **Pin to toolbar** for easy access

### Netflix Transcript Usage
1. **Start Monitoring** - Click the extension and hit "Start Monitoring"
2. **Browse Netflix** - Visit any Netflix video/series
3. **Get Transcripts** - Look for the 🎬 transcript button on Netflix URLs
4. **Navigate Videos** - Click any timestamp to jump to that moment
5. **Enjoy Professional Experience** - YouTube-style navigation on Netflix!

## 🎯 Perfect For

| **Use Case** | **Benefits** |
|--------------|--------------|
| **🎓 Language Learning** | Read subtitles while watching, click to replay difficult sections |
| **📚 Educational Content** | Jump to specific topics, review key concepts quickly |
| **🔍 Research & Analysis** | Navigate documentaries efficiently, find specific quotes |
| **♿ Accessibility** | Enhanced viewing experience for hearing-impaired users |
| **🎬 Content Creation** | Extract dialogue, find specific scenes for references |
| **📝 Note Taking** | Jump between concepts, create timestamped notes |

## 🔧 How It Works

### 1. **Automatic Netflix Detection**
```javascript
// Netflix URLs automatically detected:
✅ netflix.com/watch/* (All Netflix streaming)
✅ nflxvideo.net/* (Netflix CDN content)  
✅ Subtitle/caption network requests
```

### 2. **TTML Processing**
Extension automatically parses Netflix TTML subtitle format:
```xml
<p begin="225416666t" end="275416666t">
  Hello, this is Netflix dialogue
</p>
```
↓ *Converted to* ↓
```javascript
{
  start: 22.54,     // seconds
  text: "Hello, this is Netflix dialogue",
  clickable: true   // Jump to 0:22 when clicked
}
```

### 3. **Video Control Integration**
```javascript
// Direct Netflix API integration
const player = netflix.appContext.state.playerApp.getAPI();
player.seek(timestampInMilliseconds); // Precise video seeking
```

## 🎨 Theme System

Choose from **140+ professionally curated themes**:

### Popular Categories
- **🌊 Ocean Blues** - Calming blue gradients
- **🌅 Sunset Warm** - Orange and pink combinations  
- **🌿 Nature Green** - Fresh and organic tones
- **🎨 Designer Pro** - Trending color schemes
- **⚡ High Contrast** - Maximum accessibility
- **🌙 Dark Mode** - Eye-friendly night themes

### Theme Structure
```css
:root {
  --primary-color: #1a1a2e;    /* Background */
  --secondary-color: #16213e;   /* Cards/containers */
  --accent-color: #0f3460;     /* Text/borders */
}
```

## 📊 Technical Features

### Architecture
- **⚡ Manifest V3** - Latest Chrome extension standard
- **🔧 Service Worker** - Efficient background processing
- **🌐 Chrome APIs** - Storage, tabs, scripting, webRequest
- **📱 Responsive Design** - Works on all screen sizes

### Performance
- **🪶 Lightweight** - Minimal memory footprint
- **⚡ Fast Parsing** - Optimized TTML processing
- **🎯 Smart Filtering** - Efficient URL detection
- **💾 Local Storage** - No external dependencies

### Security
- **🛡️ Privacy First** - All processing done locally
- **🚫 No Data Collection** - Your Netflix viewing stays private
- **🔒 Secure Parsing** - Safe subtitle file processing

## 📋 Configuration

### Automatic URL Filtering
```javascript
// ✅ Auto-captured URLs:
Netflix streaming URLs with subtitles
High-quality video content URLs  
TTML/subtitle file requests

// ❌ Auto-filtered URLs:
Download-triggering media files (.mp4, .mkv)
Archive files (.zip, .rar)
Document files (.pdf, .doc)
Range/chunk requests (prevents downloads)
```

## 🎮 Advanced Usage

### Keyboard Shortcuts
- **Space** - Toggle Netflix video play/pause
- **←/→** - Seek backward/forward  
- **Click transcript** - Jump to timestamp
- **Scroll transcript** - Browse all dialogue

### Power User Features
- **Export Transcripts** - Save as text files
- **Search Dialogue** - Find specific quotes
- **Multi-language** - Switch between subtitle languages
- **Custom Themes** - Create your own color schemes

## 📈 Version History

| Version | Major Features |
|---------|----------------|
| **v3.5** | Enhanced TTML parser, live highlighting, improved Netflix integration |
| **v3.3** | Revolutionary Netflix transcript viewer with clickable timestamps |
| **v3.2** | 140+ theme system with search and favorites |
| **v3.1** | Smart URL filtering, download prevention |
| **v3.0** | Initial Netflix subtitle detection |

## 🛣️ Roadmap

### Coming Soon
- **🔍 Transcript Search** - Find specific dialogue instantly
- **📤 Export Options** - Save transcripts in multiple formats
- **🌍 Multi-language** - Switch between subtitle languages
- **🎨 Theme Creator** - Build custom color schemes
- **📱 Mobile Support** - Chrome mobile compatibility
- **🤖 AI Integration** - Smart dialogue analysis

### Community Requests
- **🔗 Share Transcripts** - Export with timestamps
- **📝 Note Integration** - Sync with note-taking apps
- **🎬 Other Platforms** - YouTube, Amazon Prime support
- **📊 Analytics** - Viewing time analysis

## 🤝 Contributing

We welcome contributions! Here's how to help:

### Code Contributions
1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

### Theme Contributions
Add new themes to the collection:
```javascript
// Format: [primary, secondary, accent]
newThemes: [
  ['#1a1a2e', '#16213e', '#0f3460'], // Your theme colors
]
```

### Bug Reports
- Use GitHub Issues
- Include Chrome version
- Describe steps to reproduce
- Add screenshots if applicable

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Netflix Platform** - For excellent subtitle infrastructure
- **Design Communities** - Color palette inspiration  
- **Chrome Extension APIs** - Powerful development platform
- **Open Source Community** - Collaborative development
- **User Feedback** - Continuous improvement insights

## 🆘 Support

### Common Issues
- **🎬 Transcript button not showing?** Make sure monitoring is active and you're on a Netflix video
- **⏱️ Timestamps not working?** Ensure Netflix video is playing and not paused
- **🎨 Themes not applying?** Try refreshing the extension popup
- **📱 Mobile issues?** Currently optimized for desktop Chrome

### Get Help
- **GitHub Issues** - Bug reports and feature requests
- **Documentation** - Check the wiki for detailed guides
- **Community** - Share tips and tricks with other users

---

<div align="center">

**🎬 Netflix Transcript Collector**

*Transform your Netflix experience with professional transcript navigation*

**⭐ Star this repo if it enhances your Netflix viewing! ⭐**

</div>
