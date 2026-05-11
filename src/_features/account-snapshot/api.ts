import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type { ApiResponse } from "_libraries/fetch/response";

import type {
  AccountSnapshotMonthItem,
  AccountSnapshotYearly,
  AccountSnapshotYearlyRequest,
} from "./types";

const num = (v: number | string) => (typeof v === "number" ? v : Number(v));

interface BackendSnapshotBalance {
  account_id: string;
  account_name: string;
  balance: number | string;
}

interface BackendSnapshotMonth {
  snapshot_date: string;
  total_balance: number | string;
  accounts: BackendSnapshotBalance[];
}

interface BackendSnapshotYearly {
  months: BackendSnapshotMonth[];
  current_month_saved: boolean;
  current_month_date: string;
}

function mapBalance(b: BackendSnapshotBalance) {
  return {
    accountId: b.account_id,
    accountName: b.account_name,
    balance: num(b.balance),
  };
}

function mapMonth(b: BackendSnapshotMonth): AccountSnapshotMonthItem {
  return {
    snapshotDate: b.snapshot_date,
    totalBalance: num(b.total_balance),
    accounts: b.accounts.map(mapBalance),
  };
}

function mapYearly(b: BackendSnapshotYearly): AccountSnapshotYearly {
  return {
    months: b.months.map(mapMonth),
    currentMonthSaved: b.current_month_saved,
    currentMonthDate: b.current_month_date,
  };
}

export async function GetAccountSnapshotYearlyApi(
  params: AccountSnapshotYearlyRequest = {},
) {
  const queryParams: Record<string, unknown> = {};
  if (params.from) queryParams.from = params.from;
  if (params.to) queryParams.to = params.to;

  const queryString = objectToParams(queryParams).toString();
  const res = await apiFetch<ApiResponse<BackendSnapshotYearly>>(
    `/api/account-snapshot/yearly${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
  return {
    ...res,
    body: { ...res.body, data: mapYearly(res.body.data) },
  };
}

/**
 * 이번 달 자산 스냅샷 저장 — 백엔드가 KST 기준 자동 결정.
 * 같은 달 이미 있으면 백엔드 SNAPSHOT_ALREADY_EXISTS 에러.
 */
export async function PostAccountSnapshotCreateApi() {
  const res = await apiFetch<ApiResponse<BackendSnapshotMonth>>(
    `/api/account-snapshot/create`,
    {
      method: "POST",
      errorHandleMethod: "reject",
    },
  );
  return {
    ...res,
    body: { ...res.body, data: mapMonth(res.body.data) },
  };
}
