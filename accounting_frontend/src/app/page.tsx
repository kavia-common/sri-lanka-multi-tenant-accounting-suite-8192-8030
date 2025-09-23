"use client";
import React from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Card, CardBody, CardHeader, Button, Table } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { getAuth } from "@/lib/auth";

export default function Home() {
  const [health, setHealth] = React.useState<string>("...");
  const auth = getAuth();

  const ranRef = React.useRef(false);
  React.useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    apiFetch<{ status: string; message: string; timestamp: string; environment: string }>("/", {
      tenantId: auth.tenantId,
      companyId: auth.companyId,
      token: auth.token,
    }).then((res) => {
      if (res.ok) {
        setHealth(res.data.message);
      } else {
        setHealth(res.error || "Backend not reachable");
      }
    });
  }, [auth.companyId, auth.tenantId, auth.token]);

  const showLoginHint = !auth?.token;

  return (
    <SidebarLayout>
      {showLoginHint ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You are not authenticated. Go to <a className="underline" href="/login">Login</a> to set your token, tenant, and company.
        </div>
      ) : null}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader title="Welcome" subtitle="Ocean Professional Dashboard" />
          <CardBody>
            <p className="text-gray-700">
              Backend status: <span className="font-medium text-blue-700">{health}</span>
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="primary">New Journal</Button>
              <Button variant="secondary">Add Customer</Button>
              <Button variant="ghost">Import CSV</Button>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Sri Lankan Compliance" subtitle="VAT, NBT, ESC readiness" />
          <CardBody>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Tax rates configurable at Masters → Tax Rates</li>
              <li>Journals enforce double-entry integrity</li>
              <li>Trial balance & account statements available</li>
            </ul>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Quick Links" />
          <CardBody>
            <div className="flex flex-wrap gap-2">
              <a className="text-blue-700 hover:underline text-sm" href="/journals">Journals</a>
              <a className="text-blue-700 hover:underline text-sm" href="/chart-of-accounts">Chart of Accounts</a>
              <a className="text-blue-700 hover:underline text-sm" href="/users">Users</a>
              <a className="text-blue-700 hover:underline text-sm" href="/companies">Companies</a>
              <a className="text-blue-700 hover:underline text-sm" href="/reports/trial-balance">Trial Balance</a>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Recent Journals" />
          <CardBody>
            <Table headers={["Date", "Reference", "Description", "Total (LKR)"]}>
              {/* Placeholder rows */}
              <tr>
                <td className="px-3 py-2 text-sm text-gray-700">2025-01-10</td>
                <td className="px-3 py-2 text-sm text-gray-700">JV-1001</td>
                <td className="px-3 py-2 text-sm text-gray-700">Opening entries</td>
                <td className="px-3 py-2 text-sm text-gray-700">0.00</td>
              </tr>
            </Table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Tasks" subtitle="Your upcoming actions" />
          <CardBody>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Review VAT setup for Q1</li>
              <li>• Import bank statement for reconciliation</li>
              <li>• Invite accountant to tenant</li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </SidebarLayout>
  );
}
