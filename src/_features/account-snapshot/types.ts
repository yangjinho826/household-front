export interface AccountSnapshotSearchRequestType {
  accountId?: string;
}

export interface AccountSnapshotItemType {
  snapshotId: string;
  accountId: string;
  snapshotDate: string; // YYYY-MM-DD (월말)
  balance: number;
  frstRegDt: string;
  lastMdfcnDt: string;
  dataStatCd: string;
}

export interface AccountMonthlyAggregate {
  month: string; // YYYY-MM
  total: number; // 전체 계좌 잔액 합산
}
