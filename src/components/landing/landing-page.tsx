import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Users,
  MessageSquareCode,
  GraduationCap,
  GitBranch,
  ShieldCheck,
  TestTube2,
  ListChecks,
} from "lucide-react";
import TerminalModal from "./terminal-modal";
import { HeroCards } from "@/components/hero-cards";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Generator PRD",
    desc: "Tulis ide kasar Anda, dan biarkan AI merumuskan PRD lengkap, spesifikasi fitur, dan task list yang siap dieksekusi.",
    href: "/builder",
    cta: "Mulai generator",
  },
  {
    icon: GitBranch,
    title: "Multi-Agent Engine",
    desc: "Product, Architect, Security, QA, dan Planner Agent bekerja berurutan — hasilnya PRD lengkap dengan arsitektur C4, skema DB, API, dan test scenario.",
    href: "/builder",
    cta: "Lihat pipeline",
  },
  {
    icon: Users,
    title: "Forum Builder",
    desc: "Jejaring eksklusif para pengembang AI dan pembuat produk digital. Tanya-jawab, diskusi arsitektur, dan cari kolaborator.",
    href: "/community",
    cta: "Gabung forum",
  },
  {
    icon: MessageSquareCode,
    title: "Multi-Model AI",
    desc: "Gunakan kekuatan LLM terbaik (Gemini 2.5, dsb) untuk merancang PRD Anda secara cerdas dan terstruktur.",
    href: "/builder",
    cta: "Pilih model",
  },
  {
    icon: ShieldCheck,
    title: "Security by Default",
    desc: "Setiap PRD dilewati threat modeling: escrow fraud, multi-tenancy, OWASP, sampai mitigasi konkret.",
    href: "/builder",
    cta: "Lihat contoh",
  },
  {
    icon: GraduationCap,
    title: "Sesi Mentoring",
    desc: "Konsultasi teknis 1-on-1, bedah kode, dan bimbingan arsitektur perangkat lunak bersama Kurniawan Dwi Pras.",
    href: "/coaching",
    cta: "Jadwalkan sesi",
  },
];

const AGENTS = [
  {
    name: "Product Agent",
    desc: "User stories, MVP scope, metrik",
    icon: Sparkles,
    color: "text-amber-400",
  },
  {
    name: "Architect Agent",
    desc: "C4 diagram, schema DB, API spec",
    icon: GitBranch,
    color: "text-sky-400",
  },
  {
    name: "Security Agent",
    desc: "STRIDE threat model, OWASP ASVS",
    icon: ShieldCheck,
    color: "text-rose-400",
  },
  {
    name: "QA Agent",
    desc: "BDD Gherkin, edge cases",
    icon: TestTube2,
    color: "text-violet-400",
  },
  {
    name: "Planner Agent",
    desc: "Task breakdown + dependency graph",
    icon: ListChecks,
    color: "text-emerald-400",
  },
];

export default function LandingPage() {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <section className="relative h-full overflow-hidden flex flex-col justify-center">
        <div className="grid-bg absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(60%_50%_at_50%_0%,rgba(69,176,229,0.12),transparent)]" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pt-20">
          <div className="mx-auto w-full text-center">
            <h1
              className="animate-fade-up mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl"
              style={{ animationDelay: "80ms" }}
            >
              Mau ngapain hari ini?
            </h1>

            <div
              className="animate-fade-up"
              style={{ animationDelay: "160ms" }}
            >
              <HeroCards />
            </div>

            <TerminalModal />

            <div
              className="animate-fade-up mt-40 text-xs font-mono tracking-widest text-zinc-600 select-none"
              style={{ animationDelay: "240ms" }}
            >
              Product by kurniawandwipras
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
