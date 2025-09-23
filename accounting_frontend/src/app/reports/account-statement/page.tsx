"use client";
import React from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Card, CardBody, CardHeader, Table, TextInput, Button } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { getAuth } from "@/lib/auth";

type Txn = { date: string; description: string; debit: number; credit: number; balance: number };

export default function AccountStatementPage() {
  const [accountId, setAccountId] = React.useState<string>("");
  const [items, setItems] = React.useState<Txn[]>([]);
  const auth = getAuth();

  async function run() {
    if (!accountId) return;
    const res = await apiFetch<Txn[]>(`/general_ledger/accounts/${encodeURIComponent(accountId)}`, {
      tenantId: auth.tenantId, companyId: auth.companyId, token: auth.token,
    });
    if (res.ok && res.data) setItems(res.data);
  }

  return (
    <SidebarLayout>
      <Card>
        <CardHeader title="Account Statement" subtitle="Detailed ledger for a specific account" />
        <CardBody>
          <form onSubmit={(e) => { e.preventDefault(); run(); }} className="flex flex-wrap items-end gap-3 mb-4">
            <TextInput label="Account ID or Code" value={accountId} onChange={(e) => setAccountId(e.target.value)} />
            <Button type="submit" variant="primary">Run</Button>
          </form>
          <Table headers={["Date", "Description", "Debit", "Credit", "Balance"]}>
            {items.map((t, idx) => (
              <tr key={idx}>
                <td className="px-3 py-2 text-sm text-gray-700">{t.date}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{t.description}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{t.debit.toFixed(2)}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{t.credit.toFixed(2)}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{t.balance.toFixed(2)}</td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr><td className="px-3 py-4 text-sm text-gray-500" colSpan={5}>No transactions.</td></tr>
            ) : null}
          </Table>
        </CardBody>
      </Card>
    </SidebarLayout>
  );
}
