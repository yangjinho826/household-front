import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";
import { mockOkItem, mockOkList } from "_utilities/mock-response";

import { accountMockStore } from "./mock";
import type {
  AccountCreateRequest,
  AccountDetailItemType,
  AccountListItemType,
  AccountSearchRequestType,
  AccountUpdateRequest,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const wrap = <T>(data: T) => ({ body: data });

// 통장 검색
export function GetAccountSearchApi(params: AccountSearchRequestType) {
  if (USE_MOCK) {
    const items = accountMockStore.list();
    const filtered = items.filter((i) => {
      if (
        params.searchTerm &&
        !i.name.toLowerCase().includes(params.searchTerm.toLowerCase())
      )
        return false;
      if (params.accountType && i.accountType !== params.accountType)
        return false;
      if (params.isArchived !== undefined && i.isArchived !== params.isArchived)
        return false;
      return true;
    });
    return Promise.resolve(wrap(mockOkList(filtered)));
  }
  const queryString = objectToParams({ ...params }).toString();
  return apiFetch<ApiListResponse<AccountListItemType>>(
    `/api/front/v1/account/list?${queryString}`,
    { method: "GET" },
  );
}

// 통장 상세
export function GetAccountDetailApi(accountId: string) {
  if (USE_MOCK) {
    const item = accountMockStore.detail(accountId);
    if (!item) return Promise.reject(new Error("account not found"));
    return Promise.resolve(wrap(mockOkItem(item)));
  }
  return apiFetch<ApiResponse<AccountDetailItemType>>(
    `/api/front/v1/account/detail/${accountId}`,
    { method: "GET", errorHandleMethod: "reject" },
  );
}

// 통장 생성
export function PostAccountCreateApi(params: AccountCreateRequest) {
  if (USE_MOCK) {
    const item = accountMockStore.create({
      householdId: params.householdId,
      name: params.name,
      accountType: params.accountType,
      startBalance: params.startBalance,
      color: params.color ?? null,
      icon: params.icon ?? null,
      sortOrder: params.sortOrder,
      isArchived: params.isArchived,
    });
    return Promise.resolve(wrap(mockOkItem(item)));
  }
  return apiFetch<ApiResponse<AccountDetailItemType>>(
    `/api/front/v1/account/create`,
    {
      method: "POST",
      body: params,
      errorHandleMethod: "reject",
    },
  );
}

// 통장 수정
export function PutAccountUpdateApi(params: AccountUpdateRequest) {
  if (USE_MOCK) {
    const { accountId, ...rest } = params;
    accountMockStore.update(accountId, {
      ...rest,
      color: rest.color ?? null,
      icon: rest.icon ?? null,
    });
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/front/v1/account/update/${params.accountId}`,
    {
      method: "PUT",
      body: params,
      errorHandleMethod: "reject",
    },
  );
}

// 통장 삭제
export function DeleteAccountDeleteApi(accountId: string) {
  if (USE_MOCK) {
    accountMockStore.remove(accountId);
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/front/v1/account/delete/${accountId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}
