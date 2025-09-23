# UI Notes: Ocean Professional Theme and New Pages

This update adds the remaining entity pages and reporting/compliance settings with a reusable set of components.

Highlights
- Ocean Professional components in src/components/ocean-theme.tsx (Card, Button, Input, Select, TextArea, DataTable)
- API helper hooks in src/lib/hooks.ts include Authorization and x-company-id automatically
- EntityScaffold for consistent listing + create forms

New Pages
- Companies: /(app)/companies
  - GET /api/companies
  - POST /api/companies

- Chart of Accounts: /(app)/chart-of-accounts
  - GET /api/accounts
  - POST /api/accounts
  - Notes: edits limited to PUT /api/accounts/{id} name/description by backend

- Journal Entries: /(app)/journal-entries
  - GET /api/transactions
  - POST /api/transactions
  - Loads accounts via GET /api/accounts for line selection

- General Ledger: /(app)/general-ledger
  - GET /api/reports/v2/general-ledger with period[] and account_id
  - Client shows result rows in a table

- Bank Accounts: /(app)/bank-accounts
  - Assumed endpoints: GET/POST /api/bank-accounts (stub)
  - Update paths when backend publishes OpenAPI

- Tax Rates: /(app)/tax-rates
  - Assumed endpoints: GET/POST /api/tax-rates (stub)
  - Map to accounts for compliance reports in future

- Currencies: /(app)/currencies
  - Assumed endpoints: GET/POST /api/currencies (stub)

- Reporting & Compliance Settings: /(app)/settings/reporting-compliance
  - Launchpad to standard reports and Sri Lanka VAT Return
  - Vat Return uses GET /api/reports/lk/vat-return with period_start/period_end

Multi-tenancy
- All API calls include x-company-id from context via useApi() headers; ensure CompanyProvider sets active company.

Styling
- Minimal global gradient in globals.css
- Sidebar nav updated to include new sections

Future Work
- Implement edit forms/drawers for accounts and transactions
- Add pagination and sorting to DataTable
- Confirm and wire exact backend endpoints for bank accounts, tax rates, currencies
- Add validation and error toasts
