import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiCursorPage,
  ApiResponse,
} from "_libraries/fetch/response";

import type {
  CategoryCreateRequest,
  CategoryDetailItemType,
  CategoryListItemType,
  CategorySearchRequestType,
  CategoryUpdateRequest,
} from "./types";

type BackendCategoryResponse = Omit<CategoryDetailItemType, "categoryId"> & {
  id: string;
};

interface BackendCursorPage<T> {
  items: T[];
  nextCursor: string | null;
  hasNext: boolean;
  totalCount: number | null;
}

function toListItem(b: BackendCategoryResponse): CategoryListItemType {
  const { id, ...rest } = b;
  return { ...rest, categoryId: id };
}

/** 카테고리 목록 — cursor 무한 스크롤 */
export async function GetCategorySearchApi(
  params: CategorySearchRequestType & {
    cursor?: string | null;
    limit?: number;
  },
) {
  const queryParams: Record<string, unknown> = {};
  if (params.searchTerm) queryParams.searchTerm = params.searchTerm;
  if (params.kind) queryParams.kind = params.kind;
  if (params.isArchived !== undefined)
    queryParams.isArchived = params.isArchived;
  if (params.cursor) queryParams.cursor = params.cursor;
  if (params.limit) queryParams.limit = params.limit;
  const queryString = objectToParams(queryParams).toString();

  const res = await apiFetch<
    ApiResponse<BackendCursorPage<BackendCategoryResponse>>
  >(`/api/category/list${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
  });
  const items = res.body.data.items.map((b) => toListItem(b));
  const wrapped: ApiCursorPage<CategoryListItemType> = {
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

export async function GetCategoryDetailApi(categoryId: string) {
  const res = await apiFetch<ApiResponse<BackendCategoryResponse>>(
    `/api/category/detail/${categoryId}`,
    { method: "GET" },
  );
  const { id, ...rest } = res.body.data;
  const mapped: CategoryDetailItemType = { ...rest, categoryId: id };
  return { ...res, body: { ...res.body, data: mapped } };
}

export async function PostCategoryCreateApi(
  params: CategoryCreateRequest,
  idempotencyKey?: string,
) {
  const res = await apiFetch<ApiResponse<BackendCategoryResponse>>(
    `/api/category/create`,
    {
      method: "POST",
      body: params,
      idempotencyKey,
      errorHandleMethod: "reject",
    },
  );
  const { id, ...rest } = res.body.data;
  const mapped: CategoryDetailItemType = { ...rest, categoryId: id };
  return { ...res, body: { ...res.body, data: mapped } };
}

export async function PutCategoryUpdateApi(params: CategoryUpdateRequest) {
  const { categoryId, ...rest } = params;
  return apiFetch<ApiResponse<void>>(
    `/api/category/update/${categoryId}`,
    { method: "PUT", body: rest, errorHandleMethod: "reject" },
  );
}

export function DeleteCategoryDeleteApi(categoryId: string) {
  return apiFetch<ApiResponse<void>>(
    `/api/category/delete/${categoryId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}
