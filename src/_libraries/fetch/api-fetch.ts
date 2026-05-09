import { apiBaseUrl } from "_constants/url";

import { returnFetchCookie } from "./return-fetch-cookie";
import { returnFetchExtended } from "./return-fetch-extended";

/**
 * 최종 사용 fetch — 4 체인 (cookie → refresh → api → json) 통과.
 *
 * @example
 * const res = await apiFetch<User>("/api/users/1", {
 *   method: "GET",
 *   errorHandleMethod: "toast",
 * });
 * // res.body: User
 */
export const apiFetch = returnFetchExtended({
  baseUrl: apiBaseUrl,
  headers: { Accept: "application/json" },
});

/**
 * 인증 쿠키만 자동 첨부하는 단순 fetch.
 * `return-fetch-refresh` 가 401 시 refresh 호출에 사용.
 */
export const cookieFetch = returnFetchCookie({
  baseUrl: apiBaseUrl,
  headers: { Accept: "application/json" },
});
