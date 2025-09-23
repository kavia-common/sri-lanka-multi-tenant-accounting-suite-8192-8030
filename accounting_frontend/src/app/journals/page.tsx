"use client";
import React from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Button, Card, CardBody, CardHeader, Table, TextInput } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { getAuth } from "@/lib/auth";

type Journal = { id?: string; date: string; reference?: string; description?: string; total?: number };

export default function JournalsPage() {
  const [list, setList] = React.useState<Journal[]>([]);
  const [form, setForm] = React.useState<Journal>({ date: new Date().toISOString().slice(0,10), reference: "", description: "" });
  const auth = getAuth();

  const load = React.useCallback(async () => {
    const res = await apiFetch<Journal[]>("/journal_entries", {
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
    const res = await apiFetch("/journal_entries", {
      method: "POST",
      body: form,
      tenantId: auth.tenantId,
      companyId: auth.companyId,
      token: auth.token,
    });
    if (res.ok) {
      setForm({ date: new Date().toISOString().slice(0,10), reference: "", description: "" });
      load();
    } else alert(res.error || "Failed to create journal");
  }

  return (
    <SidebarLayout>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader title="Journal Entries" subtitle="Double-entry bookkeeping" />
          <CardBody>
            <Table headers={["Date", "Reference", "Description", "Total (LKR)"]}>
              {list.map((j) => (
                <tr key={j.id || `${j.reference}-${j.date}`}>
                  <td className="px-3 py-2 text-sm text-gray-700">{j.date}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{j.reference}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{j.description}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{(j.total ?? 0).toFixed(2)}</td>
                </tr>
              ))}
              {list.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-sm text-gray-500" colSpan={4}>
                    No journal entries found.
                  </td>
                </tr>
              ) : null}
            </Table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Create Journal" />
          <CardBody>
            <form onSubmit={create} className="space-y-3">
              <TextInput label="Date" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <TextInput label="Reference" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} />
              <TextInput label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Button type="submit" variant="primary">Post Journal</Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </SidebarLayout>
  );
}
