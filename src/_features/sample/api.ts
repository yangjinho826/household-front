/**
 * Sample API
 *
 * 학습용 표준 참조 모듈. CRUD 4개.
 * NEXT_PUBLIC_USE_MOCK !== "false" 면 in-memory 데이터로 동작.
 */
import { apiFetch } from "_libraries/fetch/api-fetch";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";
import { newId, todayIso } from "_utilities/fmt";

import { INITIAL_SAMPLES } from "./mock";
import type {
  Sample,
  SampleCreateRequest,
  SampleUpdateRequest,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

// in-memory mock state
const state = {
  samples: [...INITIAL_SAMPLES],
};

const okList = <T>(items: T[]): ApiListResponse<T> => ({
  code: "OK",
  message: "성공",
  status: 200,
  data: {
    listSize: items.length,
    currentPage: 1,
    currentCount: items.length,
    totalElements: items.length,
    totalPages: 1,
    content: items,
  },
});

const okItem = <T>(item: T): ApiResponse<T> => ({
  code: "OK",
  message: "성공",
  status: 200,
  data: item,
});

// =========================================================
// CRUD
// =========================================================

export async function GetSampleListApi(): Promise<ApiListResponse<Sample>> {
  if (USE_MOCK) return okList(state.samples);
  const res = await apiFetch<ApiListResponse<Sample>>("/api/sample/list", {
    method: "GET",
  });
  return res.body;
}

export async function PostSampleCreateApi(
  body: SampleCreateRequest,
): Promise<ApiResponse<Sample>> {
  if (USE_MOCK) {
    const created: Sample = {
      ...body,
      id: newId(),
      createdAt: todayIso(),
    };
    state.samples = [created, ...state.samples];
    return okItem(created);
  }
  const res = await apiFetch<ApiResponse<Sample>>("/api/sample/create", {
    method: "POST",
    body,
    errorHandleMethod: "reject",
  });
  return res.body;
}

export async function PutSampleUpdateApi(
  body: SampleUpdateRequest,
): Promise<ApiResponse<Sample>> {
  if (USE_MOCK) {
    state.samples = state.samples.map((s) =>
      s.id === body.id ? { ...s, ...body } : s,
    );
    const updated = state.samples.find((s) => s.id === body.id);
    if (!updated) throw new Error("Sample not found");
    return okItem(updated);
  }
  const res = await apiFetch<ApiResponse<Sample>>(`/api/sample/update/${body.id}`, {
    method: "PUT",
    body,
    errorHandleMethod: "reject",
  });
  return res.body;
}

export async function DeleteSampleApi(
  id: string,
): Promise<ApiResponse<{ id: string }>> {
  if (USE_MOCK) {
    state.samples = state.samples.filter((s) => s.id !== id);
    return okItem({ id });
  }
  const res = await apiFetch<ApiResponse<{ id: string }>>(
    `/api/sample/delete/${id}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
  return res.body;
}
