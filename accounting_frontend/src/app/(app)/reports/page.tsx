"use client";
import Link from "next/link";
import { Card, Button } from "@/components/ui";

export default function ReportsIndex() {
  return (
    <div className="space-y-6">
      <Card title="Reports" subtitle="Financial statements and analytics">
        <div className="flex gap-3 flex-wrap">
          <Link href="/reports/trial-balance"><Button variant="primary">Trial Balance</Button></Link>
          <Link href="/reports/balance-sheet"><Button variant="secondary">Balance Sheet</Button></Link>
          <Link href="/reports/profit-loss"><Button variant="ghost">Profit & Loss</Button></Link>
        </div>
      </Card>
    </div>
  );
}
