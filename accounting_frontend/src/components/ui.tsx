"use client";
import React from "react";
import { OCEAN_PRO_THEME } from "@/lib/config";

export function cn(...classes: Array<string | boolean | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => (
  <div
    className={cn(
      "rounded-xl shadow-sm border border-gray-200 bg-white",
      "focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:outline-none",
      className
    )}
    style={{ background: OCEAN_PRO_THEME.surface }}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<React.PropsWithChildren<{ title?: string; subtitle?: string }>> = ({
  title,
  subtitle,
  children,
}) => (
  <div className="p-5 border-b border-gray-100">
    {title ? <h2 className="text-gray-900 text-lg font-medium">{title}</h2> : null}
    {subtitle ? <p className="text-gray-500 text-sm mt-1">{subtitle}</p> : null}
    {children}
  </div>
);

export const CardBody: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => (
  <div className={cn("p-5", className)}>{children}</div>
);

export const Button: React.FC<
  React.PropsWithChildren<{ variant?: "primary" | "secondary" | "ghost" | "danger"; className?: string; type?: "button" | "submit" | "reset"; onClick?: () => void; ariaLabel?: string; disabled?: boolean }>
> = ({ variant = "primary", className, children, type = "button", onClick, ariaLabel, disabled }) => {
  const base = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    secondary: "bg-amber-500/90 text-white hover:bg-amber-600 focus-visible:ring-amber-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-blue-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
  };
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={cn(base, variants[variant], className)}
    >
      {children}
    </button>
  );
};

export const TextInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string }>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    const inputId = id || `inp-${Math.random().toString(36).slice(2)}`;
    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        ) : null}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none",
            error ? "border-red-500 focus:ring-red-500/30" : "",
            className
          )}
          {...props}
        />
        {hint && !error ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
        {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
      </div>
    );
  }
);
TextInput.displayName = "TextInput";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; hint?: string; error?: string }>(
  ({ label, hint, error, className, id, children, ...props }, ref) => {
    const selectId = id || `sel-${Math.random().toString(36).slice(2)}`;
    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        ) : null}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none",
            error ? "border-red-500 focus:ring-red-500/30" : "",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {hint && !error ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
        {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
      </div>
    );
  }
);
Select.displayName = "Select";

export const Table: React.FC<React.PropsWithChildren<{ headers: string[]; caption?: string }>> = ({ headers, caption, children }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200" role="table">
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <thead className="bg-gray-50">
        <tr>
          {headers.map((h) => (
            <th key={h} scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">{children}</tbody>
    </table>
  </div>
);
