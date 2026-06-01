import { createQueryKeys } from "@lukemorales/query-key-factory";

import { GetManualAssetListApi } from "../api";

export const manualAssets = createQueryKeys("manualAsset", {
  list: () => ({
    queryKey: ["list"],
    queryFn: () => GetManualAssetListApi(),
  }),
});
