"use client";

import React from "react";

/**
 * Ocean Professional theme helpers: colors, card, button, input, table.
 * Keep minimal footprint and reuse across pages for consistency.
 */

// PUBLIC_INTERFACE
export const ocean = {
  colors: {
    primary: "#2563EB",
    primaryHover: "#1E40AF",
    secondary: "#F59E0B",
    surface: "#ffffff",
    bg: "#f9fafb",
    danger: "#EF4444",
    text: "#111827",
    muted: "#6B7280",
    border: "#E5E7EB",
    gradient: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(249,250,251,1))",
  },
  radius: {
    md: "10px",
    lg: "14px",
    full: "999px",
  },
  shadow: {
    sm: "0 1px 2px rgba(0,0,0,0.06)",
    md: "0 6px 20px rgba(0,0,0,0.08)",
  },
};

type CardProps = React.PropsWithChildren<{
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
}>;

// PUBLIC_INTERFACE
export function Card({ title, subtitle, right, className, children }: CardProps) {
  return (
    <div
      className={["bg-white rounded-xl border", className].filter(Boolean).join(" ")}
      style={{
        borderColor: ocean.colors.border,
        boxShadow: ocean.shadow.sm,
      }}
    >
      {(title || right || subtitle) && (
        <div
          style={{ borderBottom: `1px solid ${ocean.colors.border}` }}
          className="flex items-center justify-between px-4 md:px-6 py-4"
        >
          <div>
            {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {right && <div className="flex items-center gap-2">{right}</div>}
        </div>
      )}
      <div className="p-4 md:p-6">{children}</div>
    </div>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

// PUBLIC_INTERFACE
export function Button({
  variant = "primary",
  size = "md",
  className,
  iconLeft,
  iconRight,
  children,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm md:text-[0.95rem]",
  };
  const variants: Record<string, string> = {
    primary: `bg-[${ocean.colors.primary}] text-white hover:bg-[${ocean.colors.primaryHover}] focus:ring-[${ocean.colors.primary}]`,
    secondary:
      "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300 border border-gray-200",
    danger:
      "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };
  return (
    <button className={[base, sizes[size], variants[variant], className || ""].join(" ")} {...rest}>
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

// PUBLIC_INTERFACE
export function Input({ label, hint, error, className, ...rest }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={[
          "w-full rounded-lg border text-sm px-3 py-2",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500",
          error ? "border-red-300" : "border-gray-300",
          className || "",
        ].join(" ")}
        {...rest}
      />
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options?: Array<{ label: string; value: string }>;
};

// PUBLIC_INTERFACE
export function Select({ label, options = [], className, ...rest }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={[
          "w-full rounded-lg border text-sm px-3 py-2 bg-white",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500",
          "border-gray-300",
          className || "",
        ].join(" ")}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

// PUBLIC_INTERFACE
export function TextArea({ label, className, ...rest }: TextAreaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={[
          "w-full rounded-lg border text-sm px-3 py-2",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500",
          "border-gray-300",
          className || "",
        ].join(" ")}
        {...rest}
      />
    </div>
  );
}

type RowRecord = Record<string, React.ReactNode>;
type TableProps = {
  columns: Array<{ key: string; label: string; className?: string }>;
  data: RowRecord[];
  rowKey?: (row: RowRecord, idx: number) => string;
  emptyText?: string;
};

// PUBLIC_INTERFACE
export function DataTable({ columns, data, rowKey, emptyText = "No data found." }: TableProps) {
  return (
    <div className="overflow-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={["px-4 py-2 text-left text-xs font-semibold text-gray-600", c.className || ""].join(" ")}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-sm text-gray-500" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          )}
          {data.map((row: RowRecord, idx: number) => (
            <tr key={rowKey ? rowKey(row, idx) : String(idx)} className="hover:bg-gray-50">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-2 text-sm text-gray-800">
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
