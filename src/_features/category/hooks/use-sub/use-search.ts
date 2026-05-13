import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { useCategoryList } from "_features/category/queries/use-query";
import type { CategoryKind } from "_features/category/types";

const VALID_KINDS: CategoryKind[] = ["EXPENSE", "INCOME"];

export function useCategorySearch() {
  const [params, setParams] = useQueryStates({
    kind: parseAsString,
    pageNo: parseAsInteger.withDefault(1),
    listSize: parseAsInteger.withDefault(20),
  });

  const kind: CategoryKind | undefined =
    params.kind && VALID_KINDS.includes(params.kind as CategoryKind)
      ? (params.kind as CategoryKind)
      : undefined;

  const { data, isLoading } = useCategoryList({
    kind,
    pageNo: params.pageNo,
    listSize: params.listSize,
  });

  const result = data?.body?.data ?? undefined;

  const setKind = (next: CategoryKind | undefined) => {
    setParams({
      kind: next ?? null,
      pageNo: 1,
    });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setParams({ ...params, pageNo: page, listSize: pageSize });
  };

  return {
    handlePageChange,
    params,
    kind,
    setKind,
    result,
    isLoading,
  };
}
