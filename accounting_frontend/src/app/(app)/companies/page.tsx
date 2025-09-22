"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/client";
import type { CompaniesResponse } from "@/types/api";
import { Button, Card, Input } from "@/components/ui";
import { useCompany } from "@/context/company";

type CompanyCreate = {
  name: string;
  code: string;
  email?: string;
  phone?: string;
};

export default function Page() {
  const qc = useQueryClient();
  const { setCompanies } = useCompany();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["companies"],
    queryFn: () => apiFetch<CompaniesResponse>("/api/companies"),
  });

  React.useEffect(() => {
    if (data?.data?.companies) setCompanies(data.data.companies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CompanyCreate>();

  const mutation = useMutation({
    mutationFn: (payload: CompanyCreate) => apiFetch("/api/companies", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["companies"] });
      reset({ name: "", code: "", email: "", phone: "" });
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Companies</h1>

      <Card>
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="grid grid-cols-1 md:grid-cols-4 gap-3" aria-label="Create company form">
          <div>
            <label className="text-sm">Name</label>
            <Input aria-invalid={!!errors.name} {...register("name", { required: "Name is required" })} />
            {errors.name && <p role="alert" className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm">Code</label>
            <Input aria-invalid={!!errors.code} {...register("code", { required: "Code is required", minLength: { value: 2, message: "Code must be at least 2 chars" } })} />
            {errors.code && <p role="alert" className="text-xs text-red-600 mt-1">{errors.code.message}</p>}
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input type="email" {...register("email")} />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <Input {...register("phone")} />
          </div>
          <div className="md:col-span-4">
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Creating..." : "Create Company"}</Button>
            {mutation.isError && <span role="alert" className="ml-2 text-sm text-red-600">{(mutation.error as Error).message}</span>}
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-medium mb-2">Your Companies</h2>
        {isLoading && <div role="status">Loading companies...</div>}
        {isError && <div role="alert" className="text-red-600">{(error as Error).message}</div>}
        <ul className="divide-y">
          {data?.data?.companies?.map((c) => (
            <li key={c.id} className="py-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.code}</div>
                </div>
                <div className="text-xs text-gray-600">{c.role}</div>
              </div>
            </li>
          ))}
          {data?.data?.companies?.length === 0 && <li className="py-2 text-gray-500">No companies found.</li>}
        </ul>
      </Card>
    </div>
  );
}
