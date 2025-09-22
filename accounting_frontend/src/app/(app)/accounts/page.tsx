"use client";
import React, { useEffect, useState } from "react";
import { Card, Table, Button, Input, Select, Badge } from "@/components/ui";
import { apiCreateAccount, apiGetAccounts, apiUpdateAccount } from "@/lib/api";
import { Account, AccountType } from "@/types";

const accountTypeOptions = [
  "ASSET",
  "LIABILITY",
  "EQUITY",
  "REVENUE",
  "EXPENSE",
] as AccountType[];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("ASSET");

  async function load() {
    setLoading(true);
    try {
      const res = await apiGetAccounts();
      setAccounts(res.data?.accounts || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createAccount(e: React.FormEvent) {
    e.preventDefault();
    await apiCreateAccount({ code, name, type });
    setCode("");
    setName("");
    setType("ASSET");
    await load();
  }

  async function updateAccount(a: Account, updates: Partial<Pick<Account, "name" | "description">>) {
    await apiUpdateAccount(a.id, updates);
    await load();
  }

  function typeBadge(t: AccountType) {
    const tone = t === "REVENUE" ? "success" : t === "EXPENSE" ? "warning" : "info";
    return <Badge tone={tone}>{t}</Badge>;
  }

  return (
    <div className="space-y-6">
      <Card title="Chart of Accounts" subtitle="Manage your accounts">
        {loading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : (
          <Table
            columns={[
              { header: "Code", cell: (a: Account) => a.code },
              { header: "Name", cell: (a: Account) => (
                <InlineEditText value={a.name} onSave={(val) => updateAccount(a, { name: val })} />
              ) },
              { header: "Type", cell: (a: Account) => typeBadge(a.type) },
              { header: "Description", cell: (a: Account) => (
                <InlineEditText value={a.description || ""} placeholder="Add description" onSave={(val) => updateAccount(a, { description: val })} />
              ) },
              { header: "Balance", cell: (a: Account) => (a.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 }) , className: "text-right"},
            ]}
            rows={accounts}
            keySelector={(a) => a.id}
          />
        )}
      </Card>
      <Card title="Create Account">
        <form onSubmit={createAccount} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Code" value={code} onChange={(e) => setCode(e.target.value)} required />
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value as AccountType)}
            options={accountTypeOptions.map((t) => ({ label: t, value: t }))}
          />
          <div className="flex items-end">
            <Button type="submit">Add</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function InlineEditText({ value, onSave, placeholder }: { value: string; placeholder?: string; onSave: (val: string) => Promise<void> | void }) {
  const [editing, setEditing] = useState(false);
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);

  async function submit() {
    if (v !== value) {
      await onSave(v);
    }
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="group flex items-center gap-2">
        <span className={value ? "text-gray-900" : "text-gray-400"}>{value || placeholder || "—"}</span>
        <button type="button" className="opacity-0 group-hover:opacity-100 text-blue-600 text-xs" onClick={() => setEditing(true)}>Edit</button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <input className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={v} onChange={(e) => setV(e.target.value)} />
      <button className="text-blue-600 text-xs" onClick={submit}>Save</button>
      <button className="text-gray-500 text-xs" onClick={() => setEditing(false)}>Cancel</button>
    </div>
  );
}
