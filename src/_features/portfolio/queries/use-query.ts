import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";
import type { ApiPaginationProps } from "_libraries/fetch/response";

import type { PortfolioSearchRequestType } from "../types";

export const usePortfolioList = (
  params: PortfolioSearchRequestType & Partial<ApiPaginationProps>,
) => {
  return useSuspenseQuery(queryKeys.portfolio.list(params));
};

export const usePortfolioDetail = () => {
  const queryClient = useQueryClient();
  return async (portfolioId: string) => {
    return await queryClient.fetchQuery({
      ...queryKeys.portfolio.detail(portfolioId),
    });
  };
};
