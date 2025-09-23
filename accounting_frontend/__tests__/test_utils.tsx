import React from 'react';
import { RenderOptions, render } from '@testing-library/react';
import { getAuth, setAuth, clearAuth } from '@/lib/auth';

export const TEST_AUTH = {
  email: 'user@example.com',
  token: 'test-token',
  tenantId: 'tenant-1',
  companyId: 'company-1',
  roles: ['admin'],
};

export function seedAuth(auth = TEST_AUTH) {
  setAuth(auth);
}

export function clearAuthState() {
  clearAuth();
}

export function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  return render(ui, options);
}

// Convenience to mock fetch JSON responses with multi-tenant assertions
export function mockFetchOnceJson(data: any, init?: Partial<Response>) {
  (global as any).fetch = jest.fn().mockResolvedValueOnce(
    new Response(JSON.stringify(data), {
      status: init?.status ?? 200,
      headers: { 'Content-Type': 'application/json' },
      ...init,
    } as ResponseInit)
  );
}

export function mockFetchOnceError(message: string, status = 400) {
  (global as any).fetch = jest.fn().mockResolvedValueOnce(
    new Response(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    } as ResponseInit)
  );
}

export function expectLastFetchHeaders(expected: Record<string, string>) {
  const mock = (global as any).fetch as jest.Mock;
  expect(mock).toBeDefined();
  const call = mock.mock.calls[mock.mock.calls.length - 1];
  const reqInit = call?.[1] || {};
  const headers = reqInit.headers || {};
  for (const [k, v] of Object.entries(expected)) {
    expect(headers[k]).toBe(v);
  }
}
