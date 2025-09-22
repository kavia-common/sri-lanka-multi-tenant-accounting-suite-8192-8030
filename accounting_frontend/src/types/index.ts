export type UUID = string;

export type ApiStatusResponse<T = unknown> = {
  status: string;
  message?: string;
  data?: T;
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message?: string;
  data: {
    token: string;
    user: {
      id: UUID;
      email: string;
      firstName?: string;
      lastName?: string;
    };
    companies: Array<{
      id: UUID;
      name: string;
      code: string;
      role: string;
    }>;
  };
}

export interface Company {
  id: UUID;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_number?: string;
  role?: string;
  created_at?: string;
}

export type AccountType = "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";

export interface Account {
  id: UUID;
  company_id: UUID;
  code: string;
  name: string;
  type: AccountType;
  parent_account_id?: UUID | null;
  description?: string;
  balance?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface JournalEntryLine {
  id?: UUID;
  transaction_id?: UUID;
  account_id: UUID;
  debit_amount?: number;
  credit_amount?: number;
  description?: string;
  account_code?: string;
  account_name?: string;
}

export interface TransactionModel {
  id: UUID;
  company_id: UUID;
  date: string;
  description: string;
  reference?: string;
  total_amount?: number;
  created_at?: string;
  entries: JournalEntryLine[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TrialBalanceRow {
  code: string;
  name: string;
  type: string;
  total_debits: string;
  total_credits: string;
  balance: string;
}

export interface ProfitLossSummary {
  totalRevenue: string;
  totalExpenses: string;
  netIncome: string;
  netIncomePercent: string;
}
