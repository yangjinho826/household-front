import "server-only";

import { cookies } from "next/headers";

const REFRESH_COOKIE = "refresh_token";

/**
 * 백엔드가 set 한 refresh_token 쿠키 존재 여부.
 * SSR layout 가드용. 만료된 쿠키도 일단 통과 — 만료 검증은 클라에서 401 흐름.
 */
export async function hasRefreshCookie(): Promise<boolean> {
  const store = await cookies();
  return store.has(REFRESH_COOKIE);
}
