import {
  useInfiniteQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

import { GetAccountSearchApi } from "../api";
import type { AccountSearchRequestType } from "../types";

export const useAccountReport = (accountId: string) => {
  return useSuspenseQuery(queryKeys.account.report(accountId));
};

export const useAccountList = (
  params: AccountSearchRequestType & { limit?: number },
) => {
  return useSuspenseQuery(queryKeys.account.list(params));
};

/** 통장 무한 스크롤 — 관리 페이지용 */
export const useAccountInfiniteList = (
  params: AccountSearchRequestType,
  pageSize = 30,
) => {
  const keyDef = queryKeys.account.infinite({ ...params, pageSize });
  return useInfiniteQuery({
    queryKey: keyDef.queryKey,
    queryFn: ({ pageParam }) =>
      GetAccountSearchApi({ ...params, cursor: pageParam, limit: pageSize }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      const { nextCursor, hasNext } = lastPage.body.data;
      return hasNext && nextCursor ? nextCursor : undefined;
    },
  });
};

export const useAccountDetail = () => {
  const queryClient = useQueryClient();

  return async (accountId: string) => {
    return await queryClient.fetchQuery({
      ...queryKeys.account.detail(accountId),
    });
  };
};
