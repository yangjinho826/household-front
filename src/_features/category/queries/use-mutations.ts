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

  // 카테고리 변경 시 — 거래/고정지출 응답에 JOIN 된 category_name/color/icon 도 stale
  const invalidateRelated = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.category._def,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.transaction._def,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.fixed._def,
      refetchType: "all",
    });
  };

  const createMutation = useMutation({
    mutationFn: (props: CategoryCreateRequest) => PostCategoryCreateApi(props),
    onSuccess: invalidateRelated,
  });

  const updateMutation = useMutation({
    mutationFn: (props: CategoryUpdateRequest) => PutCategoryUpdateApi(props),
    onSuccess: invalidateRelated,
  });

  const removeMutation = useMutation({
    mutationFn: (categoryId: string) => DeleteCategoryDeleteApi(categoryId),
    onSuccess: invalidateRelated,
  });

  return { createMutation, updateMutation, removeMutation };
}
