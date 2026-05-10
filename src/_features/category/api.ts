import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";
import { mockOkItem, mockOkList } from "_utilities/mock-response";

import { categoryMockStore } from "./mock";
import type {
  CategoryCreateRequest,
  CategoryDetailItemType,
  CategoryKind,
  CategoryListItemType,
  CategorySearchRequestType,
  CategoryUpdateRequest,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_CATEGORY === "true";

const wrap = <T>(data: T) => ({ body: data });

interface BackendCategoryResponse {
  id: string;
  household_id: string;
  is_income: boolean;
  name: string;
  color: string | null;
  icon: string | null;
  sort_order: number;
  is_archived: boolean;
}

const toKind = (isIncome: boolean): CategoryKind =>
  isIncome ? "income" : "expense";

function mapToListItem(
  b: BackendCategoryResponse,
  rowNo: number,
): CategoryListItemType {
  return {
    rowNo,
    categoryId: b.id,
    householdId: b.household_id,
    kind: toKind(b.is_income),
    name: b.name,
    color: b.color,
    icon: b.icon,
    sortOrder: b.sort_order,
    isArchived: b.is_archived,
    frstRegDt: "",
    lastMdfcnDt: "",
    dataStatCd: "ACTIVE",
  };
}

function mapToDetailItem(b: BackendCategoryResponse): CategoryDetailItemType {
  return {
    categoryId: b.id,
    householdId: b.household_id,
    kind: toKind(b.is_income),
    name: b.name,
    color: b.color,
    icon: b.icon,
    sortOrder: b.sort_order,
    isArchived: b.is_archived,
    frstRegDt: "",
    lastMdfcnDt: "",
    dataStatCd: "ACTIVE",
  };
}

export async function GetCategorySearchApi(params: CategorySearchRequestType) {
  if (USE_MOCK) {
    const items = categoryMockStore.list();
    const filtered = items.filter((i) => {
      if (
        params.searchTerm &&
        !i.name.toLowerCase().includes(params.searchTerm.toLowerCase())
      )
        return false;
      if (params.kind && i.kind !== params.kind) return false;
      if (params.isArchived !== undefined && i.isArchived !== params.isArchived)
        return false;
      return true;
    });
    return wrap(mockOkList(filtered));
  }

  const queryString = objectToParams({ ...params }).toString();
  const res = await apiFetch<ApiResponse<BackendCategoryResponse[]>>(
    `/api/category/list${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
  const items = (res.body.data ?? []).map((b, idx) =>
    mapToListItem(b, idx + 1),
  );
  const wrapped: ApiListResponse<CategoryListItemType> = {
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

export async function GetCategoryDetailApi(categoryId: string) {
  if (USE_MOCK) {
    const item = categoryMockStore.detail(categoryId);
    if (!item) return Promise.reject(new Error("category not found"));
    return wrap(mockOkItem(item));
  }
  const listRes = await apiFetch<ApiResponse<BackendCategoryResponse[]>>(
    `/api/category/list`,
    { method: "GET" },
  );
  const found = (listRes.body.data ?? []).find((c) => c.id === categoryId);
  if (!found) return Promise.reject(new Error("category not found"));
  return wrap(mockOkItem(mapToDetailItem(found)));
}

export async function PostCategoryCreateApi(params: CategoryCreateRequest) {
  if (USE_MOCK) {
    const item = categoryMockStore.create({
      householdId: params.householdId,
      kind: params.kind,
      name: params.name,
      color: params.color ?? null,
      icon: params.icon ?? null,
      sortOrder: params.sortOrder,
      isArchived: params.isArchived,
    });
    return wrap(mockOkItem(item));
  }
  const res = await apiFetch<ApiResponse<BackendCategoryResponse>>(
    `/api/category/create`,
    {
      method: "POST",
      body: {
        is_income: params.kind === "income",
        name: params.name,
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

export async function PutCategoryUpdateApi(params: CategoryUpdateRequest) {
  if (USE_MOCK) {
    const { categoryId, ...rest } = params;
    categoryMockStore.update(categoryId, {
      ...rest,
      color: rest.color ?? null,
      icon: rest.icon ?? null,
    });
    return wrap(mockOkItem(undefined as unknown as void));
  }
  const res = await apiFetch<ApiResponse<BackendCategoryResponse>>(
    `/api/category/update/${params.categoryId}`,
    {
      method: "PUT",
      body: {
        is_income: params.kind === "income",
        name: params.name,
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

export function DeleteCategoryDeleteApi(categoryId: string) {
  if (USE_MOCK) {
    categoryMockStore.remove(categoryId);
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/category/delete/${categoryId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}
