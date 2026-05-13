import { apiFetch } from "_libraries/fetch/api-fetch";
import type { ApiResponse } from "_libraries/fetch/response";

import type { EnumName } from "./types";

/**
 * enum 값 목록 조회 — 백엔드 `/enum/{name}` 호출.
 * 응답은 enum 의 모든 값 (예: ["LIVING","SAVINGS","INVESTMENT"]).
 */
export function GetEnumApi(name: EnumName) {
  return apiFetch<ApiResponse<string[]>>(`/api/enum/${name}`, {
    method: "GET",
  });
}
