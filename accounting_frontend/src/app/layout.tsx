import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./providers";
import Link from "next/link";
import CompanySelector from "@/components/company-selector";

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
          <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
              <Link href="/" className="font-semibold text-[#2563EB]">Accounting</Link>
              <nav className="flex items-center gap-3 text-sm">
                <Link className="hover:text-[#2563EB]" href="/dashboard">Dashboard</Link>
                <Link className="hover:text-[#2563EB]" href="/(app)/transactions">Transactions</Link>
                <Link className="hover:text-[#2563EB]" href="/(app)/accounts">Accounts</Link>
                <Link className="hover:text-[#2563EB]" href="/(app)/reports">Reports</Link>
                <Link className="hover:text-[#2563EB]" href="/(app)/companies">Companies</Link>
              </nav>
              <div className="ml-auto">
                <CompanySelector />
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
