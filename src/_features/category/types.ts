export type CategoryKind = "EXPENSE" | "INCOME";

export interface CategorySearchRequestType {
  searchTerm?: string;
  kind?: CategoryKind;
  isArchived?: boolean;
}

export interface CategoryBaseRequestType {
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
  categoryId: string;
  householdId: string;
  kind: CategoryKind;
  name: string;
  color: string | null;
  icon: string | null;
  sortOrder: number;
  isArchived: boolean;
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
}
