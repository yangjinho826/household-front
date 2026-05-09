import { apiFetch } from "_libraries/fetch/api-fetch";
import type { ApiResponse } from "_libraries/fetch/response";
import { mockOkItem } from "_utilities/mock-response";

import { authMockStore } from "./mock";
import type {
  AuthUser,
  LoginRequest,
  LoginResponseRaw,
  RegisterRequest,
} from "./types";

// auth 는 별도 토글 — 다른 도메인 (household 등) 백엔드 미구현 상태에서도 auth 만 백엔드 사용 가능
// 기본값: false (백엔드). mock 으로 보려면 NEXT_PUBLIC_USE_MOCK_AUTH=true 명시.
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

const wrap = <T>(data: T) => ({ body: data });

export function PostLoginApi(params: LoginRequest) {
  if (USE_MOCK) {
    return Promise.resolve(wrap(mockOkItem(authMockStore.login(params))));
  }
  return apiFetch<ApiResponse<LoginResponseRaw>>(`/api/auth/login`, {
    method: "POST",
    body: params,
    errorHandleMethod: "reject",
  });
}

export function PostRegisterApi(params: RegisterRequest) {
  if (USE_MOCK) {
    return Promise.resolve(wrap(mockOkItem(authMockStore.register(params))));
  }
  return apiFetch<ApiResponse<AuthUser>>(`/api/user`, {
    method: "POST",
    body: params,
    errorHandleMethod: "reject",
  });
}

export function PostLogoutApi() {
  if (USE_MOCK) {
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(`/api/auth/logout`, {
    method: "POST",
    errorHandleMethod: "reject",
  });
}
