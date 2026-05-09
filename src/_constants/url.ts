// 프론트에서 백엔드로 요청할 때 사용하는 base URL.
// next.config.mjs 의 rewrites 가 /api/* → process.env.BACKEND_URL/api/* 로 프록시.
// 빈 문자열이면 같은 origin (rewrites 통과).
export const apiBaseUrl = "";

// 401 발생 시 리다이렉트할 로그인 URL (locale 은 client 에서 prefix).
export const authLoginUrl = "";
