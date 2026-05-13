import { parseAsInteger, useQueryStates } from "nuqs";

import { useFixedList } from "_features/fixed/queries/use-query";

export function useFixedSearch() {
  const [params, setParams] = useQueryStates({
    pageNo: parseAsInteger.withDefault(1),
    listSize: parseAsInteger.withDefault(20),
  });

  const { data, isLoading } = useFixedList({
    pageNo: params.pageNo,
    listSize: params.listSize,
  });

  const result = data?.body?.data ?? undefined;

  const handlePageChange = (page: number, pageSize: number) => {
    setParams({ ...params, pageNo: page, listSize: pageSize });
  };

  return {
    handlePageChange,
    params,
    result,
    isLoading,
  };
}
