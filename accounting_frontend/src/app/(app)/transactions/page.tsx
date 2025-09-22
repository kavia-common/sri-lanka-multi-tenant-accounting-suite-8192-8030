"use client";

import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/client";
import type { AccountsResponse, Account, Transaction } from "@/types/api";
import { Button, Card, Input, Select } from "@/components/ui";

type EntryForm = {
  account_id: string;
  type: "DEBIT" | "CREDIT";
  amount: number | string;
  description?: string;
};

type TxnForm = {
  date: string;
  description: string;
  reference?: string;
  entries: EntryForm[];
};

function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function Page() {
  const qc = useQueryClient();
  const { data: accountsData } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => apiFetch<AccountsResponse>("/api/accounts"),
  });

  const accounts = accountsData?.data?.accounts ?? [];

  const { control, register, handleSubmit, watch, formState: { errors, isSubmitting }, reset } = useForm<TxnForm>({
    defaultValues: {
      date: todayStr(),
      description: "",
      reference: "",
      entries: [
        { account_id: "", type: "DEBIT", amount: "" },
        { account_id: "", type: "CREDIT", amount: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "entries" });

  const computeTotals = () => {
    const values = watch("entries") || [];
    let debit = 0;
    let creditTotal = 0;
    for (const e of values) {
      const amt = Number(e.amount || 0);
      if (!isFinite(amt)) continue;
      if (e.type === "DEBIT") debit += amt;
      else creditTotal += amt;
    }
    return { debit, credit: creditTotal, balanced: Math.abs(debit - creditTotal) < 1e-6 && debit > 0 };
  };

  const mutation = useMutation({
    mutationFn: (payload: Transaction) =>
      apiFetch("/api/transactions", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: async () => {
      await qc.invalidateQueries();
      reset({
        date: todayStr(),
        description: "",
        reference: "",
        entries: [
          { account_id: "", type: "DEBIT", amount: "" },
          { account_id: "", type: "CREDIT", amount: "" },
        ],
      });
    },
  });

  const onSubmit = (values: TxnForm) => {
    const { debit, balanced } = computeTotals();
    if (!balanced) {
      alert("Entries must be balanced (total debits = total credits) and greater than 0.");
      return;
    }
    const entries = values.entries.map((e) => ({
      account_id: e.account_id,
      debit_amount: e.type === "DEBIT" ? Number(e.amount) : 0,
      credit_amount: e.type === "CREDIT" ? Number(e.amount) : 0,
      description: e.description || undefined,
    }));
    const payload: Transaction = {
      date: values.date,
      description: values.description,
      reference: values.reference,
      entries,
      total_amount: debit,
    };
    mutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">New Transaction</h1>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-label="Transaction entry form">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm" htmlFor="date">Date</label>
              <Input id="date" type="date" aria-invalid={!!errors.date} {...register("date", { required: "Date is required" })} />
              {errors.date && <p role="alert" className="text-xs text-red-600 mt-1">{errors.date.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm" htmlFor="description">Description</label>
              <Input id="description" aria-invalid={!!errors.description} {...register("description", { required: "Description is required" })} />
              {errors.description && <p role="alert" className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
            </div>
            <div className="md:col-span-3">
              <label className="text-sm" htmlFor="reference">Reference</label>
              <Input id="reference" {...register("reference")} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-3">Account</th>
                  <th className="py-2 pr-3">Type</th>
                  <th className="py-2 pr-3">Amount</th>
                  <th className="py-2 pr-3">Description</th>
                  <th className="py-2 pr-3 sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((f, idx) => (
                  <tr key={f.id} className="border-t">
                    <td className="py-2 pr-3">
                      <Controller
                        control={control}
                        name={`entries.${idx}.account_id`}
                        rules={{ required: "Account is required" }}
                        render={({ field }) => (
                          <Select aria-label={`Entry ${idx + 1} account`} {...field}>
                            <option value="">Select account</option>
                            {accounts.map((a: Account) => (
                              <option key={a.id} value={a.id}>
                                {a.code} - {a.name}
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.entries?.[idx]?.account_id && (
                        <p role="alert" className="text-xs text-red-600 mt-1">
                          {errors.entries[idx]?.account_id?.message as string}
                        </p>
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      <Controller
                        control={control}
                        name={`entries.${idx}.type`}
                        render={({ field }) => (
                          <Select aria-label={`Entry ${idx + 1} type`} {...field}>
                            <option value="DEBIT">DEBIT</option>
                            <option value="CREDIT">CREDIT</option>
                          </Select>
                        )}
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <Input
                        type="number"
                        step="0.01"
                        aria-label={`Entry ${idx + 1} amount`}
                        {...register(`entries.${idx}.amount` as const, {
                          required: "Amount is required",
                          validate: (v) => Number(v) > 0 || "Amount must be greater than 0",
                        })}
                      />
                      {errors.entries?.[idx]?.amount && (
                        <p role="alert" className="text-xs text-red-600 mt-1">
                          {errors.entries[idx]?.amount?.message as string}
                        </p>
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      <Input aria-label={`Entry ${idx + 1} line description`} {...register(`entries.${idx}.description` as const)} />
                    </td>
                    <td className="py-2 pr-3">
                      <Button
                        type="button"
                        className="bg-red-600 hover:bg-red-700"
                        aria-label={`Remove entry ${idx + 1}`}
                        onClick={() => remove(idx)}
                        disabled={fields.length <= 2}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => append({ account_id: "", type: "DEBIT", amount: "" })}
              aria-label="Add entry row"
            >
              Add Line
            </Button>
          </div>

          <Totals computeTotals={computeTotals} />

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save Transaction"}
            </Button>
            {mutation.isError && (
              <span role="alert" className="text-sm text-red-600">
                {(mutation.error as Error).message}
              </span>
            )}
            {mutation.isSuccess && (
              <span role="status" className="text-sm text-green-700">Transaction saved.</span>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

function Totals({ computeTotals }: { computeTotals: () => { debit: number; credit: number; balanced: boolean } }) {
  const { debit, credit, balanced } = computeTotals();
  return (
    <div className="rounded-md bg-gray-50 border p-3 text-sm flex items-center gap-4" aria-live="polite">
      <div>Debits: <span className="font-medium">{debit.toFixed(2)}</span></div>
      <div>Credits: <span className="font-medium">{credit.toFixed(2)}</span></div>
      <div>Status: <span className={`font-medium ${balanced ? "text-green-700" : "text-red-700"}`}>{balanced ? "Balanced" : "Unbalanced"}</span></div>
    </div>
  );
}
