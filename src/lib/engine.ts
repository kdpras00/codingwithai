import { streamObject } from "ai";
import type { Prd, Tier, GenOptions } from "./types";
import { getAIModel } from "./ai";
import { prdSchema } from "./types";

export const PROMPT_VERSION = "v1.5.0";

export async function streamPrd(opts: GenOptions) {
  const { idea, tech, answers, lang, type } = opts;

  let context = `Ide Proyek:\n${idea}\n\n`;
  if (answers && answers.length > 0) {
    context += `Konteks Tambahan / Jawaban User:\n`;
    answers.forEach((ans, i) => {
      if (ans.trim()) context += `- P${i + 1}: ${ans}\n`;
    });
    context += `\nKRITIS: Jika ada jawaban bertanda [DILEWATI] dengan Asumsi, kamu WAJIB memasukkan asumsi tersebut secara eksplisit ke dalam bagian "requirements" atau "summary" PRD agar asumsinya valid.\n`;
  }
  if (tech && tech.length > 0) {
    context += `\nPreferensi Teknologi: ${tech.join(", ")}\n`;
  }

  if (opts.modulesHint && opts.modulesHint.length > 0) {
    context += `\nStruktur Modul yang Sudah Disetujui User (WAJIB dipatuhi — gunakan PERSIS nama modul ini, jangan buat modul baru di luar daftar ini):\n`;
    opts.modulesHint.forEach((m, i) => {
      context += `${i + 1}. ${m.name}`;
      if (m.features && m.features.length > 0) {
        context += ` — fitur awal: ${m.features.join(", ")}`;
      }
      context += `\n`;
    });
    context += `Kamu BOLEH memperkaya/menambah fitur di dalam modul-modul di atas, tapi JANGAN menambah modul baru yang tidak ada di daftar ini.\n`;
  }

  const model = getAIModel(opts.modelId);

  const langInstruction =
    lang === "en"
      ? "You MUST write all textual descriptions, summaries, names, goals, features, flows, schema, and constraints in English."
      : "Kamu WAJIB menulis semua deskripsi tekstual, ringkasan, nama, tujuan, fitur, alur, skema, dan batasan dalam Bahasa Indonesia.";

  let complexityInstruction = "";
  let isComplexType = false;

  switch (type) {
    case "simple_web":
      complexityInstruction = "Aplikasi statis/landing page. JANGAN buat arsitektur rumit. Kosongkan db, userStories, risks, milestones, assumptions, roles.";
      break;
    case "saas_b2b":
      complexityInstruction = "SaaS B2B. Fokus multi-tenancy, RBAC, subscription. Wajib ada tabel operasional.\nATURAN:\n";
      isComplexType = true;
      break;
    case "marketplace":
      complexityInstruction = "Marketplace (Buyer & Seller). Fokus escrow, review, discovery.\nATURAN:\n";
      isComplexType = true;
      break;
    case "hardware_software":
      complexityInstruction = "IoT/Hardware + Software. Bahas device state, OTA, MQTT.\nATURAN:\n";
      isComplexType = true;
      break;
    case "internal_tool":
      complexityInstruction = "Internal Tool/Admin Panel. Fokus SSO, audit trail, efisiensi operasional.\nATURAN:\n";
      isComplexType = true;
      break;
    case "crud_app":
    default:
      complexityInstruction = "Aplikasi fungsional standar (CRUD). Rancang arsitektur & db secukupnya.";
      break;
  }

  if (isComplexType) {
    complexityInstruction += `
=== ATURAN FASING & MVP ===
1. JANGAN menumpuk semua fitur arsitektur kompleks ke dalam MVP. Gunakan tag [MVP]/[V2]/[V3] di setiap bullet fitur.
2. KRITIS: Setelah kamu selesai menentukan tag fase, tanyakan pada dirimu sendiri: "Apakah value proposition utama dari produk ini bisa dirasakan user di fase MVP saja?" Jika TIDAK (misal: fitur inti justru di V2), kamu WAJIB menambahkan komentar eksplisit di 'outOfScope' yang menjelaskan ALASAN strategis kenapa fitur inti itu ditunda.
3. 'milestones' harus dipecah realistis (Fase 1 MVP Murni, Fase 2 Scale, Fase 3 Enterprise/Maturity).

=== ATURAN ASSUMPTIONS & RISKS (WAJIB DIISI) ===
4. 'assumptions' WAJIB minimal 3 item yang mencakup KETIGA kategori ini:
   a) TEKNIS: dependency eksternal atau klaim performa (contoh: "Third-party API diasumsikan uptime 99.9%", "<100ms latency bisa dicapai dengan Redis caching").
   b) USER BEHAVIOR: asumsi tentang perilaku pengguna yang belum tervalidasi (contoh: "User diasumsikan familiar dengan antarmuka berbasis web").
   c) BISNIS/REGULASI: asumsi regulasi, market, atau model bisnis (contoh: "Regulasi impor API tidak berubah dalam 12 bulan ke depan").
   Untuk produk kompleks: minimal 5 items di 'assumptions' DAN 5 items di 'risks'.
   Setiap klaim performa agresif WAJIB masuk ke 'assumptions' beserta cara validasinya (benchmark/PoC/chaos test).

=== ATURAN SCHEMA DB SELF-CHECK ===
5. Setelah menulis skema 'db', lakukan pengecekan:
   - Kolom yang menyimpan counter/sequence global: pastikan tipe datanya BIGINT, BUKAN INT (INT overflow di ~2.1 miliar).
   - Kolom yang menyimpan pair/composite key: pertimbangkan FK terpisah daripada string gabungan.
   - Pastikan kolom monetary menggunakan DECIMAL/NUMERIC, bukan FLOAT.

=== ATURAN COMPLIANCE ===
6. Jika proyek melibatkan Institusi Keuangan/Bank, perhatikan Data Residency (sebutkan region cloud spesifik, misal: "AWS ap-southeast-3 Jakarta"), regulasi lokal (OJK/BI/MAS/BSP), dan WAJIB address skenario on-premise/sovereign cloud di 'outOfScope' jika belum termasuk MVP.
7. Definisikan 'roles' (RBAC) secara komprehensif.
8. Isi 'userStories' minimal 5 stories dengan acceptance criteria yang testable.`;
  }

  // Detect project characteristics for targeted prompt injection (bilingual)
  const ideaLower = idea.toLowerCase();
  // Broad monetization detection — SaaS, marketplace, freemium, subscription-any-domain
  const hasMonetization = [
    "langganan", "bulanan", "tahunan", "berlangganan",
    "subscription", "premium", "freemium", "bayar", "payment",
    "harga", "pricing", "paket", "plan", "billing", "invoice", "checkout",
    "saas", "mrr", "arr", "revenue", "monetis", "berbayar", "upgrade",
  ].some(k => ideaLower.includes(k));
  // Also trigger if type is inherently monetized
  const hasMonetizationByType = ["saas_b2b", "marketplace"].includes(type);
  const isMonetized = hasMonetization || hasMonetizationByType;
  const hasUnofficialApi = ["whatsapp", "wa blast", "scraping", "unofficial", "web scrape", "bot", "telegram bot", "automation"].some(k => ideaLower.includes(k));
  const hasSensitiveData = ["kesehatan", "health", "keuangan", "finansial", "rekam medis", "kartu kredit", "medical", "finance", "credit card", "bank", "healthcare", "hospital", "clinic"].some(k => ideaLower.includes(k));
  // Projects that always need auth (exclude simple_web)
  const hasAuth = type !== "simple_web";

  const systemPrompt = `Kamu adalah seorang Senior Product Manager & Tech Architect.
Tugasmu adalah menganalisis ide proyek pengguna dan menghasilkan dokumen PRD (Product Requirements Document) yang lengkap, praktis, dan tidak berlebihan.

Konteks:
${context}

ATURAN PENTING:
1. Kamu wajib mengembalikan HANYA objek JSON mentah. JANGAN tambahkan penjelasan atau komentar Markdown lain di luar JSON.
2. Sesuaikan kompleksitas arsitektur dengan skala proyek. ${complexityInstruction}
3. Jika preferensi teknologi menyebutkan "-" untuk backend atau database, artinya proyek ini TIDAK membutuhkan backend/database. Kosongkan array "architecture" dan "db" untuk layer tersebut.
4. Requirements harus berupa kalimat deskriptif singkat.
5. User Flow harus logis dan runut.
6. ${langInstruction}

=== ATURAN SCHEMA DB — TABEL TURUNAN (WAJIB) ===
7. Setelah menulis tabel entitas utama, WAJIB tambahkan tabel turunan berikut sesuai fitur:
   - Ada fitur auth/login → tabel "users" WAJIB include kolom: id (UUID), email, password_hash, is_active (BOOLEAN), created_at, updated_at. Jika ada ToS → tambahkan tos_accepted_at (TIMESTAMP). Jika ada monetisasi → tambahkan plan/tier (VARCHAR) dan plan_expires_at (TIMESTAMP).
   - Ada fitur log/riwayat/history → tambahkan tabel *_logs atau activity_logs
   - Ada fitur pembayaran/transaksi/premium/langganan → tambahkan tabel payments DAN subscriptions
   - Ada fitur notifikasi/push/email → tambahkan tabel notifications
   - Ada fitur kirim pesan/chat → tambahkan tabel messages
   - Ada fitur upload file/gambar → tambahkan tabel attachments atau media_files
   - Ada fitur laporan/report → tambahkan tabel report_snapshots atau exports
   JANGAN hanya generate tabel entity utama. Generate semua tabel relasional yang dibutuhkan fitur-fitur di atas.

=== ATURAN AUDIT KONSISTENSI (SELF-CHECK SEBELUM FINALISASI) ===
8. Sebelum finalisasi JSON, cek: setiap fitur yang disebutkan di "modules[].features" harus punya backing di "requirements". Jika tidak ada, tambahkan ke requirements. Jika fitur tersebut tidak termasuk MVP, pindahkan ke "outOfScope".
${isMonetized ? `
=== ATURAN SUCCESS METRICS — PRODUK BERMONETISASI ===
9. Produk ini melibatkan monetisasi. "successMetrics" WAJIB minimal mencakup:
   - Target MAU (Monthly Active Users) dalam angka spesifik (contoh: "5.000 MAU dalam 6 bulan pertama")
   - Target conversion rate freemium → paid (contoh: "Conversion rate ≥5% dalam 3 bulan")
   - Target churn rate maksimum (contoh: "Churn rate ≤3% per bulan")
   - Engagement metric spesifik untuk domain ini
   - Revenue/MRR target di akhir tahun pertama` : ""}
${hasUnofficialApi || hasSensitiveData ? `
=== ATURAN LEGAL DISCLAIMER ===
10. Produk ini menggunakan unofficial API / menyimpan data sensitif:
    - WAJIB tambahkan item disclaimer/ToS di "requirements"
    - WAJIB tambahkan batasan legal di "constraints" (UU PDP/PDPA, risiko pemblokiran, mekanisme failover)
    - "risks" WAJIB mencakup risiko pemblokiran/banning akun oleh platform resmi` : ""}

=== ATURAN USER STORIES ===
11. Isi "userStories" minimal 1 story per persona yang disebutkan di "audience". Acceptance criteria harus testable (konkret, bisa di-verify dengan ya/tidak).`;

  const result = await streamObject({
    model,
    system: systemPrompt,
    prompt: "Buatkan dokumen PRD lengkap sekarang berdasarkan konteks di atas.",
    schema: prdSchema,
    temperature: 0.2,
  });

  return result;
}

export function buildMarkdown(prd: Prd): string {
  let sectionNumber = 1;
  let md = `# PRD — ${prd.name || "Project Requirements Document"}
> ${prd.tagline || ""}

## ${sectionNumber++}. Overview
${prd.summary || ""}

Masalah utama yang ingin diselesaikan:
${prd.problem || ""}

## ${sectionNumber++}. Requirements
Berikut adalah persyaratan tingkat tinggi untuk pengembangan sistem:
${(prd.requirements || []).map((r) => `- **${r}**`).join("\n")}

## ${sectionNumber++}. Core Features
Fitur-fitur kunci yang harus ada dalam versi pertama (MVP):
${(prd.modules || []).map((m) => `- **${m.name}:** ${m.features.join(", ")}`).join("\n")}

## ${sectionNumber++}. User Flow
Alur kerja sederhana bagi pengguna saat menggunakan aplikasi:
${(prd.userFlow || []).map((uf) => `${uf.step}. **${uf.title}:** ${uf.description}`).join("\n")}

## ${sectionNumber++}. Architecture
Berikut adalah gambaran arsitektur sistem dan aliran data secara teknis:
${(prd.architecture || []).map((c) => `- **${c.name} (${c.layer})**: ${c.tech}`).join("\n")}

## ${sectionNumber++}. Database Schema
Berikut adalah struktur ERD database utama:

${(prd.db || [])
  .map(
    (table) => `### Tabel: ${table.name}
${table.description ? `_${table.description}_\n` : ""}${table.columns.map((col) => `- \`${col.name}\` (${col.type}) ${col.note ? `-> ${col.note}` : ""}`).join("\n")}`,
  )
  .join("\n\n")}

## ${sectionNumber++}. Design & Technical Constraints
Bagian ini mengatur batasan teknis dan panduan desain:
${(prd.constraints || []).map((c) => `- ${c}`).join("\n")}
- **Target Audience:** ${(prd.audience || []).join(", ")}
- **Goals:** ${(prd.goals || []).join(", ")}

## ${sectionNumber++}. Out of Scope (Di Luar Cakupan MVP)
Fitur atau batasan yang secara spesifik ditunda atau tidak masuk dalam pengembangan fase pertama (MVP):
${(prd.outOfScope || []).map((c) => `- ${c}`).join("\n")}

## ${sectionNumber++}. Success Metrics (Metrik Keberhasilan)
Indikator kesuksesan yang terukur untuk menilai performa aplikasi setelah dideploy:
${(prd.successMetrics || []).map((c) => `- ${c}`).join("\n")}
`;

  // --- Adaptive sections for complex projects ---
  if (prd.userStories && prd.userStories.length > 0) {
    md += `\n## ${sectionNumber++}. User Stories & Acceptance Criteria\n`;
    md += `Daftar user stories utama dalam format Agile beserta kriteria penerimaannya:\n\n`;
    prd.userStories.forEach((us, i) => {
      md += `### Story ${i + 1}\n`;
      md += `**As a** ${us.persona}, **I want to** ${us.action}, **so that** ${us.value}\n\n`;
      md += `**Acceptance Criteria:**\n`;
      us.acceptanceCriteria.forEach((ac) => {
        md += `- [ ] ${ac}\n`;
      });
      md += `\n`;
    });
  }

  if (prd.risks && prd.risks.length > 0) {
    md += `\n## ${sectionNumber++}. Risk Register & Mitigation\n`;
    md += `Identifikasi risiko utama beserta strategi mitigasinya:\n\n`;
    md += `| # | Risiko | Dampak | Mitigasi |\n`;
    md += `|---|--------|--------|----------|\n`;
    prd.risks.forEach((r, i) => {
      md += `| ${i + 1} | ${r.risk} | ${r.impact} | ${r.mitigation} |\n`;
    });
    md += `\n`;
  }

  if (prd.milestones && prd.milestones.length > 0) {
    md += `\n## ${sectionNumber++}. Milestones & Timeline\n`;
    md += `Estimasi jadwal pengembangan per fase (Prioritas MoSCoW):\n\n`;
    prd.milestones.forEach((m) => {
      md += `### ${m.phase}: ${m.title} (${m.duration})\n`;
      m.deliverables.forEach((d) => {
        md += `- ${d}\n`;
      });
      md += `\n`;
    });
  }

  if (prd.roles && prd.roles.length > 0) {
    md += `\n## ${sectionNumber++}. Roles & Permissions (RBAC)\n`;
    md += `| Role | Access Level | Description |\n`;
    md += `|---|---|---|\n`;
    prd.roles.forEach((r) => {
      md += `| **${r.role}** | ${r.accessLevel} | ${r.description} |\n`;
    });
    md += `\n`;
  }

  if (prd.assumptions && prd.assumptions.length > 0) {
    md += `\n## ${sectionNumber++}. Assumptions & Validation Plan\n`;
    md += `Asumsi teknis/bisnis yang butuh validasi (Spike/PoC) sebelum masuk ke roadmap utama:\n\n`;
    prd.assumptions.forEach((a) => {
      md += `### ${a.assumption}\n`;
      md += `**Validation Plan:** ${a.validationPlan}\n\n`;
    });
  }

  if (prd.consistencyAudit && prd.consistencyAudit.length > 0) {
    md += `\n## ${sectionNumber++}. Consistency Audit\n`;
    md += `Hasil audit internal AI terhadap konsistensi dokumen:\n\n`;
    prd.consistencyAudit.forEach((audit) => {
      md += `- ${audit}\n`;
    });
    md += `\n`;
  }

  md += `\n\n---\n*Generated by PRD Generator ${PROMPT_VERSION}*\n`;
  return md;
}

export function buildJson(prd: Prd): string {
  return JSON.stringify(prd, null, 2);
}
