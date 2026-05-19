// 백엔드 API 기본 응답
interface ApiBaseResponse {
  code: string | null;
  message: string | null;
  status: number;
}

// 백엔드 API 성공 응답
export interface ApiResponse<T> extends ApiBaseResponse {
  data: T;
}

// 백엔드 API 에러 응답
export type ApiErrorResponse = ApiBaseResponse;

// 리스트 요청 파라미터
export interface ApiPaginationProps {
  pageNo: number;
  listSize: number;
}

/**
 * 리스트 응답 wrapper.
 *
 * 백엔드는 도메인별로 두 가지 페이징 패턴을 사용한다:
 * - **단순 list**: account / category / household / fixed / portfolio — 전체 array 반환,
 *   프론트의 `GetXxxSearchApi` 가 `ApiListResponse` 형태로 wrap (currentPage=1, totalPages=1).
 * - **커서 페이징**: transaction — 백엔드 `TransactionListResponse {items, nextCursor, hasNext, totalCount}`
 *   를 프론트가 `ApiListResponse` + `{nextCursor, hasNext}` 추가 필드로 확장.
 */
export type ApiListResponse<T> = ApiResponse<{
  listSize: number;
  currentPage: number;
  currentCount: number;
  totalElements: number;
  totalPages: number;
  content: T[];
}>;
