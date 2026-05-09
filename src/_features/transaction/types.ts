export type TransactionType = "income" | "expense" | "transfer";

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  accountId: string;
  toAccountId?: string;
  categoryId?: string;
  date: string;
  memo: string;
};

export type TransactionCreateRequest = Omit<Transaction, "id">;
export type TransactionUpdateRequest = Partial<Transaction> & { id: string };

// 홈 화면 통계 — derived from transactions + accounts + portfolio
export type BudgetStats = {
  income: number;
  expense: number;
  save: number;
  totalAssets: number;
  savingRate: number;
};
