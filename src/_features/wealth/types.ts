import type { AccountListItemType } from "_features/account/types";
import type { AccountSnapshotYearly } from "_features/account-snapshot/types";
import type { AssetClass } from "_features/portfolio/types";

export interface WealthOverviewRequest {
  fromDate?: string;
  toDate?: string;
}

/** 자산 성격 1조각 — 배분 파이의 한 칸 */
export interface AssetClassSliceType {
  assetClass: AssetClass;
  valuation: number;
  ratio: number; // 전체 대비 비중 (%, 0~100)
}

/** 자산군별 배분 — 현재 시점 */
export interface AllocationType {
  currentAllocation: AssetClassSliceType[];
}

/** GET /wealth/overview 응답 — 자산 페이지 1호출 묶음 */
export interface WealthOverviewType {
  totalBalance: number;
  accounts: AccountListItemType[];
  yearlySnapshots: AccountSnapshotYearly;
  allocation: AllocationType;
}
