"use client";
import React, { useEffect, useState } from "react";
import { Card, Table, Button, Input } from "@/components/ui";
import { apiCreateCompany, apiGetCompanies } from "@/lib/api";
import { Company } from "@/types";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await apiGetCompanies();
      setCompanies(res.data?.companies || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createCompany(e: React.FormEvent) {
    e.preventDefault();
    await apiCreateCompany({ name, code, email });
    setName("");
    setCode("");
    setEmail("");
    await load();
  }

  return (
    <div className="space-y-6">
      <Card title="Your Companies" subtitle="Companies you have access to">
        {loading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : (
          <Table
            columns={[
              { header: "Name", cell: (c: Company) => c.name },
              { header: "Code", cell: (c: Company) => c.code },
              { header: "Email", cell: (c: Company) => c.email || "—" },
              { header: "Created", cell: (c: Company) => (c.created_at ? new Date(c.created_at).toLocaleString() : "—") },
            ]}
            rows={companies}
            keySelector={(c) => c.id}
          />
        )}
      </Card>
      <Card title="Create Company">
        <form onSubmit={createCompany} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Code" value={code} onChange={(e) => setCode(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="md:col-span-3">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
