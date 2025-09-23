"use client";
import React from "react";
import { Card, CardBody, CardHeader, TextInput, Button } from "@/components/ui";
import { setAuth, getAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
// Note: This demo saves token and info. Replace with real call to /auth/login when backend ready.

export default function LoginPage() {
  const router = useRouter();
  const existing = getAuth();
  const [email, setEmail] = React.useState(existing.email || "");
  const [token, setToken] = React.useState(existing.token || "");
  const [tenantId, setTenantId] = React.useState(existing.tenantId || "");
  const [companyId, setCompanyId] = React.useState(existing.companyId || "");

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    setAuth({ email, token, tenantId, companyId });
    router.replace("/");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader title="Login (Temp)" subtitle="Provide token/IDs for API access" />
          <CardBody>
            <form onSubmit={onSave} className="space-y-3">
              <TextInput label="Email" type="email" value={email || ""} onChange={(e) => setEmail(e.target.value)} />
              <TextInput label="Token" value={token || ""} onChange={(e) => setToken(e.target.value)} />
              <TextInput label="Tenant ID" value={tenantId || ""} onChange={(e) => setTenantId(e.target.value)} />
              <TextInput label="Company ID" value={companyId || ""} onChange={(e) => setCompanyId(e.target.value)} />
              <Button type="submit" variant="primary">Save</Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
