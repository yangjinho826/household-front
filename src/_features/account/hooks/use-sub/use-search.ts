import { useForm } from "@mantine/form";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { useAccountList } from "_features/account/queries/use-query";
import type { ApiPaginationProps } from "_libraries/fetch/response";

import type {
  AccountSearchRequestType,
  AccountType,
} from "../../types";

const isBlank = (s: string | null | undefined) => !s || s.trim() === "";

export function useAccountSearch() {
  const [params, setParams] = useQueryStates({
    searchTerm: parseAsString,
    accountType: parseAsString,
    pageNo: parseAsInteger.withDefault(1),
    listSize: parseAsInteger.withDefault(20),
  });

  const { data, isLoading } = useAccountList({
    searchTerm: params.searchTerm ?? undefined,
    accountType: (params.accountType as AccountType | null) ?? undefined,
    pageNo: params.pageNo,
    listSize: params.listSize,
  });

  const result = data?.body?.data ?? undefined;

  const searchform = useForm<AccountSearchRequestType & ApiPaginationProps>({
    mode: "controlled",
    initialValues: {
      searchTerm: params.searchTerm ?? "",
      accountType:
        (params.accountType as AccountType | null) ?? undefined,
      pageNo: params.pageNo ?? 1,
      listSize: params.listSize ?? 20,
    },
  });

  const onSearch = (formValues: AccountSearchRequestType) => {
    setParams({
      searchTerm: isBlank(formValues.searchTerm)
        ? null
        : (formValues.searchTerm ?? null),
      accountType: formValues.accountType ?? null,
      pageNo: 1,
      listSize: params.listSize ?? 20,
    });
  };

  const onReset = () => {
    searchform.reset();
    setParams({
      searchTerm: null,
      accountType: null,
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
