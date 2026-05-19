import { apiFetch } from "_libraries/fetch/api-fetch";
import type { ApiResponse } from "_libraries/fetch/response";

import type {
  AuthUser,
  LoginRequest,
  LoginResponseRaw,
  RegisterRequest,
} from "./types";

export function GetAuthMeApi() {
  return apiFetch<ApiResponse<AuthUser>>(`/api/user/me`, {
    method: "GET",
    errorHandleMethod: "reject",
  });
}

export function GetAuthUserSearchByEmailApi(email: string) {
  const qs = new URLSearchParams({ email }).toString();
  return apiFetch<ApiResponse<AuthUser>>(`/api/user/search?${qs}`, {
    method: "GET",
    errorHandleMethod: "reject",
  });
}

export function PostAuthLoginApi(params: LoginRequest) {
  return apiFetch<ApiResponse<LoginResponseRaw>>(`/api/auth/login`, {
    method: "POST",
    body: params,
    errorHandleMethod: "reject",
  });
}

export function PostAuthRegisterApi(params: RegisterRequest) {
  return apiFetch<ApiResponse<AuthUser>>(`/api/user`, {
    method: "POST",
    body: params,
    errorHandleMethod: "reject",
  });
}

export function PostAuthLogoutApi() {
  return apiFetch<ApiResponse<void>>(`/api/auth/logout`, {
    method: "POST",
    errorHandleMethod: "reject",
  });
}
