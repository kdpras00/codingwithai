import type { Prd } from "./types";

export const SAMPLE_PRD: Prd = {
  id: "contoh-prd",
  name: "Digitalisasi Stok Gudang",
  tagline: "Pencatatan inventaris gudang berbasis nomor batch & lokasi rak",
  summary: "Aplikasi ini bertujuan untuk mendigitalkan pencatatan stok gudang yang sebelumnya manual, memantau pergerakan stok real-time, lokasi penyimpanan rak, dan riwayat masuk-keluar berdasarkan nomor batch.",
  problem: "Pencatatan stok gudang manual menyulitkan pemantauan stok real-time, pencarian lokasi rak, dan riwayat barang masuk/keluar.",
  audience: ["Admin Gudang Tunggal", "Pemilik Toko"],
  goals: [
    "Mendigitalkan pencatatan stok gudang manual",
    "Melacak stok real-time & lokasi penyimpanan rak",
    "Menyediakan visual alert untuk stok yang menipis"
  ],
  modelId: "gemini-2.5-flash",
  createdAt: 1785699452000,
  requirements: [
    "Aplikasi diakses via web browser (desktop/laptop prioritas untuk input manual)",
    "Single admin (Admin Gudang Tunggal) dengan akses penuh",
    "Input manual via keyboard (tidak scan barcode)",
    "Setiap produk wajib mencatat Nomor Batch & Lokasi Rak",
    "Low stock alert visual di Dashboard (tidak push/email)"
  ],
  modules: [
    {
      name: "Dashboard & Autentikasi",
      features: [
        "Login multi-role (Admin Gudang, Manajer)",
        "Ringkasan total stok dan peringatan stok menipis"
      ]
    },
    {
      name: "Manajemen Data Master",
      features: [
        "CRUD data barang (SKU, Nama, Satuan)",
        "Kategorisasi dan penempatan rak penyimpanan"
      ]
    },
    {
      name: "Pencatatan Stok Masuk (Inbound)",
      features: [
        "Pencatatan quantity produk masuk",
        "Input nomor batch produk dan tanggal penerimaan barang"
      ]
    },
    {
      name: "Pencatatan Stok Keluar (Outbound)",
      features: [
        "Form input pengurangan stok barang",
        "Pilihan batch manual berdasarkan metode FIFO/LIFO"
      ]
    },
    {
      name: "Laporan Riwayat (Movement Logs)",
      features: [
        "Pencatatan riwayat transaksi masuk/keluar",
        "Detail pelaku, waktu, produk, dan kuantitas"
      ]
    }
  ],
  userFlow: [
    { step: 1, title: "Login Admin Gudang", description: "Admin masuk ke sistem dengan kredensial" },
    { step: 2, title: "Dashboard - Cek Stok Rendah", description: "Admin melihat panel peringatan stok di bawah minimum" },
    { step: 3, title: "Stok Masuk (Inbound)", description: "Admin input barang masuk: pilih produk, qty, nomor batch, lokasi rak" },
    { step: 4, title: "Stok Keluar (Outbound)", description: "Admin input barang keluar: pilih produk, qty, sistem pilih batch FIFO/LIFO" },
    { step: 5, title: "Verifikasi & Riwayat", description: "Sistem otomatis update stok & catat transaksi di riwayat pergerakan" },
  ],
  architecture: [
    { name: "Frontend Application", layer: "client", description: "Antarmuka berbasis Next.js untuk Admin melakukan input dan monitoring data.", tech: "Next.js, Tailwind CSS" },
    { name: "REST API Gateway", layer: "server", description: "Menghubungkan frontend dengan logika database SQLite.", tech: "Next.js Route Handlers" },
    { name: "SQLite Database", layer: "data", description: "Penyimpanan data lokal relasional untuk produk, batch, dan log transaksi.", tech: "SQLite, Prisma" }
  ],
  db: [
    {
      name: "products",
      description: "Master data produk gudang",
      columns: [
        { name: "id", type: "int (PK)", note: "Primary Key autoincrement" },
        { name: "name", type: "string", note: "Nama barang" },
        { name: "sku", type: "string", note: "Stock Keeping Unit unik" },
        { name: "unit", type: "string", note: "Satuan (pcs, box, kg)" },
        { name: "rack_location", type: "string", note: "Kode rak (misal: A-12)" },
        { name: "min_stock", type: "int", note: "Batas minimum stok untuk alert" },
        { name: "current_stock", type: "int", note: "Total stok saat ini" },
        { name: "created_at", type: "datetime" },
        { name: "updated_at", type: "datetime" }
      ]
    },
    {
      name: "batches",
      description: "Detail batch penerimaan produk",
      columns: [
        { name: "id", type: "int (PK)" },
        { name: "product_id", type: "int (FK)", note: "Merujuk ke products.id" },
        { name: "batch_number", type: "string", note: "Nomor batch produksi" },
        { name: "quantity", type: "int", note: "Jumlah barang dalam batch ini" },
        { name: "received_date", type: "date", note: "Tanggal penerimaan barang" },
        { name: "created_at", type: "datetime" }
      ]
    },
    {
      name: "stock_movements",
      description: "Log masuk dan keluar barang",
      columns: [
        { name: "id", type: "int (PK)" },
        { name: "product_id", type: "int (FK)" },
        { name: "batch_id", type: "int (FK)" },
        { name: "type", type: "string", note: "inbound atau outbound" },
        { name: "quantity", type: "int" },
        { name: "notes", type: "string", note: "Keterangan opsional" },
        { name: "created_at", type: "datetime" }
      ]
    },
    {
      name: "users",
      description: "Data admin pengelola sistem",
      columns: [
        { name: "id", type: "int (PK)" },
        { name: "email", type: "string" },
        { name: "password_hash", type: "string" },
        { name: "name", type: "string" },
        { name: "role", type: "string" },
        { name: "created_at", type: "datetime" }
      ]
    }
  ],
  constraints: [
    "Sistem harus dibangun menggunakan teknologi modern yang mendukung pengembangan cepat (rapid development) dan kemudahan pemeliharaan (maintainability).",
    "Typography: Sans: Geist Mono, ui-monospace; Mono: JetBrains Mono"
  ],
  outOfScope: [
    "Scan barcode/QR Code via kamera (ditunda ke fase lanjutan)",
    "Integrasi otomatis dengan API kurir pengiriman pihak ketiga"
  ],
  successMetrics: [
    "Akurasi pencatatan stok fisik vs sistem mencapai 99.8%",
    "Waktu admin dalam melakukan inbound/outbound report turun 70%"
  ],
  userStories: [
    {
      persona: "Admin Gudang",
      action: "mencatat barang masuk beserta nomor batch dan lokasi rak",
      value: "stok selalu akurat dan bisa dilacak per batch",
      acceptanceCriteria: [
        "Form inbound menampilkan field produk, quantity, nomor batch, dan lokasi rak",
        "Setelah submit, stok produk bertambah sesuai quantity yang diinput",
        "Data batch tersimpan dengan tanggal penerimaan otomatis"
      ]
    },
    {
      persona: "Pemilik Toko",
      action: "melihat dashboard ringkasan stok dan alert barang menipis",
      value: "bisa mengambil keputusan restok sebelum kehabisan",
      acceptanceCriteria: [
        "Dashboard menampilkan total SKU, total stok, dan jumlah item di bawah minimum",
        "Alert visual muncul untuk produk dengan stok di bawah threshold min_stock",
        "Data dashboard diperbarui real-time setelah transaksi inbound/outbound"
      ]
    }
  ],
  risks: [
    {
      risk: "Ketidakakuratan data input manual oleh admin",
      impact: "Sedang",
      mitigation: "Validasi input di frontend dan backend, serta fitur koreksi transaksi di riwayat"
    },
    {
      risk: "Database SQLite tidak mendukung akses multi-user secara bersamaan",
      impact: "Rendah",
      mitigation: "MVP ditargetkan untuk single admin; migrasi ke PostgreSQL di fase berikutnya jika dibutuhkan multi-user"
    }
  ],
  milestones: [
    {
      phase: "1",
      title: "MVP Core",
      duration: "4 minggu",
      deliverables: [
        "Setup project Next.js + Prisma + SQLite",
        "CRUD data master produk",
        "Form inbound dan outbound",
        "Dashboard ringkasan stok"
      ]
    },
    {
      phase: "2",
      title: "Enhancement",
      duration: "2 minggu",
      deliverables: [
        "Riwayat pergerakan stok (movement logs)",
        "Low stock alert visual",
        "Export laporan ke CSV"
      ]
    }
  ],
  roles: [
    {
      role: "Admin Gudang",
      accessLevel: "Read/Write",
      description: "Bisa menambah barang masuk dan keluar, tapi tidak bisa hapus data master"
    },
    {
      role: "Pemilik Toko",
      accessLevel: "Admin/All",
      description: "Bisa melihat dashboard, mengunduh laporan, dan mengubah minimum stock threshold"
    }
  ],
  assumptions: [
    {
      assumption: "Database SQLite cukup untuk skala MVP (maksimum 2 concurrent user)",
      validationPlan: "Load test sederhana dengan Artillery; jika terjadi database locked, evaluasi migrasi ke PostgreSQL"
    },
    {
      assumption: "Admin selalu scan/input barang tepat saat barang fisik tiba",
      validationPlan: "Interview dengan tim gudang untuk memastikan tidak ada delay antara barang tiba dan input sistem"
    }
  ]
};
