"use client";

import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import HouseholdForm from "_features/household/components/form";

interface HouseholdFormSectionProps {
  householdId?: string;
}

export default function HouseholdFormSection({
  householdId,
}: HouseholdFormSectionProps) {
  const t = useTranslations("household");
  const router = useRouter();
  const isUpdate = Boolean(householdId);

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

      <HouseholdForm householdId={householdId} />
    </Stack>
  );
}
