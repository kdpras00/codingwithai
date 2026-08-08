import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const prds = await prisma.prd.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(prds);
  } catch (error) {
    console.error("Failed to fetch PRDs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    
    // Convert object/array fields to JSON-compatible format for Prisma
    const prd = await prisma.prd.create({
      data: {
        id: data.id, // Gunakan ID yang digenerate oleh AI/Frontend
        userId: session.user.id,
        name: data.name,
        tagline: data.tagline,
        summary: data.summary,
        problem: data.problem,
        audience: data.audience || [],
        goals: data.goals || [],
        modelId: data.modelId,
        requirements: data.requirements || [],
        modules: data.modules || [],
        userFlow: data.userFlow || [],
        architecture: data.architecture || [],
        db: data.db || [],
        constraints: data.constraints || [],
        outOfScope: data.outOfScope || [],
        successMetrics: data.successMetrics || [],
      },
    });

    return NextResponse.json(prd);
  } catch (error) {
    console.error("Failed to create PRD:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
