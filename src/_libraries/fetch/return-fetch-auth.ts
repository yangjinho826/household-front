import returnFetch, { ReturnFetchDefaultOptions } from "return-fetch";

import { useAuthStore } from "_features/auth/store";

/**
 * `useAuthStore.accessToken` 을 `Authorization: Bearer` 헤더로 첨부.
 * SSR 시엔 store 가 비어있어 헤더 안 박힘 → 보호 API 는 클라에서만 호출.
 */
export const returnFetchAuth = (args?: ReturnFetchDefaultOptions) =>
  returnFetch({
    ...args,
    interceptors: {
      request: async ([url, _configs]) => {
        const configs = { ..._configs };

        if (typeof window !== "undefined") {
          const token = useAuthStore.getState().accessToken;
          if (token) {
            const headers = new Headers(configs.headers);
            headers.set("Authorization", `Bearer ${token}`);
            configs.headers = headers;
          }
        }

        return [url, configs];
      },
    },
  });
