"use client";

import { useTranslations } from "next-intl";

import FormSheet from "_features/common/components/form-sheet";
import TransactionForm from "_features/transaction/components/form";
import { useQuickAddStore } from "_features/transaction/store";

/**
 * 거래 입력 시트 — 어디서나 FAB·거래 탭 [+]·거래 row 클릭으로 열림.
 * editId 가 있으면 수정, 없으면 생성. 공용 FormSheet(bottom sheet) 사용.
 */
export default function QuickAddSheet() {
  const t = useTranslations("transaction");
  const opened = useQuickAddStore((s) => s.opened);
  const editId = useQuickAddStore((s) => s.editId);
  const close = useQuickAddStore((s) => s.close);

  // 캐시 무효화는 create/updateMutation.onSuccess(invalidateRelated) 가 transaction/
  // account/wealth/home/stats 까지 정교하게 처리한다. 여기서 전역 invalidateQueries() 를
  // 또 부르면 formOptions·enum 까지 불필요하게 refetch → 거래 탭 툴바가 흔들렸다.
  const handleDone = () => {
    close();
  };

  return (
    <FormSheet
      opened={opened}
      onClose={close}
      title={editId ? t("form_update_title") : t("form_create_title")}
    >
      <TransactionForm
        transactionId={editId ?? undefined}
        onDone={handleDone}
        hideCard
      />
    </FormSheet>
  );
}
