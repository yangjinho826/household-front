"use client";

import { ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import { useQuickAddStore } from "_features/transaction/store";

/**
 * 빠른 거래 입력 FAB — 모든 페이지 우하단.
 *
 * 위치 계산 (CSS only):
 * - bottom: BottomTab 높이 + safe-area + 16px
 * - right: max(16px, (viewport - container-max) / 2 + 16px)
 *   → 모바일: viewport 우측 16px / 패드·데스크탑: 박스 우측 16px
 *
 * z = 600 (BottomTab 500 위, Drawer/Modal 1000 아래).
 */
export default function QuickAddFab() {
  const open = useQuickAddStore((s) => s.open);

  return (
    <ActionIcon
      onClick={open}
      radius="50%"
      color="info"
      variant="filled"
      aria-label="새 거래"
      style={{
        position: "fixed",
        width: 56,
        height: 56,
        bottom:
          "calc(var(--bottom-tab-h) + var(--safe-bottom) + 16px)",
        right:
          "max(16px, calc((100vw - var(--container-max)) / 2 + 16px))",
        zIndex: 600,
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
      }}
    >
      <IconPlus size={26} stroke={2.5} />
    </ActionIcon>
  );
}
