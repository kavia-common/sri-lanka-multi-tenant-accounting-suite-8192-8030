# UI Notes (Ocean Professional)

- Layout: AppShell provides sidebar navigation + main content area. Responsive; sidebar collapses on mobile with a toggle.
- Theme: Ocean Professional (blue primary #2563EB, amber accents #F59E0B). Subtle gradients via from-blue-500/10 to-gray-50, rounded corners, soft shadows.
- Components: `Card`, `Button`, `Input`, `Select`, `Textarea` in src/components/ui.tsx are minimal, accessible, and used across pages.
- Company Context: CompanySelector reads/sets current company and persists to localStorage as `selectedCompany`.
- API Client: `src/lib/client.ts` adds Authorization and x-company-id headers automatically based on localStorage values.
- Pages implemented:
  - Dashboard (reports snapshot)
  - Accounts (chart of accounts CRUD add + list)
  - Transactions (journal entries with balancing helper)
  - Reports (trial balance, balance sheet, profit & loss)
  - Companies (create/list + updates CompanySelector)
  - Customers (list/create)
  - Vendors (list/create)
  - Users (list/invite)
- Accessibility: Forms include aria attributes, role alerts, and focus rings.
- Auth:
  - Login page stores `token` to localStorage.
  - Logout clears auth and redirects.

## Environment
- NEXT_PUBLIC_API_URL must be set (e.g., http://localhost:3001)

## REST API
- Headers: `Authorization: Bearer <token>`, `x-company-id: <uuid>`.
- Error Handling: apiFetch throws Error with message parsed from response JSON when available.

## Future Enhancements
- Add pagination components
- Add edit/delete for master data rows
- Add role-based UI gating using claims from /api/auth/profile
- Add toasts for non-blocking success/error messages
