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
 * 커서 기반 무한 스크롤 list. 백엔드는 next_cursor 반환, mock 모드에선 한 페이지만.
 */
export const useTransactionInfiniteList = (
  params: TransactionSearchRequestType,
  pageSize = 30,
) => {
  return useInfiniteQuery({
    queryKey: ["transaction", "infinite", params, pageSize],
    queryFn: ({ pageParam }) =>
      GetTransactionSearchApi({
        ...params,
        cursor: pageParam,
        limit: pageSize,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      const data = lastPage.body.data as typeof lastPage.body.data & {
        nextCursor?: string | null;
        hasNext?: boolean;
      };
      if (data.hasNext && data.nextCursor) return data.nextCursor;
      return undefined;
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
