# Smart URL Monitor

<div align="center">

![Version](https://img.shields.io/badge/version-3.5-blue)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green)
![Themes](https://img.shields.io/badge/themes-140+-purple)
![License](https://img.shields.io/badge/license-MIT-orange)

Advanced URL monitoring extension with Netflix transcript viewer and 140+ customizable themes.

<div align="center">
  <h2>📸 Screenshots</h2>
  
  <div>
    <h3>Main Interface</h3>
    <img width="300" src="https://github.com/user-attachments/assets/35db5eee-907e-4a19-b662-e1c654fd51d8" alt="Main Interface Screenshot">
  </div>
  
  <div>
    <h3>Feature Transcript</h3>
    <img width="300" src="https://github.com/user-attachments/assets/63948a2c-d306-43d0-a297-b6e7845fa766" alt="Feature Dashboard Screenshot">
  </div>
  
  <div>
    <h3>Settings</h3>
    <img width="300" src="https://github.com/user-attachments/assets/d3123ebb-9092-4a27-98bc-21845a3ab921" alt="Settings Panel Screenshot">
  </div>
</div>

## Features

### Theme System
- 140+ color themes from design communities
- Real-time theme switching with instant preview
- Search and favorites functionality
- HCI compliant text colors for readability
- Persistent settings across sessions

### Netflix Transcript Viewer
- TTML parser for Netflix subtitle files
- Clickable timestamps for video seeking
- Live highlighting synchronized with video playback
- YouTube-style transcript interface
- Automatic detection of Netflix subtitle URLs

### Smart URL Monitoring
- Intelligent filtering for URLs with `?o=` parameters
- Prevents unwanted file downloads
- Real-time monitoring with visual feedback
- Domain and URL type categorization
- Professional statistics dashboard

### User Interface
- Clean, responsive design
- Real-time notifications
- Export functionality for collected URLs
- Professional analytics dashboard
- Smooth animations and transitions

## What Makes This Extension Different

### Comprehensive Theme Collection
Carefully curated color palettes including:
- Dark themes: shadow, dracula, nord, matrix
- Pastel themes: magic girl, lavender, bingsu, pastel
- Gaming themes: cyberpunk, joker, tron orange
- Professional themes: github, vscode, material

### Advanced Netflix Integration
- Parse Netflix TTML subtitle files with enhanced parser
- Clickable transcript lines for precise video seeking
- Live highlighting synchronized with video playback
- Professional transcript interface similar to YouTube

### Intelligent URL Filtering
- Smart detection of quality streaming URLs
- Automatic filtering of unwanted file types
- Domain-based URL categorization
- Advanced parameter analysis

## Installation

1. Download the latest release or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked" and select the extension folder
5. Pin the extension to your toolbar for easy access

## Usage

### Theme Customization
1. Click the palette icon in the extension header
2. Browse through 140+ available themes
3. Search for specific theme names or styles
4. Click any theme to apply instantly
5. Mark favorites for quick access
6. Settings are automatically saved

### Netflix Transcript Viewer
1. Start monitoring and browse Netflix
2. Look for the transcript button on Netflix URLs
3. Click to open the transcript viewer
4. Click any timestamp to seek video to that moment
5. Live highlighting follows video playback

### Supported Features
- TTML parsing for Netflix subtitle format
- Timestamp seeking with precise video control
- Live highlighting synchronized with playback
- Clean, responsive user interface
- Real-time video integration

## Configuration

### URL Filtering Rules
```javascript
// Quality indicators:
URLs with '?o=' parameter
Streaming domains (netflix, youtube, etc.)
Media file extensions (.m3u8, .ts, .mp4)

// Automatically filtered:
Document files (.pdf, .doc, .txt)
Archive files (.zip, .rar, .7z)
Executable files (.exe, .msi, .dmg)
Image files (.jpg, .png, .gif)
```

### Theme Structure
Each theme consists of three colors:
- Primary: Main background color
- Secondary: Card/container background
- Accent: Text, borders, and highlights

## Use Cases

### Content Creators
- Monitor Netflix for subtitle analysis
- Extract transcript data for content research
- Match themes to brand colors

### Network Analysts
- Track quality streaming URLs
- Analyze media delivery networks
- Export data for further analysis

### UI/UX Designers
- 140+ color palette inspiration
- HCI compliant color combinations
- Professional interface design reference

## Version History

### v3.5 - Enhanced TTML Parser
- Extended timing system for better TTML parsing
- Live highlighting synchronized with video playback
- Enhanced debugging and error handling
- Improved transcript loading with retry mechanism

### v3.3 - Netflix Transcript Viewer
- Netflix transcript integration with TTML parsing
- Clickable timestamps for video seeking
- HCI compliant theme text colors
- Enhanced theme persistence system

### v3.2 - Theme System
- 140+ color palettes from design communities
- Search and favorites functionality
- Auto-save theme preferences
- Professional theme selector interface

### v3.1 - Smart Filtering
- Intelligent URL filtering algorithms
- Professional analytics dashboard
- Beautiful UI redesign
- Enhanced performance optimizations

## Technical Details

### Architecture
- Manifest V3 - Latest Chrome extension standard
- Service Worker - Efficient background processing
- Chrome APIs - Storage, tabs, scripting, webRequest
- Modern JavaScript - ES6+ features and APIs

### Design Philosophy
- HCI Compliance - Optimal color contrast ratios
- Responsive Design - Works on all screen sizes
- Professional Aesthetics - Clean, modern interface
- User Experience - Intuitive, accessible interactions

### Performance
- Lightweight - Minimal memory footprint
- Efficient Filtering - Smart algorithm optimization
- Fast Theme Switching - CSS variables for instant updates
- Persistent Settings - Chrome sync storage integration

## Roadmap

### Planned Features
- Custom theme creator - Build your own color schemes
- Theme import/export - Share themes with community
- Multi-language transcript support
- AI-powered URL categorization
- Mobile support - Chrome mobile compatibility

### Theme Development
- Seasonal themes - Dynamic color schemes
- Animated themes - Subtle motion effects
- Gradient themes - Modern gradient designs
- Community themes - User-submitted palettes

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Follow our code style guidelines
4. Test thoroughly before submitting
5. Submit a pull request with clear description

### Contributing Themes
To contribute color palettes:
- Follow the theme format: `['primary', 'secondary', 'accent']`
- Ensure HCI compliance with proper contrast ratios
- Test across different UI elements

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design Communities - For inspiring color palettes
- Chrome Extension Platform - For robust APIs
- Open Source Community - For collaborative development
- User Feedback - For continuous improvement suggestions

---

<div align="center">

Smart URL Monitor - Advanced Chrome Extension

Intelligent URL monitoring with Netflix transcript viewer and 140+ themes

</div>
