"use client";
import React from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Button, Card, CardBody, CardHeader, Table, TextInput, Select } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { getAuth } from "@/lib/auth";

type Account = { id?: string; code: string; name: string; type: string; };

const TYPES = ["Asset", "Liability", "Equity", "Income", "Expense"];

export default function CoAPage() {
  const [list, setList] = React.useState<Account[]>([]);
  const [form, setForm] = React.useState<Account>({ code: "", name: "", type: TYPES[0] });
  const auth = getAuth();

  const load = React.useCallback(async () => {
    const res = await apiFetch<Account[]>("/chart_of_accounts", {
      tenantId: auth.tenantId,
      companyId: auth.companyId,
      token: auth.token,
    });
    if (res.ok && res.data) setList(res.data);
  }, [auth.companyId, auth.tenantId, auth.token]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const res = await apiFetch("/chart_of_accounts", {
      method: "POST",
      body: form,
      tenantId: auth.tenantId,
      companyId: auth.companyId,
      token: auth.token,
    });
    if (res.ok) {
      setForm({ code: "", name: "", type: TYPES[0] });
      load();
    } else alert(res.error || "Failed to create account");
  }

  return (
    <SidebarLayout>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader title="Chart of Accounts" subtitle="Sri Lankan GAAP friendly categories" />
          <CardBody>
            <Table headers={["Code", "Name", "Type"]}>
              {list.map((a) => (
                <tr key={a.id || a.code}>
                  <td className="px-3 py-2 text-sm text-gray-700">{a.code}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{a.name}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{a.type}</td>
                </tr>
              ))}
              {list.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-sm text-gray-500" colSpan={3}>
                    No accounts found.
                  </td>
                </tr>
              ) : null}
            </Table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Create Account" />
          <CardBody>
            <form onSubmit={create} className="space-y-3">
              <TextInput label="Code" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              <TextInput label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
              <Button type="submit" variant="primary">Create</Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </SidebarLayout>
  );
}
