"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/client";
import type { Account, AccountsResponse, AccountType } from "@/types/api";
import { Button, Card, Input, Select, Textarea } from "@/components/ui";

type CreateAccountForm = {
  code: string;
  name: string;
  type: AccountType;
  description?: string;
  parent_account_id?: string | null;
};

export default function Page() {
  const qc = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => apiFetch<AccountsResponse>("/api/accounts"),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateAccountForm>({
    defaultValues: { type: "ASSET" },
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateAccountForm) =>
      apiFetch("/api/accounts", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["accounts"] });
      reset({ code: "", name: "", type: "ASSET", description: "" });
    },
  });

  const onSubmit = (values: CreateAccountForm) => createMutation.mutate(values);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Chart of Accounts</h1>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-5 gap-3" aria-label="Create account form">
          <div>
            <label className="text-sm">Code</label>
            <Input aria-invalid={!!errors.code} {...register("code", { required: "Code is required" })} />
            {errors.code && <p role="alert" className="text-xs text-red-600 mt-1">{errors.code.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="text-sm">Name</label>
            <Input aria-invalid={!!errors.name} {...register("name", { required: "Name is required" })} />
            {errors.name && <p role="alert" className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm">Type</label>
            <Select {...register("type", { required: true })} aria-label="Account type">
              {["ASSET","LIABILITY","EQUITY","REVENUE","EXPENSE"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-sm">Parent</label>
            <Select {...register("parent_account_id")} aria-label="Parent account">
              <option value="">None</option>
              {data?.data?.accounts?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.code} - {a.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-5">
            <label className="text-sm">Description</label>
            <Textarea rows={2} {...register("description")} />
          </div>
          <div className="md:col-span-5 flex items-center gap-2">
            <Button type="submit" disabled={isSubmitting || createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Account"}
            </Button>
            {createMutation.isError && (
              <span role="alert" className="text-sm text-red-600">
                {(createMutation.error as Error)?.message}
              </span>
            )}
            {createMutation.isSuccess && (
              <span role="status" className="text-sm text-green-700">Account created.</span>
            )}
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-medium mb-3">Accounts</h2>
        {isLoading && <div role="status">Loading accounts...</div>}
        {isError && <div role="alert" className="text-red-600">{(error as Error)?.message}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-4">Code</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Balance</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.accounts?.map((a: Account) => (
                <tr key={a.id} className="border-t">
                  <td className="py-2 pr-4">{a.code}</td>
                  <td className="py-2 pr-4">{a.name}</td>
                  <td className="py-2 pr-4">{a.type}</td>
                  <td className="py-2 pr-4">{a.balance ?? "-"}</td>
                </tr>
              ))}
              {data?.data?.accounts?.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-3 text-gray-500">
                    No accounts found.
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
