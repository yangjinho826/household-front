export interface AccountSnapshotYearlyRequest {
  from?: string; // YYYY-MM-DD (월 1일)
  to?: string; // YYYY-MM-DD (월 1일)
}

// 월별 묶음 안의 계좌별 row
export interface AccountSnapshotBalanceItem {
  accountId: string;
  accountName: string;
  balance: number;
}

// 한 달 스냅샷 묶음 — 백엔드가 미리 합산
export interface AccountSnapshotMonthItem {
  snapshotDate: string; // YYYY-MM-DD (그달 1일)
  totalBalance: number;
  accounts: AccountSnapshotBalanceItem[];
}

// 1년 (또는 임의 기간) 추이 응답
export interface AccountSnapshotYearly {
  months: AccountSnapshotMonthItem[];
  targetMonthSaved: boolean;
  targetMonthDate: string; // YYYY-MM-DD (박제 대상 = 지난달 1일)
}
