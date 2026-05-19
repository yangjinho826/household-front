import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

import { queryKeys } from "_constants/queries";

import { useAuthMutations } from "../queries/use-mutations";
import { useAuthStore } from "../store";

/**
 * auth 도메인 메인 훅 — store 상태 + 로그아웃 액션 노출.
 *
 * 마운트 시 GET /api/user/me 한 번 호출해서 store user 동기화.
 * RAM accessToken 이 새로고침 후 비어 있어도 refresh interceptor 가
 * 자동으로 access_token 재발급 → me 재시도 흐름.
 *
 * login/register 는 form 별 에러 처리가 다르므로 section 에서
 * `useAuthMutations({ onLoginError, onRegisterError })` 를 직접 호출.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const clearSession = useAuthStore((s) => s.clearSession);
  const setUser = useAuthStore((s) => s.setUser);

  const meQuery = useQuery({
    ...queryKeys.auth.me,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // me 응답으로 store user 동기화
  useEffect(() => {
    const fresh = meQuery.data?.body.data;
    if (fresh) setUser(fresh);
  }, [meQuery.data, setUser]);

  const { logoutMutation } = useAuthMutations();

  return useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      accessToken,
      actions: {
        // mutateAsync 반환 — 호출 측이 await 해서 PostLogoutApi 응답
        // (= 백엔드 Set-Cookie: refresh_token 만료) 도착 후 라우팅 가능
        logout: () => logoutMutation.mutateAsync(),
        clearSession,
      },
      state: {
        isLoggingOut: logoutMutation.isPending,
      },
    }),
    [user, accessToken, clearSession, logoutMutation],
  );
}
