# Auto Transcript Collector v2.0

🚀 **LIGHTWEIGHT & RESOURCE-EFFICIENT** Chrome extension untuk deteksi URL transkrip dengan parameter `?o=`. 

## ⚡ **SIMPLE START/STOP INTERFACE** - No More Resource Waste!

Extension ini sekarang **HANYA menggunakan resource saat diperlukan**! Default state = OFF untuk maksimal efisiensi.

## 🎯 Key Features

- **🔥 RESOURCE-EFFICIENT**: Default OFF - zero background resource usage
- **▶️ START/STOP Control**: Simple toggle button 
- **📋 Two Modes**: Clipboard copy atau Download file
- **🎯 Smart Detection**: Hanya URL dengan parameter `?o=`
- **📊 Simple Stats**: Basic monitoring tanpa bloat

## 🚀 Cara Install

```bash
git clone https://github.com/HaikalE/auto-transcript-collector.git
cd auto-transcript-collector
```

1. Buka `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Pilih folder project

## 💡 Cara Pakai (SUPER SIMPLE!)

### 1. **Klik Icon Extension** di toolbar
### 2. **Tekan START** untuk mulai monitoring  
### 3. **Pilih Mode**: Clipboard atau Download
### 4. **Browse normal** - extension akan deteksi URL `?o=` otomatis
### 5. **Tekan STOP** saat selesai untuk save resource

## ⚙️ Interface Popup

```
🎤 Auto Transcript Collector
     Simple & Lightweight

┌─────────────────────────┐
│        🚀 (Active)      │ ← Status indicator  
│       MONITORING        │
│  Scanning for URLs...   │
└─────────────────────────┘

     ⏹️ STOP MONITORING     ← Main toggle button

📋 Action Mode
┌─────────────┬─────────────┐
│ Clipboard ✓ │  Download   │ ← Mode selector
└─────────────┴─────────────┘

Detected: 5    Processed: 4
Status: Active
```

## 🔥 Resource Management

| State | Resource Usage | webRequest Listener |
|-------|----------------|-------------------|
| **STOPPED** | **🟢 MINIMAL** | ❌ Disabled |
| **STARTED** | 🟡 Active | ✅ Enabled |

**Extension cerdas**: Hanya consume resource saat explicitly di-START!

## 🛠️ Technical Improvements v2.0

### ❌ **Removed** (Resource Hogs):
- ~~Manual URL input field~~
- ~~Always-on webRequest listener~~
- ~~Complex statistics tracking~~
- ~~Heavy popup features~~

### ✅ **Added** (Lightweight):
- Dynamic listener management
- START/STOP resource control
- Simple toggle interface
- Minimal stats display

## 📊 Performance Comparison

| Version | Default State | Resource Usage | User Control |
|---------|--------------|----------------|--------------|
| v1.x | Always ON | 🔴 High | Limited |
| **v2.0** | **OFF** | **🟢 Minimal** | **Full** |

## 🐛 Troubleshooting

### Extension tidak detect URL
- ✅ Pastikan di-START dulu
- ✅ URL harus ada parameter `?o=`
- ✅ Check popup status

### Resource usage tinggi
- ✅ Click STOP saat tidak pakai
- ✅ Default state = OFF

### Popup tidak respond
- ✅ Reload extension
- ✅ Check permissions

## 💻 File Structure (Minimalist)

```
auto-transcript-collector/
├── manifest.json      # v2.0 config
├── background.js      # Smart resource management
├── popup.html         # Simple START/STOP UI
├── popup.js           # Lightweight controls
└── README.md          # This file
```

## 🔒 Privacy & Resource Usage

- ✅ Zero tracking
- ✅ Local storage only  
- ✅ No external connections
- ✅ **Smart resource management**
- ✅ **Default OFF state**

## 🆚 Why v2.0?

**v1.x Problems:**
- Always monitoring (resource waste)
- Complex manual features
- High background usage

**v2.0 Solutions:**  
- START/STOP control
- Resource-efficient
- Simple but effective

## 📄 License

MIT License - Free to use and modify.

## 🤝 Contributing

Issues dan PRs welcome! Focus pada **simplicity** dan **efficiency**.

---

## 🎯 **TL;DR untuk yang Males Baca:**

1. **Download & Install** extension
2. **Klik icon** extension di toolbar
3. **Tekan START** untuk mulai monitoring
4. **Pilih mode** Clipboard/Download  
5. **Browse normal** - otomatis detect `?o=` URLs
6. **Tekan STOP** saat selesai

**Simple. Lightweight. Effective.** 🚀

**Repository**: https://github.com/HaikalE/auto-transcript-collector