# Setup Environment Variables di Vercel

Setelah push ke GitHub dan deploy di Vercel, kamu perlu menambahkan environment variables.

## Langkah-langkah:

1. Buka project kamu di [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project yang baru di-deploy
3. Klik **Settings** > **Environment Variables**
4. Tambahkan variable berikut satu per satu:

### Database Variables

```
DATABASE_URL
```
Value: Connection string dari Supabase (mode: Session/Pooler)
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&prepared_statements=false&connection_limit=5&pool_timeout=10
```

```
DIRECT_URL
```
Value: Direct connection string dari Supabase (mode: Transaction)
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

### Supabase Variables

```
NEXT_PUBLIC_SUPABASE_URL
```
Value: Project URL dari Supabase
```
https://[PROJECT-REF].supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Value: Anon public key dari Supabase

```
SUPABASE_SERVICE_ROLE_KEY
```
Value: Service role key dari Supabase (untuk upload foto)

### App Configuration

```
NODE_ENV
```
Value: `production`

```
SESSION_SECRET
```
Value: Random string minimal 32 karakter
Generate dengan: `openssl rand -base64 32`

```
REGISTRATION_TOKEN
```
Value: Token untuk registrasi admin
Generate dengan: `openssl rand -hex 16`

```
GROQ_API_KEY
```
Value: API key dari Groq (untuk AI Chatbot)
Dapatkan di: https://console.groq.com/keys

## Cara Mendapatkan Supabase Credentials:

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project kamu
3. **Database Connection**:
   - Settings > Database > Connection String
   - Copy untuk DATABASE_URL (mode: Session) dan DIRECT_URL (mode: Transaction)
4. **API Keys**:
   - Settings > API
   - Copy Project URL, anon public key, dan service_role key

## Setelah Menambahkan Variables:

1. Klik **Save** untuk setiap variable
2. Pilih environment: **Production**, **Preview**, dan **Development**
3. Klik **Redeploy** untuk apply perubahan

## Troubleshooting:

Jika masih error setelah menambahkan variables:
1. Pastikan semua variables sudah tersimpan
2. Redeploy project dari Vercel dashboard
3. Cek logs di Vercel untuk error detail
