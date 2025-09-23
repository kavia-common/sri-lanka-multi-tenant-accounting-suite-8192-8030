"use client";
import React, { useState } from "react";
import { Card, Button, Input } from "@/components/ui";
import { apiProfitLoss } from "@/lib/api";

type StatementRow = {
  name?: string;
  code?: string;
  amount?: string | number;
  total?: string | number;
  balance?: string | number;
};

export default function ProfitLossPage() {
  const [start, setStart] = useState<string>(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10));
  const [end, setEnd] = useState<string>(new Date().toISOString().slice(0, 10));
  const [data, setData] = useState<{ revenue: StatementRow[]; expenses: StatementRow[] } | null>(null);
  const [summary, setSummary] = useState<{ totalRevenue: string; totalExpenses: string; netIncome: string; netIncomePercent: string } | null>(null);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    const res = await apiProfitLoss({ start_date: start, end_date: end });
    setData(res.data?.profitLoss || null);
    setSummary(res.data?.summary || null);
  }

  return (
    <div className="space-y-6">
      <Card title="Profit & Loss" subtitle="Income statement for a date range">
        <form onSubmit={run} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-sm" htmlFor="pl-start">Start Date</label>
            <Input id="pl-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <label className="text-sm" htmlFor="pl-end">End Date</label>
            <Input id="pl-end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button type="submit">Run</Button>
          </div>
        </form>

        {data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section title="Revenue" items={data.revenue} />
            <Section title="Expenses" items={data.expenses} />
          </div>
        ) : (
          <p className="text-sm text-gray-500">Run the report to see results.</p>
        )}

        {summary && (
          <div className="mt-4 text-sm text-gray-700">
            <div>Total Revenue: <strong>{summary.totalRevenue}</strong></div>
            <div>Total Expenses: <strong>{summary.totalExpenses}</strong></div>
            <div>Net Income: <strong>{summary.netIncome}</strong></div>
            <div>Net Income %: <strong>{summary.netIncomePercent}</strong></div>
          </div>
        )}
      </Card>
    </div>
  );
}

function Section({ title, items }: { title: string; items: StatementRow[] }) {
  return (
    <Card title={title}>
      {items?.length ? (
        <div className="space-y-2">
          {items.map((row, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-gray-800">{row.name || row.code || "Item"}</span>
              <span className="text-gray-900 font-medium">{String(row.amount ?? row.total ?? row.balance ?? "—")}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No data</p>
      )}
    </Card>
  );
}
