import {
  useInfiniteQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

import { GetPortfolioItemTransactionsApi } from "../api";

export const usePortfolioOverview = () => {
  return useSuspenseQuery(queryKeys.portfolio.overview());
};

export const useAccountOverview = (accountId: string) => {
  return useSuspenseQuery(queryKeys.portfolio.byAccount(accountId));
};

export const usePortfolioFormOptions = () => {
  return useSuspenseQuery(queryKeys.portfolio.formOptions());
};

export const usePortfolioItem = (itemId: string) => {
  return useSuspenseQuery(queryKeys.portfolio.item(itemId));
};

/** 종목 단건 거래 내역 — 무한 스크롤. transaction 패턴과 동일. */
export const usePortfolioItemTransactionsInfinite = (
  itemId: string,
  pageSize = 30,
) => {
  const keyDef = queryKeys.portfolio.itemTransactionsInfinite({
    itemId,
    pageSize,
  });
  return useInfiniteQuery({
    queryKey: keyDef.queryKey,
    queryFn: ({ pageParam }) =>
      GetPortfolioItemTransactionsApi(itemId, pageParam, pageSize),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      const { nextCursor, hasNext } = lastPage.body.data;
      return hasNext && nextCursor ? nextCursor : undefined;
    },
  });
};

/** 폼 등 비페이지 진입에서 종목 detail 이 필요한 경우 — 명령형 fetch */
export const usePortfolioItemFetch = () => {
  const queryClient = useQueryClient();
  return async (itemId: string) => {
    return await queryClient.fetchQuery({
      ...queryKeys.portfolio.item(itemId),
    });
  };
};
