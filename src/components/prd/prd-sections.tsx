"use client";

import { Check, GitBranch } from "lucide-react";
import type { Prd } from "@/lib/types";

export function SummarySection({ prd }: { prd: Partial<Prd> | null }) {
  if (!prd) return null;
  return (
    <div className="space-y-8">
      <div className="panel p-6">
        <h3 className="text-sm font-semibold text-white">Ringkasan Eksekutif</h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{prd.summary}</p>

        <h4 className="mt-8 text-xs font-semibold uppercase tracking-widest text-zinc-600">Masalah yang dipecahkan</h4>
        <p className="mt-2 rounded-xl border border-edge bg-black/40 p-4 font-mono text-[13px] leading-relaxed text-zinc-300">
          &ldquo;{prd.problem}&rdquo;
        </p>

        <h4 className="mt-8 text-xs font-semibold uppercase tracking-widest text-zinc-600">Requirements</h4>
        <ul className="mt-3 space-y-2">
          {(prd.requirements || []).map((r, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
              <Check size={15} className="mt-0.5 shrink-0 text-acid" />
              {r}
            </li>
          ))}
        </ul>

        <h4 className="mt-8 text-xs font-semibold uppercase tracking-widest text-zinc-600">Tujuan</h4>
        <ul className="mt-3 space-y-2.5">
          {(prd.goals || []).map((g, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
              <Check size={15} className="mt-0.5 shrink-0 text-acid" />
              {g}
            </li>
          ))}
        </ul>

        <h4 className="mt-8 text-xs font-semibold uppercase tracking-widest text-zinc-600">Target Pengguna</h4>
        <div className="mt-3 flex flex-wrap gap-2">
          {(prd.audience || []).map((a) => (
            <span key={a} className="chip">{a}</span>
          ))}
        </div>
      </div>

      {/* Core Features */}
      <div className="panel p-6">
        <h3 className="text-sm font-semibold text-white">Core Features (MVP)</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {(prd.modules || []).map((m) => (
            <div key={m?.name || Math.random()} className="rounded-xl border border-edge bg-black/40 p-4">
              <div className="text-sm font-semibold text-white">{m?.name}</div>
              <ul className="mt-3 space-y-1.5">
                {(m?.features || []).map((f, i) => (
                  <li key={i} className="text-xs leading-relaxed text-zinc-400">· {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Constraints */}
      {prd.constraints && prd.constraints.length > 0 && (
        <div className="panel p-6">
          <h3 className="text-sm font-semibold text-white">Batasan Teknis & Desain</h3>
          <ul className="mt-4 space-y-2">
            {(prd.constraints || []).map((c, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Out of Scope */}
      {prd.outOfScope && prd.outOfScope.length > 0 && (
        <div className="panel p-6">
          <h3 className="text-sm font-semibold text-white">Di Luar Cakupan (Out of Scope MVP)</h3>
          <ul className="mt-4 space-y-2">
            {(prd.outOfScope || []).map((c, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-rose-400/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500/50" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Success Metrics */}
      {prd.successMetrics && prd.successMetrics.length > 0 && (
        <div className="panel p-6">
          <h3 className="text-sm font-semibold text-white">Metrik Keberhasilan (KPI)</h3>
          <ul className="mt-4 space-y-2.5">
            {(prd.successMetrics || []).map((c, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-emerald-400/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/50" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* User Stories */}
      {prd.userStories && prd.userStories.length > 0 && (
        <div className="panel p-6">
          <h3 className="text-sm font-semibold text-white">User Stories & Acceptance Criteria</h3>
          <div className="mt-4 space-y-4">
            {prd.userStories.map((us, i) => (
              <div key={i} className="rounded-xl border border-edge bg-black/40 p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-xs font-bold text-violet-400 border border-violet-500/20">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-relaxed text-zinc-200">
                      <span className="font-semibold text-violet-400">As a</span> {us?.persona},{" "}
                      <span className="font-semibold text-violet-400">I want to</span> {us?.action},{" "}
                      <span className="font-semibold text-violet-400">so that</span> {us?.value}
                    </p>
                    {us?.acceptanceCriteria && us.acceptanceCriteria.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Acceptance Criteria</div>
                        {us.acceptanceCriteria.map((ac, j) => (
                          <div key={j} className="flex items-start gap-2 text-xs text-zinc-400">
                            <Check size={13} className="mt-0.5 shrink-0 text-emerald-500" />
                            <span>{ac}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Register */}
      {prd.risks && prd.risks.length > 0 && (
        <div className="panel p-6">
          <h3 className="text-sm font-semibold text-white">Risk Register & Mitigation</h3>
          <div className="mt-4 space-y-3">
            {prd.risks.map((r, i) => (
              <div key={i} className="rounded-xl border border-edge bg-black/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white">{r?.risk}</div>
                    {r?.mitigation && (
                      <p className="mt-2 text-xs text-zinc-400">
                        <span className="font-semibold text-zinc-300">Mitigasi:</span> {r.mitigation}
                      </p>
                    )}
                  </div>
                  {r?.impact && (
                    <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      r.impact.toLowerCase().includes("tinggi") || r.impact.toLowerCase().includes("high")
                        ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                        : r.impact.toLowerCase().includes("sedang") || r.impact.toLowerCase().includes("medium")
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    }`}>
                      {r.impact}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Milestones */}
      {prd.milestones && prd.milestones.length > 0 && (
        <div className="panel p-6">
          <h3 className="text-sm font-semibold text-white">Milestones & Timeline</h3>
          <div className="mt-4 space-y-4">
            {prd.milestones.map((m, i) => (
              <div key={i} className="relative rounded-xl border border-edge bg-black/40 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-xs font-bold text-sky-400 border border-sky-500/20">
                    {m?.phase}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white">{m?.title}</div>
                    <div className="mt-0.5 text-[11px] text-zinc-500">{m?.duration}</div>
                  </div>
                </div>
                {m?.deliverables && m.deliverables.length > 0 && (
                  <div className="mt-3 pl-11 space-y-1">
                    {m.deliverables.map((d, j) => (
                      <div key={j} className="flex items-start gap-2 text-xs text-zinc-400">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500/50" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                )}
                {i < (prd.milestones || []).length - 1 && (
                  <div className="absolute left-8 bottom-0 h-4 w-px bg-gradient-to-b from-sky-500/30 to-transparent translate-y-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roles & Permissions */}
      {prd.roles && prd.roles.length > 0 && (
        <div className="panel p-6">
          <h3 className="text-sm font-semibold text-white">Roles & Permissions (RBAC)</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-edge text-zinc-500">
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Access Level</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge/50">
                {prd.roles.map((r, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-semibold text-white">{r?.role}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-md bg-indigo-500/10 px-2 py-1 text-[10px] font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                        {r?.accessLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{r?.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assumptions */}
      {prd.assumptions && prd.assumptions.length > 0 && (
        <div className="panel p-6">
          <h3 className="text-sm font-semibold text-white">Assumptions & Validation Plan</h3>
          <p className="mt-1 text-xs text-zinc-500">Asumsi yang membutuhkan PoC atau validasi teknis sebelum fase eksekusi utama.</p>
          <div className="mt-4 space-y-3">
            {prd.assumptions.map((a, i) => (
              <div key={i} className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                  <span className="text-[10px] font-bold">!</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-amber-200/90">{a?.assumption}</p>
                  {a?.validationPlan && (
                    <div className="mt-2 rounded-lg bg-black/40 px-3 py-2 text-xs text-zinc-400 border border-edge">
                      <span className="font-semibold text-zinc-300">Validation:</span> {a.validationPlan}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRD Stats */}
      <div className="panel p-6">
        <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-600">Komposisi PRD</h4>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            [(prd.modules || []).length, "Modul"],
            [(prd.db || []).length, "Tabel DB"],
            [(prd.userFlow || []).length, "Langkah Flow"],
            [(prd.architecture || []).length, "Komponen"],
          ].map(([n, l]) => (
            <div key={l as string} className="rounded-xl border border-edge bg-black/40 p-3 text-center">
              <div className="font-mono text-2xl font-bold text-white">{n}</div>
              <div className="mt-0.5 text-[11px] text-zinc-500">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DatabaseSection({ prd }: { prd: Partial<Prd> | null }) {
  if (!prd) return null;
  if (!prd.db || prd.db.length === 0) {
    return <div className="panel p-6 text-center text-zinc-500">Tidak ada database untuk proyek ini.</div>;
  }
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {(prd.db || []).map((t, i) => (
        <div key={t?.name || i} className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-edge bg-black/40 px-5 py-3">
            <code className="font-mono text-sm font-semibold text-acid">{t?.name}</code>
            <span className="text-[11px] text-zinc-600">{(t?.columns || []).length} kolom</span>
          </div>
          <p className="border-b border-edge px-5 py-2 text-xs text-zinc-500">{t?.description}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-edge text-zinc-600">
                  <th className="px-5 py-2.5 font-medium">Kolom</th>
                  <th className="px-3 py-2.5 font-medium">Tipe</th>
                  <th className="px-5 py-2.5 font-medium">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {(t?.columns || []).map((c, ci) => (
                  <tr key={c?.name || ci} className="border-b border-edge/50 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-2.5 text-zinc-200">
                      {c?.name}
                      {c?.note?.includes("PK") && <span className="ml-2 rounded bg-acid/10 px-1 py-0.5 text-[9px] text-acid">PK</span>}
                      {c?.note?.includes("FK") && <span className="ml-1 rounded bg-sky-500/10 px-1 py-0.5 text-[9px] text-sky-400">FK</span>}
                    </td>
                    <td className="px-3 py-2.5 text-zinc-400">{c?.type}</td>
                    <td className="px-5 py-2.5 text-zinc-600">{c?.note && !c?.note.includes("PK") && !c?.note.includes("FK") ? c.note : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export function UserFlowSection({ prd }: { prd: Partial<Prd> | null }) {
  if (!prd) return null;
  if (!prd.userFlow || prd.userFlow.length === 0) {
    return <div className="panel p-6 text-center text-zinc-500">User Flow belum tersedia.</div>;
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-600">
        <GitBranch size={14} className="text-acid" />
        User Flow
      </div>
      <div className="space-y-3">
        {(prd.userFlow || []).map((step, i) => (
          <div key={i} className="panel p-5 relative">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-acid/10 border border-acid/30 flex items-center justify-center font-mono text-sm font-bold text-acid">
                {step?.step}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white">{step?.title}</h4>
                <p className="mt-1 text-sm text-zinc-400">{step?.description}</p>
              </div>
            </div>
            {i < (prd.userFlow || []).length - 1 && (
              <div className="absolute left-3 top-10 bottom-0 w-0.5 bg-gradient-to-b from-acid/50 to-transparent" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ArchitectureSection({ prd }: { prd: Partial<Prd> | null }) {
  if (!prd) return null;
  if (!prd.architecture || prd.architecture.length === 0) {
    return <div className="panel p-6 text-center text-zinc-500">Arsitektur tidak diperlukan untuk proyek ini.</div>;
  }
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {(prd.architecture || []).map((c, i) => (
          <div key={i} className="panel p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">{c?.name}</h4>
              <span className="chip text-[10px]">{c?.layer}</span>
            </div>
            <p className="mt-2 text-xs text-zinc-400">{c?.description}</p>
            <div className="mt-3">
              <code className="rounded bg-acid/10 px-2 py-1 font-mono text-[11px] text-acid">{c?.tech}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
