"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const colors = {
  primary: "#2563EB", // blue-600
  secondary: "#F59E0B", // amber-500
  error: "#EF4444",
  bg: "#f9fafb",
  surface: "#ffffff",
  text: "#111827",
};

// PUBLIC_INTERFACE
export function AppShell({ children }: { children: React.ReactNode }) {
  /** Base Shell with sidebar and top bar */
  return (
    <div className="min-h-screen flex bg-[--bg] text-[--text]">
      <aside className="w-64 hidden md:flex flex-col border-r border-gray-200 bg-[--surface]">
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-amber-400 mr-3" />
          <div>
            <div className="text-base font-semibold text-gray-900">OceanBooks</div>
            <div className="text-xs text-gray-500">Multi-tenant Accounting</div>
          </div>
        </div>
        <NavMenu />
      </aside>
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="p-4 md:p-6 bg-[--bg] flex-1">{children}</main>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <div className="h-16 bg-[--surface] border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
      <div className="md:hidden flex items-center">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-amber-400 mr-2" />
        <span className="font-semibold text-gray-900">OceanBooks</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <Link href="/settings" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Settings</Link>
        <Link href="/auth/logout" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">Logout</Link>
      </div>
    </div>
  );
}

const routes = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/companies", label: "Companies" },
  { href: "/accounts", label: "Chart of Accounts" },
  { href: "/transactions", label: "Transactions" },
  { href: "/reports", label: "Reports" },
];

function NavMenu() {
  const pathname = usePathname();
  return (
    <nav className="flex-1 p-2">
      {routes.map((r) => {
        const active = pathname?.startsWith(r.href);
        return (
          <Link
            key={r.href}
            href={r.href}
            className={classNames(
              "block px-3 py-2 rounded-md text-sm mb-1 transition-colors",
              active
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            {r.label}
          </Link>
        );
      })}
    </nav>
  );
}

// PUBLIC_INTERFACE
export function Card({ title, subtitle, children, actions }: { title?: string; subtitle?: string; actions?: React.ReactNode; children: React.ReactNode; }) {
  /** Surface card with optional header */
  return (
    <section className="bg-[--surface] rounded-xl shadow-sm ring-1 ring-gray-100/70">
      {(title || subtitle || actions) && (
        <header className="px-4 md:px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="p-4 md:p-5">{children}</div>
    </section>
  );
}

// PUBLIC_INTERFACE
export function Button({ children, variant = "primary", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  /** Styled button */
  const base = "inline-flex items-center justify-center rounded-md px-3.5 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-400",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
  }[variant];
  return (
    <button className={classNames(base, styles)} {...rest}>
      {children}
    </button>
  );
}

// PUBLIC_INTERFACE
export function Input({ label, error, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  /** Text input with label and error */
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-700">{label}</label>}
      <input
        className={classNames(
          "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow",
          error && "ring-2 ring-red-500"
        )}
        {...rest}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

// PUBLIC_INTERFACE
export function Select({ label, options, error, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string; options: { label: string; value: string }[] }) {
  /** Select input */
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-700">{label}</label>}
      <select
        className={classNames(
          "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow",
          error && "ring-2 ring-red-500"
        )}
        {...rest}
      >
        {options.map((o) => (
          <option value={o.value} key={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

// PUBLIC_INTERFACE
export function Table<T>({ columns, rows, keySelector }: { columns: Array<{ header: string; cell: (row: T) => React.ReactNode; className?: string }>; rows: T[]; keySelector: (row: T, idx: number) => string; }) {
  /** Simple table */
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            {columns.map((c, i) => (
              <th key={i} className={classNames("text-left px-3 py-2 font-medium", c.className)}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r, idx) => (
            <tr key={keySelector(r, idx)} className="hover:bg-gray-50/70">
              {columns.map((c, i) => (
                <td key={i} className={classNames("px-3 py-2 text-gray-800", c.className)}>
                  {c.cell(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// PUBLIC_INTERFACE
export function Badge({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "success" | "warning" | "danger" }) {
  /** Colored badge */
  const map = {
    info: "bg-blue-50 text-blue-700 ring-blue-200",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warning: "bg-amber-50 text-amber-700 ring-amber-200",
    danger: "bg-red-50 text-red-700 ring-red-200",
  }[tone];
  return <span className={classNames("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ring-1", map)}>{children}</span>;
}
