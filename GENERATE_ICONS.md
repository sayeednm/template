# Generate PWA Icons

File `public/icon.svg` sudah tersedia. Sekarang perlu di-convert ke PNG.

## Cara Cepat (Online):

### 1. Buka Website Converter
Pergi ke: https://cloudconvert.com/svg-to-png

### 2. Upload & Convert
1. Upload file `public/icon.svg`
2. Set width: **192** → Download sebagai `icon-192.png`
3. Upload lagi `public/icon.svg`
4. Set width: **512** → Download sebagai `icon-512.png`

### 3. Taruh di Folder Public
Copy kedua file ke folder `public/`:
- `public/icon-192.png`
- `public/icon-512.png`

## Cara Manual (Figma/Canva):

### Figma:
1. Buat frame 512x512
2. Design icon/logo kamu
3. Export sebagai PNG:
   - 192x192 → `icon-192.png`
   - 512x512 → `icon-512.png`

### Canva:
1. Buat design 512x512
2. Design icon/logo kamu
3. Download sebagai PNG
4. Resize ke 192x192 untuk icon kecil

## Atau Pakai Icon Generator:

Website yang bisa generate icon otomatis:
- https://favicon.io/favicon-generator/
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator

Upload logo → download semua ukuran → taruh di `public/`

## Setelah Icon Siap:

1. Pastikan ada di `public/icon-192.png` dan `public/icon-512.png`
2. Commit dan push:
```bash
git add public/
git commit -m "Add PWA icons"
git push origin main
```

3. Deploy di Vercel
4. Buka aplikasi di browser
5. Icon install akan muncul!

## Cek PWA Ready:

1. Buka aplikasi di Chrome
2. Tekan F12 (DevTools)
3. Tab **Application** > **Manifest**
4. Lihat icon sudah muncul
5. Kalau ada error, akan muncul di sini

## Selesai!

Setelah icon ditambahkan, aplikasi bisa di-install di laptop/HP! 🎉
