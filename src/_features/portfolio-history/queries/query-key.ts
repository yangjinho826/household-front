import { createQueryKeys } from "@lukemorales/query-key-factory";

import { GetPortfolioHistorySearchApi } from "../api";
import type { PortfolioHistorySearchRequestType } from "../types";

export const portfolioHistory = createQueryKeys("portfolioHistory", {
  list: (params: PortfolioHistorySearchRequestType) => ({
    queryKey: [params],
    queryFn: () => GetPortfolioHistorySearchApi(params),
  }),
});
