"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Braces,
  Check,
  ClipboardCopy,
  Database,
  Download,
  FileText,
  GitBranch,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import type { Prd } from "@/lib/types";
import { AGENT_MODELS } from "@/lib/presets";
import { usePrds } from "@/lib/store";

const PrdGraph = dynamic(() => import("./prd-graph"), { ssr: false });
import {
  SummarySection,
  DatabaseSection,
  UserFlowSection,
  ArchitectureSection,
} from "./prd-sections";

type Tab = "ringkasan" | "graph" | "userflow" | "arsitektur" | "database";

const TABS: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: "ringkasan", label: "Ringkasan", icon: FileText },
  { id: "graph", label: "Project Graph", icon: GitBranch },
  { id: "userflow", label: "User Flow", icon: GitBranch },
  { id: "arsitektur", label: "Arsitektur", icon: Braces },
  { id: "database", label: "Database", icon: Database },
];

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PrdDetail({ prd }: { prd: Prd }) {
  const [tab, setTab] = useState<Tab>("ringkasan");
  const [copied, setCopied] = useState(false);
  const { remove } = usePrds();
  const model = AGENT_MODELS.find((m) => m.id === prd.modelId);

  const [exported, setExported] = useState<{ md: string; json: string } | null>(
    null,
  );
  useEffect(() => {
    let cancelled = false;
    fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prd }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.markdown) {
          setExported({ md: data.markdown, json: data.json ?? "" });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [prd]);

  const md = exported?.md ?? "";
  const date = new Date(prd.createdAt).toLocaleDateString("id-ID", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-zinc-500 transition-colors hover:text-zinc-200"
        >
          Beranda
        </Link>
        <span className="text-zinc-700">/</span>
        <Link
          href="/builder"
          className="text-zinc-500 transition-colors hover:text-zinc-200"
        >
          Generator PRD
        </Link>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-300">{prd.name}</span>
      </div>

      <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="min-w-0">
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
            {prd.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base">
            {prd.tagline}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 sm:flex-nowrap">
          <button
            onClick={() => {
              navigator.clipboard.writeText(md);
              toast.success("Markdown PRD disalin ke clipboard!");
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }}
            className="btn-ghost"
          >
            {copied ? (
              <Check size={15} className="text-acid" />
            ) : (
              <ClipboardCopy size={15} />
            )}
            {copied ? "Tersalin" : "Salin MD"}
          </button>
          <button
            onClick={() =>
              download(
                `${prd.name.toLowerCase().replace(/\s+/g, "-")}.md`,
                md,
                "text/markdown",
              )
            }
            className="btn-ghost"
          >
            <Download size={15} /> Export .md
          </button>
          <button
            onClick={() =>
              download(
                `${prd.name.toLowerCase().replace(/\s+/g, "-")}.json`,
                exported?.json ?? "{}",
                "application/json",
              )
            }
            className="btn-primary"
          >
            <Download size={15} /> Export JSON
          </button>
        </div>
      </div>

      <div className="mt-8 flex gap-1 overflow-x-auto border-b border-edge pb-px">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm transition-colors ${
              tab === t.id
                ? "border-acid font-medium text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "ringkasan" && <SummarySection prd={prd} />}
        {tab === "graph" && (
          <div>
            <PrdGraph prd={prd} />
            <p className="mt-3 text-xs text-zinc-600">
              Feature breakdown dari project sampai fitur — mind map yang
              menyesuaikan ide kamu.
            </p>
          </div>
        )}
        {tab === "database" && <DatabaseSection prd={prd} />}
        {tab === "userflow" && <UserFlowSection prd={prd} />}
        {tab === "arsitektur" && <ArchitectureSection prd={prd} />}
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-edge bg-gradient-to-r from-acid/5 via-transparent to-transparent p-6 md:flex-row">
        <div>
          <div className="text-sm font-semibold text-white">
            Siap dieksekusi oleh AI coding agent?
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Export task list ke Linear atau GitHub Issues, atau generate ulang
            dengan model lain.
          </p>
        </div>
        <div className="flex gap-2.5">
          <Link href="/builder" className="btn-ghost">
            Generate ulang
          </Link>
          <Link href="/builder" className="btn-primary">
            Bikin PRD baru
          </Link>
        </div>
      </div>
    </div>
  );
}
