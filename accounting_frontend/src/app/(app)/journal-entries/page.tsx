"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Card, Button, Input, TextArea, Select, DataTable } from "../../../components/ocean-theme";
import { useApi } from "../../../lib/hooks";

type Line = { account_id: string; debit_amount?: string | number; credit_amount?: string | number; description?: string };

export default function JournalEntriesPage() {
  const { get, post } = useApi();
  type TransactionRow = { id: string; date: string; description: string; reference?: string; total_amount?: number };
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  type Account = { id: string; code: string; name: string };
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [form, setForm] = useState<{ date: string; description: string; reference?: string; entries: Line[] }>({
    date: new Date().toISOString().slice(0, 10),
    description: "",
    reference: "",
    entries: [
      { account_id: "", debit_amount: "", credit_amount: "" },
      { account_id: "", debit_amount: "", credit_amount: "" },
    ],
  });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await get<{ data?: { transactions?: TransactionRow[] } }>("/api/transactions");
    setTransactions(res?.data?.transactions || []);
    setLoading(false);
  }, [get]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    (async () => {
      const res = await get<{ data?: { accounts?: Account[] } }>("/api/accounts");
      setAccounts(res?.data?.accounts || []);
    })();
  }, [get]);

  const accountOptions = useMemo(
    () =>
      [{ label: "Select account", value: "" }].concat(
        accounts.map((a: Account) => ({ label: `${a.code} — ${a.name}`, value: a.id }))
      ),
    [accounts]
  );

  const balanced = useMemo(() => {
    const deb = form.entries.reduce((s, e) => s + (parseFloat(String(e.debit_amount || 0)) || 0), 0);
    const cre = form.entries.reduce((s, e) => s + (parseFloat(String(e.credit_amount || 0)) || 0), 0);
    return Math.abs(deb - cre) < 0.0001;
  }, [form.entries]);

  return (
    <div className="space-y-6">
      <Card
        title="Journal Entries"
        subtitle={loading ? "Loading..." : undefined}
        right={<Button onClick={() => setOpenCreate(true)}>+ New Journal Entry</Button>}
      >
        <DataTable
          columns={[
            { key: "date", label: "Date" },
            { key: "description", label: "Description" },
            { key: "reference", label: "Reference" },
            { key: "total_amount", label: "Total" },
          ]}
          data={transactions}
          rowKey={(r) => r.id}
        />
      </Card>

      {openCreate && (
        <Card title="Create Journal Entry" right={<Button variant="ghost" onClick={() => setOpenCreate(false)}>Close</Button>}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
            <Input
              label="Reference"
              value={form.reference || ""}
              onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
            />
            <div className="md:col-span-3">
              <TextArea
                label="Description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {form.entries.map((line, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                <div className="md:col-span-3">
                  <Select
                    label={`Line ${idx + 1} Account`}
                    value={line.account_id}
                    onChange={(e) =>
                      setForm((f) => {
                        const entries = [...f.entries];
                        entries[idx] = { ...entries[idx], account_id: e.target.value };
                        return { ...f, entries };
                      })
                    }
                    options={accountOptions}
                  />
                </div>
                <Input
                  label="Debit"
                  type="number"
                  value={String(line.debit_amount || "")}
                  onChange={(e) =>
                    setForm((f) => {
                      const entries = [...f.entries];
                      entries[idx] = { ...entries[idx], debit_amount: e.target.value, credit_amount: "" };
                      return { ...f, entries };
                    })
                  }
                />
                <Input
                  label="Credit"
                  type="number"
                  value={String(line.credit_amount || "")}
                  onChange={(e) =>
                    setForm((f) => {
                      const entries = [...f.entries];
                      entries[idx] = { ...entries[idx], credit_amount: e.target.value, debit_amount: "" };
                      return { ...f, entries };
                    })
                  }
                />
                <Input
                  label="Memo"
                  value={line.description || ""}
                  onChange={(e) =>
                    setForm((f) => {
                      const entries = [...f.entries];
                      entries[idx] = { ...entries[idx], description: e.target.value };
                      return { ...f, entries };
                    })
                  }
                />
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <Button
              variant="ghost"
              onClick={() =>
                setForm((f) => ({ ...f, entries: [...f.entries, { account_id: "", debit_amount: "", credit_amount: "" }] }))
              }
            >
              + Add line
            </Button>
            <Button
              variant="danger"
              onClick={() => setForm((f) => ({ ...f, entries: f.entries.slice(0, Math.max(2, f.entries.length - 1)) }))}
            >
              Remove last line
            </Button>
          </div>

          <div className="mt-4 flex justify-end gap-2 items-center">
            <span className={`text-sm ${balanced ? "text-green-600" : "text-red-600"}`}>
              {balanced ? "Balanced" : "Not balanced"}
            </span>
            <Button
              onClick={async () => {
                if (!balanced) return;
                await post("/api/transactions", {
                  date: form.date,
                  description: form.description,
                  reference: form.reference,
                  entries: form.entries.map((e) => ({
                    account_id: e.account_id,
                    debit_amount: e.debit_amount ? Number(e.debit_amount) : undefined,
                    credit_amount: e.credit_amount ? Number(e.credit_amount) : undefined,
                    description: e.description || undefined,
                  })),
                });
                setOpenCreate(false);
                setForm({
                  date: new Date().toISOString().slice(0, 10),
                  description: "",
                  reference: "",
                  entries: [
                    { account_id: "", debit_amount: "", credit_amount: "" },
                    { account_id: "", debit_amount: "", credit_amount: "" },
                  ],
                });
                await load();
              }}
            >
              Save Entry
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Future: add attachments and document numbers; support editing via transaction detail page using /api/transactions/{id}.
          </div>
        </Card>
      )}
    </div>
  );
}
