import returnFetch, { ReturnFetchDefaultOptions } from "return-fetch";

import { useHouseholdStore } from "_features/household/store";

/**
 * `useHouseholdStore.currentHouseholdId` 를 `X-Household-Id` 헤더로 자동 첨부.
 * 백엔드의 `CurrentHousehold` deps 가 이 헤더로 가계부 컨텍스트 결정.
 * SSR 시엔 store 비어있어 헤더 안 박힘 → 보호 API 는 클라에서만 호출.
 */
export const returnFetchHousehold = (args?: ReturnFetchDefaultOptions) =>
  returnFetch({
    ...args,
    interceptors: {
      request: async ([url, _configs]) => {
        const configs = { ..._configs };

        if (typeof window !== "undefined") {
          const id = useHouseholdStore.getState().currentHouseholdId;
          if (id) {
            const headers = new Headers(configs.headers);
            headers.set("X-Household-Id", id);
            configs.headers = headers;
          }
        }

        return [url, configs];
      },
    },
  });
