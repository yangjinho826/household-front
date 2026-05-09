// 통장 타입 — 백엔드 account_type 컬럼 (확장 가능)
export type AccountType =
  | "checking"
  | "savings"
  | "credit"
  | "cash"
  | "investment";

export interface AccountSearchRequestType {
  searchTerm?: string;
  accountType?: AccountType;
  isArchived?: boolean;
}

export interface AccountBaseRequestType {
  householdId: string;
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
  rowNo: number;
  accountId: string;
  householdId: string;
  name: string;
  accountType: AccountType;
  startBalance: number;
  color: string | null;
  icon: string | null;
  sortOrder: number;
  isArchived: boolean;
  frstRegDt: string;
  lastMdfcnDt: string;
  dataStatCd: string;
}

export interface AccountDetailItemType {
  accountId: string;
  householdId: string;
  name: string;
  accountType: AccountType;
  startBalance: number;
  color: string | null;
  icon: string | null;
  sortOrder: number;
  isArchived: boolean;
  frstRegDt: string;
  lastMdfcnDt: string;
  dataStatCd: string;
}
