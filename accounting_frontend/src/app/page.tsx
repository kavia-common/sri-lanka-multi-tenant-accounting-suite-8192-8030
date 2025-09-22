import Link from "next/link";

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Welcome to Accounting Suite</h1>
      <p className="text-gray-600 mt-2">Use the navigation to access features.</p>
      <div className="mt-4">
        <Link className="text-[#2563EB] underline" href="/dashboard">Go to Dashboard</Link>
      </div>
    </div>
  );
}
