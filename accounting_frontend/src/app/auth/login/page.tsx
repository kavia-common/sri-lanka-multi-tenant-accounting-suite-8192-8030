"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button, Card, Input } from "@/components/ui";
import { apiFetch } from "@/lib/client";
import type { LoginResponse } from "@/types/api";
import { useRouter } from "next/navigation";
import { useCompany } from "@/context/company";

type LoginForm = { email: string; password: string };

export default function Page() {
  const { setCompanies, setCompany } = useCompany();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();

  const onSubmit = async (values: LoginForm) => {
    try {
      const data = await apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const token = data.data.token;
      localStorage.setItem("token", token);
      setCompanies(data.data.companies);
      if (data.data.companies.length > 0) {
        setCompany(data.data.companies[0]);
      }
      router.replace("/dashboard");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed";
      alert(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <Card>
        <h1 className="text-lg font-semibold mb-3">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" aria-label="Login form">
          <div>
            <label className="text-sm">Email</label>
            <Input type="email" aria-invalid={!!errors.email} {...register("email", { required: "Email is required" })} />
            {errors.email && <p role="alert" className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm">Password</label>
            <Input type="password" aria-invalid={!!errors.password} {...register("password", { required: "Password is required" })} />
            {errors.password && <p role="alert" className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Sign in"}</Button>
        </form>
      </Card>
    </div>
  );
}
