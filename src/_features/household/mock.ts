import type { Household, Member, User } from "./types";

export const INITIAL_USER: User = {
  id: "u1",
  email: "jinho@example.com",
  name: "진호",
  language: "ko",
};

export const INITIAL_HOUSEHOLDS: Household[] = [
  { id: "h1", name: "내 가계부", currency: "KRW", owner_id: "u1", description: "", started_at: "2026-01-01" },
  { id: "h2", name: "우리 가족", currency: "KRW", owner_id: "u1", description: "부부 공동 가계부", started_at: "2026-03-01" },
];

export const INITIAL_MEMBERS: Record<string, Member[]> = {
  h1: [
    { id: "m1", user_id: "u1", name: "진호", email: "jinho@example.com", role: "owner", joined_at: "2026-01-01" },
  ],
  h2: [
    { id: "m2", user_id: "u1", name: "진호", email: "jinho@example.com", role: "owner", joined_at: "2026-03-01" },
    { id: "m3", user_id: "u2", name: "수민", email: "sumin@example.com", role: "member", joined_at: "2026-03-05" },
  ],
};
