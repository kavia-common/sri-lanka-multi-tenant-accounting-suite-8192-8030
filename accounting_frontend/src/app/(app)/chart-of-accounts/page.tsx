"use client";

import React, { useCallback } from "react";
import { EntityScaffold } from "../../../components/entity-scaffold";
import { useApi, useList } from "../../../lib/hooks";
import { Card } from "../../../components/ocean-theme";

const accountTypes = [
  { label: "Asset", value: "ASSET" },
  { label: "Liability", value: "LIABILITY" },
  { label: "Equity", value: "EQUITY" },
  { label: "Revenue", value: "REVENUE" },
  { label: "Expense", value: "EXPENSE" },
];

export default function ChartOfAccountsPage() {
  const { get, post } = useApi();

  const fetcher = useCallback(() => get<{ data?: { accounts?: Account[] } }>("/api/accounts"), [get]);
  type Account = { id: string; code: string; name: string; type: string; balance?: number };
  const { data, loading, error, setData } = useList<Account>(
    fetcher,
    (res) => res?.data?.accounts || []
  );

  return (
    <div className="space-y-6">
      <Card title="Chart of Accounts" subtitle="Manage accounts per company." />
      <EntityScaffold
        list={{
          title: "Accounts",
          columns: [
            { key: "code", label: "Code" },
            { key: "name", label: "Name" },
            { key: "type", label: "Type" },
            { key: "balance", label: "Balance" },
          ],
        }}
        form={{
          title: "Create Account",
          fields: [
            { key: "code", label: "Code", type: "text", required: true },
            { key: "name", label: "Name", type: "text", required: true },
            { key: "type", label: "Type", type: "select", options: accountTypes, required: true },
            { key: "description", label: "Description", type: "textarea" },
          ],
        }}
        data={data}
        loading={loading}
        error={error}
        onCreate={async (values) => {
          await post("/api/accounts", values);
          const refreshed = await fetcher();
          setData(refreshed?.data?.accounts || []);
        }}
      />
      <div className="text-xs text-gray-500">
        Notes: Editing restricted to name/description via PUT /api/accounts/:id in backend. Add drawer edit in future.
      </div>
    </div>
  );
}
