"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/client";
import type { TrialBalanceResponse, BalanceSheetResponse, ProfitLossResponse } from "@/types/api";
import { Card, Input, Button } from "@/components/ui";

export default function Page() {
  const [start, setStart] = React.useState("");
  const [end, setEnd] = React.useState("");

  const tb = useQuery({
    queryKey: ["reports", "trial-balance", { start, end }],
    queryFn: () =>
      apiFetch<TrialBalanceResponse>(`/api/reports/trial-balance${queryDates(start, end)}`),
  });

  const bs = useQuery({
    queryKey: ["reports", "balance-sheet", { end }],
    queryFn: () => apiFetch<BalanceSheetResponse>(`/api/reports/balance-sheet${end ? `?as_of_date=${end}` : ""}`),
  });

  const pl = useQuery({
    queryKey: ["reports", "profit-loss", { start, end }],
    queryFn: () =>
      apiFetch<ProfitLossResponse>(`/api/reports/profit-loss${queryDates(start, end, true)}`),
    enabled: !!start && !!end,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Reports</h1>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <label className="text-sm">Start date</label>
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">End date</label>
            <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          <div className="md:col-span-3 flex items-end">
            <Button type="button" onClick={() => { tb.refetch(); bs.refetch(); pl.refetch(); }}>
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-lg font-medium mb-2">Trial Balance</h2>
          {tb.isLoading && <div role="status">Loading...</div>}
          {tb.isError && <div role="alert" className="text-red-600">{(tb.error as Error).message}</div>}
          {!tb.isLoading && tb.data?.data?.trialBalance && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 pr-3">Code</th>
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Debits</th>
                    <th className="py-2 pr-3">Credits</th>
                    <th className="py-2 pr-3">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {tb.data.data.trialBalance.map((r, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-2 pr-3">{r.code}</td>
                      <td className="py-2 pr-3">{r.name}</td>
                      <td className="py-2 pr-3">{r.total_debits}</td>
                      <td className="py-2 pr-3">{r.total_credits}</td>
                      <td className="py-2 pr-3">{r.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-sm text-gray-600 mt-2">
                Balanced: {tb.data.data.summary.isBalanced ? "Yes" : "No"}
              </div>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-medium mb-2">Balance Sheet</h2>
          {bs.isLoading && <div role="status">Loading...</div>}
          {bs.isError && <div role="alert" className="text-red-600">{(bs.error as Error).message}</div>}
          {!bs.isLoading && bs.data?.data?.summary && (
            <div className="text-sm text-gray-700">
              <div>Total Assets: {bs.data.data.summary.totalAssets}</div>
              <div>Total Liabilities: {bs.data.data.summary.totalLiabilities}</div>
              <div>Total Equity: {bs.data.data.summary.totalEquity}</div>
              <div>Balanced: {bs.data.data.summary.isBalanced ? "Yes" : "No"}</div>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-medium mb-2">Profit & Loss</h2>
          {pl.isFetching && <div role="status">Loading...</div>}
          {pl.isError && <div role="alert" className="text-red-600">{(pl.error as Error).message}</div>}
          {!pl.isFetching && pl.data?.data?.summary && (
            <div className="text-sm text-gray-700">
              <div>Total Revenue: {pl.data.data.summary.totalRevenue}</div>
              <div>Total Expenses: {pl.data.data.summary.totalExpenses}</div>
              <div>Net Income: {pl.data.data.summary.netIncome}</div>
              <div>Margin: {pl.data.data.summary.netIncomePercent}</div>
            </div>
          )}
          {!start || !end ? <div className="text-xs text-gray-500 mt-2">Provide start and end dates to load P&L.</div> : null}
        </Card>
      </div>
    </div>
  );
}

function queryDates(start?: string, end?: string, requireBoth = false) {
  const params = new URLSearchParams();
  if (start) params.set("start_date", start);
  if (end) params.set("end_date", end);
  if (requireBoth && (!start || !end)) return "";
  const s = params.toString();
  return s ? `?${s}` : "";
}
