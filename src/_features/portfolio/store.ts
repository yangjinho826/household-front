import { create } from "zustand";

interface PortfolioStoreState {
  detailRefreshKey: number;
  bumpDetailRefreshKey: () => void;
}

export const usePortfolioStore = create<PortfolioStoreState>((set) => ({
  detailRefreshKey: 0,
  bumpDetailRefreshKey: () =>
    set((s) => ({ detailRefreshKey: s.detailRefreshKey + 1 })),
}));

/**
 * 종목 추가/수정 시트 — 투자 메인·계좌 상세·종목 매매화면 어디서든 연다.
 * UserShell 안 PortfolioSheet 가 구독. editId 있으면 수정, accountId 있으면 create 프리필.
 */
interface PortfolioSheetState {
  opened: boolean;
  editId: string | null;
  defaultAccountId: string | null;
  /** 인자 없으면 생성, editId 주면 수정, accountId 주면 그 계좌로 프리필 */
  open: (editId?: string, accountId?: string) => void;
  close: () => void;
}

export const usePortfolioSheetStore = create<PortfolioSheetState>((set) => ({
  opened: false,
  editId: null,
  defaultAccountId: null,
  open: (editId?: string, accountId?: string) =>
    set({
      opened: true,
      editId: editId ?? null,
      defaultAccountId: accountId ?? null,
    }),
  close: () => set({ opened: false, editId: null, defaultAccountId: null }),
}));
