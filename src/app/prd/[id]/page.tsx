"use client";

import { use, useEffect, useState } from "react";
import PrdDetail from "@/components/prd/prd-detail";
import { usePrds } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function PrdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { prds, loading: prdsLoading } = usePrds();
  const { status } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && status === "unauthenticated") {
      router.push("/");
    }
  }, [mounted, status, router]);

  if (!mounted || status === "loading" || prdsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="animate-pulse font-mono text-sm text-muted">
          memuat PRD…
        </div>
      </div>
    );
  }

  const prd = prds.find((p) => p.id === id);

  if (!prd) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center font-mono text-sm text-muted">
          PRD tidak ditemukan.
        </div>
      </div>
    );
  }

  return <PrdDetail prd={prd} />;
}
