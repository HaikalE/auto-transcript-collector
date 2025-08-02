# Auto Transcript Collector

Chrome extension untuk mendeteksi dan mengambil konten transkrip secara otomatis dari URL dengan parameter `?o=`. **SEKARANG DENGAN POPUP UI YANG BISA DIKLIK!** 🎉

## 📋 Fitur

- **Deteksi Otomatis**: Mendeteksi URL transkrip yang mengandung parameter `?o=`
- **Popup Interface**: UI yang mudah digunakan dan bisa diklik
- **Dua Mode Operasi**:
  - 📋 **Copy ke Clipboard**: Menyalin konten transkrip ke clipboard
  - 💾 **Download File**: Mengunduh konten sebagai file `.txt` dengan timestamp
- **Manual Control**: Input URL manual untuk processing konten
- **Real-time Statistics**: Monitor aktivitas extension
- **Settings Persistence**: Mode tersimpan otomatis

## 🎮 Interface Popup

Klik icon extension di toolbar untuk membuka popup interface dengan fitur:

### 🎯 Status Monitor
- Status extension (Aktif/Tidak aktif)
- Mode operasi saat ini
- Real-time statistics (URL terdeteksi, berhasil diproses, aktivitas terakhir)

### ⚙️ Mode Control
- **📋 Clipboard Mode**: Salin konten ke clipboard
- **💾 Download Mode**: Unduh konten sebagai file

### 🔧 Manual Control
- Input URL manual dengan parameter `?o=`
- Tombol Copy dan Download untuk processing manual
- Auto-detection URL aktif di tab saat ini

## 🚀 Cara Instalasi

1. **Download Source Code**:
   ```bash
   git clone https://github.com/HaikalE/auto-transcript-collector.git
   cd auto-transcript-collector
   ```

2. **Install di Chrome**:
   - Buka Chrome browser
   - Ketik `chrome://extensions/` di address bar
   - Aktifkan "Developer mode" (toggle di kanan atas)
   - Klik "Load unpacked"
   - Pilih folder project ini

3. **Verifikasi Instalasi**:
   - Extension "Auto Transcript Collector" akan muncul di daftar extensions
   - **Icon extension akan muncul di toolbar** - SEKARANG BISA DIKLIK! 🎯
   - Klik icon untuk membuka popup interface

## 💡 Cara Penggunaan

### 🤖 Mode Otomatis
1. **Aktivasi**: Extension bekerja otomatis setelah terinstall
2. **Deteksi**: Saat mengunjungi website yang memuat transkrip dengan URL mengandung `?o=`, extension akan mendeteksinya
3. **Pemrosesan**: Konten akan otomatis disalin ke clipboard atau diunduh (tergantung mode yang dipilih)

### 🎮 Mode Manual
1. **Buka Popup**: Klik icon extension di toolbar
2. **Input URL**: Paste URL yang mengandung `?o=` di input field
3. **Process**: Klik tombol "Copy" atau "Download"
4. **Monitor**: Lihat statistics real-time di popup

### ⚙️ Mengubah Mode
1. Buka popup extension
2. Klik tombol "📋 Clipboard" atau "💾 Download"
3. Setting akan tersimpan otomatis

## 🔧 Technical Details

### Manifest V3
Extension ini menggunakan Manifest V3 dengan permissions:
- `webRequest`: Memantau network requests
- `downloads`: Mengunduh file
- `clipboardWrite`: Menulis ke clipboard
- `storage`: Menyimpan settings dan statistics
- `activeTab`: Akses tab aktif
- `scripting`: Execute script untuk clipboard
- `<all_urls>`: Akses semua website

### Architecture
- **background.js**: Service worker utama dengan auto-detection
- **popup.html/js**: Interface popup untuk manual control
- **Storage**: Settings dan statistics tersimpan di Chrome storage

## 📁 File Structure

```
auto-transcript-collector/
├── manifest.json      # Konfigurasi extension
├── background.js      # Service worker utama  
├── popup.html         # Popup interface
├── popup.js           # Popup functionality
├── README.md          # Dokumentasi
└── LICENSE           # MIT License
```

## 🎯 Screenshot Popup Interface

Popup interface mencakup:
- 🟢 Status indicator (Aktif/Tidak aktif)
- 🎮 Mode switching buttons (Clipboard/Download)
- 📝 Manual URL input field
- 📊 Real-time statistics display
- 🎨 Modern, gradient design

## 🐛 Troubleshooting

### Extension tidak mendeteksi URL
- Pastikan URL mengandung parameter `?o=`
- Cek console untuk log aktivitas (`F12` → Console)
- Pastikan permissions sudah diberikan

### Icon extension tidak muncul
- Pastikan extension enabled di `chrome://extensions/`
- Refresh browser setelah install
- Check apakah extension muncul di menu extensions (puzzle icon)

### Popup tidak buka
- Klik kanan icon → "Inspect popup" untuk debug
- Reload extension di `chrome://extensions/`
- Check console errors

### Error saat copy ke clipboard
- Pastikan website mengizinkan clipboard access
- Coba refresh halaman dan ulangi
- Test dengan manual input di popup

### Error saat download
- Cek permission downloads di Chrome
- Pastikan tidak ada popup blocker yang aktif
- Check Downloads folder Chrome

## 📊 Features Comparison

| Feature | V1.0 (Background Only) | V1.2 (With Popup) |
|---------|----------------------|-------------------|
| Auto Detection | ✅ | ✅ |
| Manual Control | ❌ | ✅ |
| Mode Switching | Code Edit | Popup UI |
| Statistics | Console Only | Real-time UI |
| Settings | Manual | Persistent |
| User Interface | ❌ | ✅ |

## 📝 Development

### Prerequisites
- Google Chrome browser
- Developer mode enabled

### Testing
1. Load extension dalam developer mode
2. Klik icon extension untuk buka popup
3. Test auto-detection dengan URL `?o=`
4. Test manual input dengan URL samples
5. Monitor console dan popup statistics

### Debug Mode
- Background: `chrome://extensions/` → Extension → "service worker"
- Popup: Right-click icon → "Inspect popup"

## 🔒 Privacy & Security

- Extension hanya memproses URL dengan pattern spesifik (`?o=`)
- Tidak menyimpan data personal
- Settings tersimpan locally di Chrome storage
- Tidak mengirim data ke server eksternal
- Semua operasi dilakukan locally

## 🆕 What's New in V1.2

- ✅ **Clickable popup interface**
- ✅ **Manual URL processing**
- ✅ **Real-time statistics**
- ✅ **Persistent settings**
- ✅ **Mode switching via UI**
- ✅ **Modern gradient design**
- ✅ **Auto-fill current tab URL**
- ✅ **Visual feedback & notifications**

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

Jika mengalami masalah atau memiliki pertanyaan, silakan buat [Issue](https://github.com/HaikalE/auto-transcript-collector/issues) di repository ini.

---

**🎉 SEKARANG EXTENSION SUDAH BISA DIKLIK!** Tidak perlu edit kode lagi untuk ganti mode - cukup klik icon extension dan gunakan popup interface yang mudah dan intuitif! 

**Note**: Extension ini dirancang khusus untuk URL dengan parameter `?o=`. Pastikan URL target sesuai dengan pattern ini agar extension dapat berfungsi dengan baik.