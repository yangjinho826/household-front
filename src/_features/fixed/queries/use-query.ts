import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";
import type { ApiPaginationProps } from "_libraries/fetch/response";

import type { FixedSearchRequestType } from "../types";

export const useFixedList = (
  params: FixedSearchRequestType & ApiPaginationProps,
) => {
  return useSuspenseQuery(queryKeys.fixed.list(params));
};

export const useFixedDetail = () => {
  const queryClient = useQueryClient();
  return async (fixedId: string) => {
    return await queryClient.fetchQuery({
      ...queryKeys.fixed.detail(fixedId),
    });
  };
};
