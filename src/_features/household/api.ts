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
  HouseholdSearchRequestType,
  HouseholdUpdateRequest,
  MemberCreateRequest,
} from "./types";

type BackendHouseholdResponse = Omit<HouseholdDetailItemType, "householdId"> & {
  id: string;
};

// =========================================================
// Household CRUD
// =========================================================

export async function GetHouseholdSearchApi(
  params: HouseholdSearchRequestType,
) {
  const queryString = objectToParams({ ...params }).toString();
  const res = await apiFetch<ApiResponse<BackendHouseholdResponse[]>>(
    `/api/household/list${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
  const items = (res.body.data ?? []).map(
    ({ id, ...rest }, idx): HouseholdListItemType => ({
      ...rest,
      householdId: id,
      rowNo: idx + 1,
    }),
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
  const { id, ...rest } = res.body.data;
  const mapped: HouseholdDetailItemType = { ...rest, householdId: id };
  return { ...res, body: { ...res.body, data: mapped } };
}

export async function PostHouseholdCreateApi(params: HouseholdCreateRequest) {
  const res = await apiFetch<ApiResponse<BackendHouseholdResponse>>(
    `/api/household/create`,
    { method: "POST", body: params, errorHandleMethod: "reject" },
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
  const res = await apiFetch<ApiResponse<BackendHouseholdMemberResponse[]>>(
    `/api/household/${householdId}/members`,
    { method: "GET" },
  );
  const items = (res.body.data ?? []).map(
    ({ id, ...rest }): HouseholdMemberItemType => ({ ...rest, memberId: id }),
  );
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
  const { householdId, ...body } = params;
  const res = await apiFetch<ApiResponse<BackendHouseholdMemberResponse>>(
    `/api/household/${householdId}/members`,
    { method: "POST", body, errorHandleMethod: "reject" },
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
