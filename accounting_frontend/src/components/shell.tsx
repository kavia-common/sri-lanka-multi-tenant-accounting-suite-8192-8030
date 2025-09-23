"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CompanySelector from "@/components/company-selector";
import React from "react";

type NavItem = { href: string; label: string; icon?: React.ReactNode };

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Accounting",
    items: [
      { href: "/(app)/transactions", label: "Journal" },
      { href: "/(app)/accounts", label: "Chart of Accounts" },
      { href: "/(app)/reports", label: "Reports" },
    ],
  },
  {
    title: "Masters",
    items: [
      { href: "/(app)/customers", label: "Customers" },
      { href: "/(app)/vendors", label: "Vendors" },
    ],
  },
  {
    title: "Organization",
    items: [
      { href: "/(app)/companies", label: "Companies" },
      { href: "/(app)/users", label: "Users" },
    ],
  },
];

function classNames(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/**
 * PUBLIC_INTERFACE
 * AppShell with sidebar + top bar matching Ocean Professional style.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[--bg] text-[--text]">
      <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <button
            aria-label="Toggle menu"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/10 to-amber-400/10 ring-1 ring-blue-200 text-blue-700"
            onClick={() => setOpen((s) => !s)}
          >
            ☰
          </button>
          <Link href="/" className="font-semibold text-[#2563EB]">
            Accounting
          </Link>
          <div className="ml-auto">
            <CompanySelector />
          </div>
          <Link
            href="/auth/logout"
            className="ml-2 text-xs text-gray-600 hover:text-red-600"
            aria-label="Sign out"
          >
            Sign out
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 px-4 py-6">
        <aside
          className={classNames(
            "rounded-xl bg-white ring-1 ring-gray-100/70 shadow-sm h-max p-3",
            open ? "" : "hidden md:block"
          )}
        >
          {navGroups.map((group) => (
            <nav key={group.title} className="mb-4">
              <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {group.title}
              </div>
              <ul className="mt-1 space-y-1">
                {group.items.map((it) => {
                  const active = pathname === it.href;
                  return (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        className={classNames(
                          "block rounded-md px-3 py-2 text-sm transition",
                          active
                            ? "bg-gradient-to-r from-blue-500/10 to-amber-400/10 text-blue-700 ring-1 ring-blue-200"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        {it.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </aside>
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
