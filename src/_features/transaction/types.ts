export type TxType = "expense" | "income" | "transfer";

export interface TransactionSearchRequestType {
  searchTerm?: string;
  txType?: TxType;
  accountId?: string;
  categoryId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface TransactionBaseRequestType {
  householdId: string;
  txType: TxType;
  amount: number;
  txDate: string;
  accountId: string;
  toAccountId?: string | null;
  categoryId?: string | null;
  paidByUserId?: string | null;
  isFixed: boolean;
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
  isFixed: boolean;
  memo: string | null;
  // 조인된 표시 필드 (백엔드 응답에 포함될 수 있음)
  accountName?: string | null;
  toAccountName?: string | null;
  categoryName?: string | null;
  frstRegDt: string;
  lastMdfcnDt: string;
  dataStatCd: string;
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
  isFixed: boolean;
  memo: string | null;
  accountName?: string | null;
  toAccountName?: string | null;
  categoryName?: string | null;
  frstRegDt: string;
  lastMdfcnDt: string;
  dataStatCd: string;
}
