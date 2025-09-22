"use client";

import React from "react";

export default function AppSectionLayout({ children }: { children: React.ReactNode }) {
  // This section layout keeps room for future section-wide providers if needed.
  return <>{children}</>;
}
