"use client";

import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import FixedForm from "_features/fixed/components/form";

interface FixedFormSectionProps {
  fixedId?: string;
}

export default function FixedFormSection({ fixedId }: FixedFormSectionProps) {
  const t = useTranslations("fixed");
  const router = useRouter();
  const isUpdate = Boolean(fixedId);

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

      <FixedForm fixedId={fixedId} />
    </Stack>
  );
}
