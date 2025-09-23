import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import MastersEntityPage from '@/app/masters/[entity]/page';
import { renderWithProviders, seedAuth } from './test_utils';

// Mock useParams to return entity=tax-rates
jest.mock('next/navigation', () => {
  const original = jest.requireActual('next/navigation');
  return {
    ...original,
    useParams: () => ({ entity: 'tax-rates' }),
  };
});

describe('Masters - Tax Rates', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    seedAuth();
  });

  test('validates rate must be between 0 and 100', async () => {
    (global as any).fetch = jest.fn().mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );
    renderWithProviders(<MastersEntityPage />);

    fireEvent.change(screen.getByLabelText('Name (VAT/NBT)'), { target: { value: 'VAT' } });
    fireEvent.change(screen.getByLabelText('Rate (%)'), { target: { value: '150' } });
    fireEvent.click(screen.getByRole('button', { name: /Create/i }));
    expect(await screen.findByText(/between 0 and 100/)).toBeInTheDocument();
  });

  test('creates tax rate with headers and reloads', async () => {
    (global as any).fetch = jest.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })) // load
      .mockResolvedValueOnce(new Response('', { status: 200 })) // post
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: 't1', name: 'VAT', rate: 15 }]), { status: 200, headers: { 'Content-Type': 'application/json' } })); // reload

    renderWithProviders(<MastersEntityPage />);

    fireEvent.change(screen.getByLabelText('Name (VAT/NBT)'), { target: { value: 'VAT' } });
    fireEvent.change(screen.getByLabelText('Rate (%)'), { target: { value: '15' } });
    fireEvent.click(screen.getByRole('button', { name: /Create/i }));

    await waitFor(() => screen.getByText('VAT'));

    const mock = (global as any).fetch as jest.Mock;
    const postInit = mock.mock.calls[1][1] || {};
    expect(postInit.headers['X-Tenant-ID']).toBe('tenant-1');
    expect(postInit.headers['X-Company-ID']).toBe('company-1');
    expect(postInit.headers['Authorization']).toBe('Bearer test-token');
  });
});
