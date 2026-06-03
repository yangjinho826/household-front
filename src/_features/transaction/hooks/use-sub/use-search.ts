import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { defaultYearMonth } from "_features/common/components/month-picker";
import type { TxType } from "_features/transaction/types";

export type TransactionViewMode = "list" | "calendar";
export type TransactionFilterMode = "all" | TxType;

const VIEW_MODES: TransactionViewMode[] = ["list", "calendar"];
const FILTER_MODES: TransactionFilterMode[] = [
  "all",
  "EXPENSE",
  "INCOME",
  "TRANSFER",
  "FIXED_EXPENSE",
];

/**
 * 거래 목록 화면 URL 상태 — view/filter/month 를 nuqs 로 동기화.
 * 다른 도메인의 use-search 와 동일 패턴.
 */
export function useTransactionSearch() {
  const [params, setParams] = useQueryStates({
    view: parseAsStringEnum<TransactionViewMode>(VIEW_MODES).withDefault("list"),
    filter: parseAsStringEnum<TransactionFilterMode>(FILTER_MODES).withDefault(
      "all",
    ),
    month: parseAsString.withDefault(defaultYearMonth()),
    // 계좌 필터 — 빈 문자열 = 전체 계좌
    account: parseAsString.withDefault(""),
  });

  const [yearStr, monthStr] = params.month.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);

  return {
    view: params.view,
    filter: params.filter,
    month: params.month,
    accountId: params.account || undefined,
    year,
    monthNum: month,
    setView: (next: TransactionViewMode) => setParams({ view: next }),
    setFilter: (next: TransactionFilterMode) => setParams({ filter: next }),
    setMonth: (next: string) => setParams({ month: next }),
    setAccountId: (next: string | undefined) =>
      setParams({ account: next ?? "" }),
  };
}
