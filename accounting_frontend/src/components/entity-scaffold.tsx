"use client";

import React, { useMemo, useState } from "react";
import { Button, Card, Input, Select, TextArea, DataTable } from "./ocean-theme";

type Field =
  | { key: string; label: string; type: "text"; placeholder?: string; required?: boolean }
  | { key: string; label: string; type: "textarea"; placeholder?: string; required?: boolean }
  | { key: string; label: string; type: "select"; options: Array<{ label: string; value: string }>; required?: boolean };

type ListConfig = {
  title: string;
  columns: Array<{ key: string; label: string }>;
};

type FormConfig = {
  title: string;
  fields: Field[];
  submitLabel?: string;
};

type Props<T extends Record<string, unknown> = Record<string, unknown>> = {
  list: ListConfig;
  form?: FormConfig;
  data: T[];
  onCreate?: (values: Record<string, unknown>) => Promise<void>;
  loading?: boolean;
  error?: string | null;
};

// PUBLIC_INTERFACE
export function EntityScaffold<T extends Record<string, unknown> = Record<string, unknown>>({
  list,
  form,
  data,
  onCreate,
  loading,
  error,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, unknown>>({});

  const columns = useMemo(
    () => list.columns.map((c) => ({ key: c.key, label: c.label })),
    [list.columns]
  );

  return (
    <div className="space-y-6">
      <Card
        title={list.title}
        right={
          form && (
            <Button onClick={() => setOpen(true)} variant="primary">
              + Create
            </Button>
          )
        }
        subtitle={loading ? "Loading..." : error ? `Error: ${error}` : undefined}
      >
        <DataTable
          columns={columns}
          data={data as unknown as Record<string, React.ReactNode>[]}
          rowKey={(r, i) => {
            const id = (r as Record<string, unknown>)["id"];
            const code = (r as Record<string, unknown>)["code"];
            if (typeof id === "string") return id;
            if (typeof code === "string") return code;
            return String(i);
          }}
        />
      </Card>

      {form && open && (
        <Card title={form.title} right={<Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.fields.map((f) => {
              if (f.type === "text") {
                return (
                  <Input
                    key={f.key}
                    label={f.label}
                    placeholder={f.placeholder}
                    required={f.required}
                    value={(values[f.key] as string) || ""}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  />
                );
              }
              if (f.type === "textarea") {
                return (
                  <div key={f.key} className="md:col-span-2">
                    <TextArea
                      label={f.label}
                      placeholder={f.placeholder}
                      value={(values[f.key] as string) || ""}
                      onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    />
                  </div>
                );
              }
              if (f.type === "select") {
                return (
                  <Select
                    key={f.key}
                    label={f.label}
                    value={(values[f.key] as string) || ""}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    options={f.options}
                  />
                );
              }
              return null;
            })}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!onCreate) return;
                await onCreate(values);
                setValues({});
                setOpen(false);
              }}
            >
              {form.submitLabel || "Save"}
            </Button>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Note: Basic create form. For advanced workflows (validation, async selects, etc.), extend this scaffold.
          </div>
        </Card>
      )}
    </div>
  );
}
