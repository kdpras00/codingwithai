import { NextRequest, NextResponse } from "next/server";
import { streamPrd } from "@/lib/engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const idea = typeof body.idea === "string" ? body.idea.trim() : "";
    const type = typeof body.type === "string" ? body.type.trim() : "custom";

    if (!idea) {
      return NextResponse.json({ error: "Ide wajib diisi." }, { status: 400 });
    }

    const result = await streamPrd({
      idea,
      type,
      modelId: typeof body.modelId === "string" ? body.modelId : "default",
      nameOverride: typeof body.nameOverride === "string" ? body.nameOverride : undefined,
      answers: Array.isArray(body.answers) ? body.answers.map(String) : undefined,
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