import { streamObject } from "ai";
import type { AgentLog, Prd, Tier, GenOptions } from "./types";
import { prdSchema } from "./types";

const AGENT_DEFS = [
  {
    id: "prd",
    name: "PRD Agent",
    role: "Analisis ide, arsitektur, database, dan dokumen PRD lengkap",
    lines: [
      "> Membaca konteks dan ide awal proyek...",
      "> Mengidentifikasi masalah utama & target pengguna...",
      "> Merumuskan MVP (Minimum Viable Product)...",
      "> Menyusun daftar core features dan user flow...",
      "> Menentukan arsitektur sistem yang optimal...",
      "> Merancang skema database (ERD)...",
      "> Finalisasi dokumen PRD...",
    ],
  },
];

function makeLogs(): AgentLog[] {
  return AGENT_DEFS.map((a) => ({
    agentId: a.id,
    agentName: a.name,
    role: a.role,
    lines: a.lines,
    status: "pending" as const,
  }));
}

export async function streamPrd(opts: GenOptions) {
  const { idea, tech, answers, lang, type } = opts;

  let context = `Ide Proyek:\n${idea}\n\n`;
  if (answers && answers.length > 0) {
    context += `Konteks Tambahan / Jawaban User:\n`;
    answers.forEach((ans, i) => {
      if (ans.trim()) context += `- P${i + 1}: ${ans}\n`;
    });
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

  const { createOpenAI } = require("@ai-sdk/openai");
  const ollama = createOpenAI({
    apiKey: process.env.OLLAMA_API_KEY,
    baseURL: process.env.OLLAMA_BASE_URL ?? "https://ollama.com/v1",
  });

  const model = ollama(opts.modelId || "gemma4:31b");

  const langInstruction =
    lang === "en"
      ? "You MUST write all textual descriptions, summaries, names, goals, features, flows, schema, and constraints in English."
      : "Kamu WAJIB menulis semua deskripsi tekstual, ringkasan, nama, tujuan, fitur, alur, skema, dan batasan dalam Bahasa Indonesia.";

  const isComplex = ["saas", "marketplace", "social-media", "ecommerce", "fintech", "ai-tool", "devtool"].includes(type);
  const isSimple = ["landing-page", "static", "portfolio", "blog"].includes(type);

  let complexityInstruction = "";
  if (isSimple) {
    complexityInstruction =
      "Proyek ini adalah aplikasi statis/sederhana. JANGAN merancang arsitektur atau database yang rumit. Kosongkan bagian 'db' atau buat seminimal mungkin. KOSONGKAN field 'userStories', 'risks', 'milestones', 'assumptions', dan 'roles' (set sebagai array kosong []).";
  } else if (isComplex) {
    complexityInstruction =
      `Proyek ini adalah sistem kompleks. Rancang arsitektur yang scalable. Pada bagian 'db', JANGAN hanya membuat tabel master. Wajib sertakan tabel pendukung operasional secara detail.

Karena proyek ini KOMPLEKS, kamu bertindak sebagai Principal Product Manager & Staff Engineer. Kamu WAJIB mengikuti aturan ini:

=== ATURAN FASING & MVP ===
1. JANGAN menumpuk semua fitur arsitektur kompleks ke dalam MVP. Gunakan tag [MVP]/[V2]/[V3] di setiap bullet fitur.
2. KRITIS: Setelah kamu selesai menentukan tag fase, tanyakan pada dirimu sendiri: "Apakah value proposition utama dari produk ini bisa dirasakan user di fase MVP saja?" Jika TIDAK (misal: fitur inti justru di V2), kamu WAJIB menambahkan komentar eksplisit di 'outOfScope' yang menjelaskan ALASAN strategis kenapa fitur inti itu ditunda (contoh: "Cross-border settlement sengaja ditunda ke V2 karena kompleksitas konsensus quorum perlu validasi arsitektur terlebih dahulu — MVP fokus ledger domestik sebagai walking skeleton.").
3. 'milestones' harus dipecah realistis (Fase 1 MVP Murni, Fase 2 Scale, Fase 3 Enterprise/Maturity).

=== ATURAN ASSUMPTIONS & RISKS (WAJIB DIISI) ===
4. Ini bagian TERPENTING. Setelah kamu selesai menulis seluruh PRD, lakukan SELF-AUDIT dengan menjawab pertanyaan: "Fitur atau klaim mana di dokumen ini yang paling berisiko meleset, dan kenapa?"
   - Setiap klaim performa agresif (misal: "<50ms latency", "<1% CPU", "zero downtime", "RPO=0") WAJIB masuk ke 'assumptions' beserta cara validasinya (benchmark/PoC/chaos test).
   - Setiap dependency teknis yang bisa jadi blocker (misal: kernel version, HSM vendor lock-in, cloud region availability) WAJIB masuk ke 'assumptions'.
   - Setiap kontradiksi arsitektur yang kamu sadari (misal: global consistency vs network partition) HARUS di-flag di 'risks'.
   Minimal 5 items di 'assumptions' dan 5 items di 'risks'.

=== ATURAN SCHEMA DB SELF-CHECK ===
5. Setelah menulis skema 'db', lakukan pengecekan:
   - Kolom yang menyimpan counter/sequence global: pastikan tipe datanya BIGINT, BUKAN INT (INT overflow di ~2.1 miliar).
   - Kolom yang menyimpan pair/composite key: pertimbangkan FK terpisah daripada string gabungan (contoh: jangan "bankA_bankB" sebagai VARCHAR — pakai bank_a_id + bank_b_id sebagai FK).
   - Pastikan kolom monetary menggunakan DECIMAL/NUMERIC, bukan FLOAT.

=== ATURAN COMPLIANCE ===
6. Jika proyek melibatkan Institusi Keuangan/Bank, perhatikan Data Residency (sebutkan region cloud spesifik, misal: "AWS ap-southeast-3 Jakarta"), regulasi lokal (OJK/BI/MAS/BSP), dan WAJIB address skenario on-premise/sovereign cloud di 'outOfScope' jika belum termasuk MVP.
7. Definisikan 'roles' (RBAC) secara komprehensif.
8. Isi 'userStories' minimal 5 stories dengan acceptance criteria yang testable.`;
  } else {
    complexityInstruction =
      "Rancang arsitektur dan database yang seimbang, tidak terlalu over-engineering namun cukup untuk mencakup seluruh fitur yang diminta. Isi field opsional dengan jumlah secukupnya.";
  }

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
7. Kamu wajib mematuhi skema JSON yang diminta secara ketat. Output harus berupa data JSON valid dengan struktur kunci berikut:
   - "name": Nama aplikasi (string)
   - "tagline": Slogan pendek (string)
   - "summary": Ringkasan eksekutif (string)
   - "problem": Masalah utama yang dipecahkan (string)
   - "audience": Target pengguna (array of string)
   - "goals": Tujuan proyek (array of string)
   - "requirements": Daftar requirement fungsional (array of string)
   - "modules": Modul utama (array of object: { name: string, features: string[] }). WAJIB: Setiap fitur dalam array 'features' HARUS diawali dengan tag fase, contoh: "[MVP] Login", "[V2] Analytics", "[V3] ML Model". JANGAN masukkan semua fitur ke [MVP].
   - "userFlow": Alur pengguna (array of object: { step: number, title: string, description: string })
   - "architecture": Komponen arsitektur (array of object: { name: string, layer: string, description: string, tech: string })
   - "db": Skema database (array of object: { name: string, description: string, columns: Array<{ name: string, type: string, note?: string }> })
   - "constraints": Batasan teknis & desain. Wajib menyertakan batasan regulasi keamanan/privasi data (seperti UU PDP, PCI-DSS, dll.) jika aplikasi mengelola data sensitif, akun, atau pembayaran (array of string)
   - "outOfScope": Fitur-fitur yang secara eksplisit tidak dibuat atau ditunda pada fase MVP (array of string)
   - "successMetrics": Indikator/Metrik keberhasilan produk (KPI) yang terukur dalam angka/persentase (array of string)
   - "userStories": User stories dalam format Agile (array of object: { persona: string, action: string, value: string, acceptanceCriteria: string[] }). Kosongkan jika proyek sederhana.
   - "risks": Daftar risiko teknis/bisnis (array of object: { risk: string, impact: string (Tinggi/Sedang/Rendah), mitigation: string }). Kosongkan jika proyek sederhana.
   - "milestones": Timeline pengembangan yang dipisah fase-fasenya (array of object: { phase: string, title: string, duration: string, deliverables: string[] }). Kosongkan jika proyek sederhana.
   - "assumptions": Daftar asumsi teknis/bisnis atau performa yang harus divalidasi via Spike/PoC (array of object: { assumption: string, validationPlan: string }). Kosongkan jika proyek sederhana.
   - "roles": Daftar persona/RBAC dan hak aksesnya (array of object: { role: string, accessLevel: string, description: string }). Kosongkan jika proyek sederhana.

JANGAN GUNAKAN KUNCI LAIN seperti 'project_summary' atau 'user_flow' (snake_case). Wajib gunakan kunci camelCase di atas!
8. JANGAN GUNAKAN CODE BLOCK MARKDOWN (seperti \`\`\`json atau \`\`\`). Tulislah output langsung dimulai dengan karakter '{' dan diakhiri dengan karakter '}' secara mentah. JANGAN ada teks apapun sebelum karakter '{' pertama atau sesudah karakter '}' terakhir.`;

  const result = await streamObject({
    model,
    system: systemPrompt,
    prompt: "Buatkan dokumen PRD lengkap sekarang berdasarkan konteks di atas.",
    schema: prdSchema,
    temperature: 0.2, // Low temperature to prevent language leaks/hallucinations
    maxOutputTokens: 8192, // Large token limit to ensure long enterprise PRDs don't truncate early
  });

  return result;
}

export function buildMarkdown(prd: Prd): string {
  let md = `# PRD — ${prd.name || "Project Requirements Document"}
> ${prd.tagline || ""}

## 1. Overview
${prd.summary || ""}

Masalah utama yang ingin diselesaikan:
${prd.problem || ""}

## 2. Requirements
Berikut adalah persyaratan tingkat tinggi untuk pengembangan sistem:
${(prd.requirements || []).map((r) => `- **${r}**`).join("\n")}

## 3. Core Features
Fitur-fitur kunci yang harus ada dalam versi pertama (MVP):
${(prd.modules || []).map((m) => `- **${m.name}:** ${m.features.join(", ")}`).join("\n")}

## 4. User Flow
Alur kerja sederhana bagi pengguna saat menggunakan aplikasi:
${(prd.userFlow || []).map((uf) => `${uf.step}. **${uf.title}:** ${uf.description}`).join("\n")}

## 5. Architecture
Berikut adalah gambaran arsitektur sistem dan aliran data secara teknis:
${(prd.architecture || []).map((c) => `- **${c.name} (${c.layer})**: ${c.tech}`).join("\n")}

## 6. Database Schema
Berikut adalah struktur ERD database utama:

${(prd.db || [])
  .map(
    (table) => `### Tabel: ${table.name}
${table.description ? `_${table.description}_\n` : ""}${table.columns.map((col) => `- \`${col.name}\` (${col.type}) ${col.note ? `-> ${col.note}` : ""}`).join("\n")}`,
  )
  .join("\n\n")}

## 7. Design & Technical Constraints
Bagian ini mengatur batasan teknis dan panduan desain:
${(prd.constraints || []).map((c) => `- ${c}`).join("\n")}
- **Target Audience:** ${(prd.audience || []).join(", ")}
- **Goals:** ${(prd.goals || []).join(", ")}

## 8. Out of Scope (Di Luar Cakupan MVP)
Fitur atau batasan yang secara spesifik ditunda atau tidak masuk dalam pengembangan fase pertama (MVP):
${(prd.outOfScope || []).map((c) => `- ${c}`).join("\n")}

## 9. Success Metrics (Metrik Keberhasilan)
Indikator kesuksesan yang terukur untuk menilai performa aplikasi setelah dideploy:
${(prd.successMetrics || []).map((c) => `- ${c}`).join("\n")}
`;

  // --- Adaptive sections for complex projects ---
  if (prd.userStories && prd.userStories.length > 0) {
    md += `\n## 10. User Stories & Acceptance Criteria\n`;
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
    md += `\n## ${prd.userStories && prd.userStories.length > 0 ? '11' : '10'}. Risk Register & Mitigation\n`;
    md += `Identifikasi risiko utama beserta strategi mitigasinya:\n\n`;
    md += `| # | Risiko | Dampak | Mitigasi |\n`;
    md += `|---|--------|--------|----------|\n`;
    prd.risks.forEach((r, i) => {
      md += `| ${i + 1} | ${r.risk} | ${r.impact} | ${r.mitigation} |\n`;
    });
    md += `\n`;
  }

  if (prd.milestones && prd.milestones.length > 0) {
    let msNum = 10;
    if (prd.userStories && prd.userStories.length > 0) msNum++;
    if (prd.risks && prd.risks.length > 0) msNum++;
    md += `\n## ${msNum}. Milestones & Timeline\n`;
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
    let rNum = 10;
    if (prd.userStories && prd.userStories.length > 0) rNum++;
    if (prd.risks && prd.risks.length > 0) rNum++;
    if (prd.milestones && prd.milestones.length > 0) rNum++;
    md += `\n## ${rNum}. Roles & Permissions (RBAC)\n`;
    md += `| Role | Access Level | Description |\n`;
    md += `|---|---|---|\n`;
    prd.roles.forEach((r) => {
      md += `| **${r.role}** | ${r.accessLevel} | ${r.description} |\n`;
    });
    md += `\n`;
  }

  if (prd.assumptions && prd.assumptions.length > 0) {
    let aNum = 10;
    if (prd.userStories && prd.userStories.length > 0) aNum++;
    if (prd.risks && prd.risks.length > 0) aNum++;
    if (prd.milestones && prd.milestones.length > 0) aNum++;
    if (prd.roles && prd.roles.length > 0) aNum++;
    md += `\n## ${aNum}. Assumptions & Validation Plan\n`;
    md += `Asumsi teknis/bisnis yang butuh validasi (Spike/PoC) sebelum masuk ke roadmap utama:\n\n`;
    prd.assumptions.forEach((a) => {
      md += `### ${a.assumption}\n`;
      md += `**Validation Plan:** ${a.validationPlan}\n\n`;
    });
  }

  return md;
}

export function buildJson(prd: Prd): string {
  return JSON.stringify(prd, null, 2);
}
