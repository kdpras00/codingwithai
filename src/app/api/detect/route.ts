import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { getAIModel } from "@/lib/ai";

const questionsSchema = z.object({
  name: z.string().describe("Nama keren dan representatif untuk aplikasi ini (1-3 kata)"),
  type: z.string().describe("Tipe proyek singkat (misal: saas, ecommerce, static, ai-tool, dll)"),
  questions: z.array(z.object({
    text: z.string().describe("Pertanyaan klarifikasi"),
    options: z.array(z.string()).describe("2-3 opsi saran jawaban singkat (maks 4 kata per opsi)")
  })).describe("5 Pertanyaan klarifikasi mendalam untuk menggali detail ide ini")
});

const modulesSchema = z.object({
  modules: z.array(z.object({
    name: z.string(),
    features: z.array(z.string())
  })).describe("3-5 Modul utama beserta fitur-fiturnya"),
  audiences: z.array(z.string()).describe("Siapa saja target pengguna aplikasi ini?"),
  pillars: z.array(z.object({
    title: z.string(),
    desc: z.string()
  })).describe("Pilar/Nilai jual utama dari aplikasi ini")
});

export const dynamic = "force-dynamic";

const defaultQ = [
  { text: "Apa tujuan utama aplikasi ini?", options: ["Untuk pribadi", "Untuk bisnis B2B", "Platform publik"] },
  { text: "Siapa target penggunanya?", options: ["Pelajar", "Pekerja profesional", "Umum"] },
  { text: "Apa fitur andalannya?", options: ["Manajemen data", "Chat realtime", "Pembayaran"] },
  { text: "Bagaimana model monetisasi atau bisnisnya?", options: ["Gratis dengan iklan", "Berlangganan bulanan", "Sekali bayar"] },
  { text: "Apakah ada aplikasi referensi yang mirip?", options: ["Belum ada", "Banyak di pasaran"] }
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as any;
    const idea = typeof body.idea === "string" ? body.idea.trim() : "";
    const lang = typeof body.lang === "string" ? body.lang : "id";
    const mode = typeof body.mode === "string" ? body.mode : "questions";

    if (!idea) {
      return NextResponse.json({
        type: "unknown",
        name: "Proyek",
        questions: [],
        modules: [],
        audiences: [],
        pillars: []
      });
    }

    const langInstruction = lang === "en"
      ? "You MUST write all JSON values in English."
      : "Kamu WAJIB menulis semua isi JSON dalam Bahasa Indonesia.";

    let systemPrompt = "";
    if (mode === "questions") {
      systemPrompt = `Kamu adalah CPO visioner. Hasilkan 5 pertanyaan klarifikasi mendalam untuk ide proyek ini.
${langInstruction}

ATURAN PENTING untuk setiap pertanyaan:
- Pertanyaan harus menggali keputusan desain yang paling berdampak pada arsitektur dan scope
- Setiap pertanyaan WAJIB memiliki 2-4 opsi jawaban yang konkret dan singkat (maks 4 kata per opsi)

ATURAN isMultiSelect yang KETAT (berlaku untuk semua jenis project):
isMultiSelect FALSE (pilih satu) untuk:
- Strategi atau pendekatan utama ("model bisnis mana", "arsitektur mana yang dipilih")
- Prioritas tunggal ("fitur PALING penting", "target utama")
- Skala atau stage ("mulai dari skala berapa", "fase pertama untuk siapa")
- Keputusan teknis eksklusif ("database engine mana", "cloud provider mana")

isMultiSelect TRUE (boleh pilih banyak) untuk:
- Daftar fitur yang akan dibangun ("fitur apa SAJA")
- Platform atau channel distribusi ("diakses dari mana SAJA")
- Integrasi pihak ketiga ("terhubung ke platform APA SAJA")
- Compliance atau regulasi yang berlaku ("regulasi APA SAJA yang wajib dipenuhi")

DEFAULT: isMultiSelect FALSE — set TRUE HANYA jika pertanyaan secara eksplisit menanyakan daftar/kombinasi item.`;
    } else {
      systemPrompt = `Kamu adalah CTO visioner. Rancang struktur modul arsitektur, pilar, dan target audiens berdasarkan ide dan jawaban klarifikasi pengguna.\n${langInstruction}`;
    }

    const model = getAIModel(process.env.NEXT_PUBLIC_AI_MODEL_NAME?.split(",")[0]?.trim());

    let prompt = `Ide proyek: ${idea}\n`;
    if (mode === "modules") {
      const answers = Array.isArray(body.answers) ? body.answers : [];
      if (answers.length > 0 && answers.some((a: any) => typeof a === "string" && a.trim())) {
        prompt += `\nJawaban klarifikasi pengguna:\n`;
        answers.forEach((ans: any, i: number) => {
          if (ans && ans.trim()) prompt += `- Jawaban untuk pertanyaan ${i + 1}: ${ans}\n`;
        });
      }
    }

    if (mode === "questions") {
      const result = await generateObject({
        model,
        system: systemPrompt,
        prompt,
        schema: questionsSchema,
      });

      let finalQuestions = result.object.questions || [];
      if (finalQuestions.length < 5) {
        finalQuestions = [...finalQuestions, ...defaultQ.slice(finalQuestions.length, 5)];
      } else if (finalQuestions.length > 5) {
        finalQuestions = finalQuestions.slice(0, 5);
      }

      return NextResponse.json({
        detected: result.object.name,
        type: result.object.type,
        tier: "pro",
        name: result.object.name,
        questions: finalQuestions,
      });
    } else {
      const result = await generateObject({
        model,
        system: systemPrompt,
        prompt,
        schema: modulesSchema,
      });

      return NextResponse.json({
        modules: result.object.modules,
        audiences: result.object.audiences,
        pillars: result.object.pillars,
      });
    }

  } catch (e) {
    console.error("detect error:", e);
    return NextResponse.json({
      type: "custom",
      name: "Custom Project",
      questions: defaultQ,
      modules: [],
      audiences: ["Umum"],
      pillars: []
    });
  }
}