export type MemberRole = "owner" | "member";

export type User = {
  id: string;
  email: string;
  name: string;
  language: "ko" | "en";
};

export type Household = {
  id: string;
  name: string;
  currency: string;
  owner_id: string;
  description: string;
  started_at: string;
};

export type Member = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: MemberRole;
  joined_at: string;
};

export type HouseholdCreateRequest = Omit<Household, "id" | "owner_id">;
export type HouseholdUpdateRequest = Partial<Household> & { id: string };
export type MemberCreateRequest = Omit<Member, "id" | "joined_at">;
