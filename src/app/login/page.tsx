"use client";

import { useAuth } from "@/lib/auth-context";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { isLoggedIn, status } = useAuth();
  const router = useRouter();

  // If already logged in, redirect to home
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-acid border-t-transparent" />
      </div>
    );
  }

  const handleGoogleSignIn = () => {
    if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true") {
      signIn("credentials", { callbackUrl: "/" });
    } else {
      signIn("google", { callbackUrl: "/" });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-5 py-24 text-center">
      <div className="w-full max-w-sm animate-fade-up">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Selamat Datang
        </h1>
        <p className="mt-2 text-sm text-muted">
          Masuk dengan akun Google Anda untuk melanjutkan
        </p>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleGoogleSignIn}
            className="flex w-full max-w-md items-center justify-center rounded-2xl border border-edge bg-transparent px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-ghost-hover-bg active:scale-[0.98]"
          >
            <svg className="mr-3 h-5 w-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.19 2.7 1.24 6.64l4.026 3.125z"
              />
              <path
                fill="#4285F4"
                d="M16.04 15.34c-1.047.737-2.399 1.18-4.04 1.18a7.09 7.09 0 0 1-6.733-4.854l-4.027 3.125C3.18 19.3 7.26 22 12 22c3.127 0 5.966-1.09 8.082-2.918l-4.042-3.742z"
              />
              <path
                fill="#FBBC05"
                d="M5.266 14.235L1.24 17.36A11.966 11.966 0 0 1 0 12c0-1.92.455-3.733 1.24-5.36l4.026 3.125A7.056 7.056 0 0 0 4.91 12c0 1.092.127 2.182.356 3.235z"
              />
              <path
                fill="#34A853"
                d="M23.49 12.275c0-.818-.073-1.636-.218-2.436H12v4.618h6.455a5.527 5.527 0 0 1-2.418 3.618l4.042 3.742c2.364-2.182 3.727-5.39 3.727-9.263z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
