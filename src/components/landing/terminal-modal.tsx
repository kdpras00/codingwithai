"use client";

import { useState, useEffect } from "react";
import TerminalDemo from "./terminal-demo";
import { Terminal, X } from "lucide-react";

export default function TerminalModal() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="animate-fade-up mt-12 inline-flex items-center gap-2 rounded-xl border border-edge bg-panel px-6 py-3.5 text-sm font-medium text-foreground shadow-lg transition-all hover:border-acid/30 hover:bg-ghost-hover-bg hover:text-acid"
        style={{ animationDelay: "240ms" }}
      >
        Lihat Demo CLI
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-panel p-4 backdrop-blur-md">
          <div className="animate-fade-up relative w-full max-w-4xl" style={{ animationDelay: "0ms" }}>
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-ghost-hover-bg hover:text-foreground"
            >
              Tutup
            </button>
            <TerminalDemo />
          </div>
        </div>
      )}
    </>
  );
}
