export type ApiStatus<T> = {
  status: "success" | "error";
  message?: string;
  data: T;
};

export type AccountType = "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";

export type Account = {
  id: string;
  company_id: string;
  code: string;
  name: string;
  type: AccountType;
  parent_account_id?: string | null;
  description?: string;
  balance?: number;
  is_active?: boolean;
  created_at?: string;
};

export type AccountsResponse = ApiStatus<{ accounts: Account[] }>;

export type Company = {
  id: string;
  name: string;
  code?: string;
  role?: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_number?: string;
  created_at?: string;
};

export type CompaniesResponse = ApiStatus<{ companies: Company[] }>;

export type JournalEntry = {
  id?: string;
  transaction_id?: string;
  account_id: string;
  debit_amount?: number;
  credit_amount?: number;
  description?: string;
  account_code?: string;
  account_name?: string;
};

export type Transaction = {
  id?: string;
  company_id?: string;
  date: string;
  description: string;
  reference?: string;
  total_amount?: number;
  created_at?: string;
  entries: JournalEntry[];
};

export type TransactionsListResponse = ApiStatus<{
  transactions: Transaction[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}>;

export type TrialBalanceRow = {
  code: string;
  name: string;
  type: string;
  total_debits: string;
  total_credits: string;
  balance: string;
};

export type TrialBalanceResponse = ApiStatus<{
  trialBalance: TrialBalanceRow[];
  summary: { totalDebits: string; totalCredits: string; isBalanced: boolean };
}>;

export type BalanceSheetResponse = ApiStatus<{
  balanceSheet: {
    assets: Record<string, unknown>[];
    liabilities: Record<string, unknown>[];
    equity: Record<string, unknown>[];
  };
  summary: { totalAssets: string; totalLiabilities: string; totalEquity: string; isBalanced: boolean };
}>;

export type ProfitLossResponse = ApiStatus<{
  profitLoss: { revenue: Record<string, unknown>[]; expenses: Record<string, unknown>[] };
  summary: { totalRevenue: string; totalExpenses: string; netIncome: string; netIncomePercent: string };
}>;

export type LoginResponse = {
  status: string;
  message?: string;
  data: {
    token: string;
    user: { id: string; email: string; firstName?: string; lastName?: string };
    companies: { id: string; name: string; code: string; role: string }[];
  };
};
