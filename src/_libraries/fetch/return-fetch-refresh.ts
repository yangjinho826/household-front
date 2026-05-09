import returnFetch, { ReturnFetchDefaultOptions } from "return-fetch";

import { useAuthStore } from "_features/auth/store";
import { authLoginUrl } from "_constants/url";

import { cookieFetch } from "./api-fetch";
import { ApiResponseError } from "./api-response-error";

let refreshPromise: Promise<Response> | null = null;

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
          // refresh 자체 실패 → 세션 클리어 후 로그인 화면으로
          useAuthStore.getState().clearSession();

          const loginUrl = authLoginUrl
            ? `${authLoginUrl}/login?error=error_session_expired`
            : "/login?error=error_session_expired";
          window.location.href = loginUrl;

          throw new ApiResponseError(refreshResponse, "reject");
        }

        // 새 access 토큰 추출 후 store 갱신
        try {
          const json = await refreshResponse.clone().json();
          const newAccessToken = json?.data?.access_token as
            | string
            | undefined;
          if (newAccessToken) {
            useAuthStore.getState().setAccessToken(newAccessToken);
          }
        } catch {
          // refresh 응답 파싱 실패 — 다음 호출에서 401 다시 발생 시 위 분기 탐
        }

        // 원 요청 retry — returnFetchAuth 가 새 토큰을 헤더에 박음
        return fetch(_url, _configs);
      },
    },
  });
