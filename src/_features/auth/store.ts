import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
      clearSession: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "personal-auth",
      storage: createJSONStorage(() => localStorage),
      // accessToken 은 절대 persist X
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
