import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type { ApiResponse } from "_libraries/fetch/response";

import type { AccountListItemType } from "_features/account/types";
import type { TransactionListItemType } from "_features/transaction/types";

import type { HomeOverviewRequest, HomeOverviewType } from "./types";

// 백엔드 응답: account PK 는 `id`, transaction PK 도 `id`.
// 프론트 타입은 각각 `accountId` / `transactionId` 로 통일.
type BackendAccount = Omit<AccountListItemType, "accountId" | "rowNo"> & {
  id: string;
};
type BackendTransaction = Omit<
  TransactionListItemType,
  "transactionId" | "rowNo"
> & { id: string };

interface BackendHomeOverview
  extends Omit<HomeOverviewType, "accounts" | "recentTransactions"> {
  accounts: BackendAccount[];
  recentTransactions: BackendTransaction[];
}

function toAccount(b: BackendAccount, rowNo: number): AccountListItemType {
  const { id, ...rest } = b;
  return { ...rest, accountId: id, rowNo };
}

function toTransaction(
  b: BackendTransaction,
  rowNo: number,
): TransactionListItemType {
  const { id, ...rest } = b;
  return { ...rest, transactionId: id, rowNo };
}

export async function GetHomeOverviewApi(params: HomeOverviewRequest = {}) {
  const queryParams: Record<string, unknown> = {};
  if (params.year !== undefined) queryParams.year = params.year;
  if (params.month !== undefined) queryParams.month = params.month;
  const queryString = objectToParams(queryParams).toString();

  const res = await apiFetch<ApiResponse<BackendHomeOverview>>(
    `/api/home/overview${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );

  const mapped: HomeOverviewType = {
    totalBalance: res.body.data.totalBalance,
    accounts: res.body.data.accounts.map((a, i) => toAccount(a, i + 1)),
    recentTransactions: res.body.data.recentTransactions.map((t, i) =>
      toTransaction(t, i + 1),
    ),
    stats: res.body.data.stats,
    year: res.body.data.year,
    month: res.body.data.month,
  };
  return { ...res, body: { ...res.body, data: mapped } };
}
