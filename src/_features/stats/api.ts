import { apiFetch } from "_libraries/fetch/api-fetch";
import type { ApiResponse } from "_libraries/fetch/response";

import type { MonthlyStatsRequest, MonthlyStatsType } from "./types";

export async function GetMonthlyStatsApi(params: MonthlyStatsRequest) {
  return apiFetch<ApiResponse<MonthlyStatsType>>(
    `/api/stats/monthly?year=${params.year}&month=${params.month}`,
    { method: "GET" },
  );
}
