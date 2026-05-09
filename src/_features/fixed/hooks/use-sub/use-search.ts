import { useForm } from "@mantine/form";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { useFixedList } from "_features/fixed/queries/use-query";
import type { ApiPaginationProps } from "_libraries/fetch/response";

import type { FixedSearchRequestType } from "../../types";

const isBlank = (s: string | null | undefined) => !s || s.trim() === "";

export function useFixedSearch() {
  const [params, setParams] = useQueryStates({
    searchTerm: parseAsString,
    pageNo: parseAsInteger.withDefault(1),
    listSize: parseAsInteger.withDefault(20),
  });

  const { data, isLoading } = useFixedList({
    searchTerm: params.searchTerm ?? undefined,
    pageNo: params.pageNo,
    listSize: params.listSize,
  });

  const result = data?.body?.data ?? undefined;

  const searchform = useForm<FixedSearchRequestType & ApiPaginationProps>({
    mode: "controlled",
    initialValues: {
      searchTerm: params.searchTerm ?? "",
      pageNo: params.pageNo ?? 1,
      listSize: params.listSize ?? 20,
    },
  });

  const onSearch = (formValues: FixedSearchRequestType) => {
    setParams({
      searchTerm: isBlank(formValues.searchTerm)
        ? null
        : (formValues.searchTerm ?? null),
      pageNo: 1,
      listSize: params.listSize ?? 20,
    });
  };

  const onReset = () => {
    searchform.reset();
    setParams({ searchTerm: null, pageNo: 1, listSize: 20 });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setParams({ ...params, pageNo: page, listSize: pageSize });
  };

  return {
    handlePageChange,
    params,
    setParams,
    searchform,
    onSearch,
    onReset,
    result,
    isLoading,
  };
}
