import { createQueryKeys } from "@lukemorales/query-key-factory";

import { GetSettingsOverviewApi } from "../api";

export const settings = createQueryKeys("settings", {
  overview: () => ({
    queryKey: ["overview"],
    queryFn: () => GetSettingsOverviewApi(),
  }),
});
