import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type { ApiResponse } from "_libraries/fetch/response";

import type { AccountListItemType } from "_features/account/types";
import type { TransactionListItemType } from "_features/transaction/types";

import type { HomeOverviewRequest, HomeOverviewType } from "./types";

// 백엔드 응답: account PK 는 `id`, transaction PK 도 `id`.
// 프론트 타입은 각각 `accountId` / `transactionId` 로 통일.
type BackendAccount = Omit<AccountListItemType, "accountId"> & {
  id: string;
};
type BackendTransaction = Omit<TransactionListItemType, "transactionId"> & {
  id: string;
};

interface BackendHomeOverview
  extends Omit<HomeOverviewType, "accounts" | "recentTransactions"> {
  accounts: BackendAccount[];
  recentTransactions: BackendTransaction[];
}

function toAccount(b: BackendAccount): AccountListItemType {
  const { id, ...rest } = b;
  return { ...rest, accountId: id };
}

function toTransaction(b: BackendTransaction): TransactionListItemType {
  const { id, ...rest } = b;
  return { ...rest, transactionId: id };
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
    accounts: res.body.data.accounts.map((a) => toAccount(a)),
    recentTransactions: res.body.data.recentTransactions.map((t) =>
      toTransaction(t),
    ),
    stats: res.body.data.stats,
    year: res.body.data.year,
    month: res.body.data.month,
  };
  return { ...res, body: { ...res.body, data: mapped } };
}
