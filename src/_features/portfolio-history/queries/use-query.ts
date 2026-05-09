import { useSuspenseQuery } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

import type { PortfolioHistorySearchRequestType } from "../types";

export const usePortfolioHistoryList = (
  params: PortfolioHistorySearchRequestType,
) => {
  return useSuspenseQuery(queryKeys.portfolioHistory.list(params));
};
