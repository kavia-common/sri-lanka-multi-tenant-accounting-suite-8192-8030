"use client";

import React from "react";
import { useCompany } from "@/context/company";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/client";
import type { CompaniesResponse } from "@/types/api";

/**
 * PUBLIC_INTERFACE
 * Company selector dropdown that loads companies and updates the company context and localStorage.
 */
export default function CompanySelector() {
  const { company, setCompany, setCompanies, companies } = useCompany();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["companies"],
    queryFn: () => apiFetch<CompaniesResponse>("/api/companies"),
    staleTime: 60_000,
  });

  React.useEffect(() => {
    if (data?.data?.companies) {
      setCompanies(data.data.companies);
      // Initialize if none selected but have companies
      if (!company && data.data.companies.length > 0) {
        setCompany(data.data.companies[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const selected = companies.find((c) => c.id === id) || null;
    setCompany(selected);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="company" className="sr-only">
        Select company
      </label>
      <select
        id="company"
        aria-label="Select company"
        className="min-w-[220px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
        value={company?.id || ""}
        disabled={isLoading}
      >
        {isLoading && <option>Loading companies...</option>}
        {!isLoading && companies.length === 0 && <option>No companies</option>}
        {!isLoading &&
          companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.code ? `(${c.code})` : ""}
            </option>
          ))}
      </select>
      {isError && (
        <span role="alert" className="text-xs text-red-600">
          {(error as Error)?.message || "Failed to load companies"}
        </span>
      )}
    </div>
  );
}
