"use client";

import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import CategoryForm from "_features/category/components/form";

interface CategoryFormSectionProps {
  categoryId?: string;
}

export default function CategoryFormSection({
  categoryId,
}: CategoryFormSectionProps) {
  const t = useTranslations("category");
  const router = useRouter();
  const isUpdate = Boolean(categoryId);

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

      <CategoryForm categoryId={categoryId} />
    </Stack>
  );
}
