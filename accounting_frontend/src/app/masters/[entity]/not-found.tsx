"use client";
import React from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Card, CardBody, CardHeader, Button } from "@/components/ui";

export default function MastersNotFound() {
  return (
    <SidebarLayout>
      <Card>
        <CardHeader title="Masters Section Not Found" subtitle="The requested master entity is not available." />
        <CardBody>
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => (window.location.href = "/masters/customers")}>Customers</Button>
            <Button variant="secondary" onClick={() => (window.location.href = "/masters/vendors")}>Vendors</Button>
            <Button variant="ghost" onClick={() => (window.location.href = "/")}>Dashboard</Button>
          </div>
        </CardBody>
      </Card>
    </SidebarLayout>
  );
}
