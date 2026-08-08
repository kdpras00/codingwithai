import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';

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

function extractJson(text: string): any {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in response");
  return JSON.parse(match[0]);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const idea = typeof body.idea === "string" ? body.idea.trim() : "";
    const lang = typeof body.lang === "string" ? body.lang : "id";
    const mode = typeof body.mode === "string" ? body.mode : "questions"; // "questions" or "modules"
    
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
      systemPrompt = `Kamu adalah Chief Product Officer (CPO) visioner.
Tugasmu adalah menganalisis ide proyek dan menghasilkan 5 pertanyaan klarifikasi mendalam untuk menggali detail ide tersebut.
Kamu wajib merespons HANYA dengan objek JSON mentah. Jangan tambahkan kata pengantar atau penutup di luar JSON.
${langInstruction}

Format JSON yang wajib kamu ikuti harus persis seperti ini:
{
  "name": "Nama aplikasi representatif (1-3 kata)",
  "type": "Tipe proyek (misal: saas, mind-map, ecommerce, dll)",
  "questions": [
    {
      "text": "Pertanyaan klarifikasi 1",
      "options": ["Saran opsi 1", "Saran opsi 2", "Saran opsi 3"]
    },
    {
      "text": "Pertanyaan klarifikasi 2",
      "options": ["Saran opsi 1", "Saran opsi 2"]
    }
  ]
}`;
    } else {
      systemPrompt = `Kamu adalah Chief Technology Officer (CTO) visioner.
Tugasmu adalah merancang struktur modul arsitektur, pilar, dan target audiens berdasarkan ide dan jawaban klarifikasi pengguna.
Kamu wajib merespons HANYA dengan objek JSON mentah. Jangan tambahkan kata pengantar atau penutup di luar JSON.
${langInstruction}

Format JSON yang wajib kamu ikuti harus persis seperti ini:
{
  "modules": [
    {
      "name": "Nama Modul Utama (misal: Kanban Board, Mind-map Canvas, Billing)",
      "features": [
        "[MVP] Detail fitur 1 dari modul ini",
        "[Fase 2] Detail fitur 2 dari modul ini"
      ]
    }
  ],
  "audiences": [
    "Target pengguna 1",
    "Target pengguna 2"
  ],
  "pillars": [
    {
      "title": "Pilar utama / Nilai jual 1",
      "desc": "Penjelasan pilar 1"
    }
  ]
}`;
    }

    const { createOpenAI } = require('@ai-sdk/openai');
    const ollama = createOpenAI({
      apiKey: process.env.OLLAMA_API_KEY,
      baseURL: process.env.OLLAMA_BASE_URL ?? "https://ollama.com/v1",
    });

    let context = `Ide proyek: ${idea}\n`;
    if (mode === "modules") {
      const answers = Array.isArray(body.answers) ? body.answers : [];
      if (answers.length > 0 && answers.some((a: any) => typeof a === "string" && a.trim())) {
        context += `\nJawaban klarifikasi pengguna untuk membantu merancang modul arsitektur:\n`;
        answers.forEach((ans: any, i: number) => {
          if (ans && ans.trim()) context += `- Jawaban untuk pertanyaan ${i + 1}: ${ans}\n`;
        });
      }
    }

    if (lang === "en") {
      context += "\n\nIMPORTANT: You MUST write all JSON values in English.";
    } else {
      context += "\n\nPENTING: Kamu WAJIB menulis semua isi JSON dalam Bahasa Indonesia.";
    }

    let parsed;
    try {
      const { generateText } = require('ai');
      const { text } = await generateText({
        model: ollama("gemma4:31b"),
        system: systemPrompt,
        prompt: context,
      });
      if (mode === "questions") {
        parsed = questionsSchema.parse(extractJson(text));
      } else {
        parsed = modulesSchema.parse(extractJson(text));
      }
    } catch (e: any) {
      console.error("AI parse/generate error in detect:", e);
      throw e;
    }

    if (mode === "questions") {
      let finalQuestions = (parsed as any).questions || [];
      const defaultQ = [
        { text: "Apa tujuan utama aplikasi ini?", options: ["Untuk pribadi", "Untuk bisnis B2B", "Platform publik"] }, 
        { text: "Siapa target penggunanya?", options: ["Pelajar", "Pekerja profesional", "Umum"] }, 
        { text: "Apa fitur andalannya?", options: ["Manajemen data", "Chat realtime", "Pembayaran"] },
        { text: "Bagaimana model monetisasi atau bisnisnya?", options: ["Gratis dengan iklan", "Berlangganan bulanan", "Sekali bayar"] },
        { text: "Apakah ada aplikasi referensi yang mirip?", options: ["Belum ada", "Banyak di pasaran"] }
      ];
      if (finalQuestions.length < 5) {
        finalQuestions = [...finalQuestions, ...defaultQ.slice(finalQuestions.length, 5)];
      } else if (finalQuestions.length > 5) {
        finalQuestions = finalQuestions.slice(0, 5);
      }

      return NextResponse.json({
        detected: (parsed as any).name,
        type: (parsed as any).type,
        tier: "pro",
        name: (parsed as any).name,
        questions: finalQuestions,
      });
    } else {
      return NextResponse.json({
        modules: (parsed as any).modules,
        audiences: (parsed as any).audiences,
        pillars: (parsed as any).pillars
      });
    }

  } catch (e) {
    console.error("detect error:", e);
    return NextResponse.json({
      type: "custom",
      name: "Custom Project",
      questions: [
        { text: "Apa tujuan utama aplikasi ini?", options: ["Untuk pribadi", "Untuk bisnis B2B", "Platform publik"] }, 
        { text: "Siapa target penggunanya?", options: ["Pelajar", "Pekerja profesional", "Umum"] }, 
        { text: "Apa fitur andalannya?", options: ["Manajemen data", "Chat realtime", "Pembayaran"] },
        { text: "Bagaimana model monetisasi atau bisnisnya?", options: ["Gratis dengan iklan", "Berlangganan bulanan", "Sekali bayar"] },
        { text: "Apakah ada aplikasi referensi yang mirip?", options: ["Belum ada", "Banyak di pasaran"] }
      ],
      modules: [],
      audiences: ["Umum"],
      pillars: []
    });
  }
}