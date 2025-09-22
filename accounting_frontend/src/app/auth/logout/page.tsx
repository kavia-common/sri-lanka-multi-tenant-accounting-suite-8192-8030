"use client";
import { useEffect } from "react";
import { clearAuth } from "@/lib/api";

export default function LogoutPage() {
  useEffect(() => {
    clearAuth();
    window.location.replace("/auth/login");
  }, []);
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-amber-400 mx-auto mb-4 animate-pulse" />
        <h1 className="text-2xl font-semibold text-gray-900">Signing you out…</h1>
      </div>
    </main>
  );
}
