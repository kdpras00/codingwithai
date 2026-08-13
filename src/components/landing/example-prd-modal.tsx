"use client";

import { useState } from "react";
import { Copy, Download, X, Check, ZoomIn, ZoomOut, Maximize, ClipboardCopy, CheckCircle2, Play, MessageSquareCode, ShieldCheck, ExternalLink } from "lucide-react";
import { toast } from "react-toastify";

interface ExamplePrdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SECTIONS = [
  { id: "overview", label: "1. Overview" },
  { id: "requirements", label: "2. Requirements" },
  { id: "features", label: "3. Core Features" },
  { id: "flow", label: "4. User Flow" },
  { id: "architecture", label: "5. Architecture" },
  { id: "schema", label: "6. Database Schema" },
  { id: "constraints", label: "7. Design & Technical Constraints" }
];

const MARKDOWN_CONTENT = `# PRD — Project Requirements Document

## 1. Overview
Aplikasi ini bertujuan untuk mendigitalkan pencatatan stok gudang yang sebelumnya mungkin dilakukan secara manual atau tidak terorganisir. Masalah utama yang ingin diselesaikan adalah kesulitan melacak jumlah stok real-time, lokasi penyimpanan (rak), dan riwayat masuk-keluar barang berdasarkan nomor batch.

Tujuan utama aplikasi adalah menyediakan platform berbasis web yang sederhana bagi Admin Tunggal untuk mengelola inventaris, memantau pergerakan stok (masuk/keluar), dan mendapatkan peringatan dini jika stok menipis langsung di dashboard.

## 2. Requirements
Berikut adalah persyaratan tingkat tinggi untuk pengembangan sistem:
* **Aksesibilitas:** Halaman aplikasi harus dapat diakses melalui Web Browser (desktop/laptop diutamakan untuk input data manual).
* **Pengguna:** Sistem dirancang untuk satu pengguna (Admin Gudang Tunggal) dengan akses penuh.
* **Data Input:** Input data dilakukan secara manual (diketik), bukan scan barcode.
* **Spesifisitas Data:** Setiap produk harus mencatat informasi mendetail seperti Nomor Batch dan Lokasi Rak.
* **Notifikasi:** Peringatan stok rendah (Low Stock Alert) cukup ditampilkan secara visual di halaman Dashboard.

## 3. Core Features
Fitur-fitur kunci yang harus ada dalam versi pertama (MVP):
* **Dashboard Utama:** Ringkasan total jumlah produk dan nilai aset (opsional). Panel Peringatan Stok: Daftar produk yang jumlahnya di bawah batas minimum.
* **Manajemen Produk (Master Data):** Tambah, Edit, dan Hapus Produk. Kolom wajib: Nama Produk, SKU, Satuan, Lokasi Rak, dan Minimum Stok.
* **Pencatatan Stok Masuk (Inbound):** Form untuk menambah stok. Input: Pilih Produk, Jumlah, Nomor Batch, dan Tanggal Masuk.
* **Pencatatan Stok Keluar (Outbound):** Form untuk mengurangi stok. Input: Pilih Produk, Jumlah, Pilih Batch (FIFO/LIFO manual), dan Keterangan.
* **Laporan Riwayat (Movement Logs):** Tabel sederhana yang mencatat siapa (Admin), kapan, barang apa, dan berapa jumlah yang masuk/keluar.

## 4. User Flow
Alur kerja sederhana bagi Admin saat menggunakan aplikasi:
1. **Login:** Admin masuk menggunakan email dan password.
2. **Monitoring:** Admin melihat Dashboard untuk mengecek apakah ada barang yang perlu dipesan ulang (Low Stock).
3. **Setup Produk (Awal):** Jika barang baru, Admin membuat data produk baru lengkap dengan lokasi rak.
4. **Update Stok:**
   * Jika barang datang: Admin membuka menu "Stok Masuk", mengetik jumlah dan nomor batch, lalu simpan.
   * Jika barang keluar: Admin membuka menu "Stok Keluar", memilih produk, mengetik jumlah, lalu simpan.
5. **Verifikasi:** Sistem otomatis memperbarui sisa stok dan mencatat transaksi di riwayat.

## 5. Architecture
Berikut adalah gambaran arsitektur sistem dan aliran data secara teknis namun sederhana:
- **Database (SQLite)**
- **Backend Logic**
- **Frontend (Next.js)**
- **Admin (Browser)**

Proses Menambah Stok (Stok Masuk):
1. Input Data Stok (Nama, Qty, Batch, Rak)
2. Kirim Request (Create Transaction)
3. Validasi & Simpan Data Transaksi
4. Konfirmasi Sukses
5. Update Total Stok Produk
6. Kirim Status Sukses & Data Baru
7. Tampilkan Notifikasi "Stok Berhasil Ditambah"
8. Refresh Tampilan Dashboard

## 6. Database Schema
Berikut adalah struktur ERD database utama:

### Tabel: products
* \`id\` (int, PK)
* \`name\` (string)
* \`sku\` (string)
* \`unit\` (string)
* \`rack_location\` (string)
* \`min_stock\` (int)
* \`current_stock\` (int)
* \`created_at\` (datetime)
* \`updated_at\` (datetime)

### Tabel: batches
* \`id\` (int, PK)
* \`product_id\` (int, FK) -> products.id
* \`batch_number\` (string)
* \`quantity\` (int)
* \`received_date\` (date)
* \`created_at\` (datetime)

### Tabel: stock_movements
* \`id\` (int, PK)
* \`product_id\` (int, FK) -> products.id
* \`batch_id\` (int, FK) -> batches.id
* \`type\` (string: inbound/outbound)
* \`quantity\` (int)
* \`notes\` (string)
* \`created_at\` (datetime)

### Tabel: users
* \`id\` (int, PK)
* \`email\` (string)
* \`password_hash\` (string)
* \`name\` (string)
* \`role\` (string)
* \`created_at\` (datetime)

## 7. Design & Technical Constraints
Bagian ini mengatur batasan teknis dan panduan desain:
* **High-Level Technology:** Sistem harus dibangun menggunakan teknologi modern yang mendukung pengembangan cepat (rapid development) dan kemudahan pemeliharaan (maintainability).
* **Typography Rules:** Sistem antarmuka (UI) wajib menggunakan konfigurasi font variable:
  * Sans: Geist Mono, ui-monospace, monospace
  * Serif: serif
  * Mono: JetBrains Mono, monospace`;

