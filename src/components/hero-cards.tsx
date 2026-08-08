"use client";

import { FileText, MessageSquareCode, Users, GraduationCap, Flame } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export function HeroCards() {
  const router = useRouter();

  const { isLoggedIn, login } = useAuth();

  const handleMenuClick = (path: string) => {
    if (path === "/builder" && !isLoggedIn) {
      login();
    } else {
      router.push(path);
    }
  };

  return (
    <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3">
      {/* Card 1 */}
      <button
        onClick={() => handleMenuClick("/builder")}
        className="group relative flex h-full flex-col items-start rounded-2xl border border-edge bg-panel/30 p-5 text-left transition-all hover:bg-panel/50 hover:shadow-lg hover:shadow-acid/5"
      >
        <div className="absolute -inset-[1px] rounded-2xl border-2 border-transparent transition-all group-hover:border-acid/20" />
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-500 transition-transform group-hover:scale-110">
          <FileText size={20} />
        </div>
        <h3 className="mt-4 text-base font-bold text-white">Generator PRD</h3>
        <p className="mt-2 text-xs leading-relaxed text-zinc-400">
          Ubah ide kasar Anda menjadi dokumen PRD lengkap yang siap dieksekusi oleh AI Agent.
        </p>
      </button>

      {/* Card 2 */}
      <button
        onClick={() => handleMenuClick("/community")}
        className="group flex h-full flex-col items-start rounded-2xl border border-edge bg-panel/30 p-5 text-left transition-all hover:bg-panel/50"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition-transform group-hover:scale-110">
          <Users size={20} />
        </div>
        <h3 className="mt-4 text-base font-bold text-white">Forum Builder</h3>
        <p className="mt-2 text-xs leading-relaxed text-zinc-400">
          Jejaring eksklusif para pengembang AI dan pembuat produk digital.
        </p>
      </button>

      {/* Card 3 */}
      <button
        onClick={() => handleMenuClick("/coaching")}
        className="group flex h-full flex-col items-start rounded-2xl border border-edge bg-panel/30 p-5 text-left transition-all hover:bg-panel/50"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 transition-transform group-hover:scale-110">
          <GraduationCap size={20} />
        </div>
        <h3 className="mt-4 text-base font-bold text-white">Sesi Mentoring</h3>
        <p className="mt-2 text-xs leading-relaxed text-zinc-400">
          Konsultasi teknis 1-on-1 dan bimbingan arsitektur bersama Kurniawan Dwi Pras.
        </p>
      </button>
    </div>
  );
}
