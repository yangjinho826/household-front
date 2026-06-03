import { createQueryKeys } from "@lukemorales/query-key-factory";

import { GetFixedDetailApi, GetFixedMonthlySummaryApi } from "../api";
import type { FixedSearchRequestType } from "../types";

export const fixedExpenses = createQueryKeys("fixed", {
  infinite: (params: FixedSearchRequestType & { pageSize: number }) => ({
    queryKey: [params],
  }),
  detail: (fixedId: string) => ({
    queryKey: [fixedId],
    queryFn: () => GetFixedDetailApi(fixedId),
  }),
  monthlySummary: (month?: string) => ({
    queryKey: [{ month: month ?? "current" }],
    queryFn: () => GetFixedMonthlySummaryApi(month),
  }),
});
