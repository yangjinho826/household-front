import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";
import { mockOkItem, mockOkList } from "_utilities/mock-response";

import { transactionMockStore } from "./mock";
import type {
  TransactionCreateRequest,
  TransactionDetailItemType,
  TransactionListItemType,
  TransactionSearchRequestType,
  TransactionUpdateRequest,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const wrap = <T>(data: T) => ({ body: data });

export function GetTransactionSearchApi(params: TransactionSearchRequestType) {
  if (USE_MOCK) {
    const items = transactionMockStore.list();
    const filtered = items.filter((i) => {
      if (
        params.searchTerm &&
        !`${i.memo ?? ""} ${i.categoryName ?? ""}`
          .toLowerCase()
          .includes(params.searchTerm.toLowerCase())
      )
        return false;
      if (params.txType && i.txType !== params.txType) return false;
      if (params.accountId && i.accountId !== params.accountId) return false;
      if (params.categoryId && i.categoryId !== params.categoryId) return false;
      return true;
    });
    return Promise.resolve(wrap(mockOkList(filtered)));
  }
  const queryString = objectToParams({ ...params }).toString();
  return apiFetch<ApiListResponse<TransactionListItemType>>(
    `/api/front/v1/transaction/list?${queryString}`,
    { method: "GET" },
  );
}

export function GetTransactionDetailApi(transactionId: string) {
  if (USE_MOCK) {
    const item = transactionMockStore.detail(transactionId);
    if (!item) return Promise.reject(new Error("transaction not found"));
    return Promise.resolve(wrap(mockOkItem(item)));
  }
  return apiFetch<ApiResponse<TransactionDetailItemType>>(
    `/api/front/v1/transaction/detail/${transactionId}`,
    { method: "GET", errorHandleMethod: "reject" },
  );
}

export function PostTransactionCreateApi(params: TransactionCreateRequest) {
  if (USE_MOCK) {
    const item = transactionMockStore.create({
      householdId: params.householdId,
      txType: params.txType,
      amount: params.amount,
      txDate: params.txDate,
      accountId: params.accountId,
      toAccountId: params.toAccountId ?? null,
      categoryId: params.categoryId ?? null,
      paidByUserId: params.paidByUserId ?? null,
      isFixed: params.isFixed,
      memo: params.memo ?? null,
    });
    return Promise.resolve(wrap(mockOkItem(item)));
  }
  return apiFetch<ApiResponse<TransactionDetailItemType>>(
    `/api/front/v1/transaction/create`,
    { method: "POST", body: params, errorHandleMethod: "reject" },
  );
}

export function PutTransactionUpdateApi(params: TransactionUpdateRequest) {
  if (USE_MOCK) {
    const { transactionId, ...rest } = params;
    transactionMockStore.update(transactionId, {
      ...rest,
      toAccountId: rest.toAccountId ?? null,
      categoryId: rest.categoryId ?? null,
      paidByUserId: rest.paidByUserId ?? null,
      memo: rest.memo ?? null,
    });
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/front/v1/transaction/update/${params.transactionId}`,
    { method: "PUT", body: params, errorHandleMethod: "reject" },
  );
}

export function DeleteTransactionDeleteApi(transactionId: string) {
  if (USE_MOCK) {
    transactionMockStore.remove(transactionId);
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/front/v1/transaction/delete/${transactionId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}
