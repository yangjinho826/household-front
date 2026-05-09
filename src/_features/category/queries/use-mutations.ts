import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

import {
  DeleteCategoryDeleteApi,
  PostCategoryCreateApi,
  PutCategoryUpdateApi,
} from "../api";
import type {
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from "../types";

export function useCategoryMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (props: CategoryCreateRequest) => PostCategoryCreateApi(props),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.category.list._def,
        refetchType: "all",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (props: CategoryUpdateRequest) => PutCategoryUpdateApi(props),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.category.list._def,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.category.detail._def,
        refetchType: "all",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (categoryId: string) => DeleteCategoryDeleteApi(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.category.list._def,
        refetchType: "all",
      });
    },
  });

  return { createMutation, updateMutation, removeMutation };
}
