"use client";

import { useEffect, useRef } from "react";

export default function AutoUpdate() {
  const currentVersionRef = useRef<string | null>(null);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const serverVersion = data.version;

        if (!currentVersionRef.current) {
          // Initialize baseline version on first load
          currentVersionRef.current = serverVersion;
        } else if (serverVersion !== currentVersionRef.current) {
          // Version mismatch indicates a new deployment; reload to get latest assets
          window.location.reload();
        }
      } catch (error) {
        // Ignore errors (e.g., if user is temporarily offline)
      }
    };

    // Initial check on mount
    checkVersion();

    // Check periodically every 60 seconds
    const interval = setInterval(checkVersion, 60000);

    // Check immediately when user returns to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkVersion();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
