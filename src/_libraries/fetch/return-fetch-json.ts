import { FetchArgs, ReturnFetchDefaultOptions } from "return-fetch";

import { returnFetchApi } from "./return-fetch-api";

/**
 * SyntaxError 또는 plain/text 응답이 와도 throw 하지 않고 처리.
 */
function parseJsonSafe(text: string): object | string {
  try {
    return JSON.parse(text);
  } catch (e) {
    if ((e as Error).name !== "SyntaxError") {
      throw e;
    }

    return text.trim();
  }
}

export const returnFetchJson = (args?: ReturnFetchDefaultOptions) => {
  const fetch = returnFetchApi(args);

  return async <T>(
    url: FetchArgs[0],
    init?: Fetch.Init,
  ): Promise<Fetch.Json<T>> => {
    const response = await fetch(url, {
      ...init,
      body:
        init?.body instanceof FormData
          ? init.body
          : init?.body && JSON.stringify(init.body),
    });

    const body = parseJsonSafe(
      response.bodyUsed ? "" : await response.text(),
    ) as T;

    return {
      headers: response.headers,
      ok: response.ok,
      redirected: response.redirected,
      status: response.status,
      statusText: response.statusText,
      type: response.type,
      url: response.url,
      body,
    } as Fetch.Json<T>;
  };
};
