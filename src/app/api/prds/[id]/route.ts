import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Ensure the PRD belongs to the user
    const prd = await prisma.prd.findUnique({
      where: { id },
    });

    if (!prd || prd.userId !== session.user.id) {
      return NextResponse.json({ error: "Not Found or Unauthorized" }, { status: 404 });
    }

    await prisma.prd.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete PRD:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
