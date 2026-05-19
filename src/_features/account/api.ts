import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";

import type {
  AccountCreateRequest,
  AccountDetailItemType,
  AccountListItemType,
  AccountSearchRequestType,
  AccountUpdateRequest,
} from "./types";

// 백엔드 응답은 PK 가 `id`. 프론트 타입은 `accountId` 로 통일.
type BackendAccountResponse = Omit<AccountDetailItemType, "accountId"> & {
  id: string;
};

export async function GetAccountSearchApi(params: AccountSearchRequestType) {
  const queryString = objectToParams({ ...params }).toString();
  const res = await apiFetch<ApiResponse<BackendAccountResponse[]>>(
    `/api/account/list${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
  const items = (res.body.data ?? []).map(
    ({ id, ...rest }, idx): AccountListItemType => ({
      ...rest,
      accountId: id,
      rowNo: idx + 1,
    }),
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
  const res = await apiFetch<ApiResponse<BackendAccountResponse>>(
    `/api/account/detail/${accountId}`,
    { method: "GET" },
  );
  const { id, ...rest } = res.body.data;
  const mapped: AccountDetailItemType = { ...rest, accountId: id };
  return { ...res, body: { ...res.body, data: mapped } };
}

export async function PostAccountCreateApi(params: AccountCreateRequest) {
  const res = await apiFetch<ApiResponse<BackendAccountResponse>>(
    `/api/account/create`,
    { method: "POST", body: params, errorHandleMethod: "reject" },
  );
  const { id, ...rest } = res.body.data;
  const mapped: AccountDetailItemType = { ...rest, accountId: id };
  return { ...res, body: { ...res.body, data: mapped } };
}

export async function PutAccountUpdateApi(params: AccountUpdateRequest) {
  const { accountId, ...rest } = params;
  return apiFetch<ApiResponse<void>>(
    `/api/account/update/${accountId}`,
    { method: "PUT", body: rest, errorHandleMethod: "reject" },
  );
}

export function DeleteAccountDeleteApi(accountId: string) {
  return apiFetch<ApiResponse<void>>(
    `/api/account/delete/${accountId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}
