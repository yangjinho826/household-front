import type { AccountListItemType } from "_features/account/types";
import type { MonthlyStatsType } from "_features/stats/types";
import type { TransactionListItemType } from "_features/transaction/types";

/** GET /home/overview 응답 — 홈 페이지 1호출 묶음 */
export interface HomeOverviewType {
  totalBalance: number;
  accounts: AccountListItemType[];
  recentTransactions: TransactionListItemType[];
  stats: MonthlyStatsType;
  year: number;
  month: number;
}

export interface HomeOverviewRequest {
  year?: number;
  month?: number;
}
