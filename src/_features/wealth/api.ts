import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type { ApiResponse } from "_libraries/fetch/response";

import type { AccountListItemType } from "_features/account/types";
import type { AccountSnapshotYearly } from "_features/account-snapshot/types";

import type { WealthOverviewRequest, WealthOverviewType } from "./types";

type BackendAccount = Omit<AccountListItemType, "accountId"> & {
  id: string;
};

interface BackendWealthOverview {
  totalBalance: number;
  accounts: BackendAccount[];
  yearlySnapshots: AccountSnapshotYearly;
  allocation: WealthOverviewType["allocation"];
}

function toAccount(b: BackendAccount): AccountListItemType {
  const { id, ...rest } = b;
  return { ...rest, accountId: id };
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
    accounts: res.body.data.accounts.map((a) => toAccount(a)),
    yearlySnapshots: res.body.data.yearlySnapshots,
    allocation: res.body.data.allocation,
  };
  return { ...res, body: { ...res.body, data: mapped } };
}
