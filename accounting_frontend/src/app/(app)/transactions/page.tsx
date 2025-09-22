"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Card, Table, Button, Input, Select, Badge } from "@/components/ui";
import { apiCreateTransaction, apiGetAccounts, apiGetTransactions } from "@/lib/api";
import { Account, JournalEntryLine, TransactionModel, UUID } from "@/types";

type EditableLine = {
  account_id: UUID | "";
  debit_amount?: number;
  credit_amount?: number;
  description?: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [lines, setLines] = useState<EditableLine[]>([
    { account_id: "", debit_amount: 0, credit_amount: 0, description: "" },
    { account_id: "", debit_amount: 0, credit_amount: 0, description: "" },
  ]);

  const totals = useMemo(() => {
    const debits = lines.reduce((sum, l) => sum + (Number(l.debit_amount) || 0), 0);
    const credits = lines.reduce((sum, l) => sum + (Number(l.credit_amount) || 0), 0);
    return { debits, credits, balanced: Math.abs(debits - credits) < 0.0001 };
  }, [lines]);

  async function load() {
    setLoading(true);
    try {
      const [txRes, accRes] = await Promise.all([
        apiGetTransactions({ page: 1, limit: 20 }),
        apiGetAccounts(),
      ]);
      setTransactions(txRes.data?.transactions || []);
      setAccounts(accRes.data?.accounts || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function updateLine(idx: number, patch: Partial<EditableLine>) {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  }

  function addLine() {
    setLines((prev) => [...prev, { account_id: "", debit_amount: 0, credit_amount: 0, description: "" }]);
  }

  function removeLine(idx: number) {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  }

  async function createTransaction(e: React.FormEvent) {
    e.preventDefault();
    if (!totals.balanced) {
      alert("Transaction must be balanced (debits = credits).");
      return;
    }
    const validLines = lines.filter(
      (l) =>
        l.account_id &&
        ((Number(l.debit_amount) || 0) > 0 || (Number(l.credit_amount) || 0) > 0)
    );
    if (validLines.length < 2) {
      alert("At least two lines are required.");
      return;
    }
    const entries: JournalEntryLine[] = validLines.map((l) => ({
      account_id: l.account_id as UUID,
      debit_amount: Number(l.debit_amount) || undefined,
      credit_amount: Number(l.credit_amount) || undefined,
      description: l.description || undefined,
    }));
    await apiCreateTransaction({
      date,
      description,
      reference,
      entries,
    });
    setDescription("");
    setReference("");
    setLines([
      { account_id: "", debit_amount: 0, credit_amount: 0, description: "" },
      { account_id: "", debit_amount: 0, credit_amount: 0, description: "" },
    ]);
    await load();
  }

  return (
    <div className="space-y-6">
      <Card title="Transactions" subtitle="Recent activity">
        {loading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : (
          <Table
            columns={[
              { header: "Date", cell: (t: TransactionModel) => new Date(t.date).toLocaleDateString() },
              { header: "Description", cell: (t: TransactionModel) => t.description },
              { header: "Reference", cell: (t: TransactionModel) => t.reference || "—" },
              { header: "Entries", cell: (t: TransactionModel) => <Badge tone="info">{t.entries.length} lines</Badge> },
            ]}
            rows={transactions}
            keySelector={(t) => t.id}
          />
        )}
      </Card>
      <Card title="New Transaction" subtitle="Double-entry journal" actions={<Badge tone={totals.balanced ? "success" : "danger"}>{totals.balanced ? "Balanced" : "Unbalanced"}</Badge>}>
        <form onSubmit={createTransaction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <Input label="Reference" value={reference} onChange={(e) => setReference(e.target.value)} />
          </div>

          <div className="space-y-2">
            {lines.map((l, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2">
                <Select
                  label={idx === 0 ? "Account" : undefined}
                  value={l.account_id || ""}
                  onChange={(e) => updateLine(idx, { account_id: e.target.value as UUID | "" })}
                  options={[
                    { label: "Select account", value: "" },
                    ...accounts.map((a) => ({ label: `${a.code} • ${a.name}`, value: a.id })),
                  ]}
                />
                <Input
                  label={idx === 0 ? "Debit" : undefined}
                  type="number"
                  step="0.01"
                  value={String(l.debit_amount ?? 0)}
                  onChange={(e) => updateLine(idx, { debit_amount: Number(e.target.value) })}
                />
                <Input
                  label={idx === 0 ? "Credit" : undefined}
                  type="number"
                  step="0.01"
                  value={String(l.credit_amount ?? 0)}
                  onChange={(e) => updateLine(idx, { credit_amount: Number(e.target.value) })}
                />
                <Input
                  label={idx === 0 ? "Line Description" : undefined}
                  value={l.description || ""}
                  onChange={(e) => updateLine(idx, { description: e.target.value })}
                />
                <div className="flex items-end">
                  <Button type="button" variant="ghost" onClick={() => removeLine(idx)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" variant="secondary" onClick={addLine}>Add Line</Button>
            <div className="text-sm text-gray-700">
              <span className="mr-4">Debits: <strong>{totals.debits.toFixed(2)}</strong></span>
              <span>Credits: <strong>{totals.credits.toFixed(2)}</strong></span>
            </div>
            <div className="flex-1" />
            <Button type="submit">Post Transaction</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
