import { accountMockStore } from "_features/account/mock";
import { firstDayOfMonthKst, parseKstDate } from "_utilities/datetime";

import type {
  AccountSnapshotBalanceItem,
  AccountSnapshotMonthItem,
  AccountSnapshotYearly,
  AccountSnapshotYearlyRequest,
} from "./types";

// 메모리 store: snapshotDate -> 계좌별 row 목록
const store = new Map<string, AccountSnapshotBalanceItem[]>();

// 시드 — 11개월 전 ~ 지난달 (이번달 제외, 사용자가 create 버튼으로 추가)
function seed() {
  const accounts = accountMockStore.list();

  for (let i = 11; i >= 1; i -= 1) {
    const key = firstDayOfMonthKst(-i);
    const ratio = (12 - i) / 12;
    const items: AccountSnapshotBalanceItem[] = accounts.map((acc) => {
      const target = acc.balance ?? 0;
      const noise = (acc.sortOrder ?? 1) * 50_000 * (i % 2 === 0 ? 1 : -1);
      return {
        accountId: acc.accountId,
        accountName: acc.name,
        balance: Math.round(target * ratio + noise),
      };
    });
    store.set(key, items);
  }
}
seed();

function buildMonthItem(
  snapshotDate: string,
  items: AccountSnapshotBalanceItem[],
): AccountSnapshotMonthItem {
  return {
    snapshotDate,
    totalBalance: items.reduce((sum, it) => sum + it.balance, 0),
    accounts: items,
  };
}

/** "YYYY-MM-DD" → KST 기준 그달 1일 "YYYY-MM-DD" */
function normalizeToMonthFirst(yyyyMmDd: string): string {
  return parseKstDate(yyyyMmDd).startOf("month").format("YYYY-MM-DD");
}

export const accountSnapshotMockStore = {
  /**
   * 1년 추이 — default 12개월 (이번달 - 11 ~ 이번달).
   */
  yearly(params: AccountSnapshotYearlyRequest = {}): AccountSnapshotYearly {
    const currentFirst = firstDayOfMonthKst(0);

    const toDate = params.to ? normalizeToMonthFirst(params.to) : currentFirst;
    const fromDate = params.from
      ? normalizeToMonthFirst(params.from)
      : parseKstDate(toDate)
          .subtract(11, "month")
          .startOf("month")
          .format("YYYY-MM-DD");

    const monthsInRange = Array.from(store.entries())
      .filter(([k]) => k >= fromDate && k <= toDate)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, items]) => buildMonthItem(k, items));

    return {
      months: monthsInRange,
      currentMonthSaved: store.has(currentFirst),
      currentMonthDate: currentFirst,
    };
  },

  /**
   * 이번달 row 이미 있으면 throw — UX 동일.
   * 없으면 active 계좌들 현재 balance 를 그달 1일자로 push.
   */
  create(): AccountSnapshotMonthItem {
    const target = firstDayOfMonthKst(0);
    if (store.has(target)) {
      throw new Error("SNAPSHOT_ALREADY_EXISTS");
    }
    const accounts = accountMockStore
      .list()
      .filter((a) => !a.isArchived);
    if (accounts.length === 0) {
      throw new Error("NO_ACTIVE_ACCOUNT");
    }

    const items: AccountSnapshotBalanceItem[] = accounts.map((acc) => ({
      accountId: acc.accountId,
      accountName: acc.name,
      balance: acc.balance ?? 0,
    }));
    store.set(target, items);
    return buildMonthItem(target, items);
  },
};
