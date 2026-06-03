import { useSuspenseQuery } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

export const useManualAssetList = () => {
  return useSuspenseQuery(queryKeys.manualAsset.list());
};
