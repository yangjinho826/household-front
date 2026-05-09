import { apiFetch } from "_libraries/fetch/api-fetch";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";
import { newId } from "_utilities/fmt";
import { mockOkItem as okItem, mockOkList as okList } from "_utilities/mock-response";

import { INITIAL_TRANSACTIONS } from "./mock";
import type {
  Transaction,
  TransactionCreateRequest,
  TransactionUpdateRequest,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const state = { transactions: [...INITIAL_TRANSACTIONS] };

export async function GetTransactionListApi(): Promise<ApiListResponse<Transaction>> {
  if (USE_MOCK) return okList(state.transactions);
  const res = await apiFetch<ApiListResponse<Transaction>>("/api/transaction/list", {
    method: "GET",
  });
  return res.body;
}

export async function PostTransactionCreateApi(
  body: TransactionCreateRequest,
): Promise<ApiResponse<Transaction>> {
  if (USE_MOCK) {
    const created: Transaction = { ...body, id: newId() };
    state.transactions = [created, ...state.transactions];
    return okItem(created);
  }
  const res = await apiFetch<ApiResponse<Transaction>>("/api/transaction/create", {
    method: "POST",
    body,
    errorHandleMethod: "reject",
  });
  return res.body;
}

export async function PutTransactionUpdateApi(
  body: TransactionUpdateRequest,
): Promise<ApiResponse<Transaction>> {
  if (USE_MOCK) {
    state.transactions = state.transactions.map((t) =>
      t.id === body.id ? { ...t, ...body } : t,
    );
    const updated = state.transactions.find((t) => t.id === body.id);
    if (!updated) throw new Error("Transaction not found");
    return okItem(updated);
  }
  const res = await apiFetch<ApiResponse<Transaction>>(
    `/api/transaction/update/${body.id}`,
    { method: "PUT", body, errorHandleMethod: "reject" },
  );
  return res.body;
}

export async function DeleteTransactionApi(
  id: string,
): Promise<ApiResponse<{ id: string }>> {
  if (USE_MOCK) {
    state.transactions = state.transactions.filter((t) => t.id !== id);
    return okItem({ id });
  }
  const res = await apiFetch<ApiResponse<{ id: string }>>(
    `/api/transaction/delete/${id}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
  return res.body;
}
