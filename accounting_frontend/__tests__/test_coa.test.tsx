import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import CoAPage from '@/app/chart-of-accounts/page';
import { renderWithProviders, seedAuth } from './test_utils';

describe('Chart of Accounts Page', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    seedAuth();
  });

  test('shows empty message when no accounts', async () => {
    (global as any).fetch = jest.fn().mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );
    renderWithProviders(<CoAPage />);
    expect(await screen.findByText(/No accounts found/)).toBeInTheDocument();
  });

  test('creates account and reloads', async () => {
    (global as any).fetch = jest.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })) // initial load
      .mockResolvedValueOnce(new Response('', { status: 200 })) // post
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: 'a1', code: '1000', name: 'Cash', type: 'Asset' }]), { status: 200, headers: { 'Content-Type': 'application/json' } })); // reload

    renderWithProviders(<CoAPage />);

    fireEvent.change(screen.getByLabelText('Code'), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Cash' } });
    fireEvent.click(screen.getByRole('button', { name: /Create/i }));

    await waitFor(() => screen.getByText('Cash'));
    expect(screen.getByText('1000')).toBeInTheDocument();
  });
});
