"use client";

import { toast } from "sonner";

import { Fab } from "_features/layout/components/fab";

/**
 * 거래 페이지 FAB — 거래 추가 액션 (현재 placeholder).
 */
export function TransactionFab() {
  return <Fab onClick={() => toast("거래 추가 (구현 예정)")} />;
}
