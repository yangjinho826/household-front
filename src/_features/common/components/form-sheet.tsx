"use client";

import { Drawer, Group, Stack, Text } from "@mantine/core";
import { Suspense } from "react";

import { PageLoader } from "_features/common/components/page-loader";

interface FormSheetProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * 공용 bottom sheet — 추가/수정 폼을 담는 단일 패턴.
 *
 * 핸들바 + 제목 + 모바일 컨테이너(448px). 닫히면 children unmount 라
 * 다음 진입 시 폼이 fresh. 내부 Suspense 로 폼의 useSuspenseQuery 캐시 miss 가
 * 페이지 전체로 throw 되어 깜박이는 걸 막는다(quick-add-sheet 와 동일 규칙).
 *
 * Drawer zIndex 는 Mantine 기본(200) — 내부 Select/DateInput dropdown(300)이
 * 자연스럽게 위에 뜨도록 명시하지 않는다.
 */
export default function FormSheet({
  opened,
  onClose,
  title,
  children,
}: FormSheetProps) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      size="auto"
      withCloseButton={false}
      styles={{
        content: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxWidth: 448,
          margin: "0 auto",
          // BottomTab(z-index 500, 64px) 이 시트 위로 떠서 하단 버튼을 가로채는 걸 방지 —
          // household-switcher 와 동일하게 BottomTab 높이까지 빼고 본문에 채워 끝 버튼을 띄운다.
          maxHeight:
            "min(90dvh, calc(100dvh - var(--bottom-tab-h) - var(--safe-bottom)))",
        },
        body: {
          paddingBottom:
            "calc(var(--bottom-tab-h) + var(--safe-bottom) + 16px)",
        },
      }}
    >
      {/* 핸들바 (household-switcher 와 동일) */}
      <Group justify="center" pt={4} pb={8}>
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: "var(--mantine-color-gray-3)",
          }}
        />
      </Group>

      <Stack gap={4} px="md" pb="xs">
        <Text size="md" fw={800}>
          {title}
        </Text>
      </Stack>

      {opened && <Suspense fallback={<PageLoader />}>{children}</Suspense>}
    </Drawer>
  );
}
