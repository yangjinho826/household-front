export interface FixedSearchRequestType {
  searchTerm?: string;
  isArchived?: boolean;
}

export interface FixedBaseRequestType {
  householdId: string;
  name: string;
  amount: number;
  dayOfMonth: number;
  categoryId?: string | null;
  color?: string | null;
  icon?: string | null;
  sortOrder: number;
  isArchived: boolean;
}

export type FixedCreateRequest = FixedBaseRequestType;

export interface FixedUpdateRequest extends FixedBaseRequestType {
  fixedId: string;
}

export interface FixedListItemType {
  rowNo: number;
  fixedId: string;
  householdId: string;
  name: string;
  amount: number;
  dayOfMonth: number;
  categoryId: string | null;
  categoryName?: string | null;
  categoryColor?: string | null;
  categoryIcon?: string | null;
  color: string | null;
  icon: string | null;
  sortOrder: number;
  isArchived: boolean;
  frstRegDt: string;
  lastMdfcnDt: string;
  dataStatCd: string;
}

export interface FixedDetailItemType {
  fixedId: string;
  householdId: string;
  name: string;
  amount: number;
  dayOfMonth: number;
  categoryId: string | null;
  categoryName?: string | null;
  categoryColor?: string | null;
  categoryIcon?: string | null;
  color: string | null;
  icon: string | null;
  sortOrder: number;
  isArchived: boolean;
  frstRegDt: string;
  lastMdfcnDt: string;
  dataStatCd: string;
}
