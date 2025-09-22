import React from "react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="bg-[--surface] rounded-xl shadow-sm ring-1 ring-gray-100/70 p-8" role="alert" aria-live="assertive">
        <header className="mb-2">
          <h1 className="text-2xl font-semibold text-gray-900">404 – Page Not Found</h1>
          <p className="text-sm text-gray-500">The page you’re looking for doesn’t exist.</p>
        </header>
        <a href="/dashboard" className="text-blue-600 hover:text-blue-700 text-sm font-medium">Go to dashboard</a>
      </section>
    </main>
  );
}
