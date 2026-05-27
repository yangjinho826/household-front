import type { useTranslations } from "next-intl";

import { ApiResponseError } from "./api-response-error";

type ErrorTranslator = ReturnType<typeof useTranslations<"error">>;

// HTTP status → 표준 ErrorCode 매핑 (백엔드 _STATUS_TO_ERROR_CODE 와 1:1)
const STATUS_TO_FALLBACK_CODE: Record<number, string> = {
  400: "CM001",
  401: "CM002",
  403: "CM003",
  404: "CM004",
  500: "CM999",
  503: "CM005",
};

/**
 * 에러를 사용자에게 보여줄 문자열로 변환.
 *
 * 우선순위:
 * 1. ApiResponseError 면 errorCode → i18n key 매핑 (`error.<code>`)
 * 2. errorCode 매핑 없으면 status 별 fallback code 매핑 (CM001/CM002/...)
 * 3. 그것도 매핑 없으면 백엔드 errorMessage (한국어 fallback)
 * 4. 모두 실패면 `error.unknown`
 *
 * 백엔드가 starlette HTTPException 등으로 영문 detail 을 보내거나 코드가
 * 누락된 경우 status 만으로도 한국어 표준 메시지를 노출하게 한 방어막.
 *
 * @param error catch 한 에러 객체
 * @param t useTranslations("error") 결과
 */
export function getErrorMessage(error: unknown, t: ErrorTranslator): string {
  if (error instanceof ApiResponseError) {
    if (error.errorCode && t.has(error.errorCode)) {
      return t(error.errorCode);
    }
    const fallbackCode = STATUS_TO_FALLBACK_CODE[error.status];
    if (fallbackCode && t.has(fallbackCode)) {
      return t(fallbackCode);
    }
    if (error.errorMessage) return error.errorMessage;
    return t("unknown");
  }
  if (error instanceof Error && error.message) return error.message;
  return t("unknown");
}
