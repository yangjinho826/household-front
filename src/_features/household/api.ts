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
  HouseholdRole,
  HouseholdSearchRequestType,
  HouseholdUpdateRequest,
  MemberCreateRequest,
} from "./types";

// household 도메인 백엔드 토글 — 기본 false (백엔드). mock 보려면 NEXT_PUBLIC_USE_MOCK_HOUSEHOLD=true.
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_HOUSEHOLD === "true";

const wrap = <T>(data: T) => ({ body: data });

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
// Household CRUD
// =========================================================

export async function GetHouseholdSearchApi(
  params: HouseholdSearchRequestType,
) {
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
    return wrap(mockOkList(filtered));
  }
  // 백엔드: GET /api/household/list → ApiResponse<list[HouseholdResponse]>
  const queryString = objectToParams({ ...params }).toString();
  const res = await apiFetch<ApiResponse<BackendHouseholdResponse[]>>(
    `/api/household/list${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
  const items = (res.body.data ?? []).map((b, idx) =>
    mapToListItem(b, idx + 1),
  );
  // 단순 list → ApiListResponse 페이징 wrap (sections 호환)
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
  if (USE_MOCK) {
    const item = householdMockStore.detail(householdId);
    if (!item) return Promise.reject(new Error("household not found"));
    return wrap(mockOkItem(item));
  }
  // 백엔드 detail endpoint 미구현 — list 받아서 find
  const listRes = await apiFetch<ApiResponse<BackendHouseholdResponse[]>>(
    `/api/household/list`,
    { method: "GET" },
  );
  const found = (listRes.body.data ?? []).find((h) => h.id === householdId);
  if (!found) return Promise.reject(new Error("household not found"));
  return wrap(mockOkItem(mapToDetailItem(found)));
}

export async function PostHouseholdCreateApi(params: HouseholdCreateRequest) {
  if (USE_MOCK) {
    const item = householdMockStore.create({
      name: params.name,
      description: params.description ?? null,
      ownerId: "u-mock-owner",
      currency: params.currency,
      startedAt: params.startedAt,
    });
    return wrap(mockOkItem(item));
  }
  // 백엔드: POST /api/household/create — body snake_case 변환
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
  if (USE_MOCK) {
    const { householdId, ...rest } = params;
    householdMockStore.update(householdId, {
      ...rest,
      description: rest.description ?? null,
    });
    return wrap(mockOkItem(undefined as unknown as void));
  }
  // 백엔드: PUT /api/household/update/{id}
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
  if (USE_MOCK) {
    householdMockStore.remove(householdId);
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/household/delete/${householdId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}

// =========================================================
// Members — 백엔드 미구현. mock 강제 (NEXT_PUBLIC_USE_MOCK_HOUSEHOLD 무시).
// 백엔드에 endpoint 추가되면 USE_MOCK 분기 도입.
// =========================================================

export function GetHouseholdMembersApi(householdId: string) {
  return Promise.resolve(
    wrap(mockOkList(householdMockStore.members(householdId))),
  );
}

export function PostHouseholdMemberCreateApi(params: MemberCreateRequest) {
  const item = householdMockStore.addMember({
    householdId: params.householdId,
    userId: params.userId,
    role: params.role,
  });
  return Promise.resolve(wrap(mockOkItem(item)));
}

export function DeleteHouseholdMemberDeleteApi(
  _householdId: string,
  memberId: string,
) {
  householdMockStore.removeMember(memberId);
  return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
}
