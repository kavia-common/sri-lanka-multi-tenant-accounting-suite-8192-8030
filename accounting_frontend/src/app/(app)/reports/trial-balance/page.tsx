"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/client";
import type { TrialBalanceResponse } from "@/types/api";
import { Card, Input, Button } from "@/components/ui";

export default function TrialBalancePage() {
  const [start, setStart] = React.useState("");
  const [end, setEnd] = React.useState("");

  const query = useQuery({
    queryKey: ["reports", "trial-balance", { start, end }],
    queryFn: () => apiFetch<TrialBalanceResponse>(`/api/reports/trial-balance${queryDates(start, end)}`),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Trial Balance</h1>

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
            <Button type="button" onClick={() => query.refetch()}>
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        {query.isLoading && <div role="status">Loading...</div>}
        {query.isError && <div role="alert" className="text-red-600">{(query.error as Error).message}</div>}
        {query.data?.data?.trialBalance && (
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
                {query.data.data.trialBalance.map((r, idx) => (
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
            <div className="text-sm text-gray-700 mt-2">
              Balanced: {query.data.data.summary.isBalanced ? "Yes" : "No"}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function queryDates(start?: string, end?: string) {
  const params = new URLSearchParams();
  if (start) params.set("start_date", start);
  if (end) params.set("end_date", end);
  const s = params.toString();
  return s ? `?${s}` : "";
}
