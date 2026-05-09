import { createQueryKeys } from "@lukemorales/query-key-factory";

import type { ApiPaginationProps } from "_libraries/fetch/response";

import { GetTransactionDetailApi, GetTransactionSearchApi } from "../api";
import type { TransactionSearchRequestType } from "../types";

export const transactions = createQueryKeys("transaction", {
  list: (params: TransactionSearchRequestType & ApiPaginationProps) => ({
    queryKey: [params],
    queryFn: () => GetTransactionSearchApi(params),
  }),
  detail: (transactionId: string) => ({
    queryKey: [transactionId],
    queryFn: () => GetTransactionDetailApi(transactionId),
  }),
});
