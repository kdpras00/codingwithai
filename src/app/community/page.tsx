"use client";

import { Users, MessageSquareCode, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="relative mx-auto max-w-5xl px-5 py-24">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(69,176,229,0.15),transparent_50%)]" />
        
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-acid/10 text-acid mb-6 ring-1 ring-acid/20 shadow-lg shadow-acid/10">
            <Users size={24} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Gabung Komunitas Kami
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Tempat berkumpulnya para pembuat produk, developer, dan enthusiast AI. Diskusi seputar prompt engineering, setup agent, hingga kolaborasi project.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {/* Discord/Chat Card */}
          <div className="panel p-6 flex flex-col group hover:border-acid/30 transition-all hover:shadow-xl hover:shadow-acid/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <MessageSquareCode size={20} />
              </div>
              <h3 className="text-lg font-bold text-foreground">Discord Server</h3>
            </div>
            <p className="text-sm text-muted leading-relaxed mb-6 flex-1">
              Obrolan real-time, tanya jawab error, showcase hasil PRD buatanmu, dan networking dengan sesama builder.
            </p>
            <button 
              onClick={(e) => { e.preventDefault(); toast.info("Link Discord belum dikonfigurasi."); }}
              className="btn-primary w-full group-hover:bg-acid group-hover:text-ink"
            >
              Join Discord Server <ArrowRight size={16} />
            </button>
          </div>

          {/* Events/Updates Card */}
          <div className="panel p-6 flex flex-col group hover:border-acid/30 transition-all hover:shadow-xl hover:shadow-acid/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <Zap size={20} />
              </div>
              <h3 className="text-lg font-bold text-foreground">Weekly Show & Tell</h3>
            </div>
            <p className="text-sm text-muted leading-relaxed mb-6 flex-1">
              Sesi rutin setiap hari Jumat malam. Kita bedah studi kasus pengembangan produk menggunakan multi-agent bersama.
            </p>
            <button 
              onClick={(e) => { e.preventDefault(); toast.info("Jadwal event belum tersedia bulan ini."); }}
              className="btn-ghost w-full"
            >
              Lihat Jadwal Terdekat
            </button>
          </div>
        </div>
        
        <div className="mt-16 text-center panel p-8 flex flex-col items-center">
          <ShieldCheck className="h-8 w-8 text-emerald-400 mb-3" />
          <h4 className="text-foreground font-semibold mb-2">Komunitas yang Sehat & Inklusif</h4>
          <p className="text-sm text-muted max-w-lg">
            Kami menjunjung tinggi etika berdiskusi. Dilarang keras melakukan spam, promosi terselubung, atau bertindak toxic.
          </p>
        </div>
      </main>
    </div>
  );
}
