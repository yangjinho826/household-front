import { createQueryKeys } from "@lukemorales/query-key-factory";

import { GetMeApi } from "../api";

export const auth = createQueryKeys("auth", {
  me: {
    queryKey: null,
    queryFn: () => GetMeApi(),
  },
});
