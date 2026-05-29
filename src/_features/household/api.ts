import { apiFetch } from "_libraries/fetch/api-fetch";
import type {
  ApiCursorPage,
  ApiResponse,
} from "_libraries/fetch/response";

import type {
  HouseholdCreateRequest,
  HouseholdDetailItemType,
  HouseholdListItemType,
  HouseholdMemberItemType,
  HouseholdUpdateRequest,
  MemberCreateRequest,
} from "./types";

type BackendHouseholdResponse = Omit<HouseholdDetailItemType, "householdId"> & {
  id: string;
};

interface BackendCursorPage<T> {
  items: T[];
  nextCursor: string | null;
  hasNext: boolean;
  totalCount: number | null;
}

// =========================================================
// Household CRUD
// =========================================================

// 한 사용자가 속한 가계부 개수는 실무상 수십개 이내 — switcher 에서 한번에 보여줘야 해서
// infinite 가 아닌 unbounded limit 으로 처리. cursor 봉투는 통일성 유지용.
const HOUSEHOLD_LIST_LIMIT = 200;

export async function GetHouseholdSearchApi() {
  const res = await apiFetch<
    ApiResponse<BackendCursorPage<BackendHouseholdResponse>>
  >(`/api/household/list?limit=${HOUSEHOLD_LIST_LIMIT}`, { method: "GET" });
  const items = res.body.data.items.map(
    ({ id, ...rest }, idx): HouseholdListItemType => ({
      ...rest,
      householdId: id,
      rowNo: idx + 1,
    }),
  );
  const wrapped: ApiCursorPage<HouseholdListItemType> = {
    code: res.body.code,
    message: res.body.message,
    status: res.body.status,
    data: {
      items,
      nextCursor: res.body.data.nextCursor,
      hasNext: res.body.data.hasNext,
      totalCount: res.body.data.totalCount,
    },
  };
  return { ...res, body: wrapped };
}

export async function GetHouseholdDetailApi(householdId: string) {
  const res = await apiFetch<ApiResponse<BackendHouseholdResponse>>(
    `/api/household/detail/${householdId}`,
    { method: "GET" },
  );
  const { id, ...rest } = res.body.data;
  const mapped: HouseholdDetailItemType = { ...rest, householdId: id };
  return { ...res, body: { ...res.body, data: mapped } };
}

export async function PostHouseholdCreateApi(
  params: HouseholdCreateRequest,
  idempotencyKey?: string,
) {
  const res = await apiFetch<ApiResponse<BackendHouseholdResponse>>(
    `/api/household/create`,
    {
      method: "POST",
      body: params,
      idempotencyKey,
      errorHandleMethod: "reject",
    },
  );
  const { id, ...rest } = res.body.data;
  const mapped: HouseholdDetailItemType = { ...rest, householdId: id };
  return { ...res, body: { ...res.body, data: mapped } };
}

export async function PutHouseholdUpdateApi(params: HouseholdUpdateRequest) {
  const { householdId, ...rest } = params;
  return apiFetch<ApiResponse<void>>(
    `/api/household/update/${householdId}`,
    { method: "PUT", body: rest, errorHandleMethod: "reject" },
  );
}

export function DeleteHouseholdDeleteApi(householdId: string) {
  return apiFetch<ApiResponse<void>>(
    `/api/household/delete/${householdId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}

// =========================================================
// Members
// =========================================================

// 백엔드 Member 응답: id(=memberId), householdId, userId, role, joinedAt, userName, userEmail
type BackendHouseholdMemberResponse = Omit<
  HouseholdMemberItemType,
  "memberId"
> & {
  id: string;
};

export async function GetHouseholdMembersApi(householdId: string) {
  const res = await apiFetch<
    ApiResponse<BackendCursorPage<BackendHouseholdMemberResponse>>
  >(`/api/household/${householdId}/members`, { method: "GET" });
  const items = res.body.data.items.map(
    ({ id, ...rest }): HouseholdMemberItemType => ({ ...rest, memberId: id }),
  );
  const wrapped: ApiCursorPage<HouseholdMemberItemType> = {
    code: res.body.code,
    message: res.body.message,
    status: res.body.status,
    data: {
      items,
      nextCursor: res.body.data.nextCursor,
      hasNext: res.body.data.hasNext,
      totalCount: res.body.data.totalCount,
    },
  };
  return { ...res, body: wrapped };
}

export async function PostHouseholdMemberCreateApi(
  params: MemberCreateRequest,
  idempotencyKey?: string,
) {
  const { householdId, ...body } = params;
  const res = await apiFetch<ApiResponse<BackendHouseholdMemberResponse>>(
    `/api/household/${householdId}/members`,
    {
      method: "POST",
      body,
      idempotencyKey,
      errorHandleMethod: "reject",
    },
  );
  const { id, ...rest } = res.body.data;
  const mapped: HouseholdMemberItemType = { ...rest, memberId: id };
  return { ...res, body: { ...res.body, data: mapped } };
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
