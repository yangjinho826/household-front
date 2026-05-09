import { createQueryKeys } from "@lukemorales/query-key-factory";

import type { ApiPaginationProps } from "_libraries/fetch/response";

import { GetCategoryDetailApi, GetCategorySearchApi } from "../api";
import type { CategorySearchRequestType } from "../types";

export const categories = createQueryKeys("category", {
  list: (params: CategorySearchRequestType & ApiPaginationProps) => ({
    queryKey: [params],
    queryFn: () => GetCategorySearchApi(params),
  }),
  detail: (categoryId: string) => ({
    queryKey: [categoryId],
    queryFn: () => GetCategoryDetailApi(categoryId),
  }),
});
