# Accounting Frontend

Environment:
- NEXT_PUBLIC_API_URL: Base URL for backend API (e.g., http://localhost:3001)

This frontend uses:
- Next.js App Router (React 18 + TypeScript)
- TailwindCSS for styling
- TanStack Query for data fetching and caching
- React Hook Form for forms
- Accessible, responsive UI with proper ARIA labels.

Company context sets x-company-id header automatically from selection. Auth token, if present, is read from localStorage as `token`.
