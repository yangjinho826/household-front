import { create } from "zustand";

import type { TxType } from "./types";

interface TransactionStoreState {
  detailRefreshKey: number;
  bumpDetailRefreshKey: () => void;
}

export const useTransactionStore = create<TransactionStoreState>((set) => ({
  detailRefreshKey: 0,
  bumpDetailRefreshKey: () =>
    set((s) => ({ detailRefreshKey: s.detailRefreshKey + 1 })),
}));

/**
 * 거래 입력 시트 — 어디서나 + FAB·거래 탭 [+]·거래 row 클릭으로 열림.
 * UserShell 안 QuickAddSheet 가 이 store 를 구독. editId 있으면 수정, 없으면 생성.
 */
interface QuickAddStoreState {
  opened: boolean;
  editId: string | null;
  /**
   * 수정 대상의 거래 유형 — 시트 헤더의 복사 아이콘 노출 판정에만 쓴다.
   * 평가조정은 "새 평가액 절대값 → 차액" 으로 생성되므로 값 복사가 무의미하다.
   */
  editTxType: TxType | null;
  /** 복사 원본 거래 id — 값이 있으면 그 내용으로 채운 **생성** 모드 */
  copyFromId: string | null;
  /** 인자 없으면 생성, id 주면 해당 거래 수정 */
  open: (editId?: string, editTxType?: TxType) => void;
  /** 기존 거래를 원본으로 새 거래 입력 — 날짜만 오늘로 바뀐다 */
  openCopy: (copyFromId: string) => void;
  close: () => void;
}

export const useQuickAddStore = create<QuickAddStoreState>((set) => ({
  opened: false,
  editId: null,
  editTxType: null,
  copyFromId: null,
  open: (editId?: string, editTxType?: TxType) =>
    set({
      opened: true,
      editId: editId ?? null,
      editTxType: editTxType ?? null,
      copyFromId: null,
    }),
  openCopy: (copyFromId: string) =>
    set({ opened: true, editId: null, editTxType: null, copyFromId }),
  close: () =>
    set({ opened: false, editId: null, editTxType: null, copyFromId: null }),
}));
