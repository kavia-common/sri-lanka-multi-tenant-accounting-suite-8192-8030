"use client";
import React from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Button, Card, CardBody, CardHeader, Table, TextInput } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { getAuth } from "@/lib/auth";

type Company = { id?: string; name: string; registrationNo?: string; taxNumber?: string };

export default function CompaniesPage() {
  const [list, setList] = React.useState<Company[]>([]);
  const [form, setForm] = React.useState<Company>({ name: "", registrationNo: "", taxNumber: "" });
  const [loading, setLoading] = React.useState(false);
  const auth = getAuth();

  const load = React.useCallback(async () => {
    setLoading(true);
    const res = await apiFetch<Company[]>("/companies", {
      tenantId: auth.tenantId,
      token: auth.token,
    });
    if (res.ok && res.data) setList(res.data);
    setLoading(false);
  }, [auth.tenantId, auth.token]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function createCompany(e: React.FormEvent) {
    e.preventDefault();
    const res = await apiFetch("/companies", {
      method: "POST",
      body: form,
      tenantId: auth.tenantId,
      token: auth.token,
    });
    if (res.ok) {
      setForm({ name: "", registrationNo: "", taxNumber: "" });
      load();
    } else alert(res.error || "Failed to create company");
  }

  return (
    <SidebarLayout>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader title="Companies" subtitle="Manage tenant companies" />
          <CardBody>
            {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
            <Table headers={["Name", "Reg. No.", "Tax No."]}>
              {list.map((c) => (
                <tr key={c.id || c.name}>
                  <td className="px-3 py-2 text-sm text-gray-700">{c.name}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{c.registrationNo}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{c.taxNumber}</td>
                </tr>
              ))}
              {list.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-sm text-gray-500" colSpan={3}>
                    No companies found.
                  </td>
                </tr>
              ) : null}
            </Table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Create Company" />
          <CardBody>
            <form onSubmit={createCompany} className="space-y-3">
              <TextInput
                label="Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <TextInput
                label="Registration No."
                value={form.registrationNo}
                onChange={(e) => setForm({ ...form, registrationNo: e.target.value })}
              />
              <TextInput
                label="Tax Number (e.g., VAT)"
                value={form.taxNumber}
                onChange={(e) => setForm({ ...form, taxNumber: e.target.value })}
              />
              <Button type="submit" variant="primary" ariaLabel="Create company">
                Create
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </SidebarLayout>
  );
}
