# Panduan Push ke GitHub

## Langkah 1: Persiapan Database

1. Jalankan migrasi database:
```bash
npx prisma migrate dev --name add-guru-siswa-roles
```

2. Buat akun default:
```bash
node scripts/create-default-users.js
```

## Langkah 2: Setup Git Remote Baru

1. Buat repository baru di GitHub (jangan initialize dengan README)

2. Hapus remote origin lama:
```bash
git remote remove origin
```

3. Tambahkan remote GitHub kamu:
```bash
git remote add origin https://github.com/USERNAME/REPO-NAME.git
```
Ganti `USERNAME` dengan username GitHub kamu dan `REPO-NAME` dengan nama repository

4. Cek remote:
```bash
git remote -v
```

## Langkah 3: Push ke GitHub

1. Pastikan semua perubahan sudah di-commit:
```bash
git add .
git commit -m "Initial commit: Setup project dengan 3 role (admin, guru, siswa)"
```

2. Push ke GitHub:
```bash
git push -u origin main
```

Atau jika branch-nya `master`:
```bash
git push -u origin master
```

## Langkah 4: Setup di Environment Baru

Ketika clone di tempat lain:

1. Clone repository:
```bash
git clone https://github.com/USERNAME/REPO-NAME.git
cd REPO-NAME
```

2. Install dependencies:
```bash
npm install
```

3. Copy .env.example ke .env dan isi dengan kredensial database kamu:
```bash
copy .env.example .env
```

4. Setup database:
```bash
npx prisma migrate dev
npx prisma generate
node scripts/create-default-users.js
```

5. Jalankan development server:
```bash
npm run dev
```

## ⚠️ Penting

- File `.env` tidak akan ter-push (sudah ada di .gitignore)
- Jangan commit kredensial database atau API keys
- Ganti password default di production
- Lihat `DEFAULT_USERS.md` untuk kredensial akun default
