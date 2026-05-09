"use client";

import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import TransactionForm from "_features/transaction/components/form";

interface TransactionsFormSectionProps {
  transactionId?: string;
}

export default function TransactionsFormSection({
  transactionId,
}: TransactionsFormSectionProps) {
  const t = useTranslations("transaction");
  const router = useRouter();
  const isUpdate = Boolean(transactionId);

  return (
    <Stack gap="md">
      <Group align="center">
        <ActionIcon
          variant="subtle"
          onClick={() => router.back()}
          aria-label="back"
        >
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title order={4}>
          {isUpdate ? t("form_update_title") : t("form_create_title")}
        </Title>
      </Group>

      <TransactionForm transactionId={transactionId} />
    </Stack>
  );
}
