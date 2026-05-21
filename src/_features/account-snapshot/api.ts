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
 * 지난달 마감 자산 스냅샷 저장 — 백엔드가 KST 기준 자동 결정.
 * 예: 6/1~6/말 사이에 호출하면 5월 박제.
 * 같은 달 이미 있으면 백엔드 SNAPSHOT_ALREADY_EXISTS 에러.
 */
export async function PostAccountSnapshotCreateApi() {
  return apiFetch<ApiResponse<AccountSnapshotMonthItem>>(
    `/api/account-snapshot/create`,
    {
      method: "POST",
      errorHandleMethod: "reject",
    },
  );
}
