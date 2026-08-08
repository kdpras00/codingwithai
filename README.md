# CodingWithAI - PRD Generator

Aplikasi web modern untuk men- *generate* Product Requirement Document (PRD), spesifikasi teknis, arsitektur, dan *task list* secara instan menggunakan AI (Google Gemini). Hasil dari PRD ini sangat cocok digunakan sebagai *prompt* terstruktur untuk AI Coding Agents (seperti Cursor, GitHub Copilot, dsb).

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS & Lucide React
- **Authentication:** NextAuth.js (Google OAuth)
- **Database:** Prisma ORM (PostgreSQL)
- **AI Engine:** Google Gemini API
- **UI Components:** React Toastify

## Persiapan Environment
Buat file `.env` di *root* folder dengan format berikut:
```env
# URL Database (PostgreSQL dari Supabase / Neon.tech)
DATABASE_URL="postgresql://user:password@host:port/db?schema=public"

# NextAuth (Kunci Rahasia untuk Enkripsi Sesi)
NEXTAUTH_SECRET="buat_string_acak_panjang_disini"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Gemini API
GEMINI_API_KEY="your_google_gemini_api_key"

# (Opsional) True untuk mem-bypass OAuth saat testing lokal
NEXT_PUBLIC_MOCK_AUTH="true"
```

## Cara Menjalankan (Development)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Sinkronisasi skema database ke PostgreSQL:
   ```bash
   npx prisma db push
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```
4. Buka (http://localhost:3000) di browser.

---
*Product by Kurniawan Dwi Prasetyo*
# codingwithai
