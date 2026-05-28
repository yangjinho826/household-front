import {
  useInfiniteQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import type { ApiPaginationProps } from "_libraries/fetch/response";
import { queryKeys } from "_constants/queries";

import { GetTransactionSearchApi } from "../api";
import type { TransactionSearchRequestType } from "../types";

export const useTransactionList = (
  params: TransactionSearchRequestType & ApiPaginationProps,
) => {
  return useSuspenseQuery(queryKeys.transaction.list(params));
};

/**
 * 커서 기반 무한 스크롤 list.
 *
 * queryKey 는 query-key-factory 의 `transaction.infinite` 를 통과해서
 * mutation 의 `queryKeys.transaction._def` invalidate 에 자동으로 잡힌다.
 */
export const useTransactionInfiniteList = (
  params: TransactionSearchRequestType,
  pageSize = 30,
) => {
  const keyDef = queryKeys.transaction.infinite({ ...params, pageSize });
  return useInfiniteQuery({
    queryKey: keyDef.queryKey,
    queryFn: ({ pageParam }) =>
      GetTransactionSearchApi({
        ...params,
        cursor: pageParam,
        limit: pageSize,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      const { nextCursor, hasNext } = lastPage.body.data;
      return hasNext && nextCursor ? nextCursor : undefined;
    },
  });
};

export const useTransactionDetail = () => {
  const queryClient = useQueryClient();
  return async (transactionId: string) => {
    return await queryClient.fetchQuery({
      ...queryKeys.transaction.detail(transactionId),
    });
  };
};
