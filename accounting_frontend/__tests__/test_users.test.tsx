import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import UsersPage from '@/app/users/page';
import { renderWithProviders, seedAuth } from './test_utils';

describe('Users Page', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    seedAuth();
  });

  test('loads users list and shows none when empty', async () => {
    (global as any).fetch = jest.fn().mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );
    renderWithProviders(<UsersPage />);
    expect(await screen.findByText(/No users found/)).toBeInTheDocument();
  });

  test('validates email', async () => {
    (global as any).fetch = jest.fn().mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );
    renderWithProviders(<UsersPage />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'bad-email' } });
    fireEvent.click(screen.getByRole('button', { name: /Create user/i }));
    expect(await screen.findByText(/valid email/)).toBeInTheDocument();
  });

  test('creates user and reloads list with multi-tenant headers', async () => {
    (global as any).fetch = jest.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })) // initial GET
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 'u1', email: 'new@ex.com' }), { status: 200, headers: { 'Content-Type': 'application/json' } })) // POST
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: 'u1', email: 'new@ex.com', roles: ['user'] }]), { status: 200, headers: { 'Content-Type': 'application/json' } })); // reload

    renderWithProviders(<UsersPage />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@ex.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Create user/i }));

    await waitFor(() => screen.getByText('new@ex.com'));
    expect(screen.getByText('new@ex.com')).toBeInTheDocument();

    const mock = (global as any).fetch as jest.Mock;
    const postInit = mock.mock.calls[1][1] || {};
    expect(postInit.headers['X-Tenant-ID']).toBe('tenant-1');
    expect(postInit.headers['X-Company-ID']).toBe('company-1');
    expect(postInit.headers['Authorization']).toBe('Bearer test-token');
  });
});
