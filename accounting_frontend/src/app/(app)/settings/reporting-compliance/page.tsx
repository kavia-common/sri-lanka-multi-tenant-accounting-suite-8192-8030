"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, Button, Input } from "../../../../components/ocean-theme";
import { useApi } from "../../../../lib/hooks";

export default function ReportingComplianceSettingsPage() {
  const { get } = useApi();
  const [vatStart, setVatStart] = useState("");
  const [vatEnd, setVatEnd] = useState("");
  const [vatData, setVatData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <Card title="Reporting & Compliance" subtitle="Access and configure advanced reporting features.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/(app)/reports/balance-sheet">
            <div className="p-4 rounded-lg border hover:shadow-sm cursor-pointer">
              <div className="font-semibold">Balance Sheet</div>
              <div className="text-sm text-gray-600">As-of financial position</div>
            </div>
          </Link>
          <Link href="/(app)/reports/profit-loss">
            <div className="p-4 rounded-lg border hover:shadow-sm cursor-pointer">
              <div className="font-semibold">Profit & Loss</div>
              <div className="text-sm text-gray-600">Performance for a period</div>
            </div>
          </Link>
          <Link href="/(app)/reports/trial-balance">
            <div className="p-4 rounded-lg border hover:shadow-sm cursor-pointer">
              <div className="font-semibold">Trial Balance</div>
              <div className="text-sm text-gray-600">Debits vs credits check</div>
            </div>
          </Link>
        </div>
      </Card>

      <Card
        title="Sri Lanka VAT Return (Baseline)"
        subtitle="Generate VAT return using heuristic mapping; validate before filing."
        right={<Button onClick={async () => {
          setLoading(true);
          try {
            const params = new URLSearchParams();
            if (vatStart) params.append("period_start", vatStart);
            if (vatEnd) params.append("period_end", vatEnd);
            params.append("include_transactions", "true");
            const res = await get(`/api/reports/lk/vat-return?${params.toString()}`);
            setVatData(res?.data || res);
          } finally {
            setLoading(false);
          }
        }}>Generate</Button>}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Period Start" type="date" value={vatStart} onChange={(e) => setVatStart(e.target.value)} />
          <Input label="Period End" type="date" value={vatEnd} onChange={(e) => setVatEnd(e.target.value)} />
        </div>
        <div className="mt-4 text-sm text-gray-700">
          {loading && "Loading..."}
          {!loading && vatData && (
            <pre className="bg-gray-50 border rounded-lg p-3 overflow-auto text-xs">
{JSON.stringify(vatData, null, 2)}
            </pre>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-3">
          Compliance note: Proper tax mappings and document types should be configured; export to PDF supported by API.
        </div>
      </Card>
    </div>
  );
}
