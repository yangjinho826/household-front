import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiCursorPage,
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

interface BackendCursorPage<T> {
  items: T[];
  nextCursor: string | null;
  hasNext: boolean;
  totalCount: number | null;
}

function toListItem(
  b: BackendAccountResponse,
  rowNo: number,
): AccountListItemType {
  const { id, ...rest } = b;
  return { ...rest, accountId: id, rowNo };
}

/** 통장 목록 — cursor 무한 스크롤. cursor=null 이면 첫 페이지. */
export async function GetAccountSearchApi(
  params: AccountSearchRequestType & { cursor?: string | null; limit?: number },
) {
  const queryParams: Record<string, unknown> = {};
  if (params.searchTerm) queryParams.searchTerm = params.searchTerm;
  if (params.accountType) queryParams.accountType = params.accountType;
  if (params.isArchived !== undefined)
    queryParams.isArchived = params.isArchived;
  if (params.cursor) queryParams.cursor = params.cursor;
  if (params.limit) queryParams.limit = params.limit;
  const queryString = objectToParams(queryParams).toString();

  const res = await apiFetch<
    ApiResponse<BackendCursorPage<BackendAccountResponse>>
  >(`/api/account/list${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
  });
  const items = res.body.data.items.map((b, i) => toListItem(b, i + 1));
  const wrapped: ApiCursorPage<AccountListItemType> = {
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
