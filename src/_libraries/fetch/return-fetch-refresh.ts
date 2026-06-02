import returnFetch, { ReturnFetchDefaultOptions } from "return-fetch";

import { useAuthStore } from "_features/auth/store";
import { authLoginUrl } from "_constants/url";

import { cookieFetch } from "./api-fetch";
import {
  listenAuthMessages,
  postAuthMessage,
} from "./broadcast-channel";

let refreshPromise: Promise<Response> | null = null;
// 한 번 실패하면 모든 후속 401 즉시 redirect — 무한 루프 차단
let refreshFailed = false;
// redirectToLogin 재진입 차단 (location.replace 가 즉시 unload 시키지 않음)
let redirecting = false;

// 다른 탭이 refresh 중이면 그 결과 대기 — 자기 refresh 안 호출
let externalTokenWaiter: {
  promise: Promise<string | null>;
  resolve: (token: string | null) => void;
} | null = null;

if (typeof window !== "undefined") {
  listenAuthMessages((msg) => {
    if (msg.type === "REFRESH_STARTED") {
      // 자기가 이미 refresh 시작했으면 무시 — 비효율은 발생하지만 양쪽 다 reusable refresh 라 OK
      if (refreshPromise || externalTokenWaiter) return;
      let resolveFn: (t: string | null) => void = () => {};
      const promise = new Promise<string | null>((r) => {
        resolveFn = r;
      });
      externalTokenWaiter = { promise, resolve: resolveFn };
    } else if (msg.type === "TOKEN_UPDATED") {
      useAuthStore.getState().setAccessToken(msg.accessToken);
      externalTokenWaiter?.resolve(msg.accessToken);
      externalTokenWaiter = null;
    } else if (msg.type === "REFRESH_FAILED") {
      refreshFailed = true;
      externalTokenWaiter?.resolve(null);
      externalTokenWaiter = null;
    }
  });
}

// 인증 시도 자체의 401 — 세션 만료가 아니라 자격증명/요청 문제.
// refresh 무의미하므로 그대로 통과시켜 api 인터셉터가 ApiResponseError 를 던지게 한다.
// (로그인 실패가 redirectToLogin → location.replace 로 새로고침되던 버그 차단)
const AUTH_ENDPOINTS = ["/api/auth/login", "/api/auth/logout", "/api/auth/refresh"];

function isAuthEndpoint(url: unknown): boolean {
  const path = typeof url === "string" ? url : String((url as Request)?.url ?? "");
  return AUTH_ENDPOINTS.some((endpoint) => path.includes(endpoint));
}

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

        // 로그인/로그아웃 시도 자체의 401 → refresh 스킵, api 인터셉터가 에러 throw
        if (isAuthEndpoint(_url)) return response;

        // 이미 refresh 실패했거나 redirect 진행 중 → 즉시 pending (재시도 X)
        if (refreshFailed || redirecting) {
          return redirectToLogin();
        }

        // 다른 탭이 refresh 진행 중이면 그 결과로 retry
        if (externalTokenWaiter) {
          const newToken = await externalTokenWaiter.promise;
          if (!newToken) return redirectToLogin();
          return fetch(_url, _configs);
        }

        // 자기가 refresh 시작 — 다른 탭에 신호
        if (!refreshPromise) {
          postAuthMessage({ type: "REFRESH_STARTED" });
          refreshPromise = cookieFetch(`/api/auth/refresh`, {
            method: "POST",
          });
        }

        const refreshResponse = await refreshPromise;

        if (refreshResponse.status !== 200) {
          // 영구 실패 표시. refreshPromise 는 null 리셋 X — 후속 401 들도 같은 분기로
          refreshFailed = true;
          postAuthMessage({ type: "REFRESH_FAILED" });
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
          postAuthMessage({ type: "REFRESH_FAILED" });
          return redirectToLogin();
        }

        // refresh 성공 시에만 promise reset — 다음 401 에서 새 refresh 가능
        refreshPromise = null;

        useAuthStore.getState().setAccessToken(newAccessToken);
        postAuthMessage({ type: "TOKEN_UPDATED", accessToken: newAccessToken });

        // 원 요청 retry — returnFetchAuth 가 새 토큰을 헤더에 박음
        return fetch(_url, _configs);
      },
    },
  });
