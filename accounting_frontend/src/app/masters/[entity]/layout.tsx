export async function generateStaticParams() {
  // Pre-render known master entities for static export
  return [
    { entity: "customers" },
    { entity: "vendors" },
    { entity: "bank-accounts" },
    { entity: "tax-rates" },
  ];
}

// Required default layout export to satisfy Next routing (minimal pass-through)
export default function MastersEntityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
