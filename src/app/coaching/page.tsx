"use client";

import { GraduationCap, Calendar, Clock, Video, ArrowRight, User } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function CoachingPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="relative mx-auto max-w-5xl px-5 py-24">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(69,176,229,0.15),transparent_50%)]" />
        
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-acid/10 text-acid mb-6 ring-1 ring-acid/20 shadow-lg shadow-acid/10">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            1-on-1 Mentorship
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Akselerasi proses belajarmu dengan bimbingan langsung. Mulai dari pemahaman dasar AI tools, setup multi-agent, hingga arsitektur produk skala besar.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-5">
          {/* Info Side */}
          <div className="lg:col-span-2 space-y-6">
            <div className="panel p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full border border-edge bg-ghost-hover-bg flex items-center justify-center overflow-hidden">
                  <User className="text-muted" />
                  {/* <img src="/mentor-avatar.jpg" alt="Mentor" className="object-cover" /> */}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Kurniawan Dwi Prasetyo</h3>
                  <p className="text-xs text-acid">Product Architect & AI Builder</p>
                </div>
              </div>
              <p className="text-sm text-muted leading-relaxed mb-6">
                Saya telah membantu puluhan developer mengintegrasikan AI ke dalam workflow harian mereka. Sesi ini didesain agar kamu langsung mendapatkan "Aha! moment".
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Video size={16} className="text-muted" /> Google Meet / Zoom
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock size={16} className="text-muted" /> 45 - 60 Menit per Sesi
                </div>
              </div>
            </div>
          </div>

          {/* Booking Side */}
          <div className="lg:col-span-3">
            <div className="panel p-6 sm:p-8 flex flex-col h-full justify-center">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-foreground">Pilih Topik Diskusi</h3>
                <Calendar className="text-muted" />
              </div>
              
              <div className="space-y-3 mb-8">
                {[
                  "Setup AI Coding Agent (Cursor / Copilot)",
                  "Prompt Engineering untuk PRD & Arsitektur",
                  "Review Codebase & Optimasi Skala Besar",
                  "Konsultasi Karir / Roadmap Belajar"
                ].map((topic, i) => (
                  <label key={i} className="flex items-center gap-3 p-4 rounded-xl border border-edge bg-black/20 cursor-pointer hover:border-acid/30 transition-colors">
                    <input type="radio" name="topic" className="accent-acid h-4 w-4" defaultChecked={i === 0} />
                    <span className="text-sm text-muted-foreground">{topic}</span>
                  </label>
                ))}
              </div>

              <button 
                onClick={(e) => { e.preventDefault(); toast.info("Integrasi kalender (Calendly) belum dikonfigurasi."); }}
                className="btn-primary w-full py-4 text-base"
              >
                Jadwalkan Sesi via Calendly <ArrowRight size={18} />
              </button>
              <p className="text-center text-xs text-muted mt-4">
                Jadwal tersedia setiap hari kerja pukul 19:00 - 21:00 WIB.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
