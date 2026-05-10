import { createQueryKeys } from "@lukemorales/query-key-factory";

import { GetAccountSnapshotYearlyApi } from "../api";
import type { AccountSnapshotYearlyRequest } from "../types";

export const accountSnapshots = createQueryKeys("accountSnapshot", {
  yearly: (params: AccountSnapshotYearlyRequest = {}) => ({
    queryKey: [params],
    queryFn: () => GetAccountSnapshotYearlyApi(params),
  }),
});
