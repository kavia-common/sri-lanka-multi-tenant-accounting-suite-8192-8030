"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/client";
import { Button, Card, Input } from "@/components/ui";

type Vendor = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  tax_number?: string;
  address?: string;
  created_at?: string;
};
type VendorsResponse = { status: string; data: { vendors: Vendor[] } };
type CreatePayload = {
  name: string;
  email?: string;
  phone?: string;
  tax_number?: string;
  address?: string;
};

/**
 * PUBLIC_INTERFACE
 * Vendors management UI (list + create).
 */
export default function VendorsPage() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ["vendors"],
    queryFn: () => apiFetch<VendorsResponse>("/api/vendors"),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreatePayload>();

  const create = useMutation({
    mutationFn: (payload: CreatePayload) =>
      apiFetch("/api/vendors", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["vendors"] });
      reset({ name: "", email: "", phone: "", tax_number: "", address: "" });
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Vendors</h1>

      <Card title="Add Vendor" subtitle="Create a new vendor">
        <form
          onSubmit={handleSubmit((v) => create.mutate(v))}
          className="grid grid-cols-1 md:grid-cols-5 gap-3"
          aria-label="Create vendor form"
        >
          <Input
            aria-invalid={!!errors.name}
            {...register("name", { required: "Name is required" })}
            placeholder="Name"
          />
          <Input type="email" {...register("email")} placeholder="Email" />
          <Input {...register("phone")} placeholder="Phone" />
          <Input {...register("tax_number")} placeholder="Tax Number" />
          <Input className="md:col-span-2" {...register("address")} placeholder="Address" />
          <div className="md:col-span-5">
            <Button type="submit" disabled={isSubmitting || create.isPending}>
              {create.isPending ? "Creating..." : "Create"}
            </Button>
            {create.isError && (
              <span role="alert" className="ml-2 text-sm text-red-600">
                {(create.error as Error)?.message}
              </span>
            )}
          </div>
        </form>
      </Card>

      <Card title="Vendor List">
        {list.isLoading && <div role="status">Loading vendors...</div>}
        {list.isError && (
          <div role="alert" className="text-red-600">
            {(list.error as Error).message}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Phone</th>
                <th className="py-2 pr-3">Tax No.</th>
              </tr>
            </thead>
            <tbody>
              {list.data?.data?.vendors?.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="py-2 pr-3">{c.name}</td>
                  <td className="py-2 pr-3">{c.email || "—"}</td>
                  <td className="py-2 pr-3">{c.phone || "—"}</td>
                  <td className="py-2 pr-3">{c.tax_number || "—"}</td>
                </tr>
              ))}
              {!list.isLoading && (list.data?.data?.vendors?.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={4} className="py-3 text-gray-500">
                    No vendors yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
