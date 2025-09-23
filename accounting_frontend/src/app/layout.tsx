import type { Metadata } from "next";
import "./globals.css";
import { OCEAN_PRO_THEME } from "@/lib/config";

export const metadata: Metadata = {
  title: "OceanBooks — Sri Lanka Accounting Suite",
  description: "Multi-tenant accounting with Sri Lankan compliance (VAT/NBT/ESC).",
  applicationName: "OceanBooks",
  icons: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Provide CSS variables for the theme at the app root without using any
  const style: React.CSSProperties = {};
  (style as Record<string, string>)["--ocean-primary"] = OCEAN_PRO_THEME.primary;
  (style as Record<string, string>)["--ocean-secondary"] = OCEAN_PRO_THEME.secondary;
  (style as Record<string, string>)["--ocean-background"] = OCEAN_PRO_THEME.background;
  (style as Record<string, string>)["--ocean-surface"] = OCEAN_PRO_THEME.surface;
  (style as Record<string, string>)["--ocean-text"] = OCEAN_PRO_THEME.text;

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning style={style}>
        <div
          aria-hidden
          className="h-1 w-full"
          style={{ background: OCEAN_PRO_THEME.gradient }}
        />
        {children}
      </body>
    </html>
  );
}
