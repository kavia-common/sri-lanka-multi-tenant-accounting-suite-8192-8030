"use client";
import React from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Card, CardBody, CardHeader, Button } from "@/components/ui";
import Link from "next/link";

export default function MastersNotFound() {
  return (
    <SidebarLayout>
      <Card>
        <CardHeader title="Masters Section Not Found" subtitle="The requested master entity is not available." />
        <CardBody>
          <div className="flex gap-2">
            <Link href="/masters/customers" passHref legacyBehavior>
              <a aria-label="Customers"><Button variant="primary">Customers</Button></a>
            </Link>
            <Link href="/masters/vendors" passHref legacyBehavior>
              <a aria-label="Vendors"><Button variant="secondary">Vendors</Button></a>
            </Link>
            <Link href="/" passHref legacyBehavior>
              <a aria-label="Dashboard"><Button variant="ghost">Dashboard</Button></a>
            </Link>
          </div>
        </CardBody>
      </Card>
    </SidebarLayout>
  );
}
