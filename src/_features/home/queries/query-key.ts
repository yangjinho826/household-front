import { createQueryKeys } from "@lukemorales/query-key-factory";

import { GetHomeOverviewApi } from "../api";
import type { HomeOverviewRequest } from "../types";

export const home = createQueryKeys("home", {
  overview: (params: HomeOverviewRequest = {}) => ({
    queryKey: [params],
    queryFn: () => GetHomeOverviewApi(params),
  }),
});
