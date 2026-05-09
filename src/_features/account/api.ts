import { apiFetch } from "_libraries/fetch/api-fetch";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";
import { newId } from "_utilities/fmt";
import { mockOkItem as okItem, mockOkList as okList } from "_utilities/mock-response";

import { INITIAL_ACCOUNTS } from "./mock";
import type {
  Account,
  AccountCreateRequest,
  AccountUpdateRequest,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const state = { accounts: [...INITIAL_ACCOUNTS] };

export async function GetAccountListApi(): Promise<ApiListResponse<Account>> {
  if (USE_MOCK) return okList(state.accounts);
  const res = await apiFetch<ApiListResponse<Account>>("/api/account/list", { method: "GET" });
  return res.body;
}

export async function PostAccountCreateApi(
  body: AccountCreateRequest,
): Promise<ApiResponse<Account>> {
  if (USE_MOCK) {
    const created: Account = { ...body, id: newId() };
    state.accounts.push(created);
    return okItem(created);
  }
  const res = await apiFetch<ApiResponse<Account>>("/api/account/create", {
    method: "POST",
    body,
    errorHandleMethod: "reject",
  });
  return res.body;
}

export async function PutAccountUpdateApi(
  body: AccountUpdateRequest,
): Promise<ApiResponse<Account>> {
  if (USE_MOCK) {
    state.accounts = state.accounts.map((a) => (a.id === body.id ? { ...a, ...body } : a));
    const updated = state.accounts.find((a) => a.id === body.id);
    if (!updated) throw new Error("Account not found");
    return okItem(updated);
  }
  const res = await apiFetch<ApiResponse<Account>>(`/api/account/update/${body.id}`, {
    method: "PUT",
    body,
    errorHandleMethod: "reject",
  });
  return res.body;
}

export async function DeleteAccountApi(
  id: string,
): Promise<ApiResponse<{ id: string }>> {
  if (USE_MOCK) {
    state.accounts = state.accounts.filter((a) => a.id !== id);
    return okItem({ id });
  }
  const res = await apiFetch<ApiResponse<{ id: string }>>(`/api/account/delete/${id}`, {
    method: "DELETE",
    errorHandleMethod: "reject",
  });
  return res.body;
}
