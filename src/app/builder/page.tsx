"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  AppWindow,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Check,
  X,
  ClipboardList,
  Cpu,
  Database,
  FileText,
  GitBranch,
  LayoutGrid,
  Lightbulb,
  Loader2,
  Play,
  RefreshCw,
  Rocket,
  Server,
  Sparkles,
  Wand2,
  Menu,
  Trash,
  Clock,
  Compass,
  Languages,
  ArrowUp,
} from "lucide-react";
import {
  AGENT_MODELS,
  PROJECT_TYPES,
  SAMPLE_IDEAS,
  STACK_BY_TYPE,
  TECH_LAYERS,
} from "@/lib/presets";
import { experimental_useObject } from "@ai-sdk/react";
import { prdSchema } from "@/lib/types";

const LAYER_ICONS: Record<string, { icon: typeof AppWindow; style: string }> = {
  frontend: {
    icon: AppWindow,
    style: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  },
  backend: {
    icon: Server,
    style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  database: {
    icon: Database,
    style: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  deploy: {
    icon: Rocket,
    style: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
};

function CustomSelect({
  value,
  placeholder,
  options,
  onChange,
}: {
  value?: string;
  placeholder: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        if (query && query !== value) {
          onChange(query);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [query, value, onChange]);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    return options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));
  }, [options, query]);

  const isExactMatch = options.some(
    (o) => o.toLowerCase() === query.trim().toLowerCase(),
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
          }}
          placeholder={placeholder}
          className={`w-full appearance-none rounded-xl border px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-muted/70 ${
            open
              ? "border-acid/60 bg-panel text-foreground ring-2 ring-acid/20 shadow-lg shadow-sm"
              : value
                ? "border-edge bg-ghost-hover-bg text-foreground hover:border-ghost-hover-border hover:bg-ghost-hover-bg"
                : "border-edge bg-transparent text-muted hover:border-ghost-hover-border hover:bg-ghost-hover-bg"
          }`}
        />
        <ChevronDown
          size={15}
          onClick={() => setOpen(!open)}
          className={`absolute right-3.5 cursor-pointer text-muted transition-transform duration-200 hover:text-foreground ${
            open ? "rotate-180 text-acid" : ""
          }`}
        />
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-60 overflow-y-auto rounded-2xl border border-edge bg-panel p-2 shadow-2xl backdrop-blur-2xl animate-fade-up">
          {query.trim() && !isExactMatch && (
            <button
              type="button"
              onClick={() => {
                onChange(query.trim());
                setOpen(false);
              }}
              className="mb-1.5 flex w-full items-center justify-between rounded-xl bg-acid/10 px-3.5 py-2.5 text-xs font-semibold text-acid transition-colors hover:bg-acid/20"
            >
              <span>Pakai custom: "{query.trim()}"</span>
              <Check size={14} />
            </button>
          )}

          {filtered.length > 0 ? (
            filtered.map((opt) => {
              const isSelected = value === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setQuery(opt);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-acid/15 text-acid font-semibold"
                      : "text-muted-foreground hover:bg-ghost-hover-bg hover:text-foreground"
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && <Check size={14} className="text-acid" />}
                </button>
              );
            })
          ) : !query.trim() ? (
            <div className="px-3 py-2 text-xs text-muted">
              Tidak ada opsi
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
import dynamic from "next/dynamic";

const FeatureTree = dynamic(
  () => import("@/components/prd/prd-graph").then((mod) => mod.FeatureTree),
  {
    ssr: false,
    loading: () => (
      <div className="relative flex h-[620px] w-full items-center justify-center overflow-hidden rounded-2xl border border-edge bg-panel shadow-2xl">
        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <span className="h-2 w-2 animate-ping rounded-full bg-blue-400" />
          Memuat graf arsitektur...
        </div>
      </div>
    ),
  },
);
import {
  SummarySection,
  DatabaseSection,
  UserFlowSection,
  ArchitectureSection,
} from "@/components/prd/prd-sections";
import type { AgentLog, Prd } from "@/lib/types";
import { usePrds } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import ExamplePrdModal from "@/components/landing/example-prd-modal";
import { toast } from "react-toastify";

const GROUPS = [
  { label: "Struktur", base: 0, count: 3 },
  { label: "PRD", base: 3, count: 2 },
  { label: "Task", base: 5, count: 1 },
];

type Phase = 0 | 1 | 2 | 3 | 4 | 5;

const EMPTY_ANSWERS: string[] = [];
const EMPTY_QUESTIONS: { text: string; options: string[]; isMultiSelect?: boolean; defaultAssumption?: string }[] = [];

const calculateScore = (prd: any) => {
  if (!prd) return 0;
  let score = 0;
  if (prd.requirements && prd.requirements.length >= 5) score += 20;
  if (prd.db && prd.db.length > 0 && prd.db.some((d: any) => d.columns && d.columns.length > 0)) score += 20;
  if (prd.userStories && prd.userStories.length > 0) score += 20;
  if (prd.consistencyAudit && prd.consistencyAudit.length > 0) score += 15;
  if (prd.risks && prd.risks.length > 0 && prd.assumptions && prd.assumptions.length > 0) score += 15;
  
  const wordCount = JSON.stringify(prd).split(/\s+/).length;
  if (wordCount > 300) score += 10;
  return score;
}

const getScoreGrade = (score: number) => {
  if (score >= 90) return { label: `A (Score: ${score})`, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
  if (score >= 70) return { label: `B (Score: ${score})`, color: "text-blue-400 bg-blue-400/10 border-blue-400/20" };
  if (score >= 50) return { label: `C (Score: ${score})`, color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" };
  return { label: `D (Score: ${score})`, color: "text-rose-400 bg-rose-400/10 border-rose-400/20" };
}

export default function BuilderPage() {
  const router = useRouter();
  const { session, isLoggedIn, status, login } = useAuth();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { prds, add: addPrd, remove: removeSavedPrd, loading: prdsLoading } = usePrds();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exampleModalOpen, setExampleModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>(0);
  const [idea, setIdea] = useState("");
  const [type, setType] = useState("crud_app");
  const [lang, setLang] = useState<"id" | "en">("id");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const loadSavedPrd = (selectedPrd: Prd) => {
    setPrd(selectedPrd);
    setIdea(selectedPrd.problem || selectedPrd.tagline || "");
    setPhase(4);
    setPrdTab("ringkasan");
    setSidebarOpen(false);
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "Baru-baru ini";
    try {
      const d = new Date(timestamp);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return "Baru-baru ini";
    }
  };

  useEffect(() => {
    setMounted(true);
    const handleOpenSidebar = () => setSidebarOpen(true);
    window.addEventListener("ngodingai:open-sidebar", handleOpenSidebar);
    return () => {
      window.removeEventListener("ngodingai:open-sidebar", handleOpenSidebar);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const draft = sessionStorage.getItem("prd_draft");
    const draftTime = sessionStorage.getItem("prd_draft_time");
    const isStale = draftTime && (Date.now() - parseInt(draftTime)) > 30 * 60 * 1000;

    if (draft && !isStale) {
      try {
        const parsed = JSON.parse(draft);
        const score = calculateScore(parsed);
        if (score >= 40) {
          const slug = (parsed.name || "project").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
          const prdId = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
          
          const finalPrd = {
            ...parsed,
            id: prdId,
            createdAt: Date.now(),
            modelId: "salvaged-draft",
          } as Prd;
          
          addPrd(finalPrd);
          toast.success("Draft PRD yang terputus berhasil diselamatkan!");
          router.push(`/prd/${prdId}`);
        }
      } catch (e) {
        console.error("Failed to recover draft", e);
      }
    }
    
    sessionStorage.removeItem("prd_draft");
    sessionStorage.removeItem("prd_draft_time");
  }, [mounted, addPrd, router]);

  useEffect(() => {
    if (mounted && status === "unauthenticated") {
      router.push("/");
    }
  }, [mounted, status, router]);

  const modelId = AGENT_MODELS[0]?.id || process.env.NEXT_PUBLIC_AI_MODEL_NAME?.split(",")[0]?.trim() || "default";
  const [answers, setAnswers] = useState<string[]>(EMPTY_ANSWERS);
  const [skipped, setSkipped] = useState<boolean[]>(
    EMPTY_ANSWERS.map(() => false),
  );
  const [prd, setPrd] = useState<Prd | null>(null);
  const [prdTab, setPrdTab] = useState("ringkasan");
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const termRef = useRef<HTMLDivElement>(null);
  const hasSavedFallback = useRef(false);
  const [techPref, setTechPref] = useState<"auto" | "manual">("auto");
  const [techChoice, setTechChoice] = useState<Record<string, string>>({});

  const { object: streamPrdData, submit: submitStream, isLoading: isStreaming, error: streamError } = experimental_useObject({
    api: "/api/generate",
    schema: prdSchema,
    onFinish(event) {
      if (event.object) {
        // Build slug and ID for the PRD before saving
        const slug = (event.object.name || "project")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        const randomSuffix = Math.random().toString(36).slice(2, 6);
        const prdId = `${slug}-${randomSuffix}`;
        
        const finalPrd = {
          ...event.object,
          id: prdId,
          createdAt: Date.now(),
          modelId: modelId,
        } as Prd;
        
        const score = calculateScore(finalPrd);
        if (score < 40) {
          toast.error("PRD terlalu kosong. Mengarahkan ulang...");
          setTimeout(() => setPhase(3), 1500);
        } else {
          setPrd(finalPrd);
          addPrd(finalPrd);
        }
      }
      setRunning(false);
    }
  });

  const activePrd = isStreaming ? (streamPrdData || prd) : (prd || streamPrdData);

  useEffect(() => {
    if (isStreaming && streamPrdData) {
      sessionStorage.setItem("prd_draft", JSON.stringify(streamPrdData));
      sessionStorage.setItem("prd_draft_time", Date.now().toString());
    }
  }, [isStreaming, streamPrdData]);

  useEffect(() => {
    if (!isStreaming && !prd && streamPrdData && !streamError && !hasSavedFallback.current) {
      hasSavedFallback.current = true;
      const slug = (streamPrdData.name || "project")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      const randomSuffix = Math.random().toString(36).slice(2, 6);
      const prdId = `${slug}-${randomSuffix}`;
      
      const finalPrd = {
        ...streamPrdData,
        id: prdId,
        createdAt: Date.now(),
        modelId: modelId,
      } as Prd;
      
      const score = calculateScore(finalPrd);
      if (score < 40) {
        toast.error("PRD dari fallback terlalu kosong. Mengarahkan ulang...");
        setTimeout(() => setPhase(3), 1500);
        return;
      }
      
      setPrd(finalPrd);
      addPrd(finalPrd);
    }
  }, [isStreaming, prd, streamPrdData, streamError, modelId, addPrd]);

  useEffect(() => {
    if (type === "simple_web") {
      setTechChoice((t) => ({
        ...t,
        backend: "-",
        database: "-",
      }));
    } else {
      setTechChoice((t) => {
        const copy = { ...t };
        if (copy.backend === "-") delete copy.backend;
        if (copy.database === "-") delete copy.database;
        return copy;
      });
    }
  }, [type]);

  const [detected, setDetected] = useState<string | null>(null);
  const [bp, setBp] = useState<{ questions: { text: string, options: string[], isMultiSelect?: boolean, defaultAssumption?: string }[]; modules: { name: string; features: string[] }[]; name: string }>({
    questions: EMPTY_QUESTIONS,
    modules: [],
    name: "Proyek",
  });
  const questions = bp.questions && bp.questions.length > 0 ? bp.questions : EMPTY_QUESTIONS;
  const answeredCount = questions.filter((_, i) => skipped[i] || (answers[i] && answers[i].trim().length > 0)).length;

  const [detecting, setDetecting] = useState(false);

  const [lastFetchedIdeaForQs, setLastFetchedIdeaForQs] = useState("");
  const [lastFetchedIdeaForMods, setLastFetchedIdeaForMods] = useState("");

  const fetchDetectQuestions = async () => {
    if (idea.trim() === lastFetchedIdeaForQs) return Promise.resolve();
    setDetecting(true);
    setLastFetchedIdeaForQs(idea.trim());
    try {
      const r = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim(), type, lang, mode: "questions" }),
      });
      const data = await r.json();
      setDetecting(false);
      if (data.type && data.type !== type) setType(data.type);
      if (data.questions) {
        setAnswers(data.questions.map(() => ""));
        setSkipped(data.questions.map(() => false));
      }
      setBp((b) => ({
        ...b,
        name: data.name || b.name,
        modules: data.modules && data.modules.length > 0 ? data.modules : b.modules,
        questions: data.questions || b.questions,
      }));
    } catch (e) {
      setDetecting(false);
    }
  };

  const fetchDetectModules = async () => {
    setDetecting(true);
    setLastFetchedIdeaForMods(idea.trim());
    try {
      const r = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: idea.trim(),
          type,
          lang,
          mode: "modules",
          answers: answers.map((a, i) => (skipped[i] || !a.trim() ? (questions[i]?.defaultAssumption ? `[DILEWATI] Asumsi yang harus dipakai: ${questions[i].defaultAssumption}` : "[DILEWATI] Gunakan asumsi default terbaik.") : `Q: ${questions[i]?.text || ""}\nA: ${a}`))
        }),
      });
      const data = await r.json();
      setDetecting(false);
      setBp((b) => ({
        ...b,
        name: data.name || b.name,
        modules: data.modules && data.modules.length > 0 ? data.modules : b.modules,
      }));
    } catch (e) {
      setDetecting(false);
    }
  };

  const handleIdeaChange = (value: string) => {
    setIdea(value);
    if (!value.trim()) {
      setDetected(null);
    }
  };

  useEffect(() => {
    if (termRef.current)
      termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [logs]);

  const goNext = async () => {
    if (phase === 0) {
      if (!idea.trim()) {
        setError("Tulis ide kamu dulu.");
        return;
      }
      const words = idea.trim().split(/\s+/).filter(Boolean).length;
      if (idea.trim().length < 30 || words < 5) {
        setError("Ide masih terlalu samar (minimal 5 kata / 30 karakter). Ceritakan lebih spesifik aplikasi apa yang ingin dibuat.");
        return;
      }
      await fetchDetectQuestions();
      setError("");
      setPhase(1);
      return;
    }
    
    if (phase === 1) {
      if (techPref === "manual" && Object.keys(techChoice).length < TECH_LAYERS.length) {
        setError(`Lengkapi semua layer teknologi (${Object.keys(techChoice).length}/${TECH_LAYERS.length}).`);
        return;
      }
      setError("");
      setPhase(2);
      return;
    }

    if (phase === 2) {
      await fetchDetectModules();
      setError("");
      setPhase(3);
      return;
    }

    setError("");
    setPhase((phase + 1) as Phase);
  };

  const runPipeline = useCallback(() => {
    if (!isLoggedIn) {
      toast.error("Silakan login terlebih dahulu untuk membuat PRD.");
      login();
      return;
    }
    if (!idea.trim()) {
      setError("Tulis ide kamu dulu.");
      return;
    }
    setError("");
    setRunning(true);
    setPhase(4);
    setProgress(0);
    setPrd(null);
    hasSavedFallback.current = false;

    submitStream({
      idea: idea.trim(),
      type,
      modelId,
      lang,
      answers: answers.map((a, i) => (skipped[i] ? (questions[i]?.defaultAssumption ? `[DILEWATI] Asumsi yang harus dipakai: ${questions[i].defaultAssumption}` : "[DILEWATI] Gunakan asumsi default terbaik.") : a)),
      tech: techPref === "manual" ? TECH_LAYERS.map((l) => techChoice[l.id]).filter(Boolean) : undefined,
      nameOverride: bp.name,
      modulesHint: bp.modules && bp.modules.length > 0 ? bp.modules : undefined,
    });
  }, [idea, type, modelId, answers, skipped, techPref, techChoice, isLoggedIn, login, submitStream, bp.name, bp.modules]);

  const reset = () => {
    setRunning(false);
    setPhase(0);
    setLogs([]);
    setProgress(0);
    setPrd(null);
    hasSavedFallback.current = false;
    setPrdTab("ringkasan");
    setAnswers(EMPTY_ANSWERS);
    setSkipped(EMPTY_ANSWERS.map(() => false));
  };

  const selectedModel = AGENT_MODELS.find((m) => m.id === modelId) || AGENT_MODELS[0] || { id: "unknown", name: "Unknown", vendor: "Unknown", price: "Free", speed: 50, quality: 50, accent: "#fff" };
  const productName = bp.name;

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Sidebar Backdrop */}
      {sidebarOpen && isLoggedIn && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      {isLoggedIn && (
        <div
          className={`fixed inset-y-0 left-0 z-50 w-80 transform border-r border-edge bg-zinc-950 p-6 shadow-2xl transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } flex flex-col`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-edge">
              <h2 className="text-lg font-bold text-foreground tracking-tight">Menu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-1 text-muted hover:bg-ghost-hover-bg hover:text-foreground transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Core Navigation */}
            <div className="mt-6">
              <button
                onClick={() => {
                  reset();
                  setSidebarOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl bg-ghost-hover-bg px-4 py-3 text-sm font-semibold text-acid transition-all"
              >
                <FileText size={18} />
                Plan
              </button>
            </div>

            {/* Saved Plans List */}
            <div className="mt-8 flex flex-col flex-1 overflow-y-auto">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted mb-4">
                <span>Plan Saya</span>
                <button
                  onClick={() => {
                    reset();
                    setSidebarOpen(false);
                  }}
                  className="flex items-center gap-1 text-acid hover:text-foreground transition-all cursor-pointer font-bold text-xs"
                >
                  + Baru
                </button>
              </div>

              {prdsLoading ? (
                <div className="space-y-2">
                   <div className="h-16 rounded-xl bg-ghost-hover-bg animate-pulse" />
                   <div className="h-16 rounded-xl bg-ghost-hover-bg animate-pulse" />
                </div>
              ) : prds.length === 0 ? (
                <p className="text-sm text-muted italic">Belum ada plan yang disimpan.</p>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-250px)] pr-2">
                  {prds.map((p) => (
                    <div
                      key={p.id}
                      className={`group relative flex w-full flex-col items-start rounded-xl p-3.5 text-left transition-all border cursor-pointer ${
                        prd?.id === p.id
                          ? "border-acid bg-acid/5 text-foreground"
                          : "border-edge bg-panel hover:bg-ghost-hover-bg text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => loadSavedPrd(p)}
                    >
                      <div className="font-semibold text-sm truncate w-full pr-6">{p.name}</div>
                      <div className="mt-1 text-[10px] text-muted font-mono">
                        {formatDate(p.createdAt)}
                      </div>
                      {/* Delete button next to each saved plan */}
                      {deleteConfirmId === p.id ? (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-lg bg-zinc-900/90 border border-edge p-1 shadow-lg backdrop-blur-md">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSavedPrd(p.id);
                              if (prd?.id === p.id) {
                                reset();
                              }
                              setDeleteConfirmId(null);
                              toast.success("Plan berhasil dihapus.");
                            }}
                            className="rounded p-1 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                            title="Konfirmasi Hapus"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(null);
                            }}
                            className="rounded p-1 text-muted hover:bg-ghost-hover-bg hover:text-foreground transition-all cursor-pointer"
                            title="Batal"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(p.id);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 rounded-lg p-1 text-muted hover:bg-ghost-hover-bg hover:text-rose-400 transition-all cursor-pointer"
                          title="Hapus plan"
                        >
                          <Trash size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex items-center justify-between">
          <div>
            <div className="chip">
              <Sparkles size={12} /> Generator PRD
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Mau bikin apa?
            </h1>
            <p className="mt-2 text-sm text-muted">
              Ubah Ide kamu menjadi rencana yang bisa dipahami AI tools pilihanmu.{" "}
              <button
                onClick={() => setExampleModalOpen(true)}
                className="text-acid underline hover:text-foreground transition-colors font-mono cursor-pointer bg-transparent border-none p-0 inline-block align-baseline"
              >
                contoh_prd.md
              </button>
            </p>
          </div>
        <div className="hidden items-center gap-3 md:flex">
          {GROUPS.map((g, gi) => (
            <Fragment key={g.label}>
              {gi > 0 && <div className="h-px w-8 bg-zinc-800" />}
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${
                    phase >= g.base && phase < g.base + g.count
                      ? "text-acid"
                      : "text-muted"
                  }`}
                >
                  {g.label}
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: g.count }).map((_, i) => {
                    const idx = g.base + i;
                    return (
                      <span
                        key={idx}
                        className={`h-1.5 w-1.5 rounded-full transition-colors ${
                          phase > idx
                            ? "bg-acid"
                            : phase === idx
                              ? "animate-pulse-dot bg-acid"
                              : "bg-zinc-700"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>

      {phase === 0 && (
        <div className="mt-10 w-full">
          <div className="relative rounded-2xl border border-edge bg-panel p-4 focus-within:border-acid/50 transition-colors">
            <textarea
              value={idea}
              onChange={(e) => handleIdeaChange(e.target.value)}
              rows={6}
              placeholder='Contoh: "Aplikasi tracking pengeluaran harian, bisa input lewat WhatsApp, ada dashboard ringkasan bulanan..."'
              className="w-full bg-transparent resize-none font-sans text-[15px] leading-relaxed text-foreground placeholder-muted focus:outline-none border-none p-0"
            />
            
            {/* Footer Row inside input area */}
            <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
              <div className="flex items-center gap-2">
                {/* Referensi Button */}
                <button
                  onClick={() => setExampleModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-edge bg-ghost-hover-bg px-3 py-1.5 text-xs text-muted hover:bg-ghost-hover-bg hover:text-foreground transition-all"
                >
                  <Compass size={13} className="text-muted" />
                  <span>Referensi</span>
                </button>

                {/* Bahasa Dropdown Button */}
                <div className="relative">
                  <button
                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-edge bg-ghost-hover-bg px-3 py-1.5 text-xs text-muted hover:bg-ghost-hover-bg hover:text-foreground transition-all"
                  >
                    <Languages size={13} className="text-muted" />
                    <span>{lang === "id" ? "Bahasa Indonesia" : "English"}</span>
                    <ChevronDown size={12} className="text-muted" />
                  </button>

                  {/* Dropdown Popup */}
                  {langDropdownOpen && (
                    <div className="absolute left-0 mt-1.5 w-40 z-50 rounded-xl border border-edge bg-panel p-1 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
                      <button
                        onClick={() => {
                          setLang("id");
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-ghost-hover-bg ${
                          lang === "id" ? "text-acid font-medium" : "text-muted"
                        }`}
                      >
                        Bahasa Indonesia
                      </button>
                      <button
                        onClick={() => {
                          setLang("en");
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-ghost-hover-bg ${
                          lang === "en" ? "text-acid font-medium" : "text-muted"
                        }`}
                      >
                        English
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit / Next Arrow Button */}
              <button
                onClick={goNext}
                disabled={!idea.trim() || detecting}
                className={`flex h-8 w-8 items-center justify-center rounded-xl bg-acid text-ink hover:brightness-110 text-foreground transition-all disabled:opacity-30 disabled:hover:bg-acid text-ink disabled:cursor-not-allowed`}
              >
                {detecting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ArrowUp size={16} />
                )}
              </button>
            </div>
          </div>

          {/* Under input bar */}
          <div className="mt-4 flex items-center justify-between text-xs px-2">
            {isLoggedIn ? (
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex items-center gap-1.5 text-muted hover:text-muted-foreground transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                <Clock size={14} />
                <span>Lihat PRD sebelumnya</span>
              </button>
            ) : (
              <span className="text-muted">{idea.length} karakter</span>
            )}
            {error && <span className="text-sm text-rose-400">{error}</span>}
          </div>
        </div>
      )}

      {phase === 1 && (
        <div className="mt-10 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Preferensi teknologi
            </h2>
            <p className="mt-1 text-sm text-muted">
              Udah punya pilihan tech stack, atau mau AI yang tentuin?
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => {
                setTechPref("auto");
                setError("");
              }}
              className={`flex flex-col items-start gap-2 rounded-2xl border p-5 text-left transition-all ${
                techPref === "auto"
                  ? "border-acid bg-acid/10"
                  : "border-edge hover:border-ghost-hover-border"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <Sparkles
                  size={18}
                  className={
                    techPref === "auto" ? "text-acid" : "text-muted"
                  }
                />
                {techPref === "auto" && (
                  <Check size={14} className="text-acid" />
                )}
              </div>
              <div className="text-sm font-semibold text-foreground">
                Biarkan AI pilih
              </div>
              <div className="text-xs leading-relaxed text-muted">
                AI rekomendasiin stack yang paling cocok buat project kamu
              </div>
            </button>
            <button
              onClick={() => {
                setTechPref("manual");
                setError("");
              }}
              className={`flex flex-col items-start gap-2 rounded-2xl border p-5 text-left transition-all ${
                techPref === "manual"
                  ? "border-acid bg-acid/10"
                  : "border-edge hover:border-ghost-hover-border"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <Cpu
                  size={18}
                  className={
                    techPref === "manual" ? "text-acid" : "text-muted"
                  }
                />
                {techPref === "manual" && (
                  <Check size={14} className="text-acid" />
                )}
              </div>
              <div className="text-sm font-semibold text-foreground">
                Pilih sendiri
              </div>
              <div className="text-xs leading-relaxed text-muted">
                Kamu tentuin teknologi yang mau dipakai
              </div>
            </button>
          </div>

          {techPref === "manual" && (
          <div className="space-y-4 pt-2">
            <div className="text-sm font-semibold text-muted-foreground">
              Pilih teknologi untuk setiap layer
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {TECH_LAYERS.map((l) => {
                const getAiSuggestion = (layerId: string) => {
                  const t = type.toLowerCase();
                  if (["simple_web", "static", "landing", "company", "portfolio", "website", "blog"].some(k => t.includes(k))) {
                    if (layerId === "frontend") return "HTML / CSS / JS";
                    if (layerId === "backend") return "-";
                    if (layerId === "database") return "-";
                    if (layerId === "deploy") return "Vercel";
                  }
                  if (t.includes("simple")) {
                    if (layerId === "frontend") return "Next.js";
                    if (layerId === "backend") return "Supabase (BaaS)";
                    if (layerId === "database") return "Supabase (Postgres)";
                    if (layerId === "deploy") return "Vercel";
                  }
                  if (layerId === "frontend")
                    return ["pos", "booking", "logistics"].some(k => t.includes(k))
                      ? "Flutter"
                      : "Next.js";
                  if (layerId === "backend")
                    return ["saas", "fintech"].some(k => t.includes(k))
                      ? "Go (Fiber/Echo)"
                      : "Node.js (Express/Fastify)";
                  if (layerId === "database")
                    return ["fintech", "ecommerce", "saas", "marketplace", "rental"].some(k => t.includes(k))
                      ? "PostgreSQL"
                      : "Supabase (Postgres)";
                  if (layerId === "deploy")
                    return ["pos", "booking", "fintech", "saas", "marketplace"].some(k => t.includes(k))
                      ? "AWS (Amplify/ECS/Lambda)"
                      : "Vercel";
                  return l.options[0];
                };

                const val =
                  techPref === "manual"
                    ? techChoice[l.id]
                    : getAiSuggestion(l.id);

                const { icon: LayerIcon, style: iconStyle } = LAYER_ICONS[
                  l.id
                ] ?? {
                  icon: AppWindow,
                  style: "bg-sky-500/10 text-sky-400 border-sky-500/20",
                };
                return (
                  <div
                    key={l.id}
                    className="panel p-5 flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${iconStyle}`}
                      >
                        <LayerIcon size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-foreground">
                          {l.label}
                        </div>
                        <div className="text-xs text-muted">{l.desc}</div>
                      </div>
                    </div>
                    {techPref === "manual" ? (
                      type === "simple_web" && (l.id === "backend" || l.id === "database") ? (
                        <div className="flex items-center justify-between rounded-xl border border-edge bg-zinc-900/30 px-4 py-3 text-sm text-muted cursor-not-allowed">
                          Tidak Dibutuhkan
                        </div>
                      ) : (
                        <CustomSelect
                          value={val}
                          placeholder={l.placeholder}
                          options={l.options}
                          onChange={(selected) =>
                            setTechChoice((t) => ({ ...t, [l.id]: selected }))
                          }
                        />
                      )
                    ) : (
                      <div className="flex items-center justify-between rounded-xl border border-edge bg-zinc-900/50 px-4 py-3 text-sm text-muted-foreground">
                        {val}
                        <Sparkles size={14} className="text-acid" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          )}

          <div className="flex items-center justify-between">
            <button onClick={() => setPhase(0)} className="btn-ghost">
              Kembali
            </button>
            <div className="flex items-center gap-3">
              {error && <span className="text-sm text-rose-400">{error}</span>}
              <button onClick={goNext} className="btn-primary px-7">
                Lanjut
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === 2 && (
        <div className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Beberapa pertanyaan
              </h2>
              <p className="mt-1 text-sm text-muted">
                Biar PRD-nya lebih akurat. Jawab semua pertanyaan di bawah.
              </p>
            </div>
            <span className="chip border-acid/30 bg-acid/5 font-mono text-acid">
              {answeredCount}/{questions.length > 0 ? questions.length : 5}
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {detecting && questions.every((q) => !q.text.trim()) ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="panel p-6 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-ghost-hover-bg" />
                    <div className="w-full space-y-2 py-1">
                      <div className="h-4 w-3/4 rounded bg-ghost-hover-bg" />
                      <div className="h-3 w-1/2 rounded bg-ghost-hover-bg" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              questions.map((q, i) => {
                const isSkipped = skipped[i];
                const isAnswered = !isSkipped && answers[i].trim().length > 0;
                return (
                  <div
                    key={i}
                    className={`panel p-6 transition-opacity ${isSkipped ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                            isAnswered
                              ? "bg-acid text-ink"
                              : "bg-ghost-hover-bg text-muted"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <h3 className="text-sm font-medium leading-relaxed text-foreground">
                          {q.text}
                        </h3>
                      </div>
                      <button
                        onClick={() =>
                          setSkipped((s) => s.map((v, si) => (si === i ? !v : v)))
                        }
                        className={`shrink-0 rounded-lg border px-2.5 py-1 text-[11px] transition-colors ${
                          isSkipped
                            ? "border-acid text-acid hover:bg-acid/5"
                            : "border-edge text-muted hover:text-muted-foreground"
                        }`}
                      >
                        {isSkipped ? "Jawab" : "Lewati"}
                      </button>
                    </div>
                    {!isSkipped && (
                      <div className="mt-4">
                        {q.options && q.options.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-2">
                            {q.options.map((opt, oi) => {
                              const isSelected = q.isMultiSelect 
                                ? answers[i]?.split(",").map(s => s.trim()).includes(opt)
                                : answers[i] === opt;
                                
                              return (
                                <button
                                  key={oi}
                                  onClick={() => {
                                    const next = [...answers];
                                    if (q.isMultiSelect) {
                                      const currentSelected = answers[i] ? answers[i].split(",").map(s => s.trim()).filter(Boolean) : [];
                                      if (currentSelected.includes(opt)) {
                                        next[i] = currentSelected.filter(s => s !== opt).join(", ");
                                      } else {
                                        next[i] = [...currentSelected, opt].join(", ");
                                      }
                                    } else {
                                      next[i] = opt;
                                    }
                                    setAnswers(next);
                                  }}
                                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors text-left ${
                                    isSelected
                                      ? "bg-acid text-ink border-acid font-medium"
                                      : "border-edge bg-panel text-muted-foreground hover:bg-ghost-hover-bg hover:text-foreground"
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        <textarea
                          value={answers[i]}
                          onChange={(e) => {
                            const next = [...answers];
                            next[i] = e.target.value;
                            setAnswers(next);
                          }}
                          rows={2}
                          placeholder="Jawab di sini…"
                          className="input-dark w-full resize-none"
                        />
                      </div>
                    )}
                    {isSkipped && (
                      <div className="mt-4 rounded-lg bg-zinc-900/50 p-3 border border-edge/50">
                        <p className="text-xs text-muted font-medium leading-relaxed">
                          {q.defaultAssumption || "Pertanyaan ini dilewati — agent akan menggunakan asumsi default."}
                        </p>
                      </div>
                    )}
                  </div>
                );
              }))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => setPhase(1)} className="btn-ghost">
              Kembali
            </button>
            <button 
              onClick={goNext} 
              disabled={detecting || questions.every((q) => !q.text.trim()) || questions.some((_, i) => !skipped[i] && answers[i].trim().length === 0)}
              className="btn-primary px-7 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {detecting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Lanjut</span>
              )}
            </button>
          </div>
        </div>
      )}

      {phase === 3 && (
        <div className="mt-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Graf arsitektur — {productName}
              </h2>
              <p className="mt-1 text-sm text-muted">
                Breakdown dari project ke modul dan fitur secara visual.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="chip">{bp.modules.length} modul</span>
              <span className="chip">
                {bp.modules.reduce((a, m) => a + m.features.length, 0)} fitur
              </span>
            </div>
          </div>

          <div className="mt-6">
            {detecting ? (
              <div className="relative h-[620px] w-full flex flex-col items-center justify-center gap-3 rounded-2xl border border-edge bg-[#0B0F17] shadow-2xl">
                <Loader2 size={32} className="animate-spin text-acid" />
                <span className="text-sm font-mono text-muted animate-pulse">
                  AI sedang merancang struktur modul...
                </span>
              </div>
            ) : (
              <FeatureTree root={productName} modules={bp.modules} />
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => setPhase(2)} className="btn-ghost">
              Kembali
            </button>
            <button 
              onClick={runPipeline} 
              disabled={detecting}
              className="btn-primary px-7 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {detecting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Buat PRD</span>
              )}
            </button>
          </div>
        </div>
      )}

      {phase === 4 && (
        <div className="mt-10">
          {streamError ? (
            <div className="mb-6 p-6 rounded-xl border border-rose-500/20 bg-rose-500/10 text-center">
              <div className="text-rose-400 font-semibold mb-2">Gagal membuat PRD</div>
              <p className="text-sm text-muted mb-6">{streamError.message}</p>
              <button onClick={() => setPhase(3)} className="btn-ghost mx-auto">
                Kembali
              </button>
            </div>
          ) : (isStreaming || activePrd) ? (
            <>
              <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="chip border-acid/30 bg-acid/5 text-acid">
                      <span className={`h-1.5 w-1.5 rounded-full bg-acid ${isStreaming ? "animate-pulse" : ""}`} /> PRD
                      {isStreaming ? " GENERATING" : " READY"} · {activePrd?.name || "Memproses..."}
                    </div>
                    {!isStreaming && (activePrd as Prd)?.id && (() => {
                      const score = calculateScore(activePrd);
                      const grade = getScoreGrade(score);
                      return (
                        <div className={`chip border ${grade.color}`}>
                          PRD Quality: {grade.label}
                        </div>
                      );
                    })()}
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-foreground">
                    {isStreaming ? "AI sedang merancang PRD..." : "PRD-nya jadi. 🎉"}
                  </h2>
                  <p className="mt-1 text-sm text-muted">{activePrd?.tagline}</p>
                </div>
                {!isStreaming && (activePrd as Prd)?.id && (
                <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
                  <a
                    href={`mailto:feedback@example.com?subject=[Feedback PRD Generator] Evaluasi Hasil PRD ${(activePrd as Prd).name}&body=Halo, saya ingin memberikan feedback terkait hasil PRD ini:%0A%0A1. Menurut saya PRD ini...%0A%0A(ID: ${(activePrd as Prd).id})`}
                    className="btn-ghost w-full sm:w-auto inline-flex items-center justify-center gap-2"
                  >
                    💬 Beri Masukan
                  </a>
                  <button
                    onClick={() => setPhase(3)}
                    className="btn-ghost w-full sm:w-auto"
                  >
                    Kembali ke graf
                  </button>
                  <button
                    onClick={() => router.push(`/prd/${(activePrd as Prd).id}`)}
                    className="btn-primary w-full px-6 sm:w-auto"
                  >
                    Buka halaman penuh
                  </button>
                </div>
                )}
              </div>

              <div className="mb-6 flex gap-1 overflow-x-auto border-b border-edge pb-px">
                {[
                  { id: "ringkasan", label: "Ringkasan", Icon: FileText },
                  { id: "userflow", label: "User Flow", Icon: GitBranch },
                  { id: "arsitektur", label: "Arsitektur", Icon: Cpu },
                  { id: "database", label: "Database", Icon: LayoutGrid },
                ].map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPrdTab(id)}
                    className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm transition-colors ${
                      prdTab === id
                        ? "border-acid font-medium text-foreground"
                        : "border-transparent text-muted hover:text-muted-foreground"
                    }`}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                {prdTab === "ringkasan" && <SummarySection prd={activePrd as Prd} />}
                {prdTab === "userflow" && <UserFlowSection prd={activePrd as Prd} />}
                {prdTab === "arsitektur" && <ArchitectureSection prd={activePrd as Prd} />}
                {prdTab === "database" && <DatabaseSection prd={activePrd as Prd} />}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted">
              <Loader2 size={32} className="animate-spin text-acid mb-4" />
              <span>Menyiapkan AI Agent...</span>
              <button onClick={() => setPhase(3)} className="mt-6 btn-ghost text-xs">
                Batalkan
              </button>
            </div>
          )}
        </div>
      )}


    </div>
    <ExamplePrdModal isOpen={exampleModalOpen} onClose={() => setExampleModalOpen(false)} />
    </>
  );
}
