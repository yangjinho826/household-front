"use client";

import { Stack } from "@mantine/core";
import { useTranslations } from "next-intl";

import SubHeader from "_features/layout/components/sub-header";
import TransactionForm from "_features/transaction/components/form";

interface TransactionsFormSectionProps {
  transactionId?: string;
}

export default function TransactionsFormSection({
  transactionId,
}: TransactionsFormSectionProps) {
  const t = useTranslations("transaction");
  const isUpdate = Boolean(transactionId);

  return (
    <Stack gap="md">
      <SubHeader
        title={isUpdate ? t("form_update_title") : t("form_create_title")}
      />
      <TransactionForm transactionId={transactionId} />
    </Stack>
  );
}
