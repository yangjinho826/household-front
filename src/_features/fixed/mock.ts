import { newId, todayIso } from "_utilities/fmt";

import type { FixedDetailItemType, FixedListItemType } from "./types";

const HOUSEHOLD_ID = "h-mock-1";

let store: FixedDetailItemType[] = [
  {
    fixedId: newId(),
    householdId: HOUSEHOLD_ID,
    name: "월세",
    amount: 800_000,
    dayOfMonth: 1,
    categoryId: null,
    color: "#3182F6",
    icon: "home",
    sortOrder: 1,
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    fixedId: newId(),
    householdId: HOUSEHOLD_ID,
    name: "통신비",
    amount: 55_000,
    dayOfMonth: 5,
    categoryId: null,
    color: "#22C55E",
    icon: "phone",
    sortOrder: 2,
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    fixedId: newId(),
    householdId: HOUSEHOLD_ID,
    name: "넷플릭스",
    amount: 17_000,
    dayOfMonth: 15,
    categoryId: null,
    color: "#F04452",
    icon: "tv",
    sortOrder: 3,
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    fixedId: newId(),
    householdId: HOUSEHOLD_ID,
    name: "헬스장",
    amount: 70_000,
    dayOfMonth: 20,
    categoryId: null,
    color: "#8B5CF6",
    icon: "dumbbell",
    sortOrder: 4,
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
];

type CreateInput = Omit<
  FixedDetailItemType,
  "fixedId" | "frstRegDt" | "lastMdfcnDt" | "dataStatCd"
>;

export const fixedMockStore = {
  list(): FixedListItemType[] {
    return store.map((f, idx) => ({ ...f, rowNo: idx + 1 }));
  },
  detail(id: string): FixedDetailItemType | undefined {
    return store.find((f) => f.fixedId === id);
  },
  create(input: CreateInput): FixedDetailItemType {
    const item: FixedDetailItemType = {
      ...input,
      fixedId: newId(),
      frstRegDt: todayIso(),
      lastMdfcnDt: todayIso(),
      dataStatCd: "ACTIVE",
    };
    store = [item, ...store];
    return item;
  },
  update(
    id: string,
    patch: Partial<FixedDetailItemType>,
  ): FixedDetailItemType | undefined {
    const idx = store.findIndex((f) => f.fixedId === id);
    if (idx < 0) return undefined;
    const current = store[idx];
    if (!current) return undefined;
    const next: FixedDetailItemType = {
      ...current,
      ...patch,
      lastMdfcnDt: todayIso(),
    };
    store[idx] = next;
    return next;
  },
  remove(id: string) {
    store = store.filter((f) => f.fixedId !== id);
  },
};
