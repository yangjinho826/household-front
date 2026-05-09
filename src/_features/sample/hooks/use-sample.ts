import { useMemo } from "react";

import { useSampleDetail } from "./use-sub/use-detail";
import { useSampleSearch } from "./use-sub/use-search";

export function useSample() {
  const search = useSampleSearch();
  const detail = useSampleDetail();

  return useMemo(
    () => ({
      search: {
        form: search.searchform,
        params: search.params,
        result: search.result,
        isLoading: search.isLoading,
        actions: {
          setParams: search.setParams,
          handlePageChange: search.handlePageChange,
          handlePageSizeChange: search.handlePageSizeChange,
          onSearch: search.onSearch,
          onReset: search.onReset,
        },
      },
      detail: {
        form: detail.detailForm,
        selected: detail.selectedSample,
        actions: {
          getDetail: detail.getDetail,
          onCancel: detail.onCancel,
          onRemove: detail.onRemove,
          handleSubmit: detail.handleSubmit,
          handleResetDetail: detail.handleResetDetail,
        },
      },
    }),
    [
      search.searchform,
      search.params,
      search.result,
      search.isLoading,
      search.handlePageChange,
      search.handlePageSizeChange,
      search.onSearch,
      search.onReset,
      search.setParams,
      detail.detailForm,
      detail.selectedSample,
      detail.getDetail,
      detail.onCancel,
      detail.onRemove,
      detail.handleSubmit,
      detail.handleResetDetail,
    ],
  );
}
