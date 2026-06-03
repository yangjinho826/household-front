"use client";

import { Stack } from "@mantine/core";
import type { ReactNode } from "react";

import AccountSheet from "_features/account/components/account-sheet";
import HouseholdSheet from "_features/household/components/household-sheet";
import MembersSheet from "_features/household/components/members-sheet";
import AppHeader from "_features/layout/components/app-header";
import { BottomTab } from "_features/layout/components/bottom-tab";
import { SidebarNav } from "_features/layout/components/sidebar-nav";
import PortfolioSheet from "_features/portfolio/components/portfolio-sheet";
import QuickAddSheet from "_features/transaction/components/quick-add-sheet";

/**
 * UserShell — 반응형 셸 (3 viewport).
 *
 * - 휴대폰(<sm=768): block, max-width 448, AppHeader sticky + BottomTab fixed
 * - 패드(sm~lg=768~1199): block, max-width 768, AppHeader + BottomTab 유지 (확장)
 * - 데스크탑(>=lg=1200): flex (좌 SidebarNav 240 + 우 메인), AppHeader/BottomTab 숨김, max-width 1280
 *
 * max-width 는 BaseLayout main 의 `var(--container-max)` 가 처리.
 * display 분기는 `.user-shell-wrap` utility class (globals.css) 로 CSS only — SSR 안전.
 */
export function UserShell({ children }: { children: ReactNode }) {
  return (
    <div className="user-shell-wrap">
      <SidebarNav />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          paddingLeft: "var(--mantine-spacing-md)",
          paddingRight: "var(--mantine-spacing-md)",
          paddingTop: "var(--mantine-spacing-xl)",
          paddingBottom:
            "calc(var(--bottom-tab-h) + var(--safe-bottom) + var(--mantine-spacing-md))",
        }}
      >
        <AppHeader />
        <Stack gap="md" mt="md">
          {children}
        </Stack>
        <BottomTab />
      </div>

      <QuickAddSheet />
      <AccountSheet />
      <HouseholdSheet />
      <PortfolioSheet />
      <MembersSheet />
    </div>
  );
}
