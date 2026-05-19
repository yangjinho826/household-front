export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  language?: "ko" | "en";
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  language: "ko" | "en";
}

// 백엔드 /api/auth/login 응답의 data 부분
export interface LoginResponseRaw {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  user: AuthUser;
}
