# Auto Transcript Collector

Chrome extension untuk mendeteksi dan mengambil konten transkrip secara otomatis dari URL dengan parameter `?o=`.

## 📋 Fitur

- **Deteksi Otomatis**: Mendeteksi URL transkrip yang mengandung parameter `?o=`
- **Dua Mode Operasi**:
  - 📋 **Copy ke Clipboard**: Menyalin konten transkrip ke clipboard
  - 💾 **Download File**: Mengunduh konten sebagai file `.txt` dengan timestamp

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
   - Pastikan extension dalam keadaan aktif (enabled)

## 💡 Cara Penggunaan

1. **Aktivasi**: Extension akan bekerja otomatis setelah terinstall
2. **Deteksi**: Saat mengunjungi website yang memuat transkrip dengan URL mengandung `?o=`, extension akan mendeteksinya
3. **Pemrosesan**: Konten akan otomatis disalin ke clipboard atau diunduh (tergantung konfigurasi)
4. **Log**: Buka Developer Console (`F12` → Console) untuk melihat aktivitas extension

## ⚙️ Konfigurasi Mode

Secara default, extension akan **menyalin konten ke clipboard**. Untuk mengubah ke mode download:

1. Buka file `background.js`
2. Comment baris ini:
   ```javascript
   copyContentToClipboard(details.url);
   ```
3. Uncomment baris ini:
   ```javascript
   // downloadContentAsFile(details.url);
   ```
4. Reload extension di `chrome://extensions/`

## 🔧 Technical Details

### Manifest V3
Extension ini menggunakan Manifest V3 dengan permissions:
- `webRequest`: Memantau network requests
- `downloads`: Mengunduh file
- `clipboardWrite`: Menulis ke clipboard
- `<all_urls>`: Akses semua website

### Service Worker
Background script berjalan sebagai service worker yang:
- Memantau semua network requests
- Memfilter URL dengan pattern `*://*/*?o=*`
- Memproses konten dengan fetch API

## 📁 File Structure

```
auto-transcript-collector/
├── manifest.json      # Konfigurasi extension
├── background.js      # Service worker utama
└── README.md         # Dokumentasi
```

## 🐛 Troubleshooting

### Extension tidak mendeteksi URL
- Pastikan URL mengandung parameter `?o=`
- Cek console untuk log aktivitas
- Pastikan permissions sudah diberikan

### Error saat copy ke clipboard
- Pastikan website mengizinkan clipboard access
- Coba refresh halaman dan ulangi

### Error saat download
- Cek permission downloads di Chrome
- Pastikan tidak ada popup blocker yang aktif

## 📝 Development

### Prerequisites
- Google Chrome browser
- Developer mode enabled

### Testing
1. Load extension dalam developer mode
2. Buka Developer Console (`F12`)
3. Navigate ke website dengan URL transkrip
4. Monitor console untuk log activities

## 🔒 Privacy & Security

- Extension hanya memproses URL dengan pattern spesifik (`?o=`)
- Tidak menyimpan data personal
- Tidak mengirim data ke server eksternal
- Semua operasi dilakukan locally

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

**Note**: Extension ini dirancang khusus untuk URL dengan parameter `?o=`. Pastikan URL target sesuai dengan pattern ini agar extension dapat berfungsi dengan baik.