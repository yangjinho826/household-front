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
 * SSR 단계에선 호출 금지. 호출 시 즉시 reject — useSuspenseQuery 가 throw 하는
 * Promise 가 영원 pending 이면 React 18 streaming SSR 이 stream 을 안 닫아서
 * nginx 60초 후 504. 보호 라우트는 `ClientOnlyShell` 이 client-only 마운트로
 * 차단하므로 정상 흐름에선 이 reject 가 트리거되지 않음. 트리거되면 즉시 노출돼야 함.
 */
export const apiFetch = <T>(
  url: Parameters<typeof baseApiFetch>[0],
  init?: Parameters<typeof baseApiFetch>[1],
): Promise<Fetch.Json<T>> => {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("apiFetch called during SSR — wrap caller in ClientOnlyShell"),
    );
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
