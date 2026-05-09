import returnFetch, { ReturnFetchDefaultOptions } from "return-fetch";

import { authLoginUrl } from "_constants/url";
import { cookieFetch } from "./api-fetch";
import { ApiResponseError } from "./api-response-error";

let refreshPromise: Promise<Response> | null = null;

export const returnFetchRefresh = (args?: ReturnFetchDefaultOptions) =>
  returnFetch({
    ...args,
    interceptors: {
      response: async (response, [_url, _configs], fetch) => {
        // SSR 인 경우 그대로 반환
        if (typeof window === "undefined") {
          return response;
        }

        // 401 이 아니면 그대로 반환
        if (response.status !== 401) return response;

        // 리프레시 토큰 요청 (중복 방지)
        if (!refreshPromise) {
          refreshPromise = cookieFetch(`/api/auth/refresh`, {
            method: "POST",
          });
        }

        const refreshResponse = await refreshPromise;

        if (refreshResponse.status !== 200) {
          if (typeof window !== "undefined") {
            const loginUrl = authLoginUrl
              ? `${authLoginUrl}/login?error=error_session_expired`
              : "/login?error=error_session_expired";

            window.location.href = loginUrl;
          }

          throw new ApiResponseError(refreshResponse, "reject");
        }

        refreshPromise = null;

        return fetch(_url, _configs);
      },
    },
  });
