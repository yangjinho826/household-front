import { useForm } from "@mantine/form";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { useHouseholdList } from "_features/household/queries/use-query";

import type { HouseholdSearchRequestType } from "../../types";

const isBlank = (s: string | null | undefined) => !s || s.trim() === "";

// 한 user 가 가입한 가계부 1~5개라 백엔드 페이징 의미 X. 봉투 통일 후
// 클라 검색만 유지 (table 의 pageNo/listSize 는 표시용으로만 잔존, PR 6 에서 정리).
export function useHouseholdSearch() {
  const [params, setParams] = useQueryStates({
    searchTerm: parseAsString,
    pageNo: parseAsInteger.withDefault(1),
    listSize: parseAsInteger.withDefault(20),
  });

  const { data, isLoading } = useHouseholdList();

  const result = data?.body?.data ?? undefined;

  const searchform = useForm<HouseholdSearchRequestType>({
    mode: "controlled",
    initialValues: {
      searchTerm: params.searchTerm ?? "",
    },
  });

  const onSearch = (formValues: HouseholdSearchRequestType) => {
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
