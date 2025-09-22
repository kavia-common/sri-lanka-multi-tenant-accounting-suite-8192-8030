"use client";
import React, { useState } from "react";
import { Card, Table, Button, Input, Badge } from "@/components/ui";
import { apiTrialBalance } from "@/lib/api";
import { TrialBalanceRow } from "@/types";

export default function TrialBalancePage() {
  const [rows, setRows] = useState<TrialBalanceRow[]>([]);
  const [summary, setSummary] = useState<{ totalDebits: string; totalCredits: string; isBalanced: boolean } | null>(null);

  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");

  async function run(e: React.FormEvent) {
    e.preventDefault();
    const res = await apiTrialBalance({ start_date: start || undefined, end_date: end || undefined });
    setRows(res.data?.trialBalance || []);
    setSummary(res.data?.summary || null);
  }

  return (
    <div className="space-y-6">
      <Card title="Trial Balance" subtitle="Ensure debits equal credits">
        <form onSubmit={run} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input label="Start Date" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          <Input label="End Date" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          <div className="flex items-end">
            <Button type="submit">Run</Button>
          </div>
        </form>
        <Table
          columns={[
            { header: "Code", cell: (r: TrialBalanceRow) => r.code },
            { header: "Name", cell: (r: TrialBalanceRow) => r.name },
            { header: "Type", cell: (r: TrialBalanceRow) => r.type },
            { header: "Debits", cell: (r: TrialBalanceRow) => r.total_debits, className: "text-right" },
            { header: "Credits", cell: (r: TrialBalanceRow) => r.total_credits, className: "text-right" },
            { header: "Balance", cell: (r: TrialBalanceRow) => r.balance, className: "text-right" },
          ]}
          rows={rows}
          keySelector={(r, i) => `${r.code}-${i}`}
        />
        {summary && (
          <div className="mt-4 flex items-center gap-3">
            <Badge tone={summary.isBalanced ? "success" : "danger"}>{summary.isBalanced ? "Balanced" : "Not Balanced"}</Badge>
            <div className="text-sm text-gray-700">
              <span className="mr-4">Total Debits: <strong>{summary.totalDebits}</strong></span>
              <span>Total Credits: <strong>{summary.totalCredits}</strong></span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
