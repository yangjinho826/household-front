import returnFetch, { ReturnFetchDefaultOptions } from "return-fetch";

export const returnFetchCookie = (args?: ReturnFetchDefaultOptions) =>
  returnFetch({
    ...args,
    interceptors: {
      request: async ([url, _configs]) => {
        const configs = { ..._configs };

        // 항상 인증 쿠키 전달
        configs.credentials = "include";

        // 서버 사이드인 경우 next/headers 의 cookies() 동적 import 후 헤더에 주입
        if (typeof window === "undefined") {
          const { cookies } = await import("next/headers");
          const headers = new Headers(configs.headers);

          headers.set("cookie", cookies().toString());
          configs.headers = headers;
        }

        return [url, configs];
      },
    },
  });
