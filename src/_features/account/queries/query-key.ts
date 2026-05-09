import { createQueryKeys } from "@lukemorales/query-key-factory";

import type { ApiPaginationProps } from "_libraries/fetch/response";

import { GetAccountDetailApi, GetAccountSearchApi } from "../api";
import type { AccountSearchRequestType } from "../types";

export const accounts = createQueryKeys("account", {
  list: (params: AccountSearchRequestType & ApiPaginationProps) => ({
    queryKey: [params],
    queryFn: () => GetAccountSearchApi(params),
  }),
  detail: (accountId: string) => ({
    queryKey: [accountId],
    queryFn: () => GetAccountDetailApi(accountId),
  }),
});
