import { createQueryKeys } from "@lukemorales/query-key-factory";

import { GetCategoryDetailApi, GetCategorySearchApi } from "../api";
import type { CategorySearchRequestType } from "../types";

export const categories = createQueryKeys("category", {
  list: (params: CategorySearchRequestType & { limit?: number }) => ({
    queryKey: [params],
    queryFn: () => GetCategorySearchApi(params),
  }),
  infinite: (params: CategorySearchRequestType & { pageSize: number }) => ({
    queryKey: [params],
  }),
  detail: (categoryId: string) => ({
    queryKey: [categoryId],
    queryFn: () => GetCategoryDetailApi(categoryId),
  }),
});
