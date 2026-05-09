import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";

/**
 * mock 단계 전용 헬퍼.
 * 백엔드 붙으면 api.ts 에서 사용 안 함 (apiFetch 가 직접 ApiResponse 반환).
 */
export const mockOkList = <T>(items: T[]): ApiListResponse<T> => ({
  code: "OK",
  message: "성공",
  status: 200,
  data: {
    listSize: items.length,
    currentPage: 1,
    currentCount: items.length,
    totalElements: items.length,
    totalPages: 1,
    content: items,
  },
});

export const mockOkItem = <T>(item: T): ApiResponse<T> => ({
  code: "OK",
  message: "성공",
  status: 200,
  data: item,
});
