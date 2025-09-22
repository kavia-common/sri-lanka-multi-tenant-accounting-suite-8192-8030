"use client";

import React, { createContext, useContext, useMemo, useState, useEffect, ReactNode } from "react";

export type Company = {
  id: string;
  name: string;
  code?: string;
  role?: string;
};

type CompanyContextType = {
  company: Company | null;
  setCompany: (c: Company | null) => void;
  companies: Company[];
  setCompanies: (list: Company[]) => void;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

/**
 * PUBLIC_INTERFACE
 * Provider to handle currently selected company and list of companies for multi-tenant context.
 */
export function CompanyProvider({ children }: { children: ReactNode }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);

  // Restore selected company from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("selectedCompany");
      if (saved) {
        const parsed: Company = JSON.parse(saved);
        setCompany(parsed);
      }
      const savedList = localStorage.getItem("companies");
      if (savedList) {
        const parsedList: Company[] = JSON.parse(savedList);
        setCompanies(parsedList);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist selection and list
  useEffect(() => {
    try {
      if (company) localStorage.setItem("selectedCompany", JSON.stringify(company));
      else localStorage.removeItem("selectedCompany");
    } catch {}
  }, [company]);

  useEffect(() => {
    try {
      localStorage.setItem("companies", JSON.stringify(companies));
    } catch {}
  }, [companies]);

  const value = useMemo(
    () => ({ company, setCompany, companies, setCompanies }),
    [company, companies]
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * Hook to access company context.
 */
export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
}
