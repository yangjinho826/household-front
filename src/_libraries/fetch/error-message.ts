import type { useTranslations } from "next-intl";

import { ApiResponseError } from "./api-response-error";

type ErrorTranslator = ReturnType<typeof useTranslations<"error">>;

/**
 * 에러를 사용자에게 보여줄 문자열로 변환.
 *
 * 우선순위:
 * 1. ApiResponseError 면 errorCode → i18n key 매핑 (`error.<code>`)
 * 2. 매핑 없으면 백엔드 errorMessage (한국어 fallback)
 * 3. 그것도 없으면 `error.unknown`
 *
 * @param error catch 한 에러 객체
 * @param t useTranslations("error") 결과
 */
export function getErrorMessage(error: unknown, t: ErrorTranslator): string {
  if (error instanceof ApiResponseError) {
    if (error.errorCode && t.has(error.errorCode)) {
      return t(error.errorCode);
    }
    if (error.errorMessage) return error.errorMessage;
    return t("unknown");
  }
  if (error instanceof Error && error.message) return error.message;
  return t("unknown");
}
