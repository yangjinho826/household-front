import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";
import type { ApiPaginationProps } from "_libraries/fetch/response";

import type { CategorySearchRequestType } from "../types";

export const useCategoryList = (
  params: CategorySearchRequestType & ApiPaginationProps,
) => {
  return useSuspenseQuery(queryKeys.category.list(params));
};

export const useCategoryDetail = () => {
  const queryClient = useQueryClient();
  return async (categoryId: string) => {
    return await queryClient.fetchQuery({
      ...queryKeys.category.detail(categoryId),
    });
  };
};
