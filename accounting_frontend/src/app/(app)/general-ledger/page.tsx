"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Button, Input, Select, DataTable } from "../../../components/ocean-theme";
import { useApi } from "../../../lib/hooks";

export default function GeneralLedgerPage() {
  const { get } = useApi();
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [accountId, setAccountId] = useState("");
  type Account = { id: string; code: string; name: string };
  type LedgerRow = { id?: string; date?: string; account_code?: string; description?: string; debit_amount?: number; credit_amount?: number; balance?: number };
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [ledger, setLedger] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await get("/api/accounts");
      setAccounts(res?.data?.accounts || []);
    })();
  }, [get]);

  const accountOptions = useMemo(
    () =>
      [{ label: "All accounts", value: "" }].concat(
        accounts.map((a: Account) => ({ label: `${a.code} — ${a.name}`, value: a.id }))
      ),
    [accounts]
  );

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (periodStart && periodEnd) params.append("period[]", `${periodStart}..${periodEnd}`);
    if (accountId) params.append("account_id", accountId);
    const res = await get<{ data?: { entries?: LedgerRow[] } } | { data?: LedgerRow[] } | LedgerRow[]>(`/api/reports/v2/general-ledger?${params.toString()}`);
    const rows = Array.isArray(res)
      ? res
      : (res?.data?.entries ||
         ((res as { data?: LedgerRow[] }).data ?? []));
    setLedger(rows || []);
    setLoading(false);
  }, [get, periodStart, periodEnd, accountId]);

  return (
    <div className="space-y-6">
      <Card
        title="General Ledger"
        subtitle="Select filters and run the report."
        right={<Button onClick={load}>Run</Button>}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input label="Start" type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
          <Input label="End" type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
          <Select label="Account" value={accountId} onChange={(e) => setAccountId(e.target.value)} options={accountOptions} />
          <div className="flex items-end">
            <Button onClick={load}>Generate</Button>
          </div>
        </div>
      </Card>
      <Card title="Results" subtitle={loading ? "Loading..." : undefined}>
        <DataTable
          columns={[
            { key: "date", label: "Date" },
            { key: "account_code", label: "Account" },
            { key: "description", label: "Description" },
            { key: "debit_amount", label: "Debit" },
            { key: "credit_amount", label: "Credit" },
            { key: "balance", label: "Balance" },
          ]}
          data={ledger}
          rowKey={(r, i) => r.id || `${r.account_code}-${i}`}
        />
      </Card>
      <div className="text-xs text-gray-500">
        Note: Advanced pagination parameters (page, limit) are supported by the API; add client paging in future.
      </div>
    </div>
  );
}
