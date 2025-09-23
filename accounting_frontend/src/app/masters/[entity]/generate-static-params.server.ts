export function generateStaticParams() {
  // Pre-render known master entities for static export
  return [
    { entity: "customers" },
    { entity: "vendors" },
    { entity: "bank-accounts" },
    { entity: "tax-rates" },
  ];
}
