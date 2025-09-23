"use client";

import React, { useCallback } from "react";
import { EntityScaffold } from "../../../components/entity-scaffold";
import { useApi, useList } from "../../../lib/hooks";
import { Card } from "../../../components/ocean-theme";

export default function CompaniesPage() {
  const { get, post } = useApi();

  const fetcher = useCallback(() => get<{ data?: { companies?: Company[] } }>("/api/companies"), [get]);
  type Company = { id: string; name: string; code: string; email?: string; phone?: string };
  const { data, loading, error, setData } = useList<Company>(
    fetcher,
    (res) => res?.data?.companies || []
  );

  return (
    <div className="space-y-6">
      <Card title="Companies" subtitle="Companies you have access to." />
      <EntityScaffold
        list={{
          title: "Company Directory",
          columns: [
            { key: "name", label: "Name" },
            { key: "code", label: "Code" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
          ],
        }}
        form={{
          title: "Create Company",
          fields: [
            { key: "name", label: "Name", type: "text", required: true },
            { key: "code", label: "Code", type: "text", required: true },
            { key: "email", label: "Email", type: "text" },
            { key: "phone", label: "Phone", type: "text" },
            { key: "address", label: "Address", type: "textarea" },
            { key: "tax_number", label: "Tax Number", type: "text" },
          ],
        }}
        data={data}
        loading={loading}
        error={error}
        onCreate={async (values) => {
          await post("/api/companies", values);
          const refreshed = await fetcher();
          setData(refreshed?.data?.companies || []);
        }}
      />
      <div className="text-xs text-gray-500">
        Future extensibility: add company-level settings pages (fiscal year, logo, localization).
      </div>
    </div>
  );
}
