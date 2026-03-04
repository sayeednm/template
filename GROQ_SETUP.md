# Setup Groq AI Chatbot

Chatbot ini menggunakan Groq API dengan model Llama 3.3 70B dan bisa mengakses data real-time dari database.

## Fitur Chatbot:

✅ Chat real-time dengan AI
✅ Floating button di pojok kanan bawah
✅ Paham struktur project dan codebase
✅ **Bisa query database untuk jawab pertanyaan tentang data**
✅ **History percakapan tersimpan otomatis (localStorage)**
✅ **Bisa hapus history dengan tombol trash**
✅ UI yang clean dan responsive
✅ Hanya bisa diakses user yang sudah login

## Contoh Pertanyaan yang Bisa Dijawab:

### Tentang Data (Real-time dari Database):
- "Berapa jumlah user yang terdaftar?"
- "Ada berapa admin?"
- "Siapa saja user yang terdaftar?"
- "Berapa user yang punya foto profil?"
- "Tampilkan 5 user terbaru"
- "Cari user dengan email admin@example.com"

### Tentang Project:
- "Jelaskan struktur project ini"
- "Bagaimana cara kerja authentication?"
- "Apa saja fitur yang ada?"
- "Bagaimana cara menambahkan field baru di database?"
- "Jelaskan tentang role system"
- "Bagaimana cara upload foto profil?"

## Langkah Setup:

### 1. Dapatkan API Key dari Groq

1. Buka https://console.groq.com
2. Login atau daftar akun baru (gratis)
3. Klik **API Keys** di menu
4. Klik **Create API Key**
5. Copy API key yang muncul

### 2. Install Package

```bash
npm install groq-sdk
```

### 3. Tambahkan ke .env

Buka file `.env` dan tambahkan:

```env
GROQ_API_KEY="gsk_your_api_key_here"
```

### 4. Restart Development Server

```bash
npm run dev
```

### 5. Test Chatbot

1. Login ke aplikasi
2. Lihat floating button biru di pojok kanan bawah
3. Klik button untuk buka chat
4. Coba tanya:
   - "Berapa jumlah user?"
   - "Siapa saja admin?"
   - "Jelaskan struktur project"

AI akan menjawab dengan data real-time dari database! 🎉

## Fitur Chatbot:

- Chat real-time dengan AI
- Menggunakan model Llama 3.3 70B (sangat cepat)
- Menyimpan history chat dalam sesi
- UI yang clean dan responsive
- Hanya bisa diakses user yang sudah login

## Model yang Digunakan:

- **llama-3.3-70b-versatile** - Model terbaru dari Meta, sangat cepat dan akurat

## Untuk Production (Vercel):

Tambahkan environment variable di Vercel:

1. Buka Vercel Dashboard > Project > Settings > Environment Variables
2. Tambahkan:
   - Key: `GROQ_API_KEY`
   - Value: `gsk_your_api_key_here`
3. Redeploy

## Troubleshooting:

### Error: "GROQ_API_KEY is not defined"
- Pastikan sudah menambahkan `GROQ_API_KEY` di file `.env`
- Restart development server

### Error: "Unauthorized"
- Pastikan API key valid
- Cek di https://console.groq.com/keys

### Chat tidak merespon
- Cek console browser untuk error
- Pastikan sudah login
- Cek API key masih aktif

## Gratis atau Bayar?

Groq menyediakan free tier yang sangat generous:
- 30 requests per minute
- 14,400 requests per day
- Cukup untuk development dan small apps

## Ganti Model:

Edit file `lib/groq.ts`, ganti model:

```typescript
model: 'llama-3.3-70b-versatile', // Model default
// atau
model: 'mixtral-8x7b-32768',      // Alternatif
```

Model tersedia:
- `llama-3.3-70b-versatile` - Paling cepat dan akurat
- `llama-3.1-70b-versatile` - Versi sebelumnya
- `mixtral-8x7b-32768` - Mixtral dari Mistral AI
- `gemma2-9b-it` - Google Gemma

Lihat semua model: https://console.groq.com/docs/models
