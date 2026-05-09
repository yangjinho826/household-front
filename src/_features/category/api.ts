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
  CategoryListItemType,
  CategorySearchRequestType,
  CategoryUpdateRequest,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const wrap = <T>(data: T) => ({ body: data });

export function GetCategorySearchApi(params: CategorySearchRequestType) {
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
    return Promise.resolve(wrap(mockOkList(filtered)));
  }
  const queryString = objectToParams({ ...params }).toString();
  return apiFetch<ApiListResponse<CategoryListItemType>>(
    `/api/front/v1/category/list?${queryString}`,
    { method: "GET" },
  );
}

export function GetCategoryDetailApi(categoryId: string) {
  if (USE_MOCK) {
    const item = categoryMockStore.detail(categoryId);
    if (!item) return Promise.reject(new Error("category not found"));
    return Promise.resolve(wrap(mockOkItem(item)));
  }
  return apiFetch<ApiResponse<CategoryDetailItemType>>(
    `/api/front/v1/category/detail/${categoryId}`,
    { method: "GET", errorHandleMethod: "reject" },
  );
}

export function PostCategoryCreateApi(params: CategoryCreateRequest) {
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
    return Promise.resolve(wrap(mockOkItem(item)));
  }
  return apiFetch<ApiResponse<CategoryDetailItemType>>(
    `/api/front/v1/category/create`,
    {
      method: "POST",
      body: params,
      errorHandleMethod: "reject",
    },
  );
}

export function PutCategoryUpdateApi(params: CategoryUpdateRequest) {
  if (USE_MOCK) {
    const { categoryId, ...rest } = params;
    categoryMockStore.update(categoryId, {
      ...rest,
      color: rest.color ?? null,
      icon: rest.icon ?? null,
    });
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/front/v1/category/update/${params.categoryId}`,
    {
      method: "PUT",
      body: params,
      errorHandleMethod: "reject",
    },
  );
}

export function DeleteCategoryDeleteApi(categoryId: string) {
  if (USE_MOCK) {
    categoryMockStore.remove(categoryId);
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/front/v1/category/delete/${categoryId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}
