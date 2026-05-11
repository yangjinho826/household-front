import { apiBaseUrl } from "_constants/url";

import { returnFetchCookie } from "./return-fetch-cookie";
import { returnFetchExtended } from "./return-fetch-extended";

const baseApiFetch = returnFetchExtended({
  baseUrl: apiBaseUrl,
  headers: { Accept: "application/json" },
});

/**
 * 최종 사용 fetch — 4 체인 (cookie → refresh → api → json) 통과.
 *
 * SSR 단계에선 호출 차단: apiBaseUrl 이 빈 문자열(rewrites 의존)이라 Node fetch 가
 * 상대 URL parse 실패. useSuspenseQuery 가 영원 pending 으로 인식 → React 18 Suspense
 * 가 fallback HTML 송출 → client hydrate 후 진짜 fetch.
 */
export const apiFetch = <T>(
  url: Parameters<typeof baseApiFetch>[0],
  init?: Parameters<typeof baseApiFetch>[1],
): Promise<Fetch.Json<T>> => {
  if (typeof window === "undefined") {
    return new Promise<Fetch.Json<T>>(() => {});
  }
  return baseApiFetch<T>(url, init);
};

/**
 * 인증 쿠키만 자동 첨부하는 단순 fetch.
 * `return-fetch-refresh` 가 401 시 refresh 호출에 사용.
 */
export const cookieFetch = returnFetchCookie({
  baseUrl: apiBaseUrl,
  headers: { Accept: "application/json" },
});
