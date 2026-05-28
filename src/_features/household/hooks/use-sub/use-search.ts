import { useForm } from "@mantine/form";
import { parseAsString, useQueryStates } from "nuqs";

import { useHouseholdList } from "_features/household/queries/use-query";

import type { HouseholdSearchRequestType } from "../../types";

const isBlank = (s: string | null | undefined) => !s || s.trim() === "";

// 한 user 가 가입한 가계부 수가 작아 백엔드 페이징/필터 의미 X.
// searchTerm 은 URL 상태로만 보존 (클라 필터는 table 이 직접 처리하지 않으며 현재 표시만).
export function useHouseholdSearch() {
  const [params, setParams] = useQueryStates({
    searchTerm: parseAsString,
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
    });
  };

  const onReset = () => {
    searchform.reset();
    setParams({ searchTerm: null });
  };

  return {
    params,
    setParams,
    searchform,
    onSearch,
    onReset,
    result,
    isLoading,
  };
}
