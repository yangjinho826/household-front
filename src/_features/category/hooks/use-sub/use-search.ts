import { parseAsString, useQueryStates } from "nuqs";
import { useMemo } from "react";

import { useCategoryInfiniteList } from "_features/category/queries/use-query";
import type {
  CategoryKind,
  CategoryListItemType,
} from "_features/category/types";

const VALID_KINDS: CategoryKind[] = ["EXPENSE", "INCOME"];
const PAGE_SIZE = 30;

export function useCategorySearch() {
  const [params, setParams] = useQueryStates({
    kind: parseAsString,
  });

  const kind: CategoryKind | undefined =
    params.kind && VALID_KINDS.includes(params.kind as CategoryKind)
      ? (params.kind as CategoryKind)
      : undefined;

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useCategoryInfiniteList({ kind }, PAGE_SIZE);

  const items: CategoryListItemType[] = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.body.data.items),
    [data],
  );
  const totalCount = data?.pages[0]?.body.data.totalCount ?? items.length;

  const setKind = (next: CategoryKind | undefined) => {
    setParams({ kind: next ?? null });
  };

  return {
    kind,
    setKind,
    items,
    totalCount,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  };
}
