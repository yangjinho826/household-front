"use client";

import { Drawer } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import TransactionForm from "_features/transaction/components/form";
import { useQuickAddStore } from "_features/transaction/store";

/**
 * 빠른 거래 입력 시트 — 어디서나 FAB 또는 거래 탭 [+] 누르면 열림.
 *
 * UserShell 안에 1개만 mount. useQuickAddStore 의 opened 구독해서 표시.
 * 폼 = 기존 TransactionForm 재사용 (onDone prop 으로 시트 close + 데이터 갱신).
 */
export default function QuickAddSheet() {
  const t = useTranslations("transaction");
  const opened = useQuickAddStore((s) => s.opened);
  const close = useQuickAddStore((s) => s.close);
  const queryClient = useQueryClient();

  const handleDone = () => {
    // 다음 진입 시 폼 초기화 위해 mount 해제 — opened false 면 자동
    close();
    // 거래 / 통계 / 가계부 등 stale → 다음 화면에서 자동 refetch
    queryClient.invalidateQueries();
  };

  return (
    <Drawer
      opened={opened}
      onClose={close}
      position="bottom"
      size="90%"
      title={t("form_create_title")}
      zIndex={1000}
      styles={{
        content: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxWidth: "var(--container-max)",
          margin: "0 auto",
        },
        body: {
          paddingBottom: "calc(var(--safe-bottom) + 16px)",
        },
      }}
    >
      {/* 시트 닫혔을 때는 unmount → 다음 진입 시 폼 fresh */}
      {opened && <TransactionForm onDone={handleDone} />}
    </Drawer>
  );
}
