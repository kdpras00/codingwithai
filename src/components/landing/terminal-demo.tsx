"use client";

import { useEffect, useState } from "react";

const SCRIPT = [
  "> npx ngodingai \"Aplikasi catatan keuangan pribadi offline\"",
  "",
  "┌─ PRD Agent ─────────────────────────────────┐",
  "│ ✓ Konteks & ide utama diproses              │",
  "│ ✓ Core features (MVP) dirumuskan            │",
  "│ ✓ User flow dirancang (3 langkah mudah)     │",
  "│ ✓ Arsitektur dipilih: SQLite + React Native │",
  "│ ✓ Skema database (ERD) finalisasi           │",
  "└─────────────────────────────────────────────┘",
  "",
  "✔ PRD selesai: Singkat, padat, no-overkill!",
  "✔ Dokumen siap dieksekusi oleh AI Coder",
  "",
];

export default function TerminalDemo() {
  const [lines, setLines] = useState<string[]>([SCRIPT[0]]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 1;
    const timer = setInterval(() => {
      setLines(SCRIPT.slice(0, i + 1));
      i++;
      if (i >= SCRIPT.length) {
        setDone(true);
        clearInterval(timer);
      }
    }, 320);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="panel relative overflow-hidden text-left shadow-2xl shadow-black/60">
      <div className="flex items-center gap-2 border-b border-edge px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
        <span className="h-3 w-3 rounded-full bg-green-500/70" />
        <span className="ml-3 font-mono text-xs text-zinc-500">ngodingai — agent pipeline</span>
      </div>
      <div className="max-h-[380px] overflow-y-auto p-5 font-mono text-[12.5px] leading-[1.7]">
        {lines.map((l, i) => (
          <div
            key={i}
            className={
              l.startsWith("┌") || l.startsWith("└")
                ? "text-zinc-600"
                : l.startsWith("│")
                ? l.includes("✓")
                  ? "text-acid"
                  : "text-zinc-300"
                : l.startsWith(">")
                ? "font-semibold text-zinc-100"
                : l.startsWith("✔")
                ? "text-acid"
                : "text-zinc-500"
            }
          >
            {l || "\u00A0"}
          </div>
        ))}
        {!done && <span className="animate-blink text-acid">▊</span>}
      </div>
    </div>
  );
}
