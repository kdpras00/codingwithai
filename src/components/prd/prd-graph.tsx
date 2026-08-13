"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
  useEdgesState,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Activity,
  ChevronDown,
  ChevronRight,
  FileText,
  LayoutGrid,
  Layers,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import type { Prd, PrdModule } from "@/lib/types";

// Helper icon picker based on module title / index with full safety fallbacks
function getModuleIcon(title?: string, index: number = 0) {
  const fallbackIcons = [
    LayoutGrid,
    Search,
    ShoppingCart,
    Activity,
    Shield,
    Settings,
    Sparkles,
    Layers,
  ];
  const safeIndex =
    typeof index === "number" && !isNaN(index)
      ? Math.abs(Math.floor(index))
      : 0;
  const fallback =
    fallbackIcons[safeIndex % fallbackIcons.length] || LayoutGrid;

  if (!title || typeof title !== "string") {
    return fallback;
  }

  const t = title.toLowerCase();
  if (t.includes("beranda") || t.includes("home") || t.includes("main"))
    return LayoutGrid;
  if (t.includes("detail") || t.includes("cari") || t.includes("search"))
    return Search;
  if (
    t.includes("bayar") ||
    t.includes("keranjang") ||
    t.includes("cart") ||
    t.includes("checkout")
  )
    return ShoppingCart;
  if (
    t.includes("status") ||
    t.includes("riwayat") ||
    t.includes("log") ||
    t.includes("history")
  )
    return Activity;
  if (
    t.includes("akun") ||
    t.includes("keamanan") ||
    t.includes("user") ||
    t.includes("auth")
  )
    return Shield;
  if (t.includes("admin") || t.includes("dasbor") || t.includes("setting"))
    return Settings;

  return fallback;
}

type RootData = { label?: string; tagline?: string };
type ModuleData = {
  label?: string;
  phase?: string;
  status?: string;
  index?: number;
};
type SubFeatureData = {
  label?: string;
  features?: string[];
  onFeatureClick?: (feature: string) => void;
};

