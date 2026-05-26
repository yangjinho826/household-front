"use client";

import { Stack } from "@mantine/core";
import { useTranslations } from "next-intl";

import CategoryForm from "_features/category/components/form";
import SubHeader from "_features/layout/components/sub-header";

interface CategoryFormSectionProps {
  categoryId?: string;
}

export default function CategoryFormSection({
  categoryId,
}: CategoryFormSectionProps) {
  const t = useTranslations("category");
  const isUpdate = Boolean(categoryId);

  return (
    <Stack gap="md">
      <SubHeader
        title={isUpdate ? t("form_update_title") : t("form_create_title")}
      />
      <CategoryForm categoryId={categoryId} />
    </Stack>
  );
}
