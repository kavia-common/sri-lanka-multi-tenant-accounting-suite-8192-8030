"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiGetCompanies, clearAuth } from "@/lib/api";
import { Company } from "@/types";

type AuthState = {
  token: string | null;
  companyId: string | null;
  companies: Company[];
  setToken: (t: string | null) => void;
  setCompanyId: (id: string | null) => void;
  refreshCompanies: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [companyId, setCompanyState] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    try {
      const t = localStorage.getItem("auth_token");
      const c = localStorage.getItem("company_id");
      setTokenState(t);
      setCompanyState(c);
    } catch {
      // ignore
    }
  }, []);

  async function refreshCompanies() {
    if (!token) return;
    try {
      const data = await apiGetCompanies();
      if (data?.data?.companies) {
        setCompanies(data.data.companies);
        const current = localStorage.getItem("company_id");
        if (!current && data.data.companies.length > 0) {
          localStorage.setItem("company_id", data.data.companies[0].id);
          setCompanyState(data.data.companies[0].id);
        }
      }
    } catch {
      // ignore fetch errors
    }
  }

  function setToken(t: string | null) {
    setTokenState(t);
    if (t) localStorage.setItem("auth_token", t);
    else localStorage.removeItem("auth_token");
  }

  function setCompanyId(id: string | null) {
    setCompanyState(id);
    if (id) localStorage.setItem("company_id", id);
    else localStorage.removeItem("company_id");
  }

  function logout() {
    clearAuth();
    setTokenState(null);
    setCompanyState(null);
    setCompanies([]);
    window.location.href = "/auth/login";
  }

  const value: AuthState = {
    token,
    companyId,
    companies,
    setToken,
    setCompanyId,
    refreshCompanies,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
