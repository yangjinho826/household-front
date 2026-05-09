"use client";

import { useAllMembersQuery, useHouseholdListQuery } from "../queries/use-query";
import {
  useCreateHouseholdMutation,
  useCreateMemberMutation,
  useDeleteHouseholdMutation,
  useDeleteMemberMutation,
  useUpdateHouseholdMutation,
} from "../queries/use-mutations";
import { useHouseholdStore } from "../store";

export function useHousehold() {
  const user = useHouseholdStore((s) => s.user);
  const setUser = useHouseholdStore((s) => s.setUser);
  const currentHouseholdId = useHouseholdStore((s) => s.currentHouseholdId);
  const setCurrentHouseholdId = useHouseholdStore((s) => s.setCurrentHouseholdId);
  const showSwitcher = useHouseholdStore((s) => s.showSwitcher);
  const setShowSwitcher = useHouseholdStore((s) => s.setShowSwitcher);

  const householdsQ = useHouseholdListQuery();
  const allMembersQ = useAllMembersQuery();

  const households = householdsQ.data ?? [];
  const members = allMembersQ.data ?? {};
  const currentMembers = members[currentHouseholdId] ?? [];
  const currentHousehold = households.find((h) => h.id === currentHouseholdId);
  const myMembership = currentMembers.find((m) => m.user_id === user?.id);
  const isOwner = myMembership?.role === "owner";

  const createM = useCreateHouseholdMutation();
  const updateM = useUpdateHouseholdMutation();
  const deleteM = useDeleteHouseholdMutation();
  const createMemberM = useCreateMemberMutation();
  const deleteMemberM = useDeleteMemberMutation();

  return {
    user,
    setUser,

    households,
    currentHousehold,
    currentHouseholdId,
    setCurrentHouseholdId,

    members,
    currentMembers,
    myMembership,
    isOwner,

    showSwitcher,
    setShowSwitcher,

    addHousehold: createM.mutate,
    updateHousehold: updateM.mutate,
    deleteHousehold: deleteM.mutate,
    addMember: createMemberM.mutate,
    removeMember: deleteMemberM.mutate,
  };
}
