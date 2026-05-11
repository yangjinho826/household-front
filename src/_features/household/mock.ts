// 백엔드 미구현 — household members 만 mock. 다른 CRUD 는 백엔드 연동 끝남.
import { newId, todayIso } from "_utilities/fmt";

import type { HouseholdMemberItemType } from "./types";

const OWNER_ID = "u-mock-owner";
const MEMBER_ID_1 = "u-mock-member-1";

let memberStore: HouseholdMemberItemType[] = [
  {
    memberId: newId(),
    householdId: "h-mock-1",
    userId: OWNER_ID,
    role: "OWNER",
    joinedAt: todayIso(),
    userName: "양진호",
    userEmail: "yangjinho826@naver.com",
  },
  {
    memberId: newId(),
    householdId: "h-mock-1",
    userId: MEMBER_ID_1,
    role: "MEMBER",
    joinedAt: todayIso(),
    userName: "가족 1",
    userEmail: "family@example.com",
  },
  {
    memberId: newId(),
    householdId: "h-mock-2",
    userId: OWNER_ID,
    role: "OWNER",
    joinedAt: todayIso(),
    userName: "양진호",
    userEmail: "yangjinho826@naver.com",
  },
];

export const householdMockStore = {
  members(householdId: string): HouseholdMemberItemType[] {
    return memberStore.filter((m) => m.householdId === householdId);
  },
  addMember(input: Omit<HouseholdMemberItemType, "memberId" | "joinedAt">) {
    const item: HouseholdMemberItemType = {
      ...input,
      memberId: newId(),
      joinedAt: todayIso(),
    };
    memberStore = [...memberStore, item];
    return item;
  },
  removeMember(memberId: string) {
    memberStore = memberStore.filter((m) => m.memberId !== memberId);
  },
};
