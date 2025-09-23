"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { getAuth, setAuth, clearAuth } from "@/lib/auth";
import { Button, cn } from "@/components/ui";
import { OCEAN_PRO_THEME } from "@/lib/config";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/users", label: "Users" },
  { href: "/companies", label: "Companies" },
  { href: "/chart-of-accounts", label: "Chart of Accounts" },
  { href: "/journals", label: "Journals" },
  { href: "/masters/customers", label: "Customers" },
  { href: "/masters/vendors", label: "Vendors" },
  { href: "/masters/bank-accounts", label: "Bank Accounts" },
  { href: "/masters/tax-rates", label: "Tax Rates (SL VAT/NBT)" },
  { href: "/reports/trial-balance", label: "Trial Balance" },
  { href: "/reports/account-statement", label: "Account Statement" },
];

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [tenantId, setTenantId] = React.useState<string>("");
  const [companyId, setCompanyId] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [roles, setRoles] = React.useState<string[] | undefined>(undefined);

  React.useEffect(() => {
    const auth = getAuth();
    setTenantId(auth.tenantId || "");
    setCompanyId(auth.companyId || "");
    setEmail(auth.email || "");
    setRoles(auth.roles || []);
  }, []);

  function updateAuth(k: "tenantId" | "companyId", v: string) {
    const curr = getAuth();
    setAuth({ ...curr, [k]: v });
    if (k === "tenantId") setTenantId(v);
    if (k === "companyId") setCompanyId(v);
  }

  function onLogout() {
    clearAuth();
    router.replace("/");
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: OCEAN_PRO_THEME.background }}
    >
      <div className="flex">
        <aside className="hidden md:flex w-64 flex-col gap-2 border-r border-gray-200 bg-white p-4">
          <div className="mb-2">
            <Link href="/" className="text-lg font-semibold" style={{ color: OCEAN_PRO_THEME.primary }}>
              OceanBooks
            </Link>
            <p className="text-xs text-gray-500">Sri Lanka Accounting Suite</p>
          </div>
          <nav className="mt-2 flex-1">
            <ul className="space-y-1">
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm transition-colors",
                        active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                      )}
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-auto space-y-2">
            <div className="text-xs text-gray-500 flex items-center gap-2">
              {email ? <>Signed in as <span className="font-medium text-gray-700">{email}</span></> : "Not signed in"}
              {roles && roles.length ? (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">{roles.join(", ")}</span>
              ) : null}
            </div>
            <Button variant="ghost" className="w-full" onClick={onLogout} ariaLabel="Logout">
              Logout
            </Button>
          </div>
        </aside>
        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-10 border-b border-gray-200" style={{ background: OCEAN_PRO_THEME.surface }}>
            <div className="w-full" style={{ background: OCEAN_PRO_THEME.gradient }}>
              <div className="flex items-center gap-3 px-4 py-3">
                <button
                  className="md:hidden rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
                  aria-label="Open navigation"
                  onClick={() => alert("Mobile navigation not implemented in demo")}
                >
                  ☰
                </button>
                <div className="flex-1" />
                <div className="flex items-center gap-3">
                  <input
                    aria-label="Tenant ID"
                    className="w-36 rounded-lg border border-gray-300 px-2 py-1 text-sm"
                    placeholder="Tenant ID"
                    value={tenantId}
                    onChange={(e) => updateAuth("tenantId", e.target.value)}
                  />
                  <input
                    aria-label="Company ID"
                    className="w-36 rounded-lg border border-gray-300 px-2 py-1 text-sm"
                    placeholder="Company ID"
                    value={companyId}
                    onChange={(e) => updateAuth("companyId", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </header>
          <div className="p-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
