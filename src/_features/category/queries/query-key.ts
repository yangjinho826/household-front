import { createQueryKeys } from "@lukemorales/query-key-factory";

import { GetCategoryDetailApi } from "../api";
import type { CategorySearchRequestType } from "../types";

export const categories = createQueryKeys("category", {
  infinite: (params: CategorySearchRequestType & { pageSize: number }) => ({
    queryKey: [params],
  }),
  detail: (categoryId: string) => ({
    queryKey: [categoryId],
    queryFn: () => GetCategoryDetailApi(categoryId),
  }),
});
