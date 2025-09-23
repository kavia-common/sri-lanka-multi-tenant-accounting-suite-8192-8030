"use client";

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { apiFetch } from "@/lib/client";
import { Button, Card, Input, Select } from "@/components/ui";

type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  created_at?: string;
};
type UsersResponse = { status: string; data: { users: User[] } };
type InvitePayload = { email: string; role: string };

/**
 * PUBLIC_INTERFACE
 * Users management UI for a company (list + invite).
 */
export default function UsersPage() {
  const qc = useQueryClient();

  const users = useQuery({
    queryKey: ["users"],
    queryFn: () => apiFetch<UsersResponse>("/api/users"),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InvitePayload>({
    defaultValues: { role: "ACCOUNTANT" },
  });

  const invite = useMutation({
    mutationFn: (payload: InvitePayload) =>
      apiFetch("/api/users/invite", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["users"] });
      reset({ email: "", role: "ACCOUNTANT" });
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Users</h1>

      <Card title="Invite User" subtitle="Invite a user to your company">
        <form
          onSubmit={handleSubmit((v) => invite.mutate(v))}
          className="grid grid-cols-1 md:grid-cols-4 gap-3"
          aria-label="Invite user form"
        >
          <Input
            type="email"
            aria-invalid={!!errors.email}
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
          />
          <Select {...register("role", { required: true })}>
            {["OWNER", "ADMIN", "ACCOUNTANT", "VIEWER"].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
          <div className="md:col-span-2">
            <Button type="submit" disabled={isSubmitting || invite.isPending}>
              {invite.isPending ? "Sending..." : "Send Invite"}
            </Button>
            {invite.isError && (
              <span role="alert" className="ml-2 text-sm text-red-600">
                {(invite.error as Error)?.message}
              </span>
            )}
          </div>
        </form>
      </Card>

      <Card title="Users">
        {users.isLoading && <div role="status">Loading users...</div>}
        {users.isError && (
          <div role="alert" className="text-red-600">
            {(users.error as Error).message}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.data?.data?.users?.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="py-2 pr-3">{u.email}</td>
                  <td className="py-2 pr-3">
                    {(u.firstName || u.lastName) ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() : "—"}
                  </td>
                  <td className="py-2 pr-3">{u.role || "—"}</td>
                </tr>
              ))}
              {!users.isLoading && (users.data?.data?.users?.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={3} className="py-3 text-gray-500">
                    No users found.
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
