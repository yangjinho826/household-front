import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useRef } from "react";

import { ApiResponseError } from "_libraries/fetch/api-response-error";

/**
 * `Idempotency-Key` 자동 관리하는 mutation hook.
 *
 * - 호출 직전에 `crypto.randomUUID()` 로 키 생성 후 ref 보관
 * - 성공 시 키 폐기 (다음 호출은 새 키)
 * - 실패 시 키 유지 — TanStack Query retry / 사용자 수동 재시도 모두 같은 키 보장
 * - 409 ID003 (IN_PROGRESS) 는 지수 백오프로 최대 3회 자동 재시도
 *
 * `mutationFn` 의 두 번째 인자로 키를 받음:
 *
 * ```ts
 * const m = useIdempotentMutation({
 *   mutationFn: (req, idempotencyKey) =>
 *     PostTransactionCreateApi(req, idempotencyKey),
 * });
 * ```
 */
export function useIdempotentMutation<TData, TError, TVar, TContext = unknown>(
  options: Omit<UseMutationOptions<TData, TError, TVar, TContext>, "mutationFn"> & {
    mutationFn: (variables: TVar, idempotencyKey: string) => Promise<TData>;
  },
) {
  const keyRef = useRef<string | undefined>(undefined);

  return useMutation<TData, TError, TVar, TContext>({
    ...options,
    mutationFn: (variables) => {
      if (!keyRef.current) {
        keyRef.current = crypto.randomUUID();
      }
      return options.mutationFn(variables, keyRef.current);
    },
    onSuccess: (...args) => {
      keyRef.current = undefined;
      options.onSuccess?.(...args);
    },
    // 409 ID003 (처리 중) 만 자동 재시도. 나머지 에러는 호출 측 정책 위임.
    retry: (failureCount, error) => {
      if (
        error instanceof ApiResponseError &&
        error.status === 409 &&
        error.errorCode === "ID003"
      ) {
        return failureCount < 3;
      }
      return false;
    },
    retryDelay: (failureCount) => Math.min(500 * 2 ** failureCount, 4000), // 500ms → 1s → 2s → max 4s
  });
}
