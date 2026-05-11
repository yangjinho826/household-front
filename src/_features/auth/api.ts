import { apiFetch } from "_libraries/fetch/api-fetch";
import type { ApiResponse } from "_libraries/fetch/response";

import type {
  AuthUser,
  LoginRequest,
  LoginResponseRaw,
  RegisterRequest,
} from "./types";

export function GetMeApi() {
  return apiFetch<ApiResponse<AuthUser>>(`/api/user/me`, {
    method: "GET",
    errorHandleMethod: "reject",
  });
}

export function GetUserSearchByEmailApi(email: string) {
  const qs = new URLSearchParams({ email }).toString();
  return apiFetch<ApiResponse<AuthUser>>(`/api/user/search?${qs}`, {
    method: "GET",
    errorHandleMethod: "reject",
  });
}

export function PostLoginApi(params: LoginRequest) {
  return apiFetch<ApiResponse<LoginResponseRaw>>(`/api/auth/login`, {
    method: "POST",
    body: params,
    errorHandleMethod: "reject",
  });
}

export function PostRegisterApi(params: RegisterRequest) {
  return apiFetch<ApiResponse<AuthUser>>(`/api/user`, {
    method: "POST",
    body: params,
    errorHandleMethod: "reject",
  });
}

export function PostLogoutApi() {
  return apiFetch<ApiResponse<void>>(`/api/auth/logout`, {
    method: "POST",
    errorHandleMethod: "reject",
  });
}
