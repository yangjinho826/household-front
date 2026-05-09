import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";
import { mockOkItem, mockOkList } from "_utilities/mock-response";

import { householdMockStore } from "./mock";
import type {
  HouseholdCreateRequest,
  HouseholdDetailItemType,
  HouseholdListItemType,
  HouseholdMemberItemType,
  HouseholdSearchRequestType,
  HouseholdUpdateRequest,
  MemberCreateRequest,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const wrap = <T>(data: T) => ({ body: data });

// =========================================================
// Household CRUD
// =========================================================

export function GetHouseholdSearchApi(params: HouseholdSearchRequestType) {
  if (USE_MOCK) {
    const items = householdMockStore.list();
    const filtered = items.filter((i) => {
      if (
        params.searchTerm &&
        !i.name.toLowerCase().includes(params.searchTerm.toLowerCase())
      )
        return false;
      return true;
    });
    return Promise.resolve(wrap(mockOkList(filtered)));
  }
  const queryString = objectToParams({ ...params }).toString();
  return apiFetch<ApiListResponse<HouseholdListItemType>>(
    `/api/front/v1/household/list?${queryString}`,
    { method: "GET" },
  );
}

export function GetHouseholdDetailApi(householdId: string) {
  if (USE_MOCK) {
    const item = householdMockStore.detail(householdId);
    if (!item) return Promise.reject(new Error("household not found"));
    return Promise.resolve(wrap(mockOkItem(item)));
  }
  return apiFetch<ApiResponse<HouseholdDetailItemType>>(
    `/api/front/v1/household/detail/${householdId}`,
    { method: "GET", errorHandleMethod: "reject" },
  );
}

export function PostHouseholdCreateApi(params: HouseholdCreateRequest) {
  if (USE_MOCK) {
    const item = householdMockStore.create({
      name: params.name,
      description: params.description ?? null,
      ownerId: "u-mock-owner",
      currency: params.currency,
      startedAt: params.startedAt,
    });
    return Promise.resolve(wrap(mockOkItem(item)));
  }
  return apiFetch<ApiResponse<HouseholdDetailItemType>>(
    `/api/front/v1/household/create`,
    { method: "POST", body: params, errorHandleMethod: "reject" },
  );
}

export function PutHouseholdUpdateApi(params: HouseholdUpdateRequest) {
  if (USE_MOCK) {
    const { householdId, ...rest } = params;
    householdMockStore.update(householdId, {
      ...rest,
      description: rest.description ?? null,
    });
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/front/v1/household/update/${params.householdId}`,
    { method: "PUT", body: params, errorHandleMethod: "reject" },
  );
}

export function DeleteHouseholdDeleteApi(householdId: string) {
  if (USE_MOCK) {
    householdMockStore.remove(householdId);
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/front/v1/household/delete/${householdId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}

// =========================================================
// Member CRUD
// =========================================================

export function GetHouseholdMembersApi(householdId: string) {
  if (USE_MOCK) {
    return Promise.resolve(
      wrap(mockOkList(householdMockStore.members(householdId))),
    );
  }
  return apiFetch<ApiListResponse<HouseholdMemberItemType>>(
    `/api/front/v1/household/${householdId}/members/list`,
    { method: "GET" },
  );
}

export function PostHouseholdMemberCreateApi(params: MemberCreateRequest) {
  if (USE_MOCK) {
    const item = householdMockStore.addMember({
      householdId: params.householdId,
      userId: params.userId,
      role: params.role,
    });
    return Promise.resolve(wrap(mockOkItem(item)));
  }
  return apiFetch<ApiResponse<HouseholdMemberItemType>>(
    `/api/front/v1/household/${params.householdId}/members/create`,
    { method: "POST", body: params, errorHandleMethod: "reject" },
  );
}

export function DeleteHouseholdMemberDeleteApi(
  householdId: string,
  memberId: string,
) {
  if (USE_MOCK) {
    householdMockStore.removeMember(memberId);
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/front/v1/household/${householdId}/members/delete/${memberId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}
