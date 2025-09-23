import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./providers";
import { AppShell } from "@/components/shell";

export const metadata: Metadata = {
  title: "Accounting Suite",
  description: "Modern multi-tenant accounting app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#f9fafb] text-[#111827]" suppressHydrationWarning>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
