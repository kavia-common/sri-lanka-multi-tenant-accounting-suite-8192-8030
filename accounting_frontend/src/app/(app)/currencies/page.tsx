"use client";

import React, { useCallback } from "react";
import { EntityScaffold } from "../../../components/entity-scaffold";
import { useApi, useList } from "../../../lib/hooks";
import { Card } from "../../../components/ocean-theme";

export default function CurrenciesPage() {
  const { get, post } = useApi();

  // NOTE: Currencies tag exists in spec; endpoints not shown. Using conventional paths.
  const fetcher = useCallback(() => get<{ data?: { currencies?: Currency[] } } | { data?: Currency[] } | Currency[]>("/api/currencies"), [get]);
  type Currency = { id: string; code: string; name?: string; symbol?: string; is_base?: boolean };
  const { data, loading, error, setData } = useList<Currency>(
    fetcher,
    (res: unknown) => {
      const r = res as { data?: { currencies?: Currency[] } } | { data?: Currency[] } | Currency[] | undefined;
      // @ts-expect-error union narrowing to array
      return (r?.data?.currencies || r?.data || r || []) as Currency[];
    }
  );

  return (
    <div className="space-y-6">
      <Card title="Currencies" subtitle="Set allowed currencies per company." />
      <EntityScaffold
        list={{
          title: "Currency List",
          columns: [
            { key: "code", label: "Code" },
            { key: "name", label: "Name" },
            { key: "symbol", label: "Symbol" },
            { key: "is_base", label: "Base" },
          ],
        }}
        form={{
          title: "Add Currency",
          fields: [
            { key: "code", label: "Code (e.g., LKR, USD)", type: "text", required: true },
            { key: "name", label: "Name", type: "text", required: true },
            { key: "symbol", label: "Symbol", type: "text" },
          ],
        }}
        data={data}
        loading={loading}
        error={error}
        onCreate={async (values) => {
          await post("/api/currencies", values);
          const refreshed = await fetcher();
          setData(refreshed?.data?.currencies || refreshed?.data || []);
        }}
      />
      <div className="text-xs text-gray-500">
        Note: Add base currency switch and FX rates integration in a future iteration.
      </div>
    </div>
  );
}
