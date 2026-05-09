import { create } from "zustand";

interface AccountStoreState {
  // 페이지 분리 패턴이라 selectedAccount 는 router.params 로 충분.
  // 이 store 는 향후 검색 외 UI 상태 (필터 토글 등) 를 담는 용도.
  detailRefreshKey: number;
  bumpDetailRefreshKey: () => void;
}

export const useAccountStore = create<AccountStoreState>((set) => ({
  detailRefreshKey: 0,
  bumpDetailRefreshKey: () =>
    set((s) => ({ detailRefreshKey: s.detailRefreshKey + 1 })),
}));
