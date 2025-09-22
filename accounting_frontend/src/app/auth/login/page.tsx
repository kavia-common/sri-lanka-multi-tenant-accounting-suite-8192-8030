"use client";
import React, { useState } from "react";
import { apiLogin, saveAuth } from "@/lib/api";
import { Button, Card, Input, Select } from "@/components/ui";
import { useAuth } from "@/context/auth";
import { LoginResponse } from "@/types";

export default function LoginPage() {
  const { setToken, setCompanyId } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState<string>("");
  const [companies, setCompanies] = useState<LoginResponse["data"]["companies"]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"login" | "company">("login");
  const [error, setError] = useState<string | null>(null);
  const [tempToken, setTempToken] = useState<string>("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiLogin({ email, password });
      setTempToken(res.data.token);
      setCompanies(res.data.companies || []);
      if ((res.data.companies || []).length <= 1) {
        const companyId = res.data.companies?.[0]?.id || "";
        saveAuth(res.data.token, companyId || undefined);
        setToken(res.data.token);
        if (companyId) setCompanyId(companyId);
        window.location.href = "/dashboard";
      } else {
        setStep("company");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function finishSelection(e: React.FormEvent) {
    e.preventDefault();
    if (!company) {
      setError("Please select a company");
      return;
    }
    saveAuth(tempToken, company);
    setToken(tempToken);
    setCompanyId(company);
    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card
          title="Welcome to OceanBooks"
          subtitle={step === "login" ? "Sign in to continue" : "Select your company"}
          actions={<div className="text-xs text-gray-500">Blue & Amber • Modern</div>}
        >
          {step === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={loading}>
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          ) : (
            <form onSubmit={finishSelection} className="space-y-4">
              <Select
                label="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                options={[{ label: "Select a company", value: "" }, ...companies.map((c) => ({ label: `${c.name} (${c.code})`, value: c.id }))]}
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit">Continue</Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
