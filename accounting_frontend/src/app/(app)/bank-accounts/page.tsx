"use client";

import React, { useCallback } from "react";
import { EntityScaffold } from "../../../components/entity-scaffold";
import { useApi, useList } from "../../../lib/hooks";
import { Card } from "../../../components/ocean-theme";

export default function BankAccountsPage() {
  const { get, post } = useApi();

  // NOTE: Backend paths for bank accounts are not exposed in provided OpenAPI.
  // Using conventional endpoints; adjust when backend confirms.
  const fetcher = useCallback(() => get<{ data?: { bankAccounts?: BankAccount[] } } | { data?: BankAccount[] } | BankAccount[]>("/api/bank-accounts"), [get]);
  type BankAccount = { id: string; name: string; number?: string; bank_name?: string; currency?: string };
  const { data, loading, error, setData } = useList<BankAccount>(
    fetcher,
    (res: unknown) => {
      const r = res as { data?: { bankAccounts?: BankAccount[] } } | { data?: BankAccount[] } | BankAccount[] | undefined;
      // normalize
      // @ts-expect-error narrow options
      return (r?.data?.bankAccounts || r?.data || r || []) as BankAccount[];
    }
  );

  return (
    <div className="space-y-6">
      <Card title="Bank Accounts" subtitle="Manage company bank accounts." />
      <EntityScaffold
        list={{
          title: "Accounts",
          columns: [
            { key: "name", label: "Name" },
            { key: "number", label: "Account No." },
            { key: "bank_name", label: "Bank" },
            { key: "currency", label: "Currency" },
          ],
        }}
        form={{
          title: "Add Bank Account",
          fields: [
            { key: "name", label: "Name", type: "text", required: true },
            { key: "number", label: "Account Number", type: "text", required: true },
            { key: "bank_name", label: "Bank Name", type: "text" },
            { key: "currency", label: "Currency Code", type: "text" },
          ],
        }}
        data={data}
        loading={loading}
        error={error}
        onCreate={async (values) => {
          await post("/api/bank-accounts", values);
          const refreshed = await fetcher();
          // Narrow union result to an array of BankAccount
          const items =
            Array.isArray(refreshed)
              ? refreshed
              : (refreshed as { data?: { bankAccounts?: BankAccount[] } })?.data?.bankAccounts ||
                (refreshed as { data?: BankAccount[] })?.data ||
                [];
          setData(items as BankAccount[]);
        }}
      />
      <div className="text-xs text-gray-500">
        Backend coverage note: Endpoints are assumed as /api/bank-accounts. Update if backend differs.
      </div>
    </div>
  );
}
