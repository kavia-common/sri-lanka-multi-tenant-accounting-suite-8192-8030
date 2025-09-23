import React from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Card, CardBody, CardHeader, Button } from "@/components/ui";

export default function NotFound() {
  return (
    <SidebarLayout>
      <Card>
        <CardHeader title="404 – Page Not Found" subtitle="The page you’re looking for doesn’t exist." />
        <CardBody>
          <Button variant="primary" onClick={() => (window.location.href = "/")}>Go to Dashboard</Button>
        </CardBody>
      </Card>
    </SidebarLayout>
  );
}
