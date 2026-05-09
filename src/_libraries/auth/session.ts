import { cookies } from "next/headers";

export const SESSION_COOKIE = "personal-auth.session.v1";
export const ACCESS_COOKIE = "personal-auth.access";
export const REFRESH_COOKIE = "personal-auth.refresh";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
};

export async function parseSessionCookie(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function serializeSessionCookie(user: SessionUser): string {
  return JSON.stringify(user);
}
