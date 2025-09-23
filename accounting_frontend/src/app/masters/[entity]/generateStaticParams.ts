/**
 * generateStaticParams for /masters/[entity] to support output: "export".
 * This file is server-only and does not mark the page as a client component.
 */
export function generateStaticParams() {
  return [
    { entity: "customers" },
    { entity: "vendors" },
    { entity: "bank-accounts" },
    { entity: "tax-rates" },
  ];
}
