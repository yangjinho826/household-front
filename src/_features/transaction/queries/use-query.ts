import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

import { GetAccountLedgerApi } from "../api";

/**
 * 계좌별 거래 이력(running balance) 무한 스크롤.
 *
 * 백엔드가 각 행에 balanceAfter 를 박아 내려주므로 cursor 에 carry 잔액이 실려
 * 페이지 경계 잔액이 이어진다.
 */
export const useAccountLedgerInfinite = (
  accountId: string,
  pageSize = 30,
  year?: number,
  month?: number,
) => {
  const keyDef = queryKeys.transaction.accountLedger(
    accountId,
    pageSize,
    year,
    month,
  );
  return useInfiniteQuery({
    queryKey: keyDef.queryKey,
    queryFn: ({ pageParam }) =>
      GetAccountLedgerApi(accountId, {
        cursor: pageParam,
        limit: pageSize,
        year,
        month,
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
