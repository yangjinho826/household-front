import { useForm } from "@mantine/form";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { useTransactionList } from "_features/transaction/queries/use-query";
import type { ApiPaginationProps } from "_libraries/fetch/response";

import type {
  TransactionSearchRequestType,
  TxType,
} from "../../types";

const isBlank = (s: string | null | undefined) => !s || s.trim() === "";

export function useTransactionSearch() {
  const [params, setParams] = useQueryStates({
    searchTerm: parseAsString,
    txType: parseAsString,
    pageNo: parseAsInteger.withDefault(1),
    listSize: parseAsInteger.withDefault(20),
  });

  const { data, isLoading } = useTransactionList({
    searchTerm: params.searchTerm ?? undefined,
    txType: (params.txType as TxType | null) ?? undefined,
    pageNo: params.pageNo,
    listSize: params.listSize,
  });

  const result = data?.body?.data ?? undefined;

  const searchform = useForm<
    TransactionSearchRequestType & ApiPaginationProps
  >({
    mode: "controlled",
    initialValues: {
      searchTerm: params.searchTerm ?? "",
      txType: (params.txType as TxType | null) ?? undefined,
      pageNo: params.pageNo ?? 1,
      listSize: params.listSize ?? 20,
    },
  });

  const onSearch = (formValues: TransactionSearchRequestType) => {
    setParams({
      searchTerm: isBlank(formValues.searchTerm)
        ? null
        : (formValues.searchTerm ?? null),
      txType: formValues.txType ?? null,
      pageNo: 1,
      listSize: params.listSize ?? 20,
    });
  };

  const onReset = () => {
    searchform.reset();
    setParams({ searchTerm: null, txType: null, pageNo: 1, listSize: 20 });
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
