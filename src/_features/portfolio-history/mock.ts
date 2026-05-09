import { newId, todayIso } from "_utilities/fmt";

import type {
  PortfolioHistoryItemType,
  PortfolioMonthlyAggregate,
} from "./types";

// portfolio mock 의 시드 종목 ID 와 매칭은 random — 차트용이라 OK
const ITEM_IDS = ["p-mock-1", "p-mock-2", "p-mock-3"];

function lastDayOfMonth(year: number, monthIdx: number): string {
  const d = new Date(year, monthIdx + 1, 0);
  return d.toISOString().slice(0, 10);
}

function buildMonths(count: number): string[] {
  const now = new Date();
  const months: string[] = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(lastDayOfMonth(d.getFullYear(), d.getMonth()));
  }
  return months;
}

const months = buildMonths(6);

// 시드: 종목별 월별 평가액 (mock 시각 — 우상향 + 변동)
const seedByItem: Record<string, number[]> = {
  "p-mock-1": [900_000, 950_000, 1_000_000, 980_000, 1_020_000, 1_050_000],
  "p-mock-2": [
    6_500_000,
    6_800_000,
    7_000_000,
    6_900_000,
    7_100_000,
    7_200_000,
  ],
  "p-mock-3": [
    4_000_000,
    4_100_000,
    4_300_000,
    4_400_000,
    4_450_000,
    4_500_000,
  ],
};

const store: PortfolioHistoryItemType[] = ITEM_IDS.flatMap((itemId) =>
  months.map((monthEnd, idx) => ({
    historyId: newId(),
    portfolioItemId: itemId,
    recordDate: monthEnd,
    value: seedByItem[itemId]?.[idx] ?? 0,
    quantity: null,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  })),
);

export const portfolioHistoryMockStore = {
  list(params?: { portfolioItemId?: string }): PortfolioHistoryItemType[] {
    if (params?.portfolioItemId) {
      return store.filter((i) => i.portfolioItemId === params.portfolioItemId);
    }
    return store;
  },
  /**
   * 월별 전체 평가액 합산 (차트용).
   * recordDate 의 YYYY-MM 기준으로 그룹화.
   */
  aggregateByMonth(): PortfolioMonthlyAggregate[] {
    const map = new Map<string, number>();
    for (const item of store) {
      const key = item.recordDate.slice(0, 7);
      map.set(key, (map.get(key) ?? 0) + item.value);
    }
    return Array.from(map.entries())
      .map(([month, value]) => ({ month, value }))
      .sort((a, b) => a.month.localeCompare(b.month));
  },
};
