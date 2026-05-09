import { createQueryKeys } from "@lukemorales/query-key-factory";

import { GetAccountSnapshotSearchApi } from "../api";
import type { AccountSnapshotSearchRequestType } from "../types";

export const accountSnapshots = createQueryKeys("accountSnapshot", {
  list: (params: AccountSnapshotSearchRequestType) => ({
    queryKey: [params],
    queryFn: () => GetAccountSnapshotSearchApi(params),
  }),
});
