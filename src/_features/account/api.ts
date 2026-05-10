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
  AccountType,
  AccountUpdateRequest,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_ACCOUNT === "true";

const wrap = <T>(data: T) => ({ body: data });

interface BackendAccountResponse {
  id: string;
  household_id: string;
  name: string;
  account_type: AccountType;
  start_balance: number | string;
  balance: number | string;
  color: string | null;
  icon: string | null;
  sort_order: number;
  is_archived: boolean;
}

const num = (v: number | string) => (typeof v === "number" ? v : Number(v));

function mapToListItem(
  b: BackendAccountResponse,
  rowNo: number,
): AccountListItemType {
  return {
    rowNo,
    accountId: b.id,
    householdId: b.household_id,
    name: b.name,
    accountType: b.account_type,
    startBalance: num(b.start_balance),
    balance: num(b.balance),
    color: b.color,
    icon: b.icon,
    sortOrder: b.sort_order,
    isArchived: b.is_archived,
    frstRegDt: "",
    lastMdfcnDt: "",
    dataStatCd: "ACTIVE",
  };
}

function mapToDetailItem(b: BackendAccountResponse): AccountDetailItemType {
  return {
    accountId: b.id,
    householdId: b.household_id,
    name: b.name,
    accountType: b.account_type,
    startBalance: num(b.start_balance),
    balance: num(b.balance),
    color: b.color,
    icon: b.icon,
    sortOrder: b.sort_order,
    isArchived: b.is_archived,
    frstRegDt: "",
    lastMdfcnDt: "",
    dataStatCd: "ACTIVE",
  };
}

export async function GetAccountSearchApi(params: AccountSearchRequestType) {
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
    return wrap(mockOkList(filtered));
  }

  const queryString = objectToParams({ ...params }).toString();
  const res = await apiFetch<ApiResponse<BackendAccountResponse[]>>(
    `/api/account/list${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
  const items = (res.body.data ?? []).map((b, idx) =>
    mapToListItem(b, idx + 1),
  );
  const wrapped: ApiListResponse<AccountListItemType> = {
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

export async function GetAccountDetailApi(accountId: string) {
  if (USE_MOCK) {
    const item = accountMockStore.detail(accountId);
    if (!item) return Promise.reject(new Error("account not found"));
    return wrap(mockOkItem(item));
  }
  const listRes = await apiFetch<ApiResponse<BackendAccountResponse[]>>(
    `/api/account/list`,
    { method: "GET" },
  );
  const found = (listRes.body.data ?? []).find((a) => a.id === accountId);
  if (!found) return Promise.reject(new Error("account not found"));
  return wrap(mockOkItem(mapToDetailItem(found)));
}

export async function PostAccountCreateApi(params: AccountCreateRequest) {
  if (USE_MOCK) {
    const item = accountMockStore.create({
      householdId: params.householdId,
      name: params.name,
      accountType: params.accountType,
      startBalance: params.startBalance,
      balance: params.startBalance,
      color: params.color ?? null,
      icon: params.icon ?? null,
      sortOrder: params.sortOrder,
      isArchived: params.isArchived,
    });
    return wrap(mockOkItem(item));
  }
  const res = await apiFetch<ApiResponse<BackendAccountResponse>>(
    `/api/account/create`,
    {
      method: "POST",
      body: {
        name: params.name,
        account_type: params.accountType,
        start_balance: params.startBalance,
        color: params.color ?? null,
        icon: params.icon ?? null,
        sort_order: params.sortOrder,
      },
      errorHandleMethod: "reject",
    },
  );
  return {
    ...res,
    body: { ...res.body, data: mapToDetailItem(res.body.data) },
  };
}

export async function PutAccountUpdateApi(params: AccountUpdateRequest) {
  if (USE_MOCK) {
    const { accountId, ...rest } = params;
    accountMockStore.update(accountId, {
      ...rest,
      color: rest.color ?? null,
      icon: rest.icon ?? null,
    });
    return wrap(mockOkItem(undefined as unknown as void));
  }
  const res = await apiFetch<ApiResponse<BackendAccountResponse>>(
    `/api/account/update/${params.accountId}`,
    {
      method: "PUT",
      body: {
        name: params.name,
        account_type: params.accountType,
        start_balance: params.startBalance,
        color: params.color ?? null,
        icon: params.icon ?? null,
        sort_order: params.sortOrder,
        is_archived: params.isArchived,
      },
      errorHandleMethod: "reject",
    },
  );
  return {
    ...res,
    body: { ...res.body, data: undefined as unknown as void },
  };
}

export function DeleteAccountDeleteApi(accountId: string) {
  if (USE_MOCK) {
    accountMockStore.remove(accountId);
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/account/delete/${accountId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}
