"use client";

import { Stack } from "@mantine/core";
import { useTranslations } from "next-intl";

import AccountForm from "_features/account/components/form";
import SubHeader from "_features/layout/components/sub-header";

interface AccountFormSectionProps {
  accountId?: string;
}

export default function AccountFormSection({
  accountId,
}: AccountFormSectionProps) {
  const t = useTranslations("account");
  const isUpdate = Boolean(accountId);

  return (
    <Stack gap="md">
      <SubHeader
        title={isUpdate ? t("form_update_title") : t("form_create_title")}
      />
      <AccountForm accountId={accountId} />
    </Stack>
  );
}
