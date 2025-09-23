"use client";
import React from "react";
import { useParams } from "next/navigation";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Button, Card, CardBody, CardHeader, Table, TextInput } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { getAuth } from "@/lib/auth";



type MasterRecord = { id?: string; name: string; code?: string; rate?: number; accountId?: string; };

const TITLES: Record<string, { title: string; subtitle: string; placeholders: string[] }> = {
  "customers": { title: "Customers", subtitle: "Customer master data", placeholders: ["Name", "Code"] },
  "vendors": { title: "Vendors", subtitle: "Vendor master data", placeholders: ["Name", "Code"] },
  "bank-accounts": { title: "Bank Accounts", subtitle: "Banking setup", placeholders: ["Name", "Account Code"] },
  "tax-rates": { title: "Tax Rates", subtitle: "Sri Lankan VAT/NBT", placeholders: ["Name (VAT/NBT)", "Rate %"] },
};

export default function MastersEntityPage() {
  const params = useParams();
  const entity = String(params?.entity || "");
  const config = TITLES[entity] || { title: entity, subtitle: "Master data", placeholders: ["Name", "Code"] };

  const [list, setList] = React.useState<MasterRecord[]>([]);
  const [form, setForm] = React.useState<MasterRecord>({ name: "", code: "", rate: undefined });
  const [error, setError] = React.useState<string | null>(null);
  const auth = getAuth();

  const load = React.useCallback(async () => {
    const apiEntity = entity.replace("-", "_");
    const res = await apiFetch<MasterRecord[]>(`/${apiEntity}`, {
      tenantId: auth.tenantId,
      companyId: auth.companyId,
      token: auth.token,
    });
    if (res.ok && res.data) setList(res.data);
  }, [auth.companyId, auth.tenantId, auth.token, entity]);

  React.useEffect(() => { if (entity) load(); }, [entity, load]);

  function validate(): string | null {
    if (!form.name?.trim()) return "Name is required.";
    if (entity === "tax-rates") {
      const r = typeof form.rate === "number" ? form.rate : Number(form.rate);
      if (isNaN(r)) return "Tax rate must be a number.";
      if (r < 0 || r > 100) return "Tax rate must be between 0 and 100.";
    }
    return null;
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    const apiEntity = entity.replace("-", "_");
    const res = await apiFetch(`/${apiEntity}`, {
      method: "POST",
      body: form,
      tenantId: auth.tenantId,
      companyId: auth.companyId,
      token: auth.token,
    });
    if (res.ok) {
      setForm({ name: "", code: "", rate: undefined });
      load();
    } else setError(res.error || "Failed to create");
  }

  return (
    <SidebarLayout>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader title={config.title} subtitle={config.subtitle} />
          <CardBody>
            <Table headers={["Name", "Code", "Rate"]}>
              {list.map((r) => (
                <tr key={r.id || r.name}>
                  <td className="px-3 py-2 text-sm text-gray-700">{r.name}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{r.code}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{(r.rate ?? 0).toString()}</td>
                </tr>
              ))}
              {list.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-sm text-gray-500" colSpan={3}>
                    No records found.
                  </td>
                </tr>
              ) : null}
            </Table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title={`Create ${config.title.slice(0, -1)}`} />
          <CardBody>
            <form onSubmit={create} className="space-y-3">
              <TextInput label={config.placeholders[0]} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={error?.toLowerCase().includes("name") ? error : undefined} />
              <TextInput label={config.placeholders[1]} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              {entity === "tax-rates" ? (
                <TextInput label="Rate (%)" type="number" step="0.01" value={form.rate?.toString() || ""} onChange={(e) => setForm({ ...form, rate: Number(e.target.value) })} error={error?.toLowerCase().includes("rate") ? error : undefined} />
              ) : null}
              {error && !error.toLowerCase().includes("name") && !error.toLowerCase().includes("rate") ? (
                <p className="text-sm text-red-600">{error}</p>
              ) : null}
              <Button type="submit" variant="primary">Create</Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </SidebarLayout>
  );
}
