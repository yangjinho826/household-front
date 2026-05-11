import { createQueryKeys } from "@lukemorales/query-key-factory";

import type { ApiPaginationProps } from "_libraries/fetch/response";

import {
  GetPortfolioDetailApi,
  GetPortfolioSearchApi,
  GetPortfolioTransactionsApi,
  GetPortfolioValueHistoryByAccountApi,
  GetPortfolioValueHistoryByItemApi,
} from "../api";
import type {
  PortfolioSearchRequestType,
  PortfolioValueHistoryByAccountRequest,
  PortfolioValueHistoryByItemRequest,
} from "../types";

export const portfolios = createQueryKeys("portfolio", {
  list: (params: PortfolioSearchRequestType & Partial<ApiPaginationProps>) => ({
    queryKey: [params],
    queryFn: () => GetPortfolioSearchApi(params),
  }),
  detail: (portfolioId: string) => ({
    queryKey: [portfolioId],
    queryFn: () => GetPortfolioDetailApi(portfolioId),
  }),
  transactions: (params: { accountId?: string }) => ({
    queryKey: [params],
    queryFn: () => GetPortfolioTransactionsApi(params),
  }),
  valueHistoryByAccount: (params: PortfolioValueHistoryByAccountRequest) => ({
    queryKey: [params],
    queryFn: () => GetPortfolioValueHistoryByAccountApi(params),
  }),
  valueHistoryByItem: (params: PortfolioValueHistoryByItemRequest) => ({
    queryKey: [params],
    queryFn: () => GetPortfolioValueHistoryByItemApi(params),
  }),
});