// Helper to generate a clean, orthogonal path (Manhattan pathing)
const getOrthogonalPath = (startX: number, startY: number, endX: number, endY: number, trackX: number) => {
  return `M ${startX} ${startY} H ${trackX} V ${endY} H ${endX}`;
};

export default function ExamplePrdModal({ isOpen, onClose }: ExamplePrdModalProps) {
  const [copied, setCopied] = useState(false);
  const [seqZoom, setSeqZoom] = useState(0.81);
  const [seqPan, setSeqPan] = useState({ x: 0, y: 0 });
  const [seqIsDragging, setSeqIsDragging] = useState(false);
  const [seqDragStart, setSeqDragStart] = useState({ x: 0, y: 0 });

  const [erdZoom, setErdZoom] = useState(0.61);
  const [erdPan, setErdPan] = useState({ x: 0, y: 0 });
  const [erdIsDragging, setErdIsDragging] = useState(false);
  const [erdDragStart, setErdDragStart] = useState({ x: 0, y: 0 });

  // Sequence Diagram Drag Handlers
  const handleSeqMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setSeqIsDragging(true);
    setSeqDragStart({ x: e.clientX - seqPan.x, y: e.clientY - seqPan.y });
  };

  const handleSeqMouseMove = (e: React.MouseEvent) => {
    if (!seqIsDragging) return;
    setSeqPan({
      x: e.clientX - seqDragStart.x,
      y: e.clientY - seqDragStart.y
    });
  };

  const handleSeqMouseUp = () => {
    setSeqIsDragging(false);
  };

  // ERD Diagram Drag Handlers
  const handleErdMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setErdIsDragging(true);
    setErdDragStart({ x: e.clientX - erdPan.x, y: e.clientY - erdPan.y });
  };

  const handleErdMouseMove = (e: React.MouseEvent) => {
    if (!erdIsDragging) return;
    setErdPan({
      x: e.clientX - erdDragStart.x,
      y: e.clientY - erdDragStart.y
    });
  };

  const handleErdMouseUp = () => {
    setErdIsDragging(false);
  };

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MARKDOWN_CONTENT);
      toast.success("Teks PRD disalin ke clipboard!");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin teks: ", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([MARKDOWN_CONTENT], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contoh_prd.md";
    link.click();
    URL.revokeObjectURL(url);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="flex h-[85vh] w-full max-w-5xl flex-col rounded-2xl border border-edge bg-zinc-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-edge px-6 py-4">
          <span className="text-sm font-semibold text-foreground tracking-wide">Contoh PRD</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="rounded-lg p-2 text-muted hover:bg-ghost-hover-bg hover:text-foreground transition-all cursor-pointer"
              title="Salin isi PRD"
            >
              {copied ? <Check size={16} className="text-acid" /> : <Copy size={16} />}
            </button>
            <button
              onClick={handleDownload}
              className="rounded-lg p-2 text-muted hover:bg-ghost-hover-bg hover:text-foreground transition-all cursor-pointer"
              title="Unduh contoh_prd.md"
            >
              <Download size={16} />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-muted hover:bg-ghost-hover-bg hover:text-foreground transition-all cursor-pointer"
              title="Tutup"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel Sidebar Navigation */}
          <div className="w-64 border-r border-edge p-6 overflow-y-auto hidden md:block shrink-0 text-left bg-zinc-950/20">
            <div className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
              PRD — Project Requirements Document
            </div>
            <div className="space-y-1">
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className="block w-full text-left text-xs font-medium text-muted hover:text-foreground py-1.5 transition-colors cursor-pointer truncate"
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel Document View */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 text-left bg-zinc-900 select-text">
            <div className="max-w-3xl space-y-8 text-muted-foreground leading-relaxed font-sans text-sm">
              <h1 className="text-2xl font-extrabold text-foreground border-b border-edge pb-4">
                PRD — Project Requirements Document
              </h1>

              {/* 1. Overview */}
              <div id="section-overview" className="scroll-mt-6">
                <h2 className="text-lg font-bold text-foreground mb-3">1. Overview</h2>
                <p>
                  Aplikasi ini bertujuan untuk mendigitalkan pencatatan stok gudang yang sebelumnya mungkin dilakukan secara manual atau tidak terorganisir. Masalah utama yang ingin diselesaikan adalah kesulitan melacak jumlah stok real-time, lokasi penyimpanan (rak), dan riwayat masuk-keluar barang berdasarkan nomor batch.
                </p>
                <p className="mt-3">
                  Tujuan utama aplikasi adalah menyediakan platform berbasis web yang sederhana bagi <strong>Admin Tunggal</strong> untuk mengelola inventaris, memantau pergerakan stok (masuk/keluar), dan mendapatkan peringatan dini jika stok menipis langsung di dashboard.
                </p>
              </div>

              {/* 2. Requirements */}
              <div id="section-requirements" className="scroll-mt-6">
                <h2 className="text-lg font-bold text-foreground mb-3">2. Requirements</h2>
                <p>Berikut adalah persyaratan tingkat tinggi untuk pengembangan sistem:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>
                    <strong>Aksesibilitas:</strong> Aplikasi harus dapat diakses melalui Web Browser (desktop/laptop diutamakan untuk input data manual).
                  </li>
                  <li>
                    <strong>Pengguna:</strong> Sistem dirancang untuk satu pengguna (Admin Tunggal) dengan akses penuh.
                  </li>
                  <li>
                    <strong>Data Input:</strong> Input data dilakukan secara manual (diketik), bukan scan barcode.
                  </li>
                  <li>
                    <strong>Spesifisitas Data:</strong> Setiap produk harus mencatat informasi mendetail seperti Nomor Batch dan Lokasi Rak.
                  </li>
                  <li>
                    <strong>Notifikasi:</strong> Peringatan stok rendah (Low Stock Alert) cukup ditampilkan secara visual di halaman Dashboard.
                  </li>
                </ul>
              </div>

              {/* 3. Core Features */}
              <div id="section-features" className="scroll-mt-6">
                <h2 className="text-lg font-bold text-foreground mb-3">3. Core Features</h2>
                <p>Fitur-fitur kunci yang harus ada dalam versi pertama (MVP):</p>
                <ul className="list-disc pl-5 mt-3 space-y-2.5">
                  <li>
                    <strong>Dashboard Utama:</strong>
                    <p className="text-muted mt-1">Ringkasan total jumlah produk dan nilai aset (opsional). Panel Peringatan Stok: Daftar produk yang jumlahnya di bawah batas minimum.</p>
                  </li>
                  <li>
                    <strong>Manajemen Produk (Master Data):</strong>
                    <p className="text-muted mt-1">Tambah, Edit, dan Hapus Produk. Kolom wajib: Nama Produk, SKU, Satuan, Lokasi Rak, dan Minimum Stok.</p>
                  </li>
                  <li>
                    <strong>Pencatatan Stok Masuk (Inbound):</strong>
                    <p className="text-muted mt-1">Form untuk menambah stok. Input: Pilih Produk, Jumlah, Nomor Batch, dan Tanggal Masuk.</p>
                  </li>
                  <li>
                    <strong>Pencatatan Stok Keluar (Outbound):</strong>
                    <p className="text-muted mt-1">Form untuk mengurangi stok. Input: Pilih Produk, Jumlah, Pilih Batch (FIFO/LIFO manual), dan Keterangan.</p>
                  </li>
                  <li>
                    <strong>Laporan Riwayat (Movement Logs):</strong>
                    <p className="text-muted mt-1">Tabel sederhana yang mencatat siapa (Admin), kapan, barang apa, dan berapa jumlah yang masuk/keluar.</p>
                  </li>
                </ul>
              </div>

              {/* 4. User Flow */}
              <div id="section-flow" className="scroll-mt-6">
                <h2 className="text-lg font-bold text-foreground mb-3">4. User Flow</h2>
                <p>Alur kerja sederhana bagi Admin saat menggunakan aplikasi:</p>
                <ol className="list-decimal pl-5 mt-3 space-y-2">
                  <li><strong>Login:</strong> Admin masuk menggunakan email dan password.</li>
                  <li><strong>Monitoring:</strong> Admin melihat Dashboard untuk mengecek apakah ada barang yang perlu dipesan ulang (Low Stock).</li>
                  <li><strong>Setup Produk (Awal):</strong> Jika barang baru, Admin membuat data produk baru lengkap dengan lokasi rak.</li>
                  <li>
                    <strong>Update Stok:</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-muted">
                      <li>Jika barang datang: Admin membuka menu &quot;Stok Masuk&quot;, mengetik jumlah dan nomor batch, lalu simpan.</li>
                      <li>Jika barang keluar: Admin membuka menu &quot;Stok Keluar&quot;, memilih produk, mengetik jumlah, lalu simpan.</li>
                    </ul>
                  </li>
                  <li><strong>Verifikasi:</strong> Sistem otomatis memperbarui sisa stok dan mencatat transaksi di riwayat.</li>
                </ol>
              </div>

              {/* 5. Architecture */}
              <div id="section-architecture" className="scroll-mt-6">
                <h2 className="text-lg font-bold text-foreground mb-3">5. Architecture</h2>
                <p className="mb-4">Berikut adalah gambaran arsitektur sistem dan aliran data secara teknis namun sederhana:</p>
                
                {/* Visual Zoomable Sequence Diagram */}
                <div 
                  className={`relative h-[420px] border border-edge bg-[#121214] rounded-2xl p-4 overflow-hidden select-none mb-6 ${seqIsDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                  onMouseDown={handleSeqMouseDown}
                  onMouseMove={handleSeqMouseMove}
                  onMouseUp={handleSeqMouseUp}
                  onMouseLeave={handleSeqMouseUp}
                >
                  {/* Controls */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 bg-zinc-900 border border-edge p-1.5 rounded-xl z-20 shadow-lg" onMouseDown={e => e.stopPropagation()}>
                    <button
                      onClick={() => setSeqZoom(z => Math.min(z + 0.1, 1.5))}
                      className="p-1.5 text-muted hover:text-foreground hover:bg-ghost-hover-bg rounded-lg transition-colors cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn size={15} />
                    </button>
                    <button
                      onClick={() => setSeqZoom(z => Math.max(z - 0.1, 0.3))}
                      className="p-1.5 text-muted hover:text-foreground hover:bg-ghost-hover-bg rounded-lg transition-colors cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut size={15} />
                    </button>
                    <button
                      onClick={() => { setSeqZoom(0.81); setSeqPan({ x: 0, y: 0 }); }}
                      className="p-1.5 text-muted hover:text-foreground hover:bg-ghost-hover-bg rounded-lg transition-colors cursor-pointer"
                      title="Reset Zoom"
                    >
                      <Maximize size={15} />
                    </button>
                  </div>

                  {/* Zoom Indicator */}
                  <div className="absolute bottom-4 left-4 font-mono text-[10px] text-muted z-20 bg-zinc-950/80 px-2 py-0.5 rounded border border-edge">
                    {Math.round(seqZoom * 100)}%
                  </div>

                  {/* Diagram Canvas */}
                  <div className="relative h-full w-full flex items-center justify-center p-2 overflow-hidden">
                    <div
                      className="absolute origin-center"
                      style={{ transform: `translate(${seqPan.x}px, ${seqPan.y}px) scale(${seqZoom})`, width: "800px", height: "460px" }}
                    >
                      <svg viewBox="0 0 800 460" className="w-[800px] h-[460px] text-muted-foreground font-mono">
                        <defs>
                          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#71717a" />
                          </marker>
                          <marker id="arrow-left" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#71717a" />
                          </marker>
                        </defs>

                        {/* Lifelines */}
                        <line x1="120" y1="50" x2="120" y2="420" stroke="#27272a" strokeDasharray="4 4" strokeWidth="1.5" />
                        <line x1="320" y1="50" x2="320" y2="420" stroke="#27272a" strokeDasharray="4 4" strokeWidth="1.5" />
                        <line x1="520" y1="50" x2="520" y2="420" stroke="#27272a" strokeDasharray="4 4" strokeWidth="1.5" />
                        <line x1="720" y1="50" x2="720" y2="420" stroke="#27272a" strokeDasharray="4 4" strokeWidth="1.5" />

                        {/* Activation Bars (UML standard Focus of Control) */}
                        {/* Admin lifeline bar */}
                        <rect x="114" y="70" width="12" height="330" rx="2" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
                        
                        {/* Frontend lifeline bars */}
                        <rect x="314" y="80" width="12" height="50" rx="2" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
                        <rect x="314" y="310" width="12" height="90" rx="2" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />

                        {/* Backend lifeline bars */}
                        <rect x="514" y="120" width="12" height="90" rx="2" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
                        <rect x="514" y="240" width="12" height="50" rx="2" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />

                        {/* Database lifeline bars */}
                        <rect x="714" y="160" width="12" height="40" rx="2" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
                        <rect x="714" y="240" width="12" height="40" rx="2" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />

                        {/* Top Actors */}
                        <rect x="40" y="15" width="160" height="35" rx="8" fill="#09090b" stroke="#27272a" />
                        <text x="120" y="37" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">Admin (Browser)</text>

                        <rect x="240" y="15" width="160" height="35" rx="8" fill="#09090b" stroke="#27272a" />
                        <text x="320" y="37" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">Frontend (Next.js)</text>

                        <rect x="440" y="15" width="160" height="35" rx="8" fill="#09090b" stroke="#27272a" />
                        <text x="520" y="37" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">Backend Logic</text>

                        <rect x="640" y="15" width="160" height="35" rx="8" fill="#09090b" stroke="#27272a" />
                        <text x="720" y="37" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">Database (SQLite)</text>

                        {/* Bottom Actors */}
                        <rect x="40" y="420" width="160" height="35" rx="8" fill="#09090b" stroke="#27272a" />
                        <text x="120" y="442" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">Admin (Browser)</text>

                        <rect x="240" y="420" width="160" height="35" rx="8" fill="#09090b" stroke="#27272a" />
                        <text x="320" y="442" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">Frontend (Next.js)</text>

                        <rect x="440" y="420" width="160" height="35" rx="8" fill="#09090b" stroke="#27272a" />
                        <text x="520" y="442" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">Backend Logic</text>

                        <rect x="640" y="420" width="160" height="35" rx="8" fill="#09090b" stroke="#27272a" />
                        <text x="720" y="442" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">Database (SQLite)</text>

                        {/* Messages */}
                        {/* 1. Input Data Stok */}
                        <line x1="126" y1="90" x2="314" y2="90" stroke="#52525b" strokeWidth="1.5" markerEnd="url(#arrow)" />
                        <text x="220" y="83" fill="#a1a1aa" fontSize="9" textAnchor="middle">Input Data Stok (Nama, Qty, Batch, Rak)</text>

                        {/* 2. Kirim Request */}
                        <line x1="326" y1="130" x2="514" y2="130" stroke="#52525b" strokeWidth="1.5" markerEnd="url(#arrow)" />
                        <text x="420" y="123" fill="#a1a1aa" fontSize="9" textAnchor="middle">Kirim Request (Create Transaction)</text>

                        {/* 3. Validasi & Simpan */}
                        <line x1="526" y1="170" x2="714" y2="170" stroke="#52525b" strokeWidth="1.5" markerEnd="url(#arrow)" />
                        <text x="620" y="163" fill="#a1a1aa" fontSize="9" textAnchor="middle">Validasi & Simpan Data Transaksi</text>

                        {/* 4. Konfirmasi Sukses */}
                        <line x1="714" y1="195" x2="526" y2="195" stroke="#52525b" strokeWidth="1.2" strokeDasharray="3 3" markerEnd="url(#arrow-left)" />
                        <text x="620" y="188" fill="#a1a1aa" fontSize="9" textAnchor="middle">Konfirmasi Sukses</text>

                        {/* 5. Update Total Stok */}
                        <line x1="526" y1="250" x2="714" y2="250" stroke="#52525b" strokeWidth="1.5" markerEnd="url(#arrow)" />
                        <text x="620" y="243" fill="#a1a1aa" fontSize="9" textAnchor="middle">Update Total Stok Produk</text>

                        {/* 6. Stok Terupdate */}
                        <line x1="714" y1="275" x2="526" y2="275" stroke="#52525b" strokeWidth="1.2" strokeDasharray="3 3" markerEnd="url(#arrow-left)" />
                        <text x="620" y="268" fill="#a1a1aa" fontSize="9" textAnchor="middle">Stok Terupdate</text>

                        {/* 7. Kirim Status Sukses */}
                        <line x1="514" y1="320" x2="326" y2="320" stroke="#52525b" strokeWidth="1.2" strokeDasharray="3 3" markerEnd="url(#arrow-left)" />
                        <text x="420" y="313" fill="#a1a1aa" fontSize="9" textAnchor="middle">Kirim Status Sukses & Data Baru</text>

                        {/* 8. Tampilkan Notifikasi */}
                        <line x1="314" y1="355" x2="126" y2="355" stroke="#52525b" strokeWidth="1.2" strokeDasharray="3 3" markerEnd="url(#arrow-left)" />
                        <text x="220" y="348" fill="#a1a1aa" fontSize="9" textAnchor="middle">Tampilkan Notifikasi &quot;Stok Berhasil Ditambah&quot;</text>

                        {/* 9. Refresh Tampilan */}
                        <line x1="314" y1="390" x2="126" y2="390" stroke="#52525b" strokeWidth="1.2" strokeDasharray="3 3" markerEnd="url(#arrow-left)" />
                        <text x="220" y="383" fill="#a1a1aa" fontSize="9" textAnchor="middle">Refresh Tampilan Dashboard</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Database Schema */}
              <div id="section-schema" className="scroll-mt-6">
                <h2 className="text-lg font-bold text-foreground mb-3">6. Database Schema</h2>
                <p className="mb-4">Berikut adalah Entity Relationship Diagram (ERD) yang menggambarkan struktur database utama:</p>

                {/* Zoomable ERD Diagram */}
                <div 
                  className={`relative h-[580px] border border-edge bg-[#121214] rounded-2xl p-4 overflow-hidden select-none mb-6 ${erdIsDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                  onMouseDown={handleErdMouseDown}
                  onMouseMove={handleErdMouseMove}
                  onMouseUp={handleErdMouseUp}
                  onMouseLeave={handleErdMouseUp}
                >
                  {/* Controls */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 bg-zinc-900 border border-edge p-1.5 rounded-xl z-20 shadow-lg" onMouseDown={e => e.stopPropagation()}>
                    <button
                      onClick={() => setErdZoom(z => Math.min(z + 0.1, 1.5))}
                      className="p-1.5 text-muted hover:text-foreground hover:bg-ghost-hover-bg rounded-lg transition-colors cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn size={15} />
                    </button>
                    <button
                      onClick={() => setErdZoom(z => Math.max(z - 0.1, 0.2))}
                      className="p-1.5 text-muted hover:text-foreground hover:bg-ghost-hover-bg rounded-lg transition-colors cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut size={15} />
                    </button>
                    <button
                      onClick={() => { setErdZoom(0.61); setErdPan({ x: 0, y: 0 }); }}
                      className="p-1.5 text-muted hover:text-foreground hover:bg-ghost-hover-bg rounded-lg transition-colors cursor-pointer"
                      title="Reset Zoom"
                    >
                      <Maximize size={15} />
                    </button>
                  </div>

                  {/* Zoom Indicator */}
                  <div className="absolute bottom-4 left-4 font-mono text-[10px] text-muted z-20 bg-zinc-950/80 px-2 py-0.5 rounded border border-edge">
                    {Math.round(erdZoom * 100)}%
                  </div>

                  {/* Diagram Canvas */}
                  <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
                    <div
                      className="absolute origin-center"
                      style={{ transform: `translate(${erdPan.x}px, ${erdPan.y}px) scale(${erdZoom})`, width: "920px", height: "520px" }}
                    >
                      {/* Relationship Lines SVG */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 920 520">
                        <defs>
                          {/* Crow's Foot: One (Double vertical bars) */}
                          <marker id="cf-one" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <line x1="3" y1="1" x2="3" y2="9" stroke="#71717a" strokeWidth="1.5" />
                            <line x1="7" y1="1" x2="7" y2="9" stroke="#71717a" strokeWidth="1.5" />
                          </marker>
                          
                          {/* Crow's Foot: Many (Fork with a vertical bar) */}
                          <marker id="cf-many" viewBox="0 0 12 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 2 2 L 10 5 L 2 8" stroke="#71717a" strokeWidth="1.5" fill="none" />
                            <line x1="10" y1="1" x2="10" y2="9" stroke="#71717a" strokeWidth="1.5" />
                          </marker>
                        </defs>

                        {/* products.id (PK) → batches.product_id (FK) */}
                        <path d={getOrthogonalPath(290, 74, 350, 101, 315)}
                          fill="none" stroke="#52525b" strokeWidth="1.5"
                          markerStart="url(#cf-one)" markerEnd="url(#cf-many)" />

                        {/* products.id (PK) → stock_movements.product_id (FK) */}
                        <path d={getOrthogonalPath(290, 84, 350, 331, 300)}
                          fill="none" stroke="#52525b" strokeWidth="1.5"
                          markerStart="url(#cf-one)" markerEnd="url(#cf-many)" />

                        {/* batches.id (PK) → stock_movements.batch_id (FK) */}
                        <path d={getOrthogonalPath(600, 79, 610, 353, 625)}
                          fill="none" stroke="#52525b" strokeWidth="1.5"
                          markerStart="url(#cf-one)" markerEnd="url(#cf-many)" />

                        {/* users.id (PK) → stock_movements.user_id (FK) */}
                        <path d={getOrthogonalPath(660, 79, 610, 375, 640)}
                          fill="none" stroke="#52525b" strokeWidth="1.5"
                          markerStart="url(#cf-one)" markerEnd="url(#cf-many)" />

                        {/* Cardinality Text Annotations (1 and M) */}
                        {/* Relation 1: products -> batches */}
                        <text x="296" y="68" fill="#a1a1aa" fontSize="10" fontWeight="bold" fontFamily="monospace">1</text>
                        <text x="340" y="95" fill="#a1a1aa" fontSize="10" fontWeight="bold" fontFamily="monospace">M</text>

                        {/* Relation 2: products -> stock_movements */}
                        <text x="296" y="94" fill="#a1a1aa" fontSize="10" fontWeight="bold" fontFamily="monospace">1</text>
                        <text x="340" y="325" fill="#a1a1aa" fontSize="10" fontWeight="bold" fontFamily="monospace">M</text>

                        {/* Relation 3: batches -> stock_movements */}
                        <text x="606" y="73" fill="#a1a1aa" fontSize="10" fontWeight="bold" fontFamily="monospace">1</text>
                        <text x="616" y="347" fill="#a1a1aa" fontSize="10" fontWeight="bold" fontFamily="monospace">M</text>

                        {/* Relation 4: users -> stock_movements */}
                        <text x="650" y="73" fill="#a1a1aa" fontSize="10" fontWeight="bold" fontFamily="monospace">1</text>
                        <text x="616" y="369" fill="#a1a1aa" fontSize="10" fontWeight="bold" fontFamily="monospace">M</text>
                      </svg>

                      {/* === TABLE COMPONENT: products === */}
                      <div className="absolute z-10 font-mono text-[11px]" style={{ left: 30, top: 40, width: 260 }}>
                        <div className="bg-zinc-800 text-foreground text-center font-bold py-1.5 px-3 border border-zinc-600 rounded-t-md">products</div>
                        <div className="border border-t-0 border-edge/80 rounded-b-md overflow-hidden divide-y divide-zinc-800 bg-[#151518]">
                          {[
                            { badge: "PK", name: "id", type: "int" },
                            { badge: "",   name: "name", type: "varchar(255)" },
                            { badge: "",   name: "sku", type: "varchar(100)" },
                            { badge: "",   name: "unit", type: "varchar(20)" },
                            { badge: "",   name: "rack_location", type: "varchar(50)" },
                            { badge: "",   name: "min_stock", type: "int" },
                            { badge: "",   name: "current_stock", type: "int" },
                            { badge: "",   name: "created_at", type: "datetime" },
                          ].map((r, i) => (
                            <div key={i} className="grid grid-cols-[32px_1fr_80px] items-center text-left divide-x divide-zinc-800/80 font-mono text-[10px] h-[22px]">
                              <span className={`text-center font-bold ${r.badge === "PK" ? "text-yellow-500" : r.badge === "FK" ? "text-blue-400" : ""}`}>
                                {r.badge}
                              </span>
                              <span className="text-foreground px-2 truncate">{r.name}</span>
                              <span className="text-muted px-2 text-right truncate">{r.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* === TABLE COMPONENT: batches === */}
                      <div className="absolute z-10 font-mono text-[11px]" style={{ left: 350, top: 40, width: 250 }}>
                        <div className="bg-zinc-800 text-foreground text-center font-bold py-1.5 px-3 border border-zinc-600 rounded-t-md">batches</div>
                        <div className="border border-t-0 border-edge/80 rounded-b-md overflow-hidden divide-y divide-zinc-800 bg-[#151518]">
                          {[
                            { badge: "PK", name: "id", type: "int" },
                            { badge: "FK", name: "product_id", type: "int" },
                            { badge: "",   name: "batch_number", type: "varchar(50)" },
                            { badge: "",   name: "quantity", type: "int" },
                            { badge: "",   name: "received_date", type: "date" },
                            { badge: "",   name: "created_at", type: "datetime" },
                          ].map((r, i) => (
                            <div key={i} className="grid grid-cols-[32px_1fr_80px] items-center text-left divide-x divide-zinc-800/80 font-mono text-[10px] h-[22px]">
                              <span className={`text-center font-bold ${r.badge === "PK" ? "text-yellow-500" : r.badge === "FK" ? "text-blue-400" : ""}`}>
                                {r.badge}
                              </span>
                              <span className="text-foreground px-2 truncate">{r.name}</span>
                              <span className="text-muted px-2 text-right truncate">{r.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* === TABLE COMPONENT: users === */}
                      <div className="absolute z-10 font-mono text-[11px]" style={{ left: 660, top: 40, width: 230 }}>
                        <div className="bg-zinc-800 text-foreground text-center font-bold py-1.5 px-3 border border-zinc-600 rounded-t-md">users</div>
                        <div className="border border-t-0 border-edge/80 rounded-b-md overflow-hidden divide-y divide-zinc-800 bg-[#151518]">
                          {[
                            { badge: "PK", name: "id", type: "int" },
                            { badge: "",   name: "email", type: "varchar(255)" },
                            { badge: "",   name: "password_hash", type: "varchar(255)" },
                            { badge: "",   name: "name", type: "varchar(100)" },
                            { badge: "",   name: "role", type: "varchar(20)" },
                            { badge: "",   name: "created_at", type: "datetime" },
                          ].map((r, i) => (
                            <div key={i} className="grid grid-cols-[32px_1fr_80px] items-center text-left divide-x divide-zinc-800/80 font-mono text-[10px] h-[22px]">
                              <span className={`text-center font-bold ${r.badge === "PK" ? "text-yellow-500" : r.badge === "FK" ? "text-blue-400" : ""}`}>
                                {r.badge}
                              </span>
                              <span className="text-foreground px-2 truncate">{r.name}</span>
                              <span className="text-muted px-2 text-right truncate">{r.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* === TABLE COMPONENT: stock_movements === */}
                      <div className="absolute z-10 font-mono text-[11px]" style={{ left: 350, top: 270, width: 260 }}>
                        <div className="bg-zinc-800 text-foreground text-center font-bold py-1.5 px-3 border border-zinc-600 rounded-t-md">stock_movements</div>
                        <div className="border border-t-0 border-edge/80 rounded-b-md overflow-hidden divide-y divide-zinc-800 bg-[#151518]">
                          {[
                            { badge: "PK", name: "id", type: "int" },
                            { badge: "FK", name: "product_id", type: "int" },
                            { badge: "FK", name: "batch_id", type: "int" },
                            { badge: "FK", name: "user_id", type: "int" },
                            { badge: "",   name: "type", type: "varchar(10)" },
                            { badge: "",   name: "quantity", type: "int" },
                            { badge: "",   name: "notes", type: "varchar(255)" },
                            { badge: "",   name: "created_at", type: "datetime" },
                          ].map((r, i) => (
                            <div key={i} className="grid grid-cols-[32px_1fr_80px] items-center text-left divide-x divide-zinc-800/80 font-mono text-[10px] h-[22px]">
                              <span className={`text-center font-bold ${r.badge === "PK" ? "text-yellow-500" : r.badge === "FK" ? "text-blue-400" : ""}`}>
                                {r.badge}
                              </span>
                              <span className="text-foreground px-2 truncate">{r.name}</span>
                              <span className="text-muted px-2 text-right truncate">{r.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Table Description */}
                <div className="overflow-x-auto rounded-xl border border-edge mt-4">
                  <table className="min-w-full divide-y divide-edge font-sans text-xs text-muted-foreground">
                    <thead className="bg-zinc-950/60 font-semibold text-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left">Tabel</th>
                        <th className="px-4 py-3 text-left">Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-edge bg-zinc-900/40">
                      <tr>
                        <td className="px-4 py-3 font-semibold font-mono text-foreground">products</td>
                        <td className="px-4 py-3 text-muted">Master data produk, menyimpan info SKU, satuan, lokasi rak, dan batas stok minimum</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold font-mono text-foreground">batches</td>
                        <td className="px-4 py-3 text-muted">Mencatat setiap batch masuk per produk dengan nomor batch unik</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold font-mono text-foreground">stock_movements</td>
                        <td className="px-4 py-3 text-muted">Log semua transaksi masuk/keluar, terhubung ke produk dan batch</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold font-mono text-foreground">users</td>
                        <td className="px-4 py-3 text-muted">Data admin yang memiliki akses ke sistem</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 7. Design & Technical Constraints */}
              <div id="section-constraints" className="scroll-mt-6">
                <h2 className="text-lg font-bold text-foreground mb-3">7. Design & Technical Constraints</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>High-Level Technology:</strong> Sistem harus dibangun menggunakan teknologi modern yang mendukung pengembangan cepat (rapid development) dan kemudahan pemeliharaan (maintainability).
                  </li>
                  <li>
                    <strong>Typography Rules:</strong> Sistem antarmuka (UI) wajib menggunakan konfigurasi font variable sebagai berikut untuk menjaga konsistensi visual:
                    <ul className="list-disc pl-5 mt-1 text-muted text-xs space-y-1">
                      <li>Sans: Geist Mono, ui-monospace, monospace</li>
                      <li>Serif: serif</li>
                      <li>Mono: JetBrains Mono, monospace</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
