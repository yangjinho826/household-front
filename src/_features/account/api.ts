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
  AccountType,
  AccountUpdateRequest,
} from "./types";

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
  // INVESTMENT 통장 한정 (LIVING/SAVINGS 는 null)
  cash?: number | string | null;
  portfolio_cost?: number | string | null;
  portfolio_valuation?: number | string | null;
  portfolio_profit_loss?: number | string | null;
  portfolio_profit_loss_rate?: number | string | null;
}

const num = (v: number | string) => (typeof v === "number" ? v : Number(v));
const numOrNull = (v: number | string | null | undefined) =>
  v === null || v === undefined ? null : num(v);

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
    cash: numOrNull(b.cash),
    portfolioCost: numOrNull(b.portfolio_cost),
    portfolioValuation: numOrNull(b.portfolio_valuation),
    portfolioProfitLoss: numOrNull(b.portfolio_profit_loss),
    portfolioProfitLossRate: numOrNull(b.portfolio_profit_loss_rate),
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
    cash: numOrNull(b.cash),
    portfolioCost: numOrNull(b.portfolio_cost),
    portfolioValuation: numOrNull(b.portfolio_valuation),
    portfolioProfitLoss: numOrNull(b.portfolio_profit_loss),
    portfolioProfitLossRate: numOrNull(b.portfolio_profit_loss_rate),
    frstRegDt: "",
    lastMdfcnDt: "",
    dataStatCd: "ACTIVE",
  };
}

export async function GetAccountSearchApi(params: AccountSearchRequestType) {
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
  // 백엔드에 단건 detail 엔드포인트 미구현 → list 받아서 find
  const listRes = await apiFetch<ApiResponse<BackendAccountResponse[]>>(
    `/api/account/list`,
    { method: "GET" },
  );
  const found = (listRes.body.data ?? []).find((a) => a.id === accountId);
  if (!found) return Promise.reject(new Error("account not found"));
  return {
    ...listRes,
    body: { ...listRes.body, data: mapToDetailItem(found) },
  };
}

export async function PostAccountCreateApi(params: AccountCreateRequest) {
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
  return apiFetch<ApiResponse<void>>(
    `/api/account/delete/${accountId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}
