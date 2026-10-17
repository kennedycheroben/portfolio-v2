import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AdminUser {
  email: string;
  role: "admin";
}

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const TOKEN_KEY = "portfolio_admin_token";

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  });
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const verifySession = useCallback(async (authToken: string) => {
    try {
      const res = await fetch("/api/admin/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return true;
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        return false;
      }
    } catch {
      // In case of network failure during check, do not immediately kick out
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      verifySession(token);
    } else {
      setIsLoading(false);
    }
  }, [token, verifySession]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || "Authentication failed" };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const logout = () => {
    fetch("/api/admin/logout", { method: "POST", credentials: "include" }).catch(() => {
      // Ignore network errors during logout
    });
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return ctx;
}
