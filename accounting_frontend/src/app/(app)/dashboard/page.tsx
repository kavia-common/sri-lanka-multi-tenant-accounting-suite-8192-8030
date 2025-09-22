"use client";
import React from "react";
import { Card, Button, Badge } from "@/components/ui";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Cash" subtitle="Balance" >
          <div className="text-2xl font-semibold text-gray-900">—</div>
          <p className="text-xs text-gray-500 mt-1">Connect accounts to see live balances</p>
        </Card>
        <Card title="Receivables" subtitle="Outstanding" >
          <div className="text-2xl font-semibold text-gray-900">—</div>
          <p className="text-xs text-gray-500 mt-1">Coming soon</p>
        </Card>
        <Card title="Payables" subtitle="Outstanding" >
          <div className="text-2xl font-semibold text-gray-900">—</div>
          <p className="text-xs text-gray-500 mt-1">Coming soon</p>
        </Card>
        <Card title="Net Income" subtitle="Period-to-date" >
          <div className="text-2xl font-semibold text-gray-900">—</div>
          <p className="text-xs text-gray-500 mt-1">Run P&L to view</p>
        </Card>
      </div>
      <Card
        title="Quick Actions"
        actions={<Badge tone="info">Ocean Professional</Badge>}
      >
        <div className="flex gap-3 flex-wrap">
          <Link href="/transactions/new"><Button variant="primary">New Transaction</Button></Link>
          <Link href="/accounts"><Button variant="secondary">Chart of Accounts</Button></Link>
          <Link href="/reports"><Button variant="ghost">Reports</Button></Link>
          <Link href="/companies"><Button variant="ghost">Companies</Button></Link>
        </div>
      </Card>
    </div>
  );
}
