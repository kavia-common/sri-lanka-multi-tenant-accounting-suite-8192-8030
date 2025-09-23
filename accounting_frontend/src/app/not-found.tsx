"use client";

import React from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Card, CardBody, CardHeader, Button } from "@/components/ui";
import Link from "next/link";

export default function NotFound() {
  return (
    <SidebarLayout>
      <Card>
        <CardHeader title="404 – Page Not Found" subtitle="The page you’re looking for doesn’t exist." />
        <CardBody>
          <Link href="/" passHref legacyBehavior>
            <a aria-label="Go to Dashboard">
              <Button variant="primary">Go to Dashboard</Button>
            </a>
          </Link>
        </CardBody>
      </Card>
    </SidebarLayout>
  );
}
