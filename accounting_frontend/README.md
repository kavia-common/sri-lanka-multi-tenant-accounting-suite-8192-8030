# OceanBooks Frontend (Next.js)

OceanBooks is a modern, responsive accounting frontend for Sri Lankan multi-tenant bookkeeping.

## Features
- Ocean Professional theme (blue primary, amber accents), accessible and responsive
- Sidebar layout with dashboard, topbar tenant/company selectors
- CRUD UI integrated with backend REST API:
  - Users (/users)
  - Companies (/companies)
  - Chart of Accounts (/chart_of_accounts)
  - Journals (/journal_entries)
  - Masters (generic: /{entity}) — customers, vendors, bank_accounts, tax_rates
- Reports:
  - Trial Balance (/general_ledger/trial_balance)
  - Account Statement (/general_ledger/accounts/{accountId})
- Sri Lankan compliance emphasis: VAT/NBT on Tax Rates, GAAP-friendly CoA
- Centralized API client with multi-tenant headers

## Setup
1. Copy environment variables:
   cp .env.example .env
   # Update NEXT_PUBLIC_API_BASE_URL to your backend host

2. Install and run:
   npm install
   npm run dev

Open http://localhost:3000

Tip: Set tenant/company in the top bar to scope requests. Provide token via a custom login in future updates or by seeding localStorage.

## Notes
- Auth: A lightweight storage exists (src/lib/auth.ts). Integrate actual login later to populate token.
- API: Endpoints referenced from backend OpenAPI. Adjust field names as your backend evolves.
- Styling: Tailwind v4 with custom components in src/components/ui.tsx

## Scripts
- npm run dev — start dev server
- npm run build — production build
- npm run start — run production server
- npm run lint — lint code
