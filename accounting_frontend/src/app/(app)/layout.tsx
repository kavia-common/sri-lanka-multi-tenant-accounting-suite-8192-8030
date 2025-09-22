"use client";
import React, { useEffect } from "react";
import { AppShell, Card, Select } from "@/components/ui";
import { useAuth } from "@/context/auth";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { token, companyId, companies, setCompanyId, refreshCompanies } = useAuth();

  useEffect(() => {
    if (!token) {
      window.location.replace("/auth/login");
      return;
    }
    // Refresh companies on app load
    (async () => {
      if (companies.length === 0) {
        await refreshCompanies();
      }
    })();
  }, [token, companies.length, refreshCompanies]);

  if (!token) {
    return null;
  }

  return (
    <AppShell>
      <div className="mb-4">
        <Card>
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1">
              <h2 className="text-sm font-medium text-gray-700">Active Company</h2>
              <p className="text-xs text-gray-500">Switch context to manage different companies</p>
            </div>
            <div className="w-full md:w-72">
              <Select
                value={companyId ?? ""}
                onChange={(e) => setCompanyId(e.target.value)}
                options={[
                  { label: companies.length ? "Select a company" : "No companies available", value: "" },
                  ...companies.map((c) => ({ label: `${c.name} (${c.code})`, value: c.id })),
                ]}
              />
            </div>
          </div>
        </Card>
      </div>
      {children}
    </AppShell>
  );
}
