import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiCursorPage,
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

interface BackendCursorPage<T> {
  items: T[];
  nextCursor: string | null;
  hasNext: boolean;
  totalCount: number | null;
}

function toListItem(
  b: BackendFixedResponse,
  rowNo: number,
): FixedListItemType {
  const { id, ...rest } = b;
  return { ...rest, fixedId: id, rowNo };
}

/** 고정지출 목록 — cursor 무한 스크롤 */
export async function GetFixedSearchApi(
  params: FixedSearchRequestType & { cursor?: string | null; limit?: number },
) {
  const queryParams: Record<string, unknown> = {};
  if (params.searchTerm) queryParams.searchTerm = params.searchTerm;
  if (params.isArchived !== undefined)
    queryParams.isArchived = params.isArchived;
  if (params.cursor) queryParams.cursor = params.cursor;
  if (params.limit) queryParams.limit = params.limit;
  const queryString = objectToParams(queryParams).toString();

  const res = await apiFetch<
    ApiResponse<BackendCursorPage<BackendFixedResponse>>
  >(`/api/fixed/list${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
  });
  const items = res.body.data.items.map((b, i) => toListItem(b, i + 1));
  const wrapped: ApiCursorPage<FixedListItemType> = {
    code: res.body.code,
    message: res.body.message,
    status: res.body.status,
    data: {
      items,
      nextCursor: res.body.data.nextCursor,
      hasNext: res.body.data.hasNext,
      totalCount: res.body.data.totalCount,
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
