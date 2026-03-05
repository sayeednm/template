# Setup PWA (Progressive Web App)

Aplikasi ini sudah support PWA! Artinya bisa di-install di laptop/HP seperti aplikasi native.

## Cara Install di Laptop:

### Google Chrome / Edge:
1. Buka aplikasi di browser
2. Lihat icon **Install** (⊕) di address bar (sebelah kanan)
3. Klik icon tersebut
4. Klik **Install**
5. Aplikasi akan terbuka di window terpisah
6. Shortcut otomatis dibuat di desktop/start menu

### Firefox:
1. Buka aplikasi di browser
2. Klik menu (☰) > **Install [nama app]**
3. Klik **Install**

## Cara Install di HP:

### Android (Chrome):
1. Buka aplikasi di Chrome
2. Klik menu (⋮) > **Add to Home screen**
3. Klik **Add**
4. Icon muncul di home screen

### iOS (Safari):
1. Buka aplikasi di Safari
2. Klik tombol Share (kotak dengan panah)
3. Scroll dan pilih **Add to Home Screen**
4. Klik **Add**

## Fitur PWA:

✅ Install seperti aplikasi native
✅ Buka di window terpisah (tanpa address bar)
✅ Icon di desktop/home screen
✅ Splash screen saat buka
✅ Offline support (sebagian)
✅ Fast loading

## Setup Icon:

Aplikasi butuh 2 icon:
- `public/icon-192.png` (192x192 px)
- `public/icon-512.png` (512x512 px)

### Cara Buat Icon:

1. **Buat logo/icon** dengan tools:
   - Canva (gratis)
   - Figma (gratis)
   - Photoshop
   - Online: https://favicon.io

2. **Export 2 ukuran:**
   - 192x192 px → save sebagai `icon-192.png`
   - 512x512 px → save sebagai `icon-512.png`

3. **Taruh di folder `public/`**

### Atau Pakai Icon Default:

Kalau belum punya icon, bisa pakai warna solid dulu:
- Buat square dengan background biru
- Tambah text "D" (Dashboard) di tengah
- Export 192x192 dan 512x512

## Setelah Deploy:

1. Buka aplikasi di browser
2. Icon install akan muncul otomatis
3. User bisa install dengan 1 klik

## Troubleshooting:

### Icon install tidak muncul:
- Pastikan `manifest.json` sudah ada di `public/`
- Pastikan icon 192x192 dan 512x512 sudah ada
- Refresh browser (Ctrl + Shift + R)
- Cek di DevTools > Application > Manifest

### Icon tidak muncul setelah install:
- Pastikan file icon ada di `public/icon-192.png` dan `public/icon-512.png`
- Clear cache dan install ulang

## Catatan:

- PWA hanya jalan di HTTPS (production)
- Di localhost tidak perlu HTTPS
- Vercel otomatis pakai HTTPS
- Icon wajib ada agar bisa di-install
