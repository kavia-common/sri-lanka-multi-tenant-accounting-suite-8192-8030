"use client";

import React, { useCallback } from "react";
import { EntityScaffold } from "../../../components/entity-scaffold";
import { useApi, useList } from "../../../lib/hooks";
import { Card } from "../../../components/ocean-theme";

export default function TaxRatesPage() {
  const { get, post } = useApi();

  // NOTE: OpenAPI lists "Tax Rates" tag but no explicit routes. Assume standard REST paths.
  const fetcher = useCallback(() => get<{ data?: { taxRates?: TaxRate[] } } | { data?: TaxRate[] } | TaxRate[]>("/api/tax-rates"), [get]);
  type TaxRate = { id: string; name: string; code?: string; type?: string; rate?: number; description?: string };
  const { data, loading, error, setData } = useList<TaxRate>(
    fetcher,
    (res: unknown) => {
      const r = res as { data?: { taxRates?: TaxRate[] } } | { data?: TaxRate[] } | TaxRate[] | undefined;
      // @ts-expect-error union narrowing to array
      return (r?.data?.taxRates || r?.data || r || []) as TaxRate[];
    }
  );

  return (
    <div className="space-y-6">
      <Card title="Tax Rates" subtitle="Configure VAT/NBT/WHT per company." />
      <EntityScaffold
        list={{
          title: "Configured Tax Rates",
          columns: [
            { key: "name", label: "Name" },
            { key: "code", label: "Code" },
            { key: "type", label: "Type" },
            { key: "rate", label: "Rate %" },
          ],
        }}
        form={{
          title: "Add Tax Rate",
          fields: [
            { key: "name", label: "Name", type: "text", required: true },
            { key: "code", label: "Code", type: "text", required: true },
            { key: "type", label: "Type", type: "text" },
            { key: "rate", label: "Rate (%)", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
          ],
        }}
        data={data}
        loading={loading}
        error={error}
        onCreate={async (values) => {
          await post("/api/tax-rates", values);
          const refreshed = await fetcher();
          setData(refreshed?.data?.taxRates || refreshed?.data || []);
        }}
      />
      <div className="text-xs text-gray-500">
        Backend coverage note: Replace with exact routes when available; add tax mapping to accounts for compliance reports.
      </div>
    </div>
  );
}
