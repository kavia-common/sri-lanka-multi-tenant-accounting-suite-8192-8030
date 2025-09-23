import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import Home from '@/app/page';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { renderWithProviders, seedAuth, clearAuthState, mockFetchOnceJson } from './test_utils';

describe('Dashboard and Sidebar', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    clearAuthState();
  });

  test('shows login hint when unauthenticated', async () => {
    mockFetchOnceJson({ status: 'ok', message: 'Service is healthy', timestamp: '', environment: 'test' });
    renderWithProviders(<Home />);
    expect(await screen.findByText(/You are not authenticated/)).toBeInTheDocument();
  });

  test('renders backend health message when authenticated', async () => {
    seedAuth();
    mockFetchOnceJson({ status: 'ok', message: 'Service is healthy', timestamp: '', environment: 'test' });
    renderWithProviders(<Home />);
    await waitFor(() => screen.getByText(/Service is healthy/));
    expect(screen.getByText(/Service is healthy/)).toBeInTheDocument();
  });

  test('sidebar renders nav links and logout button', () => {
    seedAuth();
    renderWithProviders(<SidebarLayout><div>content</div></SidebarLayout>);
    expect(screen.getByText('OceanBooks')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Users/i })).toBeInTheDocument();
  });

  test('tenant and company inputs exist', () => {
    seedAuth();
    renderWithProviders(<SidebarLayout><div>content</div></SidebarLayout>);
    expect(screen.getByLabelText('Tenant ID')).toBeInTheDocument();
    expect(screen.getByLabelText('Company ID')).toBeInTheDocument();
  });
});
