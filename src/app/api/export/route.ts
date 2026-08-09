import { NextRequest, NextResponse } from "next/server";
import { buildJson, buildMarkdown } from "@/lib/engine";
import type { Prd } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as any;
    const prd = body.prd as Prd;
    if (!prd || !prd.id) {
      return NextResponse.json({ error: "PRD tidak valid." }, { status: 400 });
    }
    return NextResponse.json({ markdown: buildMarkdown(prd), json: buildJson(prd) });
  } catch (e) {
    console.error("export error:", e);
    return NextResponse.json({ error: "Gagal generate markdown/json." }, { status: 500 });
  }
}