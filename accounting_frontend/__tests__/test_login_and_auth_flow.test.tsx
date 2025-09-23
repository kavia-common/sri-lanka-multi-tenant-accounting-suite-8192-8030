import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import { renderWithProviders } from './test_utils';

describe('Login (Temp) Page', () => {
  test('saves auth to localStorage and redirects to /', () => {
    const { useRouter } = require('next/navigation');
    const replaceMock = jest.fn();
    (useRouter as any) = jest.fn(() => ({ replace: replaceMock }));

    renderWithProviders(<LoginPage />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Token'), { target: { value: 'tok' } });
    fireEvent.change(screen.getByLabelText('Tenant ID'), { target: { value: 't1' } });
    fireEvent.change(screen.getByLabelText('Company ID'), { target: { value: 'c1' } });

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    const saved = JSON.parse(window.localStorage.getItem('oceanbooks-auth') || '{}');
    expect(saved.email).toBe('user@example.com');
    expect(saved.token).toBe('tok');
    expect(saved.tenantId).toBe('t1');
    expect(saved.companyId).toBe('c1');

    expect(replaceMock).toHaveBeenCalledWith('/');
  });
});
