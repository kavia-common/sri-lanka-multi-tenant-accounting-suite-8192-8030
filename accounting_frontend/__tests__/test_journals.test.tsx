import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import JournalsPage from '@/app/journals/page';
import { renderWithProviders, seedAuth } from './test_utils';

describe('Journals Page', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    seedAuth();
  });

  test('shows empty state when no journals', async () => {
    (global as any).fetch = jest.fn().mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );
    renderWithProviders(<JournalsPage />);
    expect(await screen.findByText(/No journal entries found/)).toBeInTheDocument();
  });

  test('validates invalid date', async () => {
    (global as any).fetch = jest.fn().mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );
    renderWithProviders(<JournalsPage />);
    const date = screen.getByLabelText('Date');
    fireEvent.change(date, { target: { value: 'invalid-date' } });
    fireEvent.click(screen.getByRole('button', { name: /Post Journal/i }));
    expect(await screen.findByText(/Invalid date|Date is required/)).toBeInTheDocument();
  });

  test('posts journal and reloads list with headers', async () => {
    (global as any).fetch = jest.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })) // load
      .mockResolvedValueOnce(new Response('', { status: 200 })) // post
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: 'j1', date: '2025-01-10', total: 0 }]), { status: 200, headers: { 'Content-Type': 'application/json' } })); // reload

    renderWithProviders(<JournalsPage />);

    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2025-01-10' } });
    fireEvent.click(screen.getByRole('button', { name: /Post Journal/i }));

    await waitFor(() => screen.getByText('2025-01-10'));
    const mock = (global as any).fetch as jest.Mock;
    const postInit = mock.mock.calls[1][1] || {};
    expect(postInit.headers['X-Tenant-ID']).toBe('tenant-1');
    expect(postInit.headers['X-Company-ID']).toBe('company-1');
    expect(postInit.headers['Authorization']).toBe('Bearer test-token');
  });
});
