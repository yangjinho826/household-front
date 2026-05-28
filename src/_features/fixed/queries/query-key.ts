import { createQueryKeys } from "@lukemorales/query-key-factory";

import {
  GetFixedDetailApi,
  GetFixedMonthlySummaryApi,
  GetFixedSearchApi,
} from "../api";
import type { FixedSearchRequestType } from "../types";

export const fixedExpenses = createQueryKeys("fixed", {
  list: (params: FixedSearchRequestType & { limit?: number }) => ({
    queryKey: [params],
    queryFn: () => GetFixedSearchApi(params),
  }),
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
