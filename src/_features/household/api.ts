import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";

import type {
  HouseholdCreateRequest,
  HouseholdDetailItemType,
  HouseholdListItemType,
  HouseholdMemberItemType,
  HouseholdRole,
  HouseholdSearchRequestType,
  HouseholdUpdateRequest,
  MemberCreateRequest,
  MemberRole,
} from "./types";

// 백엔드 응답 (snake_case) → 프론트 타입 (camelCase + 도메인 prefix) 매핑
interface BackendHouseholdResponse {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  currency: string;
  started_at: string;
  role: HouseholdRole;
}

function mapToListItem(
  b: BackendHouseholdResponse,
  rowNo: number,
): HouseholdListItemType {
  return {
    rowNo,
    householdId: b.id,
    name: b.name,
    description: b.description,
    ownerId: b.owner_id,
    currency: b.currency,
    startedAt: b.started_at,
    role: b.role,
    frstRegDt: "",
    lastMdfcnDt: "",
    dataStatCd: "ACTIVE",
  };
}

function mapToDetailItem(
  b: BackendHouseholdResponse,
): HouseholdDetailItemType {
  return {
    householdId: b.id,
    name: b.name,
    description: b.description,
    ownerId: b.owner_id,
    currency: b.currency,
    startedAt: b.started_at,
    role: b.role,
    frstRegDt: "",
    lastMdfcnDt: "",
    dataStatCd: "ACTIVE",
  };
}

// =========================================================
// Household CRUD — 백엔드 연동
// =========================================================

export async function GetHouseholdSearchApi(
  params: HouseholdSearchRequestType,
) {
  const queryString = objectToParams({ ...params }).toString();
  const res = await apiFetch<ApiResponse<BackendHouseholdResponse[]>>(
    `/api/household/list${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
  const items = (res.body.data ?? []).map((b, idx) =>
    mapToListItem(b, idx + 1),
  );
  const wrapped: ApiListResponse<HouseholdListItemType> = {
    code: res.body.code,
    message: res.body.message,
    status: res.body.status,
    data: {
      listSize: items.length,
      currentPage: 1,
      currentCount: items.length,
      totalElements: items.length,
      totalPages: 1,
      content: items,
    },
  };
  return { ...res, body: wrapped };
}

export async function GetHouseholdDetailApi(householdId: string) {
  const res = await apiFetch<ApiResponse<BackendHouseholdResponse>>(
    `/api/household/detail/${householdId}`,
    { method: "GET" },
  );
  return {
    ...res,
    body: { ...res.body, data: mapToDetailItem(res.body.data) },
  };
}

export async function PostHouseholdCreateApi(params: HouseholdCreateRequest) {
  const res = await apiFetch<ApiResponse<BackendHouseholdResponse>>(
    `/api/household/create`,
    {
      method: "POST",
      body: {
        name: params.name,
        description: params.description ?? null,
        currency: params.currency,
        started_at: params.startedAt,
      },
      errorHandleMethod: "reject",
    },
  );
  return {
    ...res,
    body: { ...res.body, data: mapToDetailItem(res.body.data) },
  };
}

export async function PutHouseholdUpdateApi(params: HouseholdUpdateRequest) {
  const res = await apiFetch<ApiResponse<BackendHouseholdResponse>>(
    `/api/household/update/${params.householdId}`,
    {
      method: "PUT",
      body: {
        name: params.name,
        description: params.description ?? null,
        currency: params.currency,
        started_at: params.startedAt,
      },
      errorHandleMethod: "reject",
    },
  );
  return {
    ...res,
    body: { ...res.body, data: undefined as unknown as void },
  };
}

export function DeleteHouseholdDeleteApi(householdId: string) {
  return apiFetch<ApiResponse<void>>(
    `/api/household/delete/${householdId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}

// =========================================================
// Members — 백엔드 연동
// =========================================================

interface BackendHouseholdMemberResponse {
  id: string;
  household_id: string;
  user_id: string;
  user_name: string | null;
  user_email: string | null;
  role: MemberRole;
  joined_at: string;
}

function mapToMemberItem(
  b: BackendHouseholdMemberResponse,
): HouseholdMemberItemType {
  return {
    memberId: b.id,
    householdId: b.household_id,
    userId: b.user_id,
    role: b.role,
    joinedAt: b.joined_at,
    userName: b.user_name,
    userEmail: b.user_email,
  };
}

export async function GetHouseholdMembersApi(householdId: string) {
  const res = await apiFetch<ApiResponse<BackendHouseholdMemberResponse[]>>(
    `/api/household/${householdId}/members`,
    { method: "GET" },
  );
  const items = (res.body.data ?? []).map(mapToMemberItem);
  const wrapped: ApiListResponse<HouseholdMemberItemType> = {
    code: res.body.code,
    message: res.body.message,
    status: res.body.status,
    data: {
      listSize: items.length,
      currentPage: 1,
      currentCount: items.length,
      totalElements: items.length,
      totalPages: 1,
      content: items,
    },
  };
  return { ...res, body: wrapped };
}

export async function PostHouseholdMemberCreateApi(
  params: MemberCreateRequest,
) {
  const res = await apiFetch<ApiResponse<BackendHouseholdMemberResponse>>(
    `/api/household/${params.householdId}/members`,
    {
      method: "POST",
      body: {
        user_id: params.userId,
        role: params.role,
      },
      errorHandleMethod: "reject",
    },
  );
  return {
    ...res,
    body: { ...res.body, data: mapToMemberItem(res.body.data) },
  };
}

export function DeleteHouseholdMemberDeleteApi(
  householdId: string,
  memberId: string,
) {
  return apiFetch<ApiResponse<void>>(
    `/api/household/${householdId}/members/${memberId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}
