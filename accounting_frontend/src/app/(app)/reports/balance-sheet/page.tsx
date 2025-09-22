"use client";
import React, { useState } from "react";
import { Card, Button, Input } from "@/components/ui";
import { apiBalanceSheet } from "@/lib/api";

type BalanceSheetItem = {
  name?: string;
  code?: string;
  amount?: string | number;
  total?: string | number;
  balance?: string | number;
};

type BalanceSheetData = {
  assets: BalanceSheetItem[];
  liabilities: BalanceSheetItem[];
  equity: BalanceSheetItem[];
};

export default function BalanceSheetPage() {
  const [asOf, setAsOf] = useState<string>(new Date().toISOString().slice(0, 10));
  const [data, setData] = useState<BalanceSheetData | null>(null);
  const [summary, setSummary] = useState<{ totalAssets: string; totalLiabilities: string; totalEquity: string; isBalanced: boolean } | null>(null);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    const res = await apiBalanceSheet({ as_of_date: asOf });
    setData(res.data?.balanceSheet || null);
    setSummary(res.data?.summary || null);
  }

  return (
    <div className="space-y-6">
      <Card title="Balance Sheet" subtitle="Assets = Liabilities + Equity">
        <form onSubmit={run} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input label="As of Date" type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} />
          <div className="flex items-end">
            <Button type="submit">Run</Button>
          </div>
        </form>

        {data ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card title="Assets">
              <SimpleList data={data.assets} />
            </Card>
            <Card title="Liabilities">
              <SimpleList data={data.liabilities} />
            </Card>
            <Card title="Equity">
              <SimpleList data={data.equity} />
            </Card>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Run the report to see results.</p>
        )}

        {summary && (
          <div className="mt-4 text-sm text-gray-700">
            <div>Total Assets: <strong>{summary.totalAssets}</strong></div>
            <div>Total Liabilities: <strong>{summary.totalLiabilities}</strong></div>
            <div>Total Equity: <strong>{summary.totalEquity}</strong></div>
            <div>Status: <strong>{summary.isBalanced ? "Balanced" : "Not Balanced"}</strong></div>
          </div>
        )}
      </Card>
    </div>
  );
}

function SimpleList({ data }: { data: BalanceSheetItem[] }) {
  if (!data?.length) return <p className="text-sm text-gray-500">No data</p>;
  return (
    <div className="space-y-2">
      {data.map((row, idx) => (
        <div key={idx} className="flex items-center justify-between text-sm">
          <span className="text-gray-800">{row.name || row.code || "Item"}</span>
          <span className="text-gray-900 font-medium">{String(row.amount ?? row.total ?? row.balance ?? "—")}</span>
        </div>
      ))}
    </div>
  );
}
