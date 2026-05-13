import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { useAccountList } from "_features/account/queries/use-query";
import type { AccountType } from "_features/account/types";

const VALID_TYPES: AccountType[] = ["LIVING", "SAVINGS", "INVESTMENT"];

export function useAccountSearch() {
  const [params, setParams] = useQueryStates({
    accountType: parseAsString,
    pageNo: parseAsInteger.withDefault(1),
    listSize: parseAsInteger.withDefault(20),
  });

  const accountType: AccountType | undefined =
    params.accountType && VALID_TYPES.includes(params.accountType as AccountType)
      ? (params.accountType as AccountType)
      : undefined;

  const { data, isLoading } = useAccountList({
    accountType,
    pageNo: params.pageNo,
    listSize: params.listSize,
  });

  const result = data?.body?.data ?? undefined;

  const setAccountType = (next: AccountType | undefined) => {
    setParams({
      accountType: next ?? null,
      pageNo: 1,
    });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setParams({ ...params, pageNo: page, listSize: pageSize });
  };

  return {
    handlePageChange,
    params,
    accountType,
    setAccountType,
    result,
    isLoading,
  };
}
