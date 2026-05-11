import returnFetch, { ReturnFetchDefaultOptions } from "return-fetch";

import { useAuthStore } from "_features/auth/store";
import { authLoginUrl } from "_constants/url";

import { cookieFetch } from "./api-fetch";

let refreshPromise: Promise<Response> | null = null;

function redirectToLogin(): Promise<Response> {
  useAuthStore.getState().clearSession();

  const loginUrl = authLoginUrl
    ? `${authLoginUrl}/login?error=error_session_expired`
    : "/login?error=error_session_expired";
  window.location.replace(loginUrl);

  // 영원 pending — React 재마운트/재렌더 사이클 차단. redirect 완료될 때까지 idle
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

        // 동시 401 들 끼리 단일 refresh 만 호출
        if (!refreshPromise) {
          refreshPromise = cookieFetch(`/api/auth/refresh`, {
            method: "POST",
          });
        }

        const refreshResponse = await refreshPromise;
        refreshPromise = null;

        if (refreshResponse.status !== 200) {
          return redirectToLogin();
        }

        // 새 access 토큰 추출
        let newAccessToken: string | undefined;
        try {
          const json = await refreshResponse.clone().json();
          newAccessToken = json?.data?.access_token;
        } catch {
          // 파싱 실패 → 아래 가드에서 redirect
        }
        if (!newAccessToken) {
          return redirectToLogin();
        }

        useAuthStore.getState().setAccessToken(newAccessToken);

        // 원 요청 retry — returnFetchAuth 가 새 토큰을 헤더에 박음
        return fetch(_url, _configs);
      },
    },
  });
