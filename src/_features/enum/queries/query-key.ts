import { createQueryKeys } from "@lukemorales/query-key-factory";

import { GetEnumApi } from "../api";
import type { EnumName } from "../types";

export const enums = createQueryKeys("enum", {
  options: (name: EnumName) => ({
    queryKey: [name],
    queryFn: () => GetEnumApi(name),
  }),
});
