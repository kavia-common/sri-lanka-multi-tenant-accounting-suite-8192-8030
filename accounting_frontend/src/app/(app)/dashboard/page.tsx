"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/client";
import type { BalanceSheetResponse, ProfitLossResponse, TrialBalanceResponse } from "@/types/api";
import { Card } from "@/components/ui";

export default function Page() {
  const { data: tb, isLoading: tbLoading, isError: tbError } = useQuery({
    queryKey: ["reports", "trial-balance", { range: "all" }],
    queryFn: () => apiFetch<TrialBalanceResponse>("/api/reports/trial-balance"),
  });

  const { data: pl, isLoading: plLoading, isError: plError } = useQuery({
    queryKey: ["reports", "profit-loss", { range: "month" }],
    queryFn: () =>
      apiFetch<ProfitLossResponse>("/api/reports/profit-loss?start_date=2025-01-01&end_date=2025-12-31"),
  });

  const { data: bs, isLoading: bsLoading, isError: bsError } = useQuery({
    queryKey: ["reports", "balance-sheet", { asOf: "today" }],
    queryFn: () => apiFetch<BalanceSheetResponse>("/api/reports/balance-sheet"),
  });

  const loading = tbLoading || plLoading || bsLoading;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      {loading && <div role="status">Loading reports...</div>}
      {(tbError || plError || bsError) && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
          One or more widgets failed to load.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h2 className="text-sm text-gray-500">Trial Balance</h2>
          <p className="mt-1 text-2xl font-bold">
            {tb?.data?.summary
              ? tb.data.summary.isBalanced
                ? "Balanced"
                : "Unbalanced"
              : "--"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Debits {tb?.data?.summary?.totalDebits ?? "--"} / Credits {tb?.data?.summary?.totalCredits ?? "--"}
          </p>
        </Card>
        <Card>
          <h2 className="text-sm text-gray-500">Net Income</h2>
          <p className="mt-1 text-2xl font-bold">{pl?.data?.summary?.netIncome ?? "--"}</p>
          <p className="text-xs text-gray-500 mt-1">
            Margin {pl?.data?.summary?.netIncomePercent ?? "--"}
          </p>
        </Card>
        <Card>
          <h2 className="text-sm text-gray-500">Balance Sheet</h2>
          <p className="mt-1 text-2xl font-bold">
            {bs?.data?.summary?.isBalanced ? "Assets = Liabilities + Equity" : "Out of balance"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Assets {bs?.data?.summary?.totalAssets ?? "--"}
          </p>
        </Card>
      </div>
    </div>
  );
}
