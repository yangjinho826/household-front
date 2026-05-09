import returnFetch, { ReturnFetchDefaultOptions } from "return-fetch";

import { basicHeaders } from "./header";
import { ApiResponseError } from "./api-response-error";
import { ApiErrorResponse } from "./response";

function isCustomRequest(configs?: RequestInit): boolean {
  return (configs as Fetch.Init | undefined)?.method !== undefined;
}

function isFormDataRequest(configs?: RequestInit): boolean {
  return configs?.body instanceof FormData;
}

/**
 * 백엔드 API 와 통신하기 위한 fetch 인터셉터.
 * - 기본 헤더(X-Error-Handle-Method, Content-Type) 자동 설정
 * - non-2xx 응답 시 ApiResponseError throw (errorCode/errorMessage 포함)
 */
export const returnFetchApi = (args?: ReturnFetchDefaultOptions) =>
  returnFetch({
    ...args,
    interceptors: {
      request: async ([url, _configs]) => {
        const configs = { ..._configs };

        let headers: Fetch.Init["headers"] = {
          ...basicHeaders,
          ...configs?.headers,
        };

        if (isCustomRequest(configs)) {
          const custom = configs as Fetch.Init;
          if (custom.errorHandleMethod) {
            headers = {
              ...headers,
              "X-Error-Handle-Method": custom.errorHandleMethod,
            };
          }
        }

        if (!isFormDataRequest(configs)) {
          headers = {
            ...headers,
            "Content-Type": "application/json",
          };
        }

        configs.headers = headers;

        return [url, configs];
      },

      response: async (response, requestArgs) => {
        const [, reqConfigs] = requestArgs;

        if (!response.ok && reqConfigs?.headers) {
          const json = (await response.json().catch(() => null)) as
            | ApiErrorResponse
            | null;
          const headerMap = new Map(Object.entries(reqConfigs.headers));
          const errorHandleMethod = (headerMap.get("X-Error-Handle-Method") ??
            "toast") as ErrorHandleMethod;

          throw new ApiResponseError(
            response,
            errorHandleMethod,
            json?.code ?? null,
            json?.message ?? null,
          );
        }

        return response;
      },
    },
  });
