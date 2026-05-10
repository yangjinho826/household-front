import { newId, todayIso } from "_utilities/fmt";

import type {
  AccountDetailItemType,
  AccountListItemType,
} from "./types";

const HOUSEHOLD_ID = "h-mock-1";

// 명시적 ID — portfolio mock 등 cross-domain 참조용
export const MOCK_INVESTMENT_ACCOUNT_ID = "a-mock-investment-1";

let store: AccountDetailItemType[] = [
  {
    accountId: newId(),
    householdId: HOUSEHOLD_ID,
    name: "주거래 통장",
    accountType: "LIVING",
    startBalance: 2_450_000,
    balance: 2_450_000,
    color: "#3182F6",
    icon: "wallet",
    sortOrder: 1,
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    accountId: newId(),
    householdId: HOUSEHOLD_ID,
    name: "비상금",
    accountType: "SAVINGS",
    startBalance: 1_200_000,
    balance: 1_200_000,
    color: "#22C55E",
    icon: "piggy-bank",
    sortOrder: 2,
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    accountId: newId(),
    householdId: HOUSEHOLD_ID,
    name: "월급통장",
    accountType: "LIVING",
    startBalance: 3_480_000,
    balance: 3_480_000,
    color: "#3182F6",
    icon: "wallet",
    sortOrder: 3,
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    accountId: MOCK_INVESTMENT_ACCOUNT_ID,
    householdId: HOUSEHOLD_ID,
    name: "신한증권",
    accountType: "INVESTMENT",
    startBalance: 0,
    balance: 0, // portfolio 합으로 derive
    color: "#8B5CF6",
    icon: "trending-up",
    sortOrder: 5,
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
];

type CreateInput = Omit<
  AccountDetailItemType,
  "accountId" | "frstRegDt" | "lastMdfcnDt" | "dataStatCd"
>;

export const accountMockStore = {
  list(): AccountListItemType[] {
    return store.map((a, idx) => ({ ...a, rowNo: idx + 1 }));
  },
  detail(id: string): AccountDetailItemType | undefined {
    return store.find((a) => a.accountId === id);
  },
  create(input: CreateInput): AccountDetailItemType {
    const item: AccountDetailItemType = {
      ...input,
      accountId: newId(),
      frstRegDt: todayIso(),
      lastMdfcnDt: todayIso(),
      dataStatCd: "ACTIVE",
    };
    store = [item, ...store];
    return item;
  },
  update(
    id: string,
    patch: Partial<AccountDetailItemType>,
  ): AccountDetailItemType | undefined {
    const idx = store.findIndex((a) => a.accountId === id);
    if (idx < 0) return undefined;
    const current = store[idx];
    if (!current) return undefined;
    const next: AccountDetailItemType = {
      ...current,
      ...patch,
      lastMdfcnDt: todayIso(),
    };
    store[idx] = next;
    return next;
  },
  remove(id: string) {
    store = store.filter((a) => a.accountId !== id);
  },
};
