import { NextRequest, NextResponse } from "next/server";
import { streamPrd } from "@/lib/engine";

export const maxDuration = 300; // 5 minutes timeout for long PRD generation


export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as any;
    const idea = typeof body.idea === "string" ? body.idea.trim() : "";
    const type = typeof body.type === "string" ? body.type.trim() : "custom";

    if (!idea) {
      return NextResponse.json({ error: "Ide wajib diisi." }, { status: 400 });
    }
    if (idea.length < 30 || idea.split(/\s+/).length < 5) {
      return NextResponse.json({ error: "Ide terlalu singkat. Minimal 5 kata atau 30 karakter." }, { status: 400 });
    }

    const answers = Array.isArray(body.answers)
      ? body.answers.map((a: unknown, i: number) => {
          const ans = String(a).trim();
          return ans.length > 0 ? ans : `[DILEWATI - P${i+1}] User tidak memberikan jawaban. Engine wajib gunakan asumsi default untuk pertanyaan ini.`;
        })
      : undefined;

    const result = await streamPrd({
      idea,
      type,
      modelId: typeof body.modelId === "string" ? body.modelId : "default",
      nameOverride: typeof body.nameOverride === "string" ? body.nameOverride : undefined,
      answers,
      tech: Array.isArray(body.tech) ? body.tech.map(String) : undefined,
      lang: typeof body.lang === "string" ? body.lang : "id",
      modulesHint: Array.isArray(body.modulesHint) ? body.modulesHint : undefined,
    });

    return result.toTextStreamResponse();
  } catch (e) {
    console.error("generate error:", e);
    return NextResponse.json({ error: "Gagal generate PRD." }, { status: 500 });
  }
}