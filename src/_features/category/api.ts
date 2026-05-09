import { apiFetch } from "_libraries/fetch/api-fetch";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";
import { newId } from "_utilities/fmt";
import { mockOkItem as okItem, mockOkList as okList } from "_utilities/mock-response";

import { INITIAL_CATEGORIES } from "./mock";
import type {
  Category,
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const state = { categories: [...INITIAL_CATEGORIES] };

export async function GetCategoryListApi(): Promise<ApiListResponse<Category>> {
  if (USE_MOCK) return okList(state.categories);
  const res = await apiFetch<ApiListResponse<Category>>("/api/category/list", {
    method: "GET",
  });
  return res.body;
}

export async function PostCategoryCreateApi(
  body: CategoryCreateRequest,
): Promise<ApiResponse<Category>> {
  if (USE_MOCK) {
    const created: Category = { ...body, id: newId() };
    state.categories.push(created);
    return okItem(created);
  }
  const res = await apiFetch<ApiResponse<Category>>("/api/category/create", {
    method: "POST",
    body,
    errorHandleMethod: "reject",
  });
  return res.body;
}

export async function PutCategoryUpdateApi(
  body: CategoryUpdateRequest,
): Promise<ApiResponse<Category>> {
  if (USE_MOCK) {
    state.categories = state.categories.map((c) =>
      c.id === body.id ? { ...c, ...body } : c,
    );
    const updated = state.categories.find((c) => c.id === body.id);
    if (!updated) throw new Error("Category not found");
    return okItem(updated);
  }
  const res = await apiFetch<ApiResponse<Category>>(
    `/api/category/update/${body.id}`,
    { method: "PUT", body, errorHandleMethod: "reject" },
  );
  return res.body;
}

export async function DeleteCategoryApi(
  id: string,
): Promise<ApiResponse<{ id: string }>> {
  if (USE_MOCK) {
    state.categories = state.categories.filter((c) => c.id !== id);
    return okItem({ id });
  }
  const res = await apiFetch<ApiResponse<{ id: string }>>(
    `/api/category/delete/${id}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
  return res.body;
}
