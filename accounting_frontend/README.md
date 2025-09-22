# OceanBooks Frontend (Next.js)

Modern multi-tenant accounting frontend built with Next.js App Router and Tailwind CSS (Ocean Professional theme).

## Environment

Copy `.env.example` to `.env.local` and set:
- `NEXT_PUBLIC_API_BASE_URL` (e.g., http://localhost:3001)
- `NEXT_PUBLIC_SITE_URL` (e.g., http://localhost:3000)

## Scripts

- `npm run dev` — start dev server
- `npm run build` — build
- `npm start` — start production build
- `npm run lint` — lint

## Structure

- `src/app/auth/login` — login and company selection
- `src/app/(app)` — protected routes using AppShell
  - `dashboard` — KPIs & quick actions
  - `companies` — list/create companies
  - `accounts` — chart of accounts with inline edit
  - `transactions` — list & create double-entry transactions
  - `reports` — trial balance, balance sheet, profit & loss

## Notes

- Auth token is stored in `localStorage` as `auth_token`
- Active company is stored as `company_id` and sent as `x-company-id` header automatically
- All API calls are integrated with the backend REST API defined in the OpenAPI spec in the backend container
