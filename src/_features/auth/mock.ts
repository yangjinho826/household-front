import type {
  AuthUser,
  LoginRequest,
  LoginResponseRaw,
  RegisterRequest,
} from "./types";

const MOCK_TOKEN =
  "mock.eyJzdWIiOiJtb2NrLXVzZXItaWQiLCJsYW5ndWFnZSI6ImtvIn0.signature";

function buildMockUser(email: string, name: string): AuthUser {
  return {
    id: "mock-user-id",
    email,
    name,
    language: "ko",
  };
}

export const authMockStore = {
  login(params: LoginRequest): LoginResponseRaw {
    return {
      access_token: MOCK_TOKEN,
      expires_in: 900,
      token_type: "bearer",
      user: buildMockUser(params.email, params.email.split("@")[0] ?? "user"),
    };
  },
  register(params: RegisterRequest): AuthUser {
    return buildMockUser(params.email, params.name);
  },
};
