import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import {
  type ArchiveFilter,
  toIsArchivedParam,
} from "_features/common/components/filter-chip";
import { usePortfolioList } from "_features/portfolio/queries/use-query";

const VALID_FILTERS: ArchiveFilter[] = ["all", "active", "archived"];

export function usePortfolioSearch() {
  const [params, setParams] = useQueryStates({
    archived: parseAsString,
    pageNo: parseAsInteger.withDefault(1),
    listSize: parseAsInteger.withDefault(20),
  });

  const filter: ArchiveFilter =
    params.archived && VALID_FILTERS.includes(params.archived as ArchiveFilter)
      ? (params.archived as ArchiveFilter)
      : "all";

  const { data, isLoading } = usePortfolioList({
    isArchived: toIsArchivedParam(filter),
    pageNo: params.pageNo,
    listSize: params.listSize,
  });

  const result = data?.body?.data ?? undefined;

  const setFilter = (next: ArchiveFilter) => {
    setParams({
      archived: next === "all" ? null : next,
      pageNo: 1,
    });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setParams({ ...params, pageNo: page, listSize: pageSize });
  };

  return {
    handlePageChange,
    params,
    filter,
    setFilter,
    result,
    isLoading,
  };
}
