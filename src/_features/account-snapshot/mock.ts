import { newId, todayIso } from "_utilities/fmt";

import type {
  AccountMonthlyAggregate,
  AccountSnapshotItemType,
} from "./types";

const ACCOUNT_IDS = [
  "a-mock-1",
  "a-mock-2",
  "a-mock-3",
  "a-mock-4",
  "a-mock-5",
];

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

// 시드: 계좌별 월말 잔액 (mock)
const seedByAccount: Record<string, number[]> = {
  "a-mock-1": [2_100_000, 2_200_000, 2_300_000, 2_400_000, 2_420_000, 2_450_000],
  "a-mock-2": [800_000, 900_000, 1_000_000, 1_100_000, 1_150_000, 1_200_000],
  "a-mock-3": [3_200_000, 3_300_000, 3_350_000, 3_400_000, 3_450_000, 3_480_000],
  "a-mock-4": [
    -100_000,
    -200_000,
    -150_000,
    -300_000,
    -350_000,
    -380_000,
  ],
  "a-mock-5": [
    7_500_000,
    7_800_000,
    8_000_000,
    8_200_000,
    8_400_000,
    8_500_000,
  ],
};

const store: AccountSnapshotItemType[] = ACCOUNT_IDS.flatMap((accountId) =>
  months.map((monthEnd, idx) => ({
    snapshotId: newId(),
    accountId,
    snapshotDate: monthEnd,
    balance: seedByAccount[accountId]?.[idx] ?? 0,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  })),
);

export const accountSnapshotMockStore = {
  list(params?: { accountId?: string }): AccountSnapshotItemType[] {
    if (params?.accountId) {
      return store.filter((i) => i.accountId === params.accountId);
    }
    return store;
  },
  /**
   * 월별 전체 자산 합산 (차트용).
   */
  aggregateByMonth(): AccountMonthlyAggregate[] {
    const map = new Map<string, number>();
    for (const item of store) {
      const key = item.snapshotDate.slice(0, 7);
      map.set(key, (map.get(key) ?? 0) + item.balance);
    }
    return Array.from(map.entries())
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month));
  },
};
