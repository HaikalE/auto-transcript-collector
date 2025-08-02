// Chrome Extension: Auto Transcript Collector
// Mendeteksi URL dengan parameter ?o= dan mengambil konten transkrip

// Listener untuk memantau semua permintaan jaringan
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    console.log('URL transkrip terdeteksi:', details.url);
    
    // Pilih salah satu fungsi di bawah ini:
    // Opsi 1: Copy konten ke clipboard
    copyContentToClipboard(details.url);
    
    // Opsi 2: Download konten sebagai file (uncomment untuk menggunakan)
    // downloadContentAsFile(details.url);
  },
  // Filter URL yang spesifik - hanya URL dengan parameter ?o=
  { urls: ["*://*/*?o=*"] }
);

/**
 * Fungsi 1: Mengambil konten dari URL dan menyalin ke clipboard
 * @param {string} url - URL transkrip yang akan diambil kontennya
 */
async function copyContentToClipboard(url) {
  try {
    console.log('Mengambil konten dari:', url);
    
    // Fetch konten dari URL
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Baca respons sebagai teks
    const content = await response.text();
    
    // Salin ke clipboard
    await navigator.clipboard.writeText(content);
    
    console.log('✅ Konten berhasil disalin ke clipboard!');
    console.log('Panjang konten:', content.length, 'karakter');
    
  } catch (error) {
    console.error('❌ Error saat mengambil atau menyalin konten:', error);
  }
}

/**
 * Fungsi 2: Mengunduh konten dari URL sebagai file
 * @param {string} url - URL transkrip yang akan diunduh
 */
function downloadContentAsFile(url) {
  // Generate timestamp untuk nama file unik
  const timestamp = new Date().getTime();
  const filename = `transkrip-${timestamp}.txt`;
  
  console.log('Mengunduh konten dari:', url);
  
  // Download file menggunakan Chrome Downloads API
  chrome.downloads.download({
    url: url,
    filename: filename
  }, function(downloadId) {
    // Periksa apakah ada error
    if (chrome.runtime.lastError) {
      console.error('❌ Error saat mengunduh file:', chrome.runtime.lastError.message);
    } else {
      console.log('✅ File berhasil diunduh!');
      console.log('Download ID:', downloadId);
      console.log('Nama file:', filename);
    }
  });
}

// Log ketika service worker dimuat
console.log('🚀 Auto Transcript Collector service worker dimuat dan siap!');