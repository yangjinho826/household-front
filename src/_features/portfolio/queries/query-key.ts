import { createQueryKeys } from "@lukemorales/query-key-factory";

import type { ApiPaginationProps } from "_libraries/fetch/response";

import { GetPortfolioDetailApi, GetPortfolioSearchApi } from "../api";
import type { PortfolioSearchRequestType } from "../types";

export const portfolios = createQueryKeys("portfolio", {
  list: (params: PortfolioSearchRequestType & ApiPaginationProps) => ({
    queryKey: [params],
    queryFn: () => GetPortfolioSearchApi(params),
  }),
  detail: (portfolioId: string) => ({
    queryKey: [portfolioId],
    queryFn: () => GetPortfolioDetailApi(portfolioId),
  }),
});
