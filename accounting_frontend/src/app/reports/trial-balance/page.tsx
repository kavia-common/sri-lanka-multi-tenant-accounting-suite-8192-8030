"use client";
import React from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Card, CardBody, CardHeader, Table, TextInput, Button } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { getAuth } from "@/lib/auth";

type TBLine = { accountCode: string; accountName: string; debit: number; credit: number };

export default function TrialBalancePage() {
  const [from, setFrom] = React.useState<string>(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0,10));
  const [to, setTo] = React.useState<string>(new Date().toISOString().slice(0,10));
  const [lines, setLines] = React.useState<TBLine[]>([]);
  const auth = getAuth();

  async function load() {
    const url = `/general_ledger/trial_balance?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    const res = await apiFetch<TBLine[]>(url, { tenantId: auth.tenantId, companyId: auth.companyId, token: auth.token });
    if (res.ok && res.data) setLines(res.data);
  }

  return (
    <SidebarLayout>
      <Card>
        <CardHeader title="Trial Balance" subtitle="As per Sri Lankan GAAP" />
        <CardBody>
          <form onSubmit={(e) => { e.preventDefault(); load(); }} className="flex flex-wrap items-end gap-3 mb-4">
            <TextInput label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <TextInput label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            <Button type="submit" variant="primary">Run</Button>
          </form>
          <Table headers={["Account", "Debit", "Credit"]}>
            {lines.map((l) => (
              <tr key={l.accountCode}>
                <td className="px-3 py-2 text-sm text-gray-700">{l.accountCode} — {l.accountName}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{l.debit.toFixed(2)}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{l.credit.toFixed(2)}</td>
              </tr>
            ))}
            {lines.length === 0 ? (
              <tr><td className="px-3 py-4 text-sm text-gray-500" colSpan={3}>No data.</td></tr>
            ) : null}
          </Table>
        </CardBody>
      </Card>
    </SidebarLayout>
  );
}
