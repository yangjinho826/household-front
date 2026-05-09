import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";
import type { ApiPaginationProps } from "_libraries/fetch/response";

import type { AccountSearchRequestType } from "../types";

export const useAccountList = (
  params: AccountSearchRequestType & ApiPaginationProps,
) => {
  return useSuspenseQuery(queryKeys.account.list(params));
};

export const useAccountDetail = () => {
  const queryClient = useQueryClient();

  return async (accountId: string) => {
    return await queryClient.fetchQuery({
      ...queryKeys.account.detail(accountId),
    });
  };
};
