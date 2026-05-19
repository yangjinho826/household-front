import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiListResponse,
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

export async function GetCategorySearchApi(params: CategorySearchRequestType) {
  const queryString = objectToParams({ ...params }).toString();
  const res = await apiFetch<ApiResponse<BackendCategoryResponse[]>>(
    `/api/category/list${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
  const items = (res.body.data ?? []).map(
    ({ id, ...rest }, idx): CategoryListItemType => ({
      ...rest,
      categoryId: id,
      rowNo: idx + 1,
    }),
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
  const res = await apiFetch<ApiResponse<BackendCategoryResponse>>(
    `/api/category/detail/${categoryId}`,
    { method: "GET" },
  );
  const { id, ...rest } = res.body.data;
  const mapped: CategoryDetailItemType = { ...rest, categoryId: id };
  return { ...res, body: { ...res.body, data: mapped } };
}

export async function PostCategoryCreateApi(params: CategoryCreateRequest) {
  const res = await apiFetch<ApiResponse<BackendCategoryResponse>>(
    `/api/category/create`,
    { method: "POST", body: params, errorHandleMethod: "reject" },
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
