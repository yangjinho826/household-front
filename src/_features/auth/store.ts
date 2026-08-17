import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { useHouseholdStore } from "_features/household/store";

import type { AuthUser } from "./types";

interface AuthStoreState {
  // RAM only — persist 제외 (XSS 방어)
  accessToken: string | null;
  // localStorage persist — 새로고침/새 탭 시 UI 즉시
  user: AuthUser | null;

  setSession: (s: { accessToken: string; user: AuthUser }) => void;
  setAccessToken: (token: string) => void;
  setUser: (user: AuthUser) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setSession: ({ accessToken, user }) => set({ accessToken, user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setUser: (user) => set({ user }),
      clearSession: () => {
        set({ accessToken: null, user: null });
        // 선택된 가계부도 함께 버린다. `currentHouseholdId` 는 localStorage 에
        // 살아남으므로, 안 비우면 **다음에 로그인한 다른 계정이 이전 계정의
        // 가계부 id 로 `X-Household-Id` 를 보낸다** (→ HH001 "멤버가 아닙니다").
        // OnboardingGuard 가 뒤늦게 고쳐주지만 그건 렌더 이후라 그 사이 요청이 샌다.
        useHouseholdStore.setState({ currentHouseholdId: "" });
      },
    }),
    {
      name: "personal-auth",
      storage: createJSONStorage(() => localStorage),
      // accessToken 은 절대 persist X
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
