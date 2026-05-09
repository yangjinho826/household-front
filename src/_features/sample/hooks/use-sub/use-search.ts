import { useForm } from "@mantine/form";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { useSampleList } from "_features/sample/queries/use-query";
import type { ApiPaginationProps } from "_libraries/fetch/response";

import type { SampleSearchRequestType } from "../../types";

const isBlank = (s: string | null | undefined) => !s || s.trim() === "";

export function useSampleSearch() {
  const [params, setParams] = useQueryStates({
    searchTerm: parseAsString,
    sampleEmail: parseAsString,
    pageNo: parseAsInteger.withDefault(1),
    listSize: parseAsInteger.withDefault(20),
  });

  const { data, isLoading } = useSampleList({
    searchTerm: params.searchTerm ?? undefined,
    sampleEmail: params.sampleEmail ?? undefined,
    pageNo: params.pageNo,
    listSize: params.listSize,
  });

  const result = data?.body?.data ?? undefined;

  const searchform = useForm<SampleSearchRequestType & ApiPaginationProps>({
    mode: "controlled",
    initialValues: {
      searchTerm: params.searchTerm ?? "",
      sampleEmail: params.sampleEmail ?? "",
      pageNo: params.pageNo ?? 1,
      listSize: params.listSize ?? 20,
    },
  });

  const onSearch = (formValues: SampleSearchRequestType) => {
    setParams({
      searchTerm: isBlank(formValues.searchTerm)
        ? null
        : (formValues.searchTerm ?? null),
      sampleEmail: isBlank(formValues.sampleEmail)
        ? null
        : (formValues.sampleEmail ?? null),
      pageNo: 1,
      listSize: params.listSize ?? 20,
    });
  };

  const onReset = () => {
    searchform.reset();
    setParams({
      searchTerm: null,
      sampleEmail: null,
      pageNo: 1,
      listSize: 20,
    });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setParams({ ...params, pageNo: page, listSize: pageSize });
  };

  const handlePageSizeChange = (value: string | null) => {
    if (!value) return;
    const newSize = parseInt(value, 10);
    setParams({ ...params, pageNo: 1, listSize: newSize });
  };

  return {
    handlePageChange,
    handlePageSizeChange,
    params,
    setParams,
    searchform,
    onSearch,
    onReset,
    result,
    isLoading,
  };
}
