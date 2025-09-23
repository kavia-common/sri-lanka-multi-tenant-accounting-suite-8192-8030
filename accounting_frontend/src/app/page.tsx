import Link from "next/link";

export default function Home() {
  return (
    <div className="p-4">
      <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-gray-50 ring-1 ring-blue-200/40 p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome to Accounting Suite</h1>
        <p className="text-gray-600 mt-2">
          Modern multi-tenant accounting with Ocean Professional theme.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Link className="inline-flex rounded-md bg-[#2563EB] px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-600" href="/dashboard">
            Go to Dashboard
          </Link>
          <Link className="text-[#2563EB] underline text-sm" href="/(app)/transactions">
            Record journal entry
          </Link>
        </div>
      </div>
    </div>
  );
}
