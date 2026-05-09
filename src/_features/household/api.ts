import { apiFetch } from "_libraries/fetch/api-fetch";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";
import { newId, todayIso } from "_utilities/fmt";
import { mockOkItem as okItem, mockOkList as okList } from "_utilities/mock-response";

import { INITIAL_HOUSEHOLDS, INITIAL_MEMBERS } from "./mock";
import type {
  Household,
  HouseholdCreateRequest,
  HouseholdUpdateRequest,
  Member,
  MemberCreateRequest,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const state = {
  households: [...INITIAL_HOUSEHOLDS],
  members: { ...INITIAL_MEMBERS } as Record<string, Member[]>,
};

// =========================================================
// Household CRUD
// =========================================================

export async function GetHouseholdListApi(): Promise<ApiListResponse<Household>> {
  if (USE_MOCK) return okList(state.households);
  const res = await apiFetch<ApiListResponse<Household>>("/api/household/list", {
    method: "GET",
  });
  return res.body;
}

export async function PostHouseholdCreateApi(
  body: HouseholdCreateRequest & { owner_id: string },
): Promise<ApiResponse<Household>> {
  if (USE_MOCK) {
    const created: Household = { ...body, id: newId() };
    state.households.push(created);
    state.members[created.id] = [];
    return okItem(created);
  }
  const res = await apiFetch<ApiResponse<Household>>("/api/household/create", {
    method: "POST",
    body,
    errorHandleMethod: "reject",
  });
  return res.body;
}

export async function PutHouseholdUpdateApi(
  body: HouseholdUpdateRequest,
): Promise<ApiResponse<Household>> {
  if (USE_MOCK) {
    state.households = state.households.map((h) =>
      h.id === body.id ? { ...h, ...body } : h,
    );
    const updated = state.households.find((h) => h.id === body.id);
    if (!updated) throw new Error("Household not found");
    return okItem(updated);
  }
  const res = await apiFetch<ApiResponse<Household>>(
    `/api/household/update/${body.id}`,
    { method: "PUT", body, errorHandleMethod: "reject" },
  );
  return res.body;
}

export async function DeleteHouseholdApi(
  id: string,
): Promise<ApiResponse<{ id: string }>> {
  if (USE_MOCK) {
    state.households = state.households.filter((h) => h.id !== id);
    delete state.members[id];
    return okItem({ id });
  }
  const res = await apiFetch<ApiResponse<{ id: string }>>(
    `/api/household/delete/${id}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
  return res.body;
}

// =========================================================
// Member CRUD
// =========================================================

export async function GetAllMembersApi(): Promise<
  ApiResponse<Record<string, Member[]>>
> {
  if (USE_MOCK) return okItem(state.members);
  const res = await apiFetch<ApiResponse<Record<string, Member[]>>>(
    "/api/household/members",
    { method: "GET" },
  );
  return res.body;
}

export async function PostMemberCreateApi(
  householdId: string,
  body: MemberCreateRequest,
): Promise<ApiResponse<Member>> {
  if (USE_MOCK) {
    const created: Member = { ...body, id: newId(), joined_at: todayIso() };
    state.members[householdId] = [...(state.members[householdId] ?? []), created];
    return okItem(created);
  }
  const res = await apiFetch<ApiResponse<Member>>(
    `/api/household/${householdId}/members/create`,
    { method: "POST", body, errorHandleMethod: "reject" },
  );
  return res.body;
}

export async function DeleteMemberApi(
  householdId: string,
  memberId: string,
): Promise<ApiResponse<{ id: string }>> {
  if (USE_MOCK) {
    state.members[householdId] = (state.members[householdId] ?? []).filter(
      (m) => m.id !== memberId,
    );
    return okItem({ id: memberId });
  }
  const res = await apiFetch<ApiResponse<{ id: string }>>(
    `/api/household/${householdId}/members/${memberId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
  return res.body;
}
