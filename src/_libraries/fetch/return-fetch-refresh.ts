import returnFetch, { ReturnFetchDefaultOptions } from "return-fetch";

import { useAuthStore } from "_features/auth/store";
import { authLoginUrl } from "_constants/url";

import { cookieFetch } from "./api-fetch";

let refreshPromise: Promise<Response> | null = null;
// 한 번 실패하면 모든 후속 401 즉시 redirect — 무한 루프 차단
let refreshFailed = false;
// redirectToLogin 재진입 차단 (location.replace 가 즉시 unload 시키지 않음)
let redirecting = false;

function redirectToLogin(): Promise<Response> {
  if (!redirecting) {
    redirecting = true;
    useAuthStore.getState().clearSession();
    const loginUrl = authLoginUrl
      ? `${authLoginUrl}/login?error=error_session_expired`
      : "/login?error=error_session_expired";
    window.location.replace(loginUrl);
  }
  // 영원 pending — React 재마운트/재렌더 사이클 차단. unload 까지 idle
  return new Promise<Response>(() => {});
}

export const returnFetchRefresh = (args?: ReturnFetchDefaultOptions) =>
  returnFetch({
    ...args,
    interceptors: {
      response: async (response, [_url, _configs], fetch) => {
        // SSR 인 경우 그대로 반환 — 보호 API SSR 호출은 가드 단에서 막혀야 함
        if (typeof window === "undefined") {
          return response;
        }

        // 401 이 아니면 그대로 반환
        if (response.status !== 401) return response;

        // 이미 refresh 실패했거나 redirect 진행 중 → 즉시 pending (재시도 X)
        if (refreshFailed || redirecting) {
          return redirectToLogin();
        }

        // 동시 401 들 끼리 단일 refresh 만 호출
        if (!refreshPromise) {
          refreshPromise = cookieFetch(`/api/auth/refresh`, {
            method: "POST",
          });
        }

        const refreshResponse = await refreshPromise;

        if (refreshResponse.status !== 200) {
          // 영구 실패 표시. refreshPromise 는 null 리셋 X — 후속 401 들도 같은 분기로
          refreshFailed = true;
          return redirectToLogin();
        }

        // 새 access 토큰 추출
        let newAccessToken: string | undefined;
        try {
          const json = await refreshResponse.clone().json();
          newAccessToken = json?.data?.accessToken;
        } catch {
          // 파싱 실패 → 아래 가드에서 redirect
        }
        if (!newAccessToken) {
          refreshFailed = true;
          return redirectToLogin();
        }

        // refresh 성공 시에만 promise reset — 다음 401 에서 새 refresh 가능
        refreshPromise = null;

        useAuthStore.getState().setAccessToken(newAccessToken);

        // 원 요청 retry — returnFetchAuth 가 새 토큰을 헤더에 박음
        return fetch(_url, _configs);
      },
    },
  });
