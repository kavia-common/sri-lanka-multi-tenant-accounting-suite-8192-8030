import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import CompaniesPage from '@/app/companies/page';
import { renderWithProviders, seedAuth, mockFetchOnceJson, mockFetchOnceError, expectLastFetchHeaders } from './test_utils';

describe('Companies Page', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    seedAuth();
  });

  test('loads companies list', async () => {
    mockFetchOnceJson([]); // initial GET /companies
    renderWithProviders(<CompaniesPage />);
    expect(await screen.findByText(/No companies found/)).toBeInTheDocument();
  });

  test('validates name length and shows field error', async () => {
    mockFetchOnceJson([]); // load
    renderWithProviders(<CompaniesPage />);

    const name = screen.getByLabelText('Name') as HTMLInputElement;
    fireEvent.change(name, { target: { value: 'A' } });

    const submit = screen.getByRole('button', { name: /Create company/i });
    fireEvent.click(submit);

    expect(await screen.findByText(/Company name must be at least 2 characters/)).toBeInTheDocument();
  });

  test('creates company and sends tenant headers', async () => {
    mockFetchOnceJson([]); // initial load
    renderWithProviders(<CompaniesPage />);

    // Prepare POST response ok, and subsequent load
    (global as any).fetch = jest.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })) // initial GET
      .mockResolvedValueOnce(new Response('', { status: 200 })) // POST /companies
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: 'c1', name: 'Ocean Ltd' }]), { status: 200, headers: { 'Content-Type': 'application/json' } })); // reload

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ocean Ltd' } });
    fireEvent.click(screen.getByRole('button', { name: /Create company/i }));

    await waitFor(() => screen.getByText('Ocean Ltd'));
    expect(screen.getByText('Ocean Ltd')).toBeInTheDocument();

    const mock = (global as any).fetch as jest.Mock;
    // The second call should be POST /companies with headers:
    const postCall = mock.mock.calls[1];
    const postInit = postCall[1] || {};
    expect(postInit.headers['X-Tenant-ID']).toBe('tenant-1');
    expect(postInit.headers['Authorization']).toBe('Bearer test-token');
  });

  test('shows backend error message on failure', async () => {
    // initial load
    mockFetchOnceJson([]);
    renderWithProviders(<CompaniesPage />);

    (global as any).fetch = jest.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })) // first GET
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: 'Duplicate company' }), { status: 400, headers: { 'Content-Type': 'application/json' } })); // POST fails

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ocean Ltd' } });
    fireEvent.click(screen.getByRole('button', { name: /Create company/i }));

    expect(await screen.findByText(/Duplicate company|Failed to create company/)).toBeInTheDocument();
  });
});
