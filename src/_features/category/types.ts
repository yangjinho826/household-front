export type CategoryKind = "income" | "expense";

export interface CategorySearchRequestType {
  searchTerm?: string;
  kind?: CategoryKind;
  isArchived?: boolean;
}

export interface CategoryBaseRequestType {
  householdId: string;
  kind: CategoryKind;
  name: string;
  color?: string | null;
  icon?: string | null;
  sortOrder: number;
  isArchived: boolean;
}

export type CategoryCreateRequest = CategoryBaseRequestType;

export interface CategoryUpdateRequest extends CategoryBaseRequestType {
  categoryId: string;
}

export interface CategoryListItemType {
  rowNo: number;
  categoryId: string;
  householdId: string;
  kind: CategoryKind;
  name: string;
  color: string | null;
  icon: string | null;
  sortOrder: number;
  isArchived: boolean;
  frstRegDt: string;
  lastMdfcnDt: string;
  dataStatCd: string;
}

export interface CategoryDetailItemType {
  categoryId: string;
  householdId: string;
  kind: CategoryKind;
  name: string;
  color: string | null;
  icon: string | null;
  sortOrder: number;
  isArchived: boolean;
  frstRegDt: string;
  lastMdfcnDt: string;
  dataStatCd: string;
}
