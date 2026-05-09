import { newId, todayIso } from "_utilities/fmt";

import type {
  PortfolioDetailItemType,
  PortfolioListItemType,
} from "./types";

const HOUSEHOLD_ID = "h-mock-1";
const ACCOUNT_ID = "a-mock-broker";

let store: PortfolioDetailItemType[] = [
  {
    portfolioId: newId(),
    householdId: HOUSEHOLD_ID,
    accountId: ACCOUNT_ID,
    ticker: "TIGER 미국S&P500",
    symbol: "360750",
    quantity: 50,
    avgPrice: 18_000,
    currentValue: 1_050_000,
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    portfolioId: newId(),
    householdId: HOUSEHOLD_ID,
    accountId: ACCOUNT_ID,
    ticker: "삼성전자",
    symbol: "005930",
    quantity: 100,
    avgPrice: 65_000,
    currentValue: 7_200_000,
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    portfolioId: newId(),
    householdId: HOUSEHOLD_ID,
    accountId: ACCOUNT_ID,
    ticker: "QQQ",
    symbol: "QQQ",
    quantity: 10,
    avgPrice: 400_000,
    currentValue: 4_500_000,
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
];

type CreateInput = Omit<
  PortfolioDetailItemType,
  "portfolioId" | "frstRegDt" | "lastMdfcnDt" | "dataStatCd"
>;

export const portfolioMockStore = {
  list(): PortfolioListItemType[] {
    return store.map((p, idx) => ({ ...p, rowNo: idx + 1 }));
  },
  detail(id: string): PortfolioDetailItemType | undefined {
    return store.find((p) => p.portfolioId === id);
  },
  create(input: CreateInput): PortfolioDetailItemType {
    const item: PortfolioDetailItemType = {
      ...input,
      portfolioId: newId(),
      frstRegDt: todayIso(),
      lastMdfcnDt: todayIso(),
      dataStatCd: "ACTIVE",
    };
    store = [item, ...store];
    return item;
  },
  update(
    id: string,
    patch: Partial<PortfolioDetailItemType>,
  ): PortfolioDetailItemType | undefined {
    const idx = store.findIndex((p) => p.portfolioId === id);
    if (idx < 0) return undefined;
    const current = store[idx];
    if (!current) return undefined;
    const next: PortfolioDetailItemType = {
      ...current,
      ...patch,
      lastMdfcnDt: todayIso(),
    };
    store[idx] = next;
    return next;
  },
  remove(id: string) {
    store = store.filter((p) => p.portfolioId !== id);
  },
};
