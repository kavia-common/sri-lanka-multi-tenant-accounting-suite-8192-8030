"use client";
import React from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Button, Card, CardBody, CardHeader, Table, TextInput } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { getAuth } from "@/lib/auth";

type User = { id?: string; email: string; name?: string; roles?: string[] };

export default function UsersPage() {
  const [list, setList] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState<User>({ email: "", name: "", roles: ["user"] });

  const auth = getAuth();

  const load = React.useCallback(async () => {
    setLoading(true);
    const res = await apiFetch<User[]>("/users", {
      tenantId: auth.tenantId,
      companyId: auth.companyId,
      token: auth.token,
    });
    if (res.ok && res.data) setList(res.data);
    setLoading(false);
  }, [auth.companyId, auth.tenantId, auth.token]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    const res = await apiFetch<User>("/users", {
      method: "POST",
      body: form,
      tenantId: auth.tenantId,
      companyId: auth.companyId,
      token: auth.token,
    });
    if (res.ok) {
      setForm({ email: "", name: "", roles: ["user"] });
      load();
    } else {
      alert(res.error || "Failed to create user");
    }
  }

  return (
    <SidebarLayout>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader title="Users" subtitle="Manage tenant users" />
          <CardBody>
            {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}
            <Table headers={["Email", "Name", "Roles"]}>
              {list.map((u) => (
                <tr key={u.id || u.email}>
                  <td className="px-3 py-2 text-sm text-gray-700">{u.email}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{u.name}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{u.roles?.join(", ")}</td>
                </tr>
              ))}
              {list.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-sm text-gray-500" colSpan={3}>
                    No users found.
                  </td>
                </tr>
              ) : null}
            </Table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Create User" />
          <CardBody>
            <form onSubmit={createUser} className="space-y-3">
              <TextInput
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <TextInput
                label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <TextInput
                label="Roles (comma separated)"
                value={form.roles?.join(", ") || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    roles: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
              />
              <Button type="submit" variant="primary" ariaLabel="Create user">
                Create
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </SidebarLayout>
  );
}
