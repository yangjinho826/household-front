import { createQueryKeys } from "@lukemorales/query-key-factory";

import { GetAuthMeApi } from "../api";

export const auth = createQueryKeys("auth", {
  me: {
    queryKey: null,
    queryFn: () => GetAuthMeApi(),
  },
});
