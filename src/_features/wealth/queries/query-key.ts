import { createQueryKeys } from "@lukemorales/query-key-factory";

import { GetWealthOverviewApi } from "../api";
import type { WealthOverviewRequest } from "../types";

export const wealth = createQueryKeys("wealth", {
  overview: (params: WealthOverviewRequest = {}) => ({
    queryKey: [params],
    queryFn: () => GetWealthOverviewApi(params),
  }),
});
