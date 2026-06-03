"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { PageLoader } from "_features/common/components/page-loader";
import { cookieFetch } from "_libraries/fetch/api-fetch";

import { useAuth } from "./hooks/use-auth";
import { useAuthStore } from "./store";

type AuthContextType = ReturnType<typeof useAuth>;

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * 모듈 스코프 in-flight 가드 — strict mode 이중 마운트 / 동시 mount 된
 * 여러 AuthProvider 가 동일 refresh 를 중복 호출하는 것을 막는다.
 * 백엔드가 refresh token 을 rotate 하면 두 번째 호출이 첫 번째 토큰을
 * 무효화하므로 in-flight Promise 를 공유해 cookieFetch 자체는 한 번만 발사.
 *
 * `return-fetch-refresh.ts` 내부의 `refreshPromise` 와는 별도 경로(401 인터셉터)
 * 라 완벽 dedupe 는 아니지만, silent refresh 가 마운트 즉시 발사되어 자식
 * useSuspenseQuery 가 발사되기 전에 토큰을 채우는 게 정상 흐름이라 사실상 충돌 X.
 */
let pendingSilentRefresh: Promise<string | null> | null = null;

function silentRefresh(): Promise<string | null> {
  if (pendingSilentRefresh) return pendingSilentRefresh;
  pendingSilentRefresh = (async () => {
    try {
      const res = await cookieFetch("/api/auth/refresh", { method: "POST" });
      if (!res.ok) return null;
      // 백엔드 RefreshResponse: { accessToken: string, expiresIn: number }
      const json = (await res.json()) as {
        data?: { accessToken?: string };
      };
      return json?.data?.accessToken ?? null;
    } catch {
      return null;
    } finally {
      // 한 사이클 끝나면 즉시 null — 다음 마운트에서 다시 시도 가능
      pendingSilentRefresh = null;
    }
  })();
  return pendingSilentRefresh;
}

/**
 * 마운트 시 accessToken 비어있으면 silent refresh 호출 → 토큰 확보 후 children 렌더.
 * refresh interceptor 가 이미 401 → refresh → retry 를 처리하지만 그 경로는 콘솔에
 * 401 이 빨갛게 찍히고 자식 useSuspenseQuery 들이 동시 발사돼 일관성 떨어짐.
 *
 * ready 는 derived state — store 의 accessToken 또는 refresh 시도 완료 여부로 결정.
 * effect 안에서 동기 setState 호출 X (cascading render 회피, react-hooks/set-state-in-effect).
 * 다른 컴포넌트가 setAccessToken 으로 토큰 채우면 store 갱신 → 자동 리렌더 → ready=true.
 * refresh 실패 시에도 refreshTried=true → ready=true. 후속 401 흐름이 interceptor 단에서 redirect 처리.
 */
function useSilentRefreshOnMount() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const [refreshTried, setRefreshTried] = useState(false);
  const ready = Boolean(accessToken) || refreshTried;

  useEffect(() => {
    if (accessToken) return; // ready 는 derived — 별도 setState 불필요
    let cancelled = false;

    silentRefresh().then((token) => {
      if (cancelled) return;
      if (token) setAccessToken(token);
      setRefreshTried(true);
    });

    return () => {
      cancelled = true;
    };
  }, [accessToken, setAccessToken]);

  return ready;
}

function AuthChildren({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const ready = useSilentRefreshOnMount();
  if (!ready) {
    return <PageLoader />;
  }
  return <AuthChildren>{children}</AuthChildren>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
};
