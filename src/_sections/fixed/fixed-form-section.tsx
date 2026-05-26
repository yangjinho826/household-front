"use client";

import { Stack } from "@mantine/core";
import { useTranslations } from "next-intl";

import FixedForm from "_features/fixed/components/form";
import SubHeader from "_features/layout/components/sub-header";

interface FixedFormSectionProps {
  fixedId?: string;
}

export default function FixedFormSection({ fixedId }: FixedFormSectionProps) {
  const t = useTranslations("fixed");
  const isUpdate = Boolean(fixedId);

  return (
    <Stack gap="md">
      <SubHeader
        title={isUpdate ? t("form_update_title") : t("form_create_title")}
      />
      <FixedForm fixedId={fixedId} />
    </Stack>
  );
}
