import { apiFetch } from "_libraries/fetch/api-fetch";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";
import { newId } from "_utilities/fmt";
import { mockOkItem as okItem, mockOkList as okList } from "_utilities/mock-response";

import { INITIAL_FIXED } from "./mock";
import type {
  FixedCreateRequest,
  FixedExpense,
  FixedUpdateRequest,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const state = { fixed: [...INITIAL_FIXED] };

export async function GetFixedListApi(): Promise<ApiListResponse<FixedExpense>> {
  if (USE_MOCK) return okList(state.fixed);
  const res = await apiFetch<ApiListResponse<FixedExpense>>("/api/fixed/list", {
    method: "GET",
  });
  return res.body;
}

export async function PostFixedCreateApi(
  body: FixedCreateRequest,
): Promise<ApiResponse<FixedExpense>> {
  if (USE_MOCK) {
    const created: FixedExpense = { ...body, id: newId() };
    state.fixed.push(created);
    return okItem(created);
  }
  const res = await apiFetch<ApiResponse<FixedExpense>>("/api/fixed/create", {
    method: "POST",
    body,
    errorHandleMethod: "reject",
  });
  return res.body;
}

export async function PutFixedUpdateApi(
  body: FixedUpdateRequest,
): Promise<ApiResponse<FixedExpense>> {
  if (USE_MOCK) {
    state.fixed = state.fixed.map((f) => (f.id === body.id ? { ...f, ...body } : f));
    const updated = state.fixed.find((f) => f.id === body.id);
    if (!updated) throw new Error("Fixed not found");
    return okItem(updated);
  }
  const res = await apiFetch<ApiResponse<FixedExpense>>(
    `/api/fixed/update/${body.id}`,
    { method: "PUT", body, errorHandleMethod: "reject" },
  );
  return res.body;
}

export async function DeleteFixedApi(
  id: string,
): Promise<ApiResponse<{ id: string }>> {
  if (USE_MOCK) {
    state.fixed = state.fixed.filter((f) => f.id !== id);
    return okItem({ id });
  }
  const res = await apiFetch<ApiResponse<{ id: string }>>(
    `/api/fixed/delete/${id}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
  return res.body;
}
