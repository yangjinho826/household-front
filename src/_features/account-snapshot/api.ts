import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type { ApiResponse } from "_libraries/fetch/response";

import type {
  AccountSnapshotMonthItem,
  AccountSnapshotYearly,
  AccountSnapshotYearlyRequest,
} from "./types";

export async function GetAccountSnapshotYearlyApi(
  params: AccountSnapshotYearlyRequest = {},
) {
  const queryParams: Record<string, unknown> = {};
  if (params.fromDate) queryParams.fromDate = params.fromDate;
  if (params.toDate) queryParams.toDate = params.toDate;

  const queryString = objectToParams(queryParams).toString();
  return apiFetch<ApiResponse<AccountSnapshotYearly>>(
    `/api/account-snapshot/yearly${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
}

/**
 * 수동 박제 — 지난달 자산 스냅샷 저장 (upsert).
 * 예: 6/1~6/말 호출 시 5월 박제. 이미 있으면 덮어씀 (또 눌러도 안전).
 */
export async function PostAccountSnapshotCreateApi(idempotencyKey?: string) {
  return apiFetch<ApiResponse<AccountSnapshotMonthItem>>(
    `/api/account-snapshot/create`,
    {
      method: "POST",
      idempotencyKey,
      errorHandleMethod: "reject",
    },
  );
}
