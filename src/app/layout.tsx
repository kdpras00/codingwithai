import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AutoUpdate from "@/components/AutoUpdate";
import { AuthProvider } from "@/lib/auth-context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "codingwithai — Bikin PRD untuk AI Coding Agent",
  description:
    "Dari ide jadi PRD, spec fitur, arsitektur, dan task list yang siap dipakai AI coding agent. Platform AI coding untuk developer Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${dmSans.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <AutoUpdate />
        <ThemeProvider defaultTheme="dark">
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <ToastContainer position="top-right" theme="dark" style={{ marginTop: '70px' }} />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
