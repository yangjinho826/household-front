// 백엔드 enum: LIVING / SAVINGS / INVESTMENT / OTHER
export type AccountType = "LIVING" | "SAVINGS" | "INVESTMENT" | "OTHER";

export interface AccountSearchRequestType {
  searchTerm?: string;
  accountType?: AccountType;
  isArchived?: boolean;
}

export interface AccountBaseRequestType {
  name: string;
  accountType: AccountType;
  startBalance: number;
  color?: string | null;
  icon?: string | null;
  sortOrder: number;
  isArchived: boolean;
}

export type AccountCreateRequest = AccountBaseRequestType;

export interface AccountUpdateRequest extends AccountBaseRequestType {
  accountId: string;
}

export interface AccountListItemType {
  accountId: string;
  householdId: string;
  name: string;
  accountType: AccountType;
  startBalance: number;
  balance: number;
  color: string | null;
  icon: string | null;
  sortOrder: number;
  isArchived: boolean;
  // INVESTMENT 통장 한정 — 그 외 타입은 null
  cash: number | null;
  portfolioCost: number | null;
  portfolioValuation: number | null;
  portfolioProfitLoss: number | null;
  portfolioProfitLossRate: number | null;
}

export interface AccountDetailItemType {
  accountId: string;
  householdId: string;
  name: string;
  accountType: AccountType;
  startBalance: number;
  balance: number;
  color: string | null;
  icon: string | null;
  sortOrder: number;
  isArchived: boolean;
  // INVESTMENT 통장 한정
  cash: number | null;
  portfolioCost: number | null;
  portfolioValuation: number | null;
  portfolioProfitLoss: number | null;
  portfolioProfitLossRate: number | null;
}

export interface AccountMonthlyFlowType {
  monthDate: string; // YYYY-MM-DD (그달 1일)
  income: number;
  expense: number;
  fixedExpense: number;
  balance: number; // 그달 잔액 (이번달은 현재 잔액)
}

export interface AccountReportType {
  accountId: string;
  accountName: string;
  accountType: AccountType;
  balance: number;
  monthlyFlows: AccountMonthlyFlowType[];
}
