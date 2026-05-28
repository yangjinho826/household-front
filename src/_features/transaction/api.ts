import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiCursorPage,
  ApiPaginationProps,
  ApiResponse,
} from "_libraries/fetch/response";

import type {
  TransactionCalendarResponse,
  TransactionCreateRequest,
  TransactionDetailItemType,
  TransactionListItemType,
  TransactionSearchRequestType,
  TransactionUpdateRequest,
} from "./types";

type BackendTransactionResponse = Omit<
  TransactionDetailItemType,
  "transactionId"
> & { id: string };

interface BackendTransactionListPage {
  items: BackendTransactionResponse[];
  nextCursor: string | null;
  hasNext: boolean;
  totalCount: number | null;
}

function toListItem(
  b: BackendTransactionResponse,
  rowNo: number,
): TransactionListItemType {
  const { id, ...rest } = b;
  return { ...rest, transactionId: id, rowNo };
}

function toDetail(b: BackendTransactionResponse): TransactionDetailItemType {
  const { id, ...rest } = b;
  return { ...rest, transactionId: id };
}

export async function GetTransactionSearchApi(
  params: TransactionSearchRequestType &
    Partial<ApiPaginationProps> & { cursor?: string | null; limit?: number },
) {
  const limit = params.limit ?? params.listSize;
  const queryParams: Record<string, unknown> = {};
  if (params.cursor) queryParams.cursor = params.cursor;
  if (limit) queryParams.limit = limit;
  if (params.txType) queryParams.txType = params.txType;
  if (params.accountId) queryParams.accountId = params.accountId;
  if (params.categoryId) queryParams.categoryId = params.categoryId;
  if (params.year !== undefined) queryParams.year = params.year;
  if (params.month !== undefined) queryParams.month = params.month;
  if (params.fromDate) queryParams.fromDate = params.fromDate;
  if (params.toDate) queryParams.toDate = params.toDate;

  const queryString = objectToParams(queryParams).toString();
  const res = await apiFetch<ApiResponse<BackendTransactionListPage>>(
    `/api/transaction/list${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
  const items = (res.body.data?.items ?? []).map((b, idx) =>
    toListItem(b, idx + 1),
  );
  const wrapped: ApiCursorPage<TransactionListItemType> = {
    code: res.body.code,
    message: res.body.message,
    status: res.body.status,
    data: {
      items,
      nextCursor: res.body.data?.nextCursor ?? null,
      hasNext: res.body.data?.hasNext ?? false,
      totalCount: res.body.data?.totalCount ?? null,
    },
  };
  return { ...res, body: wrapped };
}

export async function GetTransactionDetailApi(transactionId: string) {
  const res = await apiFetch<ApiResponse<BackendTransactionResponse>>(
    `/api/transaction/detail/${transactionId}`,
    { method: "GET" },
  );
  return { ...res, body: { ...res.body, data: toDetail(res.body.data) } };
}

export async function PostTransactionCreateApi(
  params: TransactionCreateRequest,
) {
  const res = await apiFetch<ApiResponse<BackendTransactionResponse>>(
    `/api/transaction/create`,
    { method: "POST", body: params, errorHandleMethod: "reject" },
  );
  return { ...res, body: { ...res.body, data: toDetail(res.body.data) } };
}

export async function PutTransactionUpdateApi(
  params: TransactionUpdateRequest,
) {
  const { transactionId, ...rest } = params;
  return apiFetch<ApiResponse<void>>(
    `/api/transaction/update/${transactionId}`,
    { method: "PUT", body: rest, errorHandleMethod: "reject" },
  );
}

export function DeleteTransactionDeleteApi(transactionId: string) {
  return apiFetch<ApiResponse<void>>(
    `/api/transaction/delete/${transactionId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}

/** 달력 — 일별/월별 합계 (백엔드 미리 계산) */
export async function GetTransactionCalendarApi(params: {
  year: number;
  month: number;
}) {
  return apiFetch<ApiResponse<TransactionCalendarResponse>>(
    `/api/transaction/calendar?year=${params.year}&month=${params.month}`,
    { method: "GET" },
  );
}
