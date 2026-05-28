import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type { ApiResponse } from "_libraries/fetch/response";

import type { AccountListItemType } from "_features/account/types";
import type { AccountSnapshotYearly } from "_features/account-snapshot/types";

import type { WealthOverviewRequest, WealthOverviewType } from "./types";

type BackendAccount = Omit<AccountListItemType, "accountId" | "rowNo"> & {
  id: string;
};

interface BackendWealthOverview {
  totalBalance: number;
  accounts: BackendAccount[];
  yearlySnapshots: AccountSnapshotYearly;
}

function toAccount(b: BackendAccount, rowNo: number): AccountListItemType {
  const { id, ...rest } = b;
  return { ...rest, accountId: id, rowNo };
}

export async function GetWealthOverviewApi(params: WealthOverviewRequest = {}) {
  const queryParams: Record<string, unknown> = {};
  if (params.fromDate) queryParams.fromDate = params.fromDate;
  if (params.toDate) queryParams.toDate = params.toDate;
  const queryString = objectToParams(queryParams).toString();

  const res = await apiFetch<ApiResponse<BackendWealthOverview>>(
    `/api/wealth/overview${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );

  const mapped: WealthOverviewType = {
    totalBalance: res.body.data.totalBalance,
    accounts: res.body.data.accounts.map((a, i) => toAccount(a, i + 1)),
    yearlySnapshots: res.body.data.yearlySnapshots,
  };
  return { ...res, body: { ...res.body, data: mapped } };
}
