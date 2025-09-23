/* Jest setup for RTL and Next.js */
import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { TextEncoder, TextDecoder } from 'util';
if (typeof (global as any).TextEncoder === 'undefined') {
  (global as any).TextEncoder = TextEncoder as any;
}
if (typeof (global as any).TextDecoder === 'undefined') {
  (global as any).TextDecoder = TextDecoder as any;
}

// Simple mock for next/navigation hooks used in components
jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');
  return {
    ...actual,
    usePathname: jest.fn(() => '/'),
    useRouter: () => ({
      replace: jest.fn(),
      push: jest.fn(),
      back: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    }),
    useParams: jest.fn(() => ({})),
  };
});

// Next/link mock to render simple anchor for RTL
jest.mock('next/link', () => {
  return ({ href, children, ...rest }: any) => {
    return (
      <a href={typeof href === 'string' ? href : '#'} {...rest}>
        {children}
      </a>
    );
  };
});

// LocalStorage mock for client-side auth utilities
class LocalStorageMock {
  private store: Record<string, string> = {};
  clear() { this.store = {}; }
  getItem(key: string) { return this.store[key] ?? null; }
  setItem(key: string, value: string) { this.store[key] = String(value); }
  removeItem(key: string) { delete this.store[key]; }
}
Object.defineProperty(window, 'localStorage', { value: new LocalStorageMock() });
