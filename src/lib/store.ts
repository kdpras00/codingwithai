"use client";

import { useState, useEffect, useCallback } from "react";
import type { Prd } from "./types";
import { useSession } from "next-auth/react";

export function usePrds() {
  const { data: session, status } = useSession();
  const [prds, setPrds] = useState<Prd[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrds = useCallback(async () => {
    if (status !== "authenticated") {
      setPrds([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/prds");
      if (res.ok) {
        const data = await res.json() as any;
        setPrds(data);
      }
    } catch (e) {
      console.error("Failed to fetch PRDs", e);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchPrds();
  }, [fetchPrds]);

  const add = useCallback(
    async (prd: Prd) => {
      if (status !== "authenticated") return prd;
      
      // Optimistic update
      setPrds((prev) => [prd, ...prev.filter((p) => p.id !== prd.id)]);
      
      try {
        const res = await fetch("/api/prds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prd),
        });
        
        if (res.ok) {
          const saved = await res.json() as any;
          // Update with the ID from the database
          setPrds((prev) => prev.map((p) => (p.id === prd.id ? saved : p)));
          return saved;
        }
      } catch (e) {
        console.error("Failed to save PRD", e);
      }
      return prd;
    },
    [status]
  );

  const remove = useCallback(
    async (id: string) => {
      if (status !== "authenticated") return;
      
      // Optimistic delete
      setPrds((prev) => prev.filter((p) => p.id !== id));
      
      try {
        await fetch(`/api/prds/${id}`, { method: "DELETE" });
      } catch (e) {
        console.error("Failed to delete PRD", e);
        // Revert on failure
        fetchPrds();
      }
    },
    [status, fetchPrds]
  );

  return { prds, add, remove, loading };
}
