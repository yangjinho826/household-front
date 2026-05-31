import { createQueryKeys } from "@lukemorales/query-key-factory";

import {
  GetAccountOverviewApi,
  GetPortfolioFormOptionsApi,
  GetPortfolioItemApi,
  GetPortfolioItemRealizedPnlApi,
  GetPortfolioOverviewApi,
  GetPortfolioValueHistoryByAccountApi,
  GetPortfolioValueHistoryByItemApi,
} from "../api";
import type {
  PortfolioValueHistoryByAccountRequest,
  PortfolioValueHistoryByItemRequest,
} from "../types";

export const portfolios = createQueryKeys("portfolio", {
  overview: () => ({
    queryKey: ["overview"],
    queryFn: () => GetPortfolioOverviewApi(),
  }),
  byAccount: (accountId: string) => ({
    queryKey: [accountId],
    queryFn: () => GetAccountOverviewApi(accountId),
  }),
  formOptions: () => ({
    queryKey: ["form-options"],
    queryFn: () => GetPortfolioFormOptionsApi(),
  }),
  item: (itemId: string) => ({
    queryKey: [itemId],
    queryFn: () => GetPortfolioItemApi(itemId),
  }),
  // 무한 스크롤 거래 내역 — queryFn 은 useInfiniteQuery 헬퍼에서 cursor 주입
  itemTransactionsInfinite: (params: { itemId: string; pageSize: number }) => ({
    queryKey: [params],
  }),
  itemRealizedPnl: (params: {
    itemId: string;
    fromDate?: string;
    toDate?: string;
  }) => ({
    queryKey: [params],
    queryFn: () =>
      GetPortfolioItemRealizedPnlApi(params.itemId, params.fromDate, params.toDate),
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
