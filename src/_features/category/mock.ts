import { newId, todayIso } from "_utilities/fmt";

import type {
  CategoryDetailItemType,
  CategoryListItemType,
} from "./types";

const HOUSEHOLD_ID = "h-mock-1";

let store: CategoryDetailItemType[] = [
  {
    categoryId: newId(),
    householdId: HOUSEHOLD_ID,
    kind: "expense",
    name: "식비",
    color: "#FF6B6B",
    icon: "utensils",
    sortOrder: 1,
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    categoryId: newId(),
    householdId: HOUSEHOLD_ID,
    kind: "expense",
    name: "교통",
    color: "#4ECDC4",
    icon: "bus",
    sortOrder: 2,
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    categoryId: newId(),
    householdId: HOUSEHOLD_ID,
    kind: "expense",
    name: "쇼핑",
    color: "#FFE66D",
    icon: "shopping-bag",
    sortOrder: 3,
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    categoryId: newId(),
    householdId: HOUSEHOLD_ID,
    kind: "expense",
    name: "주거",
    color: "#95E1D3",
    icon: "home",
    sortOrder: 4,
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    categoryId: newId(),
    householdId: HOUSEHOLD_ID,
    kind: "income",
    name: "월급",
    color: "#3182F6",
    icon: "briefcase",
    sortOrder: 1,
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    categoryId: newId(),
    householdId: HOUSEHOLD_ID,
    kind: "income",
    name: "부업",
    color: "#22C55E",
    icon: "trending-up",
    sortOrder: 2,
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
];

type CreateInput = Omit<
  CategoryDetailItemType,
  "categoryId" | "frstRegDt" | "lastMdfcnDt" | "dataStatCd"
>;

export const categoryMockStore = {
  list(): CategoryListItemType[] {
    return store.map((c, idx) => ({ ...c, rowNo: idx + 1 }));
  },
  detail(id: string): CategoryDetailItemType | undefined {
    return store.find((c) => c.categoryId === id);
  },
  create(input: CreateInput): CategoryDetailItemType {
    const item: CategoryDetailItemType = {
      ...input,
      categoryId: newId(),
      frstRegDt: todayIso(),
      lastMdfcnDt: todayIso(),
      dataStatCd: "ACTIVE",
    };
    store = [item, ...store];
    return item;
  },
  update(
    id: string,
    patch: Partial<CategoryDetailItemType>,
  ): CategoryDetailItemType | undefined {
    const idx = store.findIndex((c) => c.categoryId === id);
    if (idx < 0) return undefined;
    const current = store[idx];
    if (!current) return undefined;
    const next: CategoryDetailItemType = {
      ...current,
      ...patch,
      lastMdfcnDt: todayIso(),
    };
    store[idx] = next;
    return next;
  },
  remove(id: string) {
    store = store.filter((c) => c.categoryId !== id);
  },
};
