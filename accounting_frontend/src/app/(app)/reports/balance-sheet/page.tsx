"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/client";
import type { BalanceSheetResponse } from "@/types/api";
import { Card, Input, Button } from "@/components/ui";

export default function BalanceSheetPage() {
  const [asOf, setAsOf] = React.useState("");

  const query = useQuery({
    queryKey: ["reports", "balance-sheet", { asOf }],
    queryFn: () => apiFetch<BalanceSheetResponse>(`/api/reports/balance-sheet${asOf ? `?as_of_date=${asOf}` : ""}`),
  });

  function run(e: React.FormEvent) {
    e.preventDefault();
    void query.refetch();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Balance Sheet</h1>

      <Card title="Balance Sheet" subtitle="Assets = Liabilities + Equity">
        <form onSubmit={run} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm">As of Date</label>
            <Input type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button type="submit">Run</Button>
          </div>
        </form>

        {query.isLoading && <div role="status">Loading...</div>}
        {query.isError && <div role="alert" className="text-red-600">{(query.error as Error).message}</div>}
        {!query.isLoading && query.data?.data?.summary && (
          <div className="text-sm text-gray-700 space-y-1">
            <div>Total Assets: {query.data.data.summary.totalAssets}</div>
            <div>Total Liabilities: {query.data.data.summary.totalLiabilities}</div>
            <div>Total Equity: {query.data.data.summary.totalEquity}</div>
            <div>Balanced: {query.data.data.summary.isBalanced ? "Yes" : "No"}</div>
          </div>
        )}
      </Card>
    </div>
  );
}
