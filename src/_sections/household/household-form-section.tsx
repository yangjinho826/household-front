"use client";

import { Stack } from "@mantine/core";
import { useTranslations } from "next-intl";

import HouseholdForm from "_features/household/components/form";
import SubHeader from "_features/layout/components/sub-header";

interface HouseholdFormSectionProps {
  householdId?: string;
}

export default function HouseholdFormSection({
  householdId,
}: HouseholdFormSectionProps) {
  const t = useTranslations("household");
  const isUpdate = Boolean(householdId);

  return (
    <Stack gap="md">
      <SubHeader
        title={isUpdate ? t("form_update_title") : t("form_create_title")}
      />
      <HouseholdForm householdId={householdId} />
    </Stack>
  );
}
