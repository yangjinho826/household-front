// 백엔드 enum: LIVING / SAVINGS / INVESTMENT
export type AccountType = "LIVING" | "SAVINGS" | "INVESTMENT";

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
  balance: number;
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
  balance: number;
  color: string | null;
  icon: string | null;
  sortOrder: number;
  isArchived: boolean;
  frstRegDt: string;
  lastMdfcnDt: string;
  dataStatCd: string;
}
