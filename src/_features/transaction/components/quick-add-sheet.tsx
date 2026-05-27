"use client";

import { Center, Drawer, Group, Loader, Stack, Text } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

import TransactionForm from "_features/transaction/components/form";
import { useQuickAddStore } from "_features/transaction/store";

/**
 * 빠른 거래 입력 시트 — 어디서나 FAB 또는 거래 탭 [+] 누르면 열림.
 *
 * 가계부 선택 모달(household-switcher) 과 시각 일치 — 핸들바 + 커스텀 제목,
 * size="auto" + maxWidth: 448 모바일 컨테이너. Drawer zIndex 명시 X 로
 * Mantine 기본값(200) 사용 → 내부 Select/DateInput dropdown(기본 300)
 * 이 자연스럽게 위에 떠서 안 보이는 이슈 회피.
 */
export default function QuickAddSheet() {
  const t = useTranslations("transaction");
  const opened = useQuickAddStore((s) => s.opened);
  const close = useQuickAddStore((s) => s.close);
  const queryClient = useQueryClient();

  const handleDone = () => {
    close();
    queryClient.invalidateQueries();
  };

  return (
    <Drawer
      opened={opened}
      onClose={close}
      position="bottom"
      size="auto"
      withCloseButton={false}
      styles={{
        content: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxWidth: 448,
          margin: "0 auto",
          maxHeight: "min(90dvh, calc(100dvh - var(--safe-bottom)))",
        },
        body: {
          paddingBottom: "calc(var(--safe-bottom) + 16px)",
        },
      }}
    >
      {/* 핸들바 — 토스 시그니처 (household-switcher 와 동일) */}
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
          {t("form_create_title")}
        </Text>
      </Stack>

      {/* 시트 닫혔을 때는 unmount → 다음 진입 시 폼 fresh.
          form.tsx 내부 useSuspenseQuery (account/category/fixed) 들의 캐시 miss 시
          상위 페이지 Suspense 까지 throw 가 올라가 페이지 전체가 깜박이는 걸 막기 위해
          시트 안에 자체 Suspense fallback 을 둔다. */}
      {opened && (
        <Suspense
          fallback={
            <Center py="xl">
              <Loader />
            </Center>
          }
        >
          <TransactionForm onDone={handleDone} hideCard />
        </Suspense>
      )}
    </Drawer>
  );
}
