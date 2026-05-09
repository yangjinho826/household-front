import { useMemo } from "react";

import { useAuthMutations } from "../queries/use-mutations";
import { useAuthStore } from "../store";

/**
 * auth 도메인 메인 훅 — store 상태 + 로그아웃 액션 노출.
 *
 * login/register 는 form 별 에러 처리가 다르므로 section 에서
 * `useAuthMutations({ onLoginError, onRegisterError })` 를 직접 호출.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const clearSession = useAuthStore((s) => s.clearSession);

  const { logoutMutation } = useAuthMutations();

  return useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      accessToken,
      actions: {
        logout: () => logoutMutation.mutate(),
        clearSession,
      },
      state: {
        isLoggingOut: logoutMutation.isPending,
      },
    }),
    [user, accessToken, clearSession, logoutMutation],
  );
}
