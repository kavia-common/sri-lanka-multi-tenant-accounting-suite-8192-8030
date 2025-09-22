import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth";

export const metadata: Metadata = {
  title: "OceanBooks | Multi-tenant Accounting",
  description: "Modern accounting suite with double-entry bookkeeping and multi-tenant isolation.",
  applicationName: "OceanBooks",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-[--bg] text-[--text]">
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
