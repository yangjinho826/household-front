import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiListResponse,
  ApiPaginationProps,
  ApiResponse,
} from "_libraries/fetch/response";
import { mockOkItem, mockOkList } from "_utilities/mock-response";

import { transactionMockStore } from "./mock";
import type {
  TransactionCalendarResponse,
  TransactionCreateRequest,
  TransactionDetailItemType,
  TransactionListItemType,
  TransactionSearchRequestType,
  TransactionUpdateRequest,
  TxType,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_TRANSACTION === "true";

const wrap = <T>(data: T) => ({ body: data });

const num = (v: number | string) => (typeof v === "number" ? v : Number(v));

interface BackendTransactionResponse {
  id: string;
  household_id: string;
  tx_type: TxType;
  amount: number | string;
  tx_date: string;
  account_id: string;
  account_name: string | null;
  to_account_id: string | null;
  to_account_name: string | null;
  category_id: string | null;
  category_name: string | null;
  category_color: string | null;
  category_icon: string | null;
  paid_by_user_id: string | null;
  is_fixed: boolean;
  memo: string | null;
}

interface BackendTransactionListResponse {
  items: BackendTransactionResponse[];
  next_cursor: string | null;
  has_next: boolean;
  total_count: number;
}

function mapToListItem(
  b: BackendTransactionResponse,
  rowNo: number,
): TransactionListItemType {
  return {
    rowNo,
    transactionId: b.id,
    householdId: b.household_id,
    txType: b.tx_type,
    amount: num(b.amount),
    txDate: b.tx_date,
    accountId: b.account_id,
    toAccountId: b.to_account_id,
    categoryId: b.category_id,
    paidByUserId: b.paid_by_user_id,
    isFixed: b.is_fixed,
    memo: b.memo,
    accountName: b.account_name,
    toAccountName: b.to_account_name,
    categoryName: b.category_name,
    categoryColor: b.category_color,
    categoryIcon: b.category_icon,
    frstRegDt: "",
    lastMdfcnDt: "",
    dataStatCd: "ACTIVE",
  };
}

function mapToDetailItem(
  b: BackendTransactionResponse,
): TransactionDetailItemType {
  return {
    transactionId: b.id,
    householdId: b.household_id,
    txType: b.tx_type,
    amount: num(b.amount),
    txDate: b.tx_date,
    accountId: b.account_id,
    toAccountId: b.to_account_id,
    categoryId: b.category_id,
    paidByUserId: b.paid_by_user_id,
    isFixed: b.is_fixed,
    memo: b.memo,
    accountName: b.account_name,
    toAccountName: b.to_account_name,
    categoryName: b.category_name,
    categoryColor: b.category_color,
    categoryIcon: b.category_icon,
    frstRegDt: "",
    lastMdfcnDt: "",
    dataStatCd: "ACTIVE",
  };
}

export async function GetTransactionSearchApi(
  params: TransactionSearchRequestType &
    Partial<ApiPaginationProps> & { cursor?: string | null; limit?: number },
) {
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
    return wrap(mockOkList(filtered));
  }

  const limit = params.limit ?? params.listSize;
  const queryParams: Record<string, unknown> = {};
  if (params.cursor) queryParams.cursor = params.cursor;
  if (limit) queryParams.limit = limit;
  if (params.txType) queryParams.tx_type = params.txType;
  if (params.accountId) queryParams.account_id = params.accountId;
  if (params.categoryId) queryParams.category_id = params.categoryId;
  if (params.year !== undefined) queryParams.year = params.year;
  if (params.month !== undefined) queryParams.month = params.month;
  if (params.fromDate) queryParams.from_date = params.fromDate;
  if (params.toDate) queryParams.to_date = params.toDate;

  const queryString = objectToParams(queryParams).toString();
  const res = await apiFetch<ApiResponse<BackendTransactionListResponse>>(
    `/api/transaction/list${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
  const items = (res.body.data?.items ?? []).map((b, idx) =>
    mapToListItem(b, idx + 1),
  );
  const nextCursor = res.body.data?.next_cursor ?? null;
  const hasNext = res.body.data?.has_next ?? false;
  const totalCount = res.body.data?.total_count ?? items.length;

  const wrapped: ApiListResponse<TransactionListItemType> & {
    data: ApiListResponse<TransactionListItemType>["data"] & {
      nextCursor: string | null;
      hasNext: boolean;
    };
  } = {
    code: res.body.code,
    message: res.body.message,
    status: res.body.status,
    data: {
      listSize: items.length,
      currentPage: 1,
      currentCount: items.length,
      totalElements: totalCount,
      totalPages: hasNext ? 2 : 1,
      content: items,
      nextCursor,
      hasNext,
    },
  };
  return { ...res, body: wrapped };
}

export async function GetTransactionDetailApi(transactionId: string) {
  if (USE_MOCK) {
    const item = transactionMockStore.detail(transactionId);
    if (!item) return Promise.reject(new Error("transaction not found"));
    return wrap(mockOkItem(item));
  }
  // 백엔드 detail endpoint 미구현 — list 받아서 find 우회
  const res = await apiFetch<ApiResponse<BackendTransactionListResponse>>(
    `/api/transaction/list?limit=100`,
    { method: "GET" },
  );
  const found = (res.body.data?.items ?? []).find((t) => t.id === transactionId);
  if (!found) return Promise.reject(new Error("transaction not found"));
  return wrap(mockOkItem(mapToDetailItem(found)));
}

export async function PostTransactionCreateApi(
  params: TransactionCreateRequest,
) {
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
    return wrap(mockOkItem(item));
  }
  const res = await apiFetch<ApiResponse<BackendTransactionResponse>>(
    `/api/transaction/create`,
    {
      method: "POST",
      body: {
        tx_type: params.txType,
        amount: params.amount,
        tx_date: params.txDate,
        account_id: params.accountId,
        to_account_id: params.toAccountId ?? null,
        category_id: params.categoryId ?? null,
        paid_by_user_id: params.paidByUserId ?? null,
        is_fixed: params.isFixed,
        memo: params.memo ?? null,
      },
      errorHandleMethod: "reject",
    },
  );
  return {
    ...res,
    body: { ...res.body, data: mapToDetailItem(res.body.data) },
  };
}

export async function PutTransactionUpdateApi(
  params: TransactionUpdateRequest,
) {
  if (USE_MOCK) {
    const { transactionId, ...rest } = params;
    transactionMockStore.update(transactionId, {
      ...rest,
      toAccountId: rest.toAccountId ?? null,
      categoryId: rest.categoryId ?? null,
      paidByUserId: rest.paidByUserId ?? null,
      memo: rest.memo ?? null,
    });
    return wrap(mockOkItem(undefined as unknown as void));
  }
  const res = await apiFetch<ApiResponse<BackendTransactionResponse>>(
    `/api/transaction/update/${params.transactionId}`,
    {
      method: "PUT",
      body: {
        tx_type: params.txType,
        amount: params.amount,
        tx_date: params.txDate,
        account_id: params.accountId,
        to_account_id: params.toAccountId ?? null,
        category_id: params.categoryId ?? null,
        paid_by_user_id: params.paidByUserId ?? null,
        is_fixed: params.isFixed,
        memo: params.memo ?? null,
      },
      errorHandleMethod: "reject",
    },
  );
  return {
    ...res,
    body: { ...res.body, data: undefined as unknown as void },
  };
}

export function DeleteTransactionDeleteApi(transactionId: string) {
  if (USE_MOCK) {
    transactionMockStore.remove(transactionId);
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/transaction/delete/${transactionId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}

interface BackendCalendarDay {
  date: string;
  income: number | string;
  expense: number | string;
  transfer: number | string;
  count: number;
}

interface BackendCalendarResponse {
  year: number;
  month: number;
  monthly_income: number | string;
  monthly_expense: number | string;
  monthly_transfer: number | string;
  days: BackendCalendarDay[];
}

/** 달력 — 일별/월별 합계 (백엔드 미리 계산) */
export async function GetTransactionCalendarApi(params: {
  year: number;
  month: number;
}) {
  if (USE_MOCK) {
    // mock: list 받아서 클라 합산 (백엔드 동등 결과)
    const items = transactionMockStore.list();
    const prefix = `${params.year}-${String(params.month).padStart(2, "0")}`;
    const monthItems = items.filter((it) => it.txDate.startsWith(prefix));

    const dayMap = new Map<
      string,
      { income: number; expense: number; transfer: number; count: number }
    >();
    let monthlyIncome = 0;
    let monthlyExpense = 0;
    let monthlyTransfer = 0;
    for (const it of monthItems) {
      const d = it.txDate.slice(0, 10);
      const cur = dayMap.get(d) ?? { income: 0, expense: 0, transfer: 0, count: 0 };
      cur.count += 1;
      if (it.txType === "INCOME") {
        cur.income += it.amount;
        monthlyIncome += it.amount;
      } else if (it.txType === "EXPENSE") {
        cur.expense += it.amount;
        monthlyExpense += it.amount;
      } else {
        cur.transfer += it.amount;
        monthlyTransfer += it.amount;
      }
      dayMap.set(d, cur);
    }
    const data: TransactionCalendarResponse = {
      year: params.year,
      month: params.month,
      monthlyIncome,
      monthlyExpense,
      monthlyTransfer,
      days: Array.from(dayMap.entries())
        .map(([date, v]) => ({ date, ...v }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    };
    return wrap(mockOkItem(data));
  }
  const res = await apiFetch<ApiResponse<BackendCalendarResponse>>(
    `/api/transaction/calendar?year=${params.year}&month=${params.month}`,
    { method: "GET" },
  );
  const b = res.body.data;
  const data: TransactionCalendarResponse = {
    year: b.year,
    month: b.month,
    monthlyIncome: num(b.monthly_income),
    monthlyExpense: num(b.monthly_expense),
    monthlyTransfer: num(b.monthly_transfer),
    days: b.days.map((d) => ({
      date: d.date,
      income: num(d.income),
      expense: num(d.expense),
      transfer: num(d.transfer),
      count: d.count,
    })),
  };
  return { ...res, body: { ...res.body, data } };
}
