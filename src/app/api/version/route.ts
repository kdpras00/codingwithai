import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Use VERCEL_GIT_COMMIT_SHA as the primary stable identifier
  // Fallback to VERCEL_URL or a default value if not available
  const version = process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_URL || "dev-version";

  return NextResponse.json(
    { version },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
