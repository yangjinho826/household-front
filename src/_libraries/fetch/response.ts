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
 * 커서 기반 페이지 응답 (백엔드 `CursorPage[T]` 매칭).
 *
 * - `totalCount` 는 관리 페이지에서만 채움. overview / 단순 무한 스크롤은 null
 * - `nextCursor` 는 평문 `{sort_key}|{uuid}` (transaction 도메인 패턴 그대로)
 */
export type ApiCursorPage<T> = ApiResponse<{
  items: T[];
  nextCursor: string | null;
  hasNext: boolean;
  totalCount: number | null;
}>;

/**
 * @deprecated `ApiCursorPage<T>` 로 점진 마이그레이션 중. household/members 등
 * 아직 변환 안 된 도메인의 어댑터 (`GetXxxSearchApi`) 가 임시로 사용.
 * 마이그레이션 끝나면 삭제.
 */
export type ApiListResponse<T> = ApiResponse<{
  listSize: number;
  currentPage: number;
  currentCount: number;
  totalElements: number;
  totalPages: number;
  content: T[];
}>;
