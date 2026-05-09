import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";
import type { ApiPaginationProps } from "_libraries/fetch/response";

import type { TransactionSearchRequestType } from "../types";

export const useTransactionList = (
  params: TransactionSearchRequestType & ApiPaginationProps,
) => {
  return useSuspenseQuery(queryKeys.transaction.list(params));
};

export const useTransactionDetail = () => {
  const queryClient = useQueryClient();
  return async (transactionId: string) => {
    return await queryClient.fetchQuery({
      ...queryKeys.transaction.detail(transactionId),
    });
  };
};
