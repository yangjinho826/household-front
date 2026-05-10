import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";
import { mockOkItem, mockOkList } from "_utilities/mock-response";

import { fixedMockStore } from "./mock";
import type {
  FixedCreateRequest,
  FixedDetailItemType,
  FixedListItemType,
  FixedSearchRequestType,
  FixedUpdateRequest,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_FIXED === "true";

const wrap = <T>(data: T) => ({ body: data });

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
  if (USE_MOCK) {
    const items = fixedMockStore.list();
    const filtered = items.filter((i) => {
      if (
        params.searchTerm &&
        !i.name.toLowerCase().includes(params.searchTerm.toLowerCase())
      )
        return false;
      if (params.isArchived !== undefined && i.isArchived !== params.isArchived)
        return false;
      return true;
    });
    return wrap(mockOkList(filtered));
  }
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
  if (USE_MOCK) {
    const item = fixedMockStore.detail(fixedId);
    if (!item) return Promise.reject(new Error("fixed not found"));
    return wrap(mockOkItem(item));
  }
  const listRes = await apiFetch<ApiResponse<BackendFixedResponse[]>>(
    `/api/fixed/list`,
    { method: "GET" },
  );
  const found = (listRes.body.data ?? []).find((f) => f.id === fixedId);
  if (!found) return Promise.reject(new Error("fixed not found"));
  return wrap(mockOkItem(mapToDetailItem(found)));
}

export async function PostFixedCreateApi(params: FixedCreateRequest) {
  if (USE_MOCK) {
    const item = fixedMockStore.create({
      householdId: params.householdId,
      name: params.name,
      amount: params.amount,
      dayOfMonth: params.dayOfMonth,
      categoryId: params.categoryId ?? null,
      color: params.color ?? null,
      icon: params.icon ?? null,
      sortOrder: params.sortOrder,
      isArchived: params.isArchived,
    });
    return wrap(mockOkItem(item));
  }
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
  if (USE_MOCK) {
    const { fixedId, ...rest } = params;
    fixedMockStore.update(fixedId, {
      ...rest,
      categoryId: rest.categoryId ?? null,
      color: rest.color ?? null,
      icon: rest.icon ?? null,
    });
    return wrap(mockOkItem(undefined as unknown as void));
  }
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
  if (USE_MOCK) {
    fixedMockStore.remove(fixedId);
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/fixed/delete/${fixedId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}
