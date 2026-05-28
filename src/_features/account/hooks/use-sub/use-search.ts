import { parseAsString, useQueryStates } from "nuqs";
import { useMemo } from "react";

import { useAccountInfiniteList } from "_features/account/queries/use-query";
import type {
  AccountListItemType,
  AccountType,
} from "_features/account/types";

const VALID_TYPES: AccountType[] = ["LIVING", "SAVINGS", "INVESTMENT", "OTHER"];
const PAGE_SIZE = 30;

export function useAccountSearch() {
  const [params, setParams] = useQueryStates({
    accountType: parseAsString,
  });

  const accountType: AccountType | undefined =
    params.accountType && VALID_TYPES.includes(params.accountType as AccountType)
      ? (params.accountType as AccountType)
      : undefined;

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useAccountInfiniteList({ accountType }, PAGE_SIZE);

  const items: AccountListItemType[] = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.body.data.items),
    [data],
  );
  const totalCount = data?.pages[0]?.body.data.totalCount ?? items.length;

  const setAccountType = (next: AccountType | undefined) => {
    setParams({ accountType: next ?? null });
  };

  return {
    accountType,
    setAccountType,
    items,
    totalCount,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  };
}
