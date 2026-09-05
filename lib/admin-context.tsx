"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const TOKEN_KEY = "adminToken";

/**
 * The admin token lives in localStorage, which is an external store rather
 * than React state — so it is read through useSyncExternalStore instead of
 * being copied into state by an effect on mount. That removes the render
 * cascade, and picks up sign-out in another tab for free.
 */
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** The stored token, or null. Safe to call before hydration finishes. */
export function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    // Private-mode Safari and blocked site data both throw on access.
    return null;
  }
}

function getSnapshot(): boolean {
  return Boolean(readToken());
}

/** The server has no session, so it always renders the signed-out view. */
const getServerSnapshot = () => false;

interface AdminContextValue {
  isAdmin: boolean;
  loginWithCode: (email: string, code: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const isAdmin = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const loginWithCode = useCallback(async (email: string, code: string) => {
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) return false;

      const { token } = await res.json();
      localStorage.setItem(TOKEN_KEY, token);
      emit();
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    emit();
  }, []);

  const value = useMemo(
    () => ({ isAdmin, loginWithCode, logout }),
    [isAdmin, loginWithCode, logout]
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
