import { newId, todayIso } from "_utilities/fmt";

import type {
  TransactionDetailItemType,
  TransactionListItemType,
} from "./types";

const HOUSEHOLD_ID = "h-mock-1";
const ACCOUNT_MAIN = "a-mock-main";
const ACCOUNT_SAVINGS = "a-mock-savings";

let store: TransactionDetailItemType[] = [
  {
    transactionId: newId(),
    householdId: HOUSEHOLD_ID,
    txType: "EXPENSE",
    amount: 12_500,
    txDate: todayIso(),
    accountId: ACCOUNT_MAIN,
    toAccountId: null,
    categoryId: null,
    paidByUserId: null,
    isFixed: false,
    memo: "점심 김밥",
    accountName: "주거래 통장",
    categoryName: "식비",
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    transactionId: newId(),
    householdId: HOUSEHOLD_ID,
    txType: "EXPENSE",
    amount: 4_500,
    txDate: todayIso(),
    accountId: ACCOUNT_MAIN,
    toAccountId: null,
    categoryId: null,
    paidByUserId: null,
    isFixed: false,
    memo: "지하철",
    accountName: "주거래 통장",
    categoryName: "교통",
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    transactionId: newId(),
    householdId: HOUSEHOLD_ID,
    txType: "INCOME",
    amount: 3_200_000,
    txDate: todayIso(),
    accountId: ACCOUNT_MAIN,
    toAccountId: null,
    categoryId: null,
    paidByUserId: null,
    isFixed: false,
    memo: "5월 급여",
    accountName: "주거래 통장",
    categoryName: "월급",
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    transactionId: newId(),
    householdId: HOUSEHOLD_ID,
    txType: "TRANSFER",
    amount: 500_000,
    txDate: todayIso(),
    accountId: ACCOUNT_MAIN,
    toAccountId: ACCOUNT_SAVINGS,
    categoryId: null,
    paidByUserId: null,
    isFixed: false,
    memo: "비상금 이체",
    accountName: "주거래 통장",
    toAccountName: "비상금",
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
];

type CreateInput = Omit<
  TransactionDetailItemType,
  "transactionId" | "frstRegDt" | "lastMdfcnDt" | "dataStatCd"
>;

export const transactionMockStore = {
  list(): TransactionListItemType[] {
    return store.map((t, idx) => ({ ...t, rowNo: idx + 1 }));
  },
  detail(id: string): TransactionDetailItemType | undefined {
    return store.find((t) => t.transactionId === id);
  },
  create(input: CreateInput): TransactionDetailItemType {
    const item: TransactionDetailItemType = {
      ...input,
      transactionId: newId(),
      frstRegDt: todayIso(),
      lastMdfcnDt: todayIso(),
      dataStatCd: "ACTIVE",
    };
    store = [item, ...store];
    return item;
  },
  update(
    id: string,
    patch: Partial<TransactionDetailItemType>,
  ): TransactionDetailItemType | undefined {
    const idx = store.findIndex((t) => t.transactionId === id);
    if (idx < 0) return undefined;
    const current = store[idx];
    if (!current) return undefined;
    const next: TransactionDetailItemType = {
      ...current,
      ...patch,
      lastMdfcnDt: todayIso(),
    };
    store[idx] = next;
    return next;
  },
  remove(id: string) {
    store = store.filter((t) => t.transactionId !== id);
  },
};
