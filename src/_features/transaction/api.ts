import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiCursorPage,
  ApiPaginationProps,
  ApiResponse,
} from "_libraries/fetch/response";

import type { AccountListItemType } from "_features/account/types";
import type { CategoryListItemType } from "_features/category/types";
import type { FixedListItemType } from "_features/fixed/types";

import type {
  TransactionCalendarFullType,
  TransactionCalendarResponse,
  TransactionCreateRequest,
  TransactionDetailItemType,
  TransactionFormOptionsType,
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

type BackendAccount = Omit<AccountListItemType, "accountId" | "rowNo"> & {
  id: string;
};
type BackendCategory = Omit<CategoryListItemType, "categoryId" | "rowNo"> & {
  id: string;
};
type BackendFixed = Omit<FixedListItemType, "fixedId" | "rowNo"> & {
  id: string;
};

interface BackendCalendarFull
  extends Omit<TransactionCalendarFullType, "transactions"> {
  transactions: BackendTransactionResponse[];
}

interface BackendFormOptions {
  accounts: BackendAccount[];
  categories: BackendCategory[];
  fixedExpenses: BackendFixed[];
}

/** 달력 페이지 1호출 — calendar + stats + 그달 거래 */
export async function GetTransactionCalendarFullApi(params: {
  year: number;
  month: number;
}) {
  const res = await apiFetch<ApiResponse<BackendCalendarFull>>(
    `/api/transaction/calendar/${params.year}/${params.month}/full`,
    { method: "GET" },
  );
  const transactions = res.body.data.transactions.map((b, i) =>
    toListItem(b, i + 1),
  );
  const mapped: TransactionCalendarFullType = {
    year: res.body.data.year,
    month: res.body.data.month,
    monthlyIncome: res.body.data.monthlyIncome,
    monthlyExpense: res.body.data.monthlyExpense,
    monthlyTransfer: res.body.data.monthlyTransfer,
    days: res.body.data.days,
    byCategory: res.body.data.byCategory,
    transactions,
  };
  return { ...res, body: { ...res.body, data: mapped } };
}

/** 거래 등록/수정 폼 옵션 — 통장 + 카테고리 + 활성 고정지출 */
export async function GetTransactionFormOptionsApi() {
  const res = await apiFetch<ApiResponse<BackendFormOptions>>(
    `/api/transaction/form-options`,
    { method: "GET" },
  );
  const accounts: AccountListItemType[] = res.body.data.accounts.map(
    ({ id, ...rest }, i) => ({ ...rest, accountId: id, rowNo: i + 1 }),
  );
  const categories: CategoryListItemType[] = res.body.data.categories.map(
    ({ id, ...rest }, i) => ({ ...rest, categoryId: id, rowNo: i + 1 }),
  );
  const fixedExpenses: FixedListItemType[] = res.body.data.fixedExpenses.map(
    ({ id, ...rest }, i) => ({ ...rest, fixedId: id, rowNo: i + 1 }),
  );
  const mapped: TransactionFormOptionsType = {
    accounts,
    categories,
    fixedExpenses,
  };
  return { ...res, body: { ...res.body, data: mapped } };
}
