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
      // account 도메인 전체 (list + infinite) — 잔액 변경 화면 모두 stale
      queryClient.invalidateQueries({
        queryKey: queryKeys.account._def,
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
