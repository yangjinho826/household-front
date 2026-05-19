import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";

import type {
  FixedCreateRequest,
  FixedDetailItemType,
  FixedListItemType,
  FixedSearchRequestType,
  FixedUpdateRequest,
} from "./types";

type BackendFixedResponse = Omit<FixedDetailItemType, "fixedId"> & {
  id: string;
};

export async function GetFixedSearchApi(params: FixedSearchRequestType) {
  const queryString = objectToParams({ ...params }).toString();
  const res = await apiFetch<ApiResponse<BackendFixedResponse[]>>(
    `/api/fixed/list${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
  const items = (res.body.data ?? []).map(
    ({ id, ...rest }, idx): FixedListItemType => ({
      ...rest,
      fixedId: id,
      rowNo: idx + 1,
    }),
  );
  const wrapped: ApiListResponse<FixedListItemType> = {
    code: res.body.code,
    message: res.body.message,
    status: res.body.status,
    data: {
      listSize: items.length,
      currentPage: 1,
      currentCount: items.length,
      totalElements: items.length,
      totalPages: 1,
      content: items,
    },
  };
  return { ...res, body: wrapped };
}

export async function GetFixedDetailApi(fixedId: string) {
  const res = await apiFetch<ApiResponse<BackendFixedResponse>>(
    `/api/fixed/detail/${fixedId}`,
    { method: "GET" },
  );
  const { id, ...rest } = res.body.data;
  const mapped: FixedDetailItemType = { ...rest, fixedId: id };
  return { ...res, body: { ...res.body, data: mapped } };
}

export async function PostFixedCreateApi(params: FixedCreateRequest) {
  const res = await apiFetch<ApiResponse<BackendFixedResponse>>(
    `/api/fixed/create`,
    { method: "POST", body: params, errorHandleMethod: "reject" },
  );
  const { id, ...rest } = res.body.data;
  const mapped: FixedDetailItemType = { ...rest, fixedId: id };
  return { ...res, body: { ...res.body, data: mapped } };
}

export async function PutFixedUpdateApi(params: FixedUpdateRequest) {
  const { fixedId, ...rest } = params;
  return apiFetch<ApiResponse<void>>(
    `/api/fixed/update/${fixedId}`,
    { method: "PUT", body: rest, errorHandleMethod: "reject" },
  );
}

export function DeleteFixedDeleteApi(fixedId: string) {
  return apiFetch<ApiResponse<void>>(
    `/api/fixed/delete/${fixedId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}

interface BackendFixedMonthlyUsage {
  fixedExpenseId: string;
  used: number | string;
}

interface BackendFixedMonthlySummary {
  month: string;
  items: BackendFixedMonthlyUsage[];
}

export interface FixedMonthlySummaryType {
  month: string;
  usages: Record<string, number>; // fixedId → used
}

/**
 * 고정지출별 해당 월 누적 사용액. month 생략 시 백엔드가 KST 이번달.
 */
export async function GetFixedMonthlySummaryApi(month?: string) {
  const queryString = month ? `?month=${month}` : "";
  const res = await apiFetch<ApiResponse<BackendFixedMonthlySummary>>(
    `/api/fixed/monthly-summary${queryString}`,
    { method: "GET" },
  );
  const b = res.body.data;
  const usages: Record<string, number> = {};
  for (const item of b.items) {
    usages[item.fixedExpenseId] =
      typeof item.used === "number" ? item.used : Number(item.used);
  }
  const data: FixedMonthlySummaryType = { month: b.month, usages };
  return { ...res, body: { ...res.body, data } };
}
