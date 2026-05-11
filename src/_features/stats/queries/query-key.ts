import { createQueryKeys } from "@lukemorales/query-key-factory";

import { GetMonthlyStatsApi } from "../api";
import type { MonthlyStatsRequest } from "../types";

export const stats = createQueryKeys("stats", {
  monthly: (params: MonthlyStatsRequest) => ({
    queryKey: [params],
    queryFn: () => GetMonthlyStatsApi(params),
  }),
});
