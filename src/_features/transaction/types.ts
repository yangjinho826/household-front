export type TxType = "EXPENSE" | "INCOME" | "TRANSFER" | "FIXED_EXPENSE";

export interface TransactionSearchRequestType {
  searchTerm?: string;
  txType?: TxType;
  accountId?: string;
  categoryId?: string;
  fromDate?: string;
  toDate?: string;
  year?: number;
  month?: number;
}

export interface TransactionBaseRequestType {
  txType: TxType;
  amount: number;
  txDate: string;
  accountId: string;
  toAccountId?: string | null;
  categoryId?: string | null;
  paidByUserId?: string | null;
  fixedExpenseId: string | null;
  memo?: string | null;
}

export type TransactionCreateRequest = TransactionBaseRequestType;

export interface TransactionUpdateRequest extends TransactionBaseRequestType {
  transactionId: string;
}

export interface TransactionListItemType {
  rowNo: number;
  transactionId: string;
  householdId: string;
  txType: TxType;
  amount: number;
  txDate: string;
  accountId: string;
  toAccountId: string | null;
  categoryId: string | null;
  paidByUserId: string | null;
  fixedExpenseId: string | null;
  memo: string | null;
  // 조인된 표시 필드 (백엔드 응답에 포함)
  accountName?: string | null;
  toAccountName?: string | null;
  categoryName?: string | null;
  categoryColor?: string | null;
  categoryIcon?: string | null;
  frstRegDt: string;
  lastMdfcnDt: string;
  dataStatCd: string;
}

/** 달력 일별 합계 (백엔드 /transaction/calendar) */
export interface TransactionCalendarDay {
  date: string; // YYYY-MM-DD
  income: number;
  expense: number;
  transfer: number;
  count: number;
}

export interface TransactionCalendarResponse {
  year: number;
  month: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyTransfer: number;
  days: TransactionCalendarDay[];
}

export interface TransactionDetailItemType {
  transactionId: string;
  householdId: string;
  txType: TxType;
  amount: number;
  txDate: string;
  accountId: string;
  toAccountId: string | null;
  categoryId: string | null;
  paidByUserId: string | null;
  fixedExpenseId: string | null;
  memo: string | null;
  accountName?: string | null;
  toAccountName?: string | null;
  categoryName?: string | null;
  categoryColor?: string | null;
  categoryIcon?: string | null;
  frstRegDt: string;
  lastMdfcnDt: string;
  dataStatCd: string;
}
