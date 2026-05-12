import { createQueryKeys } from "@lukemorales/query-key-factory";

import type { ApiPaginationProps } from "_libraries/fetch/response";

import {
  GetFixedDetailApi,
  GetFixedMonthlySummaryApi,
  GetFixedSearchApi,
} from "../api";
import type { FixedSearchRequestType } from "../types";

export const fixedExpenses = createQueryKeys("fixed", {
  list: (params: FixedSearchRequestType & ApiPaginationProps) => ({
    queryKey: [params],
    queryFn: () => GetFixedSearchApi(params),
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
