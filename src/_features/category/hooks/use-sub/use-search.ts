import { useForm } from "@mantine/form";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { useCategoryList } from "_features/category/queries/use-query";
import type { ApiPaginationProps } from "_libraries/fetch/response";

import type {
  CategoryKind,
  CategorySearchRequestType,
} from "../../types";

const isBlank = (s: string | null | undefined) => !s || s.trim() === "";

export function useCategorySearch() {
  const [params, setParams] = useQueryStates({
    searchTerm: parseAsString,
    kind: parseAsString,
    pageNo: parseAsInteger.withDefault(1),
    listSize: parseAsInteger.withDefault(20),
  });

  const { data, isLoading } = useCategoryList({
    searchTerm: params.searchTerm ?? undefined,
    kind: (params.kind as CategoryKind | null) ?? undefined,
    pageNo: params.pageNo,
    listSize: params.listSize,
  });

  const result = data?.body?.data ?? undefined;

  const searchform = useForm<CategorySearchRequestType & ApiPaginationProps>({
    mode: "controlled",
    initialValues: {
      searchTerm: params.searchTerm ?? "",
      kind: (params.kind as CategoryKind | null) ?? undefined,
      pageNo: params.pageNo ?? 1,
      listSize: params.listSize ?? 20,
    },
  });

  const onSearch = (formValues: CategorySearchRequestType) => {
    setParams({
      searchTerm: isBlank(formValues.searchTerm)
        ? null
        : (formValues.searchTerm ?? null),
      kind: formValues.kind ?? null,
      pageNo: 1,
      listSize: params.listSize ?? 20,
    });
  };

  const onReset = () => {
    searchform.reset();
    setParams({
      searchTerm: null,
      kind: null,
      pageNo: 1,
      listSize: 20,
    });
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
