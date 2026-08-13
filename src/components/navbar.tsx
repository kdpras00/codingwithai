"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "./theme-toggle";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

export default function Navbar() {
  const { isLoggedIn, logout, session, status } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const userImage = session?.user?.image;
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";

  return (
    <header className="sticky top-0 z-50 border-b border-edge bg-background/80 backdrop-blur-xl">
      {pathname === "/builder" && mounted && isLoggedIn && (
        <button
          onClick={() =>
            window.dispatchEvent(new Event("ngodingai:open-sidebar"))
          }
          className="absolute left-5 top-1/2 -translate-y-1/2 rounded-xl p-2 text-muted hover:bg-ghost-hover-bg hover:text-foreground transition-all active:scale-95 cursor-pointer z-50"
          title="Menu"
        >
          <Menu size={20} />
        </button>
      )}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link
          href="/"
          className={`items-center font-sans text-3xl font-medium tracking-[-0.06em] text-foreground ${
            pathname === "/builder" && isLoggedIn ? "hidden sm:flex" : "flex"
          }`}
        >
          <span className="font-medium">coding</span>
          <span className="text-acid font-black">with</span>
          <span className="font-medium">ai</span>
        </Link>

        <div className="flex items-center gap-3 ml-auto">
          {/* ThemeToggle is always visible next to the login button or profile avatar */}
          <ThemeToggle />

          {!mounted || status === "loading" ? (
            <div className="h-8 w-20 rounded-xl bg-ghost-hover-bg animate-pulse" />
          ) : isLoggedIn ? (
            <div className="relative">
              {/* Profile Avatar Button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    className="h-8 w-8 rounded-full border border-edge object-cover transition-all hover:brightness-110 active:scale-95"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full border border-edge bg-ghost-hover-bg text-muted-foreground hover:bg-ghost-hover-bg hover:text-foreground transition-all flex items-center justify-center text-xs font-semibold select-none active:scale-95">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {/* Click-outside backdrop */}
              {dropdownOpen && (
                <div
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setDropdownOpen(false)}
                />
              )}

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-56 origin-top-right rounded-2xl border border-edge bg-panel p-1.5 shadow-2xl z-50 animate-fade-up">
                  {/* User Profile Header */}
                  <div className="px-3 py-2.5 text-left">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {userName}
                    </p>
                    <p className="mt-0.5 text-xs text-muted truncate">
                      {userEmail}
                    </p>
                  </div>

                  <div className="my-1 border-t border-edge" />

                  {/* Menu Items */}
                  <div className="space-y-0.5">
                    <Link
                      href="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center px-3 py-2 text-sm text-muted-foreground hover:rounded-xl hover:bg-ghost-hover-bg hover:text-foreground transition-colors"
                    >
                      Pengaturan
                    </Link>
                    <Link
                      href="/help"
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center px-3 py-2 text-sm text-muted-foreground hover:rounded-xl hover:bg-ghost-hover-bg hover:text-foreground transition-colors"
                    >
                      Bantuan
                    </Link>
                  </div>

                  <div className="my-1 border-t border-edge" />

                  {/* Sign Out Button */}
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center px-3 py-2 text-sm text-muted-foreground hover:rounded-xl hover:bg-ghost-hover-bg hover:text-foreground transition-colors text-left"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl bg-acid px-4 py-2 text-sm font-semibold text-ink"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
