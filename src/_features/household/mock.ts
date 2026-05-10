import { newId, todayIso } from "_utilities/fmt";

import type {
  HouseholdDetailItemType,
  HouseholdListItemType,
  HouseholdMemberItemType,
} from "./types";

const OWNER_ID = "u-mock-owner";
const MEMBER_ID_1 = "u-mock-member-1";

let store: HouseholdDetailItemType[] = [
  {
    householdId: "h-mock-1",
    name: "우리 가족",
    description: "가족 가계부",
    ownerId: OWNER_ID,
    currency: "KRW",
    startedAt: todayIso(),
    memberCount: 2,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    householdId: "h-mock-2",
    name: "개인",
    description: "혼자 쓰는 가계부",
    ownerId: OWNER_ID,
    currency: "KRW",
    startedAt: todayIso(),
    memberCount: 1,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
];

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

type CreateInput = Omit<
  HouseholdDetailItemType,
  | "householdId"
  | "memberCount"
  | "frstRegDt"
  | "lastMdfcnDt"
  | "dataStatCd"
>;

export const householdMockStore = {
  list(): HouseholdListItemType[] {
    return store.map((h, idx) => ({ ...h, rowNo: idx + 1 }));
  },
  detail(id: string): HouseholdDetailItemType | undefined {
    return store.find((h) => h.householdId === id);
  },
  create(input: CreateInput): HouseholdDetailItemType {
    const item: HouseholdDetailItemType = {
      ...input,
      householdId: newId(),
      memberCount: 1,
      frstRegDt: todayIso(),
      lastMdfcnDt: todayIso(),
      dataStatCd: "ACTIVE",
    };
    store = [item, ...store];
    return item;
  },
  update(
    id: string,
    patch: Partial<HouseholdDetailItemType>,
  ): HouseholdDetailItemType | undefined {
    const idx = store.findIndex((h) => h.householdId === id);
    if (idx < 0) return undefined;
    const current = store[idx];
    if (!current) return undefined;
    const next: HouseholdDetailItemType = {
      ...current,
      ...patch,
      lastMdfcnDt: todayIso(),
    };
    store[idx] = next;
    return next;
  },
  remove(id: string) {
    store = store.filter((h) => h.householdId !== id);
    memberStore = memberStore.filter((m) => m.householdId !== id);
  },
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
