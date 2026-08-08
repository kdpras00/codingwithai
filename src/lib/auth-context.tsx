"use client";

import { createContext, useContext, ReactNode } from "react";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import { toast } from "react-toastify";

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  session: any;
  status: "authenticated" | "unauthenticated" | "loading";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderInner({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";

  const login = () => {
    // Redirect to our custom login page
    window.location.href = "/login";
  };

  const logout = async () => {
    await signOut({ redirect: false });
    toast.success("Anda telah berhasil sign out.");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, session, status }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
