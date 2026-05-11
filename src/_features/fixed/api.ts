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

const num = (v: number | string) => (typeof v === "number" ? v : Number(v));

interface BackendFixedResponse {
  id: string;
  household_id: string;
  name: string;
  amount: number | string;
  day_of_month: number;
  category_id: string | null;
  category_name: string | null;
  category_color: string | null;
  category_icon: string | null;
  color: string | null;
  icon: string | null;
  sort_order: number;
  is_archived: boolean;
}

function mapToListItem(
  b: BackendFixedResponse,
  rowNo: number,
): FixedListItemType {
  return {
    rowNo,
    fixedId: b.id,
    householdId: b.household_id,
    name: b.name,
    amount: num(b.amount),
    dayOfMonth: b.day_of_month,
    categoryId: b.category_id,
    categoryName: b.category_name,
    categoryColor: b.category_color,
    categoryIcon: b.category_icon,
    color: b.color,
    icon: b.icon,
    sortOrder: b.sort_order,
    isArchived: b.is_archived,
    frstRegDt: "",
    lastMdfcnDt: "",
    dataStatCd: "ACTIVE",
  };
}

function mapToDetailItem(b: BackendFixedResponse): FixedDetailItemType {
  return {
    fixedId: b.id,
    householdId: b.household_id,
    name: b.name,
    amount: num(b.amount),
    dayOfMonth: b.day_of_month,
    categoryId: b.category_id,
    categoryName: b.category_name,
    categoryColor: b.category_color,
    categoryIcon: b.category_icon,
    color: b.color,
    icon: b.icon,
    sortOrder: b.sort_order,
    isArchived: b.is_archived,
    frstRegDt: "",
    lastMdfcnDt: "",
    dataStatCd: "ACTIVE",
  };
}

export async function GetFixedSearchApi(params: FixedSearchRequestType) {
  const queryString = objectToParams({ ...params }).toString();
  const res = await apiFetch<ApiResponse<BackendFixedResponse[]>>(
    `/api/fixed/list${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
  const items = (res.body.data ?? []).map((b, idx) =>
    mapToListItem(b, idx + 1),
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
  return {
    ...res,
    body: { ...res.body, data: mapToDetailItem(res.body.data) },
  };
}

export async function PostFixedCreateApi(params: FixedCreateRequest) {
  const res = await apiFetch<ApiResponse<BackendFixedResponse>>(
    `/api/fixed/create`,
    {
      method: "POST",
      body: {
        name: params.name,
        amount: params.amount,
        day_of_month: params.dayOfMonth,
        category_id: params.categoryId ?? null,
        color: params.color ?? null,
        icon: params.icon ?? null,
        sort_order: params.sortOrder,
      },
      errorHandleMethod: "reject",
    },
  );
  return {
    ...res,
    body: { ...res.body, data: mapToDetailItem(res.body.data) },
  };
}

export async function PutFixedUpdateApi(params: FixedUpdateRequest) {
  const res = await apiFetch<ApiResponse<BackendFixedResponse>>(
    `/api/fixed/update/${params.fixedId}`,
    {
      method: "PUT",
      body: {
        name: params.name,
        amount: params.amount,
        day_of_month: params.dayOfMonth,
        category_id: params.categoryId ?? null,
        color: params.color ?? null,
        icon: params.icon ?? null,
        sort_order: params.sortOrder,
        is_archived: params.isArchived,
      },
      errorHandleMethod: "reject",
    },
  );
  return {
    ...res,
    body: { ...res.body, data: undefined as unknown as void },
  };
}

export function DeleteFixedDeleteApi(fixedId: string) {
  return apiFetch<ApiResponse<void>>(
    `/api/fixed/delete/${fixedId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}
