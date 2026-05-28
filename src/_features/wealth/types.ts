import type { AccountListItemType } from "_features/account/types";
import type { AccountSnapshotYearly } from "_features/account-snapshot/types";

export interface WealthOverviewRequest {
  fromDate?: string;
  toDate?: string;
}

/** GET /wealth/overview 응답 — 자산 페이지 1호출 묶음 */
export interface WealthOverviewType {
  totalBalance: number;
  accounts: AccountListItemType[];
  yearlySnapshots: AccountSnapshotYearly;
}
