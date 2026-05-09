// 백엔드 API 기본 응답
interface ApiBaseResponse {
  code: string;
  message: string;
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

// 리스트 응답
export type ApiListResponse<T> = ApiResponse<{
  listSize: number;
  currentPage: number;
  currentCount: number;
  totalElements: number;
  totalPages: number;
  content: T[];
}>;