// 1. Root Node (Level 1 - Left)
function RootNode({ data }: NodeProps<Node<RootData, "root">>) {
  const label = data?.label || "Proyek";
  const tagline = data?.tagline || "Perencanaan";

  return (
    <div className="group relative">
      <div className="flex w-[220px] items-center gap-3.5 rounded-2xl border border-edge bg-panel p-3.5 shadow-2xl backdrop-blur-md transition-all hover:border-acid/50 hover:shadow-acid/10">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-acid/30 bg-acid/15 text-acid shadow-inner">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-foreground">{label}</h3>
          <p className="mt-0.5 truncate text-[11px] font-medium text-muted">
            {tagline}
          </p>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-[#131927] !bg-slate-400 transition-colors group-hover:!bg-acid"
      />
    </div>
  );
}

// 2. Module Node (Level 2 - Middle)
function ModuleNode({ data }: NodeProps<Node<ModuleData, "module">>) {
  const label = data?.label || "Modul";
  const index = typeof data?.index === "number" ? data.index : 0;
  const IconComponent = getModuleIcon(label, index) || LayoutGrid;

  return (
    <div className="group relative w-[240px]">
      <div className="relative flex flex-col justify-between rounded-2xl border border-edge bg-panel p-3.5 shadow-xl backdrop-blur-md transition-all hover:border-slate-500 hover:shadow-slate-500/10">
        {/* Phase Badge */}
        <div className="mb-2 flex items-center justify-end">
          <span className="rounded-full border border-acid/40 bg-acid/10 px-2 py-0.5 text-[9px] font-bold tracking-wider text-acid uppercase">
            {data?.phase || "FASE 1"}
          </span>
        </div>

        {/* Content */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-edge bg-input-bg text-muted-foreground shadow-inner">
            <IconComponent className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-bold text-foreground">
              {label}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
              <span>{data?.status || "Direncanakan"}</span>
            </div>
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-[#131927] !bg-slate-400 transition-colors group-hover:!bg-acid"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-[#131927] !bg-slate-400 transition-colors group-hover:!bg-acid"
      />
    </div>
  );
}

// 3. Sub Feature Card Node (Level 3 - Right)
function SubFeatureNode({
  data,
}: NodeProps<Node<SubFeatureData, "subfeature">>) {
  const [expanded, setExpanded] = useState(false);
  const features =
    Array.isArray(data?.features) && data.features.length > 0
      ? data.features
      : ["Fitur Utama"];
  const displayFeatures = expanded ? features : features.slice(0, 3);
  const hasMore = features.length > 3;

  return (
    <div className="group relative w-[260px]">
      <div className="flex flex-col gap-2.5 rounded-2xl border border-edge bg-panel p-3.5 shadow-xl backdrop-blur-md transition-all hover:border-zinc-500">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-edge pb-2 text-[10px] font-bold tracking-wider text-muted uppercase">
          <LayoutGrid className="h-3.5 w-3.5 text-muted" />
          <span>SUB FITUR</span>
        </div>

        {/* List of Features */}
        <div className="flex flex-col gap-1.5">
          {displayFeatures.map((feat, idx) => (
            <div
              key={idx}
              onClick={() => data.onFeatureClick?.(feat)}
              className="flex items-center gap-2.5 rounded-xl border border-edge bg-black/20 px-3 py-2 text-xs font-medium text-foreground cursor-pointer hover:border-acid/30 hover:bg-acid/5 active:scale-[0.98] transition-all"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>

        {/* Footer Toggle */}
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between pt-1 text-[11px] font-medium text-muted transition-colors hover:text-foreground"
          >
            <span>
              {expanded ? "Sembunyikan" : `Lihat semua (${features.length})`}
            </span>
            {expanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-[#131927] !bg-slate-400 transition-colors group-hover:!bg-acid"
      />
    </div>
  );
}

const nodeTypes = {
  root: RootNode,
  module: ModuleNode,
  subfeature: SubFeatureNode,
};

function FeatureTreeInner({
  root,
  tagline,
  modules,
}: {
  root: string;
  tagline?: string;
  modules: PrdModule[];
}) {
  const { fitView } = useReactFlow();
  const { theme } = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const reactFlowColorMode = theme === "system" 
    ? (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : (theme === "dark" ? "dark" : "light");

  // 1. Initialize nodes and edges when raw props change
  useEffect(() => {
    const initialNodes: Node[] = [];
    const initialEdges: Edge[] = [];

    const X_ROOT = 0;
    const X_MODULE = 340;
    const X_SUBFEATURE = 680;

    const safeModules =
      Array.isArray(modules) && modules.length > 0
        ? modules
        : [{ name: "Fitur Utama", features: ["Modul Dasar"] }];

    // Calculate vertical spacing dynamically
    const moduleHeights = safeModules.map((m) => {
      const featCount = Math.min(
        3,
        Array.isArray(m?.features) ? m.features.length : 1,
      );
      return Math.max(140, 70 + featCount * 40);
    });

    const GAP = 120; // Increased spacing to prevent overlapping
    const totalH = moduleHeights.reduce((acc, h) => acc + h + GAP, 0) - GAP;

    // Root Node (Centered Vertically)
    initialNodes.push({
      id: "root",
      type: "root",
      position: { x: X_ROOT, y: Math.max(0, totalH / 2 - 40) },
      width: 220,
      height: 70,
      style: { width: 220, height: 70 },
      data: {
        label: root || "TopUp Pintar",
        tagline: tagline || "Perencanaan",
      },
    });

    let currentY = 0;

    safeModules.forEach((m, i) => {
      const mHeight = moduleHeights[i];
      const midY = currentY + mHeight / 2;

      // Module Node
      initialNodes.push({
        id: `mod-${i}`,
        type: "module",
        position: { x: X_MODULE, y: midY - 45 },
        width: 240,
        height: 90,
        style: { width: 240, height: 90, opacity: 1, transition: "opacity 0.3s" },
        data: {
          label: m?.name || "Modul",
          phase: `FASE ${i + 1}`,
          status: "Direncanakan",
          index: i,
        },
      });

      // Edge: Root -> Module
      initialEdges.push({
        id: `e-root-${i}`,
        source: "root",
        target: `mod-${i}`,
        type: "default",
        animated: false,
        style: { 
          stroke: "#64748b", 
          strokeWidth: 1.5,
          opacity: 1,
          transition: "stroke 0.3s, stroke-width 0.3s, opacity 0.3s"
        },
      });

      // SubFeature Card Node
      initialNodes.push({
        id: `sub-${i}`,
        type: "subfeature",
        position: { x: X_SUBFEATURE, y: currentY },
        width: 260,
        height: mHeight,
        style: { width: 260, height: mHeight, opacity: 1, transition: "opacity 0.3s" },
        data: {
          label: m?.name || "Modul",
          features:
            Array.isArray(m?.features) && m.features.length > 0
              ? m.features
              : ["Fitur Utama"],
          onFeatureClick: (feat: string) => setSelectedFeature(feat),
        },
      });

      // Edge: Module -> SubFeature Card
      initialEdges.push({
        id: `e-mod-${i}`,
        source: `mod-${i}`,
        target: `sub-${i}`,
        type: "default",
        animated: false,
        style: { 
          stroke: "#64748b", 
          strokeWidth: 1.5,
          opacity: 1,
          transition: "stroke 0.3s, stroke-width 0.3s, opacity 0.3s"
        },
      });

      currentY += mHeight + GAP;
    });

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [root, tagline, modules, setNodes, setEdges]);

  // 2. Highlight active path in-place (without resetting coordinates!)
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        const active =
          !activeNodeId ||
          activeNodeId === "root" ||
          activeNodeId === node.id ||
          (node.id.startsWith("mod-") && activeNodeId === `sub-${node.id.slice(4)}`) ||
          (node.id.startsWith("sub-") && activeNodeId === `mod-${node.id.slice(4)}`);

        return {
          ...node,
          style: {
            ...node.style,
            opacity: active ? 1 : 0.4,
          },
        };
      })
    );

    setEdges((eds) =>
      eds.map((edge) => {
        const edgeIdx = edge.id.split("-")[2];
        const activeIdx = activeNodeId?.split("-")[1];
        const isActive =
          !activeNodeId ||
          activeNodeId === "root" ||
          (activeIdx !== undefined && edgeIdx === activeIdx);

        return {
          ...edge,
          animated: activeNodeId ? isActive : false,
          style: {
            ...edge.style,
            stroke: activeNodeId && isActive ? "#45b0e5" : "#64748b",
            strokeWidth: activeNodeId && isActive ? 2.5 : 1.5,
            opacity: activeNodeId && !isActive ? 0.2 : 1,
          },
        };
      })
    );
  }, [activeNodeId, setNodes, setEdges]);

  const safeModules = Array.isArray(modules) ? modules : [];
  const totalFeatures = safeModules.reduce(
    (a, m) => a + (Array.isArray(m?.features) ? m.features.length : 0),
    0,
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 font-mono text-[11px] text-slate-400">
            <Zap className="h-3 w-3 text-acid" />
            Interaktif: Klik & Drag node bebas · Scroll zoom · Klik expand
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">
          Proyek → Modul → Sub Fitur ({safeModules.length} modul ·{" "}
          {totalFeatures} fitur)
        </span>
      </div>

      <div className="relative h-[620px] w-full overflow-hidden rounded-2xl border border-edge bg-panel shadow-2xl">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          colorMode={reactFlowColorMode}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.3}
          maxZoom={1.8}
          defaultEdgeOptions={{ type: "default" }}
          nodesConnectable={false}
          onNodeClick={(_, node) => setActiveNodeId(node.id)}
          onPaneClick={() => setActiveNodeId(null)}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            color="#334155"
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
          />
          <Controls
            position="bottom-left"
            className="!rounded-xl !border-slate-800 !bg-panel/50 !text-slate-300 shadow-lg"
          />
          <MiniMap
            position="bottom-right"
            pannable
            zoomable
            maskColor="rgba(255, 255, 255, 0.1)"
            maskStrokeColor="#ffffff"
            maskStrokeWidth={1}
            nodeStrokeColor="#334155"
            nodeStrokeWidth={1.5}
            nodeBorderRadius={8}
            nodeColor="#0f172a"
            className="!rounded-xl !border-2 !border-slate-800 !bg-panel shadow-2xl"
          />
        </ReactFlow>

        {/* Detail Popup Modal */}
        {selectedFeature && (
          <FeatureDetailModal
            feature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
          />
        )}
      </div>
    </div>
  );
}

function FeatureDetailModal({
  feature,
  onClose,
}: {
  feature: string;
  onClose: () => void;
}) {
  const tagMatch = feature.match(/^\[(.*?)\]/);
  const tag = tagMatch ? tagMatch[1] : null;
  const content = tag ? feature.replace(/^\[.*?\]\s*/, "") : feature;

  const getTagStyle = (t: string) => {
    const low = t.toLowerCase();
    if (low.includes("mvp"))
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    if (low.includes("2") || low.includes("v2"))
      return "border-sky-500/30 bg-sky-500/10 text-sky-400";
    return "border-violet-500/30 bg-violet-500/10 text-violet-400";
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-fade-up">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-edge bg-panel/90 p-6 shadow-2xl backdrop-blur-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted hover:bg-ghost-hover-bg hover:text-foreground transition-colors"
        >
          <X size={16} />
        </button>

        <div className="mt-2 flex items-center gap-2">
          {tag && (
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getTagStyle(
                tag,
              )}`}
            >
              {tag}
            </span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Detail Fitur
          </span>
        </div>

        <h3 className="mt-4 text-base font-semibold leading-relaxed text-foreground">
          {content}
        </h3>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="btn-primary py-2 px-4 text-xs">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export function FeatureTree(props: {
  root: string;
  tagline?: string;
  modules: PrdModule[];
}) {
  return (
    <ReactFlowProvider>
      <FeatureTreeInner {...props} />
    </ReactFlowProvider>
  );
}

export default function PrdGraph({ prd }: { prd: Prd }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modules = useMemo<PrdModule[]>(() => {
    if (Array.isArray(prd?.modules) && prd.modules.length > 0)
      return prd.modules;
    return [{ name: "Fitur Utama", features: ["Fitur Utama"] }];
  }, [prd]);

  if (!mounted) {
    return (
      <div className="relative flex h-[620px] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-800/80 bg-panel shadow-2xl">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Zap className="h-4 w-4 animate-pulse text-acid" />
          Memuat diagram interaktif...
        </div>
      </div>
    );
  }

  return (
    <FeatureTree
      root={prd?.name || "Proyek"}
      tagline={prd?.tagline}
      modules={modules}
    />
  );
}
