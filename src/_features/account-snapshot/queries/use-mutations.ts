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
      // wealth overview 가 yearly_snapshots + accounts 묶음으로 받음
      queryClient.invalidateQueries({
        queryKey: queryKeys.wealth._def,
        refetchType: "all",
      });
    },
  });

  return { createMutation };
}
