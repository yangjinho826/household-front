"use client";

import {
  Button,
  Card,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useTranslations } from "next-intl";

import ColorPicker from "_features/common/components/color-picker";
import IconPicker from "_features/common/components/icon-picker";

import { useCategoryForm } from "../hooks/use-sub/use-form";

interface CategoryFormProps {
  categoryId?: string;
}

export default function CategoryForm({ categoryId }: CategoryFormProps) {
  const t = useTranslations("category");
  const tg = useTranslations("general.common");

  const {
    form,
    isUpdate,
    isPending,
    handleSubmit,
    handleRemove,
    handleCancel,
  } = useCategoryForm({ categoryId });

  return (
    <Card>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <Select
            {...form.getInputProps("kind")}
            label={t("kind")}
            data={[
              { value: "expense", label: t("kind_expense") },
              { value: "income", label: t("kind_income") },
            ]}
          />
          <TextInput
            {...form.getInputProps("name")}
            label={t("name")}
            placeholder={t("name_placeholder")}
          />
          <ColorPicker
            value={form.values.color}
            onChange={(c) => form.setFieldValue("color", c)}
            label={t("color")}
          />
          <IconPicker
            value={form.values.icon}
            onChange={(i) => form.setFieldValue("icon", i)}
            label={t("icon")}
          />
          <NumberInput
            {...form.getInputProps("sortOrder")}
            label={t("sort_order")}
          />
          <Group grow mt="md">
            <Button
              type="button"
              variant="light"
              onClick={handleCancel}
              disabled={isPending}
            >
              {tg("cancel")}
            </Button>
            <Button type="submit" loading={isPending}>
              {isUpdate ? tg("update") : tg("create")}
            </Button>
          </Group>
          {isUpdate && (
            <Button
              type="button"
              variant="light"
              color="red"
              onClick={handleRemove}
              disabled={isPending}
              fullWidth
            >
              {tg("delete")}
            </Button>
          )}
        </Stack>
      </form>
    </Card>
  );
}
