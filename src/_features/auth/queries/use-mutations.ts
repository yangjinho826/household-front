import { useMutation } from "@tanstack/react-query";

import { ApiResponseError } from "_libraries/fetch/api-response-error";
import { useIdempotentMutation } from "_libraries/hooks/use-idempotent-mutation";

import {
  PostAuthLoginApi,
  PostAuthLogoutApi,
  PostAuthRegisterApi,
} from "../api";
import { useAuthStore } from "../store";
import type {
  AuthUser,
  LoginRequest,
  LoginResponseRaw,
  RegisterRequest,
} from "../types";

interface AuthMutationsOptions {
  onLoginError?: (error: ApiResponseError) => void;
  onRegisterError?: (error: ApiResponseError) => void;
}

export function useAuthMutations(options?: AuthMutationsOptions) {
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);

  const loginMutation = useMutation({
    mutationFn: (params: LoginRequest) => PostAuthLoginApi(params),
    onSuccess: (res) => {
      const data = res.body.data as LoginResponseRaw;
      setSession({ accessToken: data.accessToken, user: data.user });
    },
    onError: (error) => {
      if (error instanceof ApiResponseError) options?.onLoginError?.(error);
    },
  });

  const registerMutation = useIdempotentMutation({
    mutationFn: (params: RegisterRequest, idempotencyKey) =>
      PostAuthRegisterApi(params, idempotencyKey),
    onError: (error) => {
      if (error instanceof ApiResponseError) options?.onRegisterError?.(error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await PostAuthLogoutApi();
      } finally {
        // 백엔드 호출 실패/성공 무관하게 클라 상태는 즉시 비움 (unmount 전 보장)
        clearSession();
      }
    },
  });

  return { loginMutation, registerMutation, logoutMutation };
}

export type AuthMutationResult = {
  loginUser: AuthUser | null;
};
