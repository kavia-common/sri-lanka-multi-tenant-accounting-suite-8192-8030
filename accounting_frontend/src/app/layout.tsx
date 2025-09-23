import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OceanBooks — Sri Lanka Accounting Suite",
  description: "Multi-tenant accounting with Sri Lankan compliance (VAT/NBT/ESC).",
  applicationName: "OceanBooks",
  icons: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
