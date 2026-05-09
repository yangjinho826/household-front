"use client";

import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import AccountForm from "_features/account/components/form";

interface AccountFormSectionProps {
  accountId?: string;
}

export default function AccountFormSection({
  accountId,
}: AccountFormSectionProps) {
  const t = useTranslations("account");
  const router = useRouter();
  const isUpdate = Boolean(accountId);

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

      <AccountForm accountId={accountId} />
    </Stack>
  );
}
