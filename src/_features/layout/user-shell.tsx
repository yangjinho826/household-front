"use client";

import { Container, Stack } from "@mantine/core";
import type { ReactNode } from "react";

import AppHeader from "_features/layout/components/app-header";
import { BottomTab } from "_features/layout/components/bottom-tab";

/**
 * UserShell — 보호된 사용자 영역의 모바일 컨테이너.
 * - max-width 448 컨테이너 + sticky AppHeader + BottomTab
 * - pb={80} 으로 BottomTab 자리 확보
 * - AppHeader 는 페이지 상단에 항상 sticky (가계부 스위처 + 설정 링크)
 * - 인증 가드는 layout 에서 처리
 */
export function UserShell({ children }: { children: ReactNode }) {
  return (
    <Container size={448} px="md" py="xl" pb={80} bg="white" mih="100dvh">
      <AppHeader />
      <Stack gap="md" mt="md">
        {children}
      </Stack>
      <BottomTab />
    </Container>
  );
}
