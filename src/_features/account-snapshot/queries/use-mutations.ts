import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

import { PostAccountSnapshotCreateApi } from "../api";

export function useAccountSnapshotMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: () => PostAccountSnapshotCreateApi(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.accountSnapshot.yearly._def,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.account.list._def,
        refetchType: "all",
      });
    },
  });

  return { createMutation };
}
