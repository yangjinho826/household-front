"use client";

import {
  Button,
  Card,
  Group,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useTranslations } from "next-intl";

import { useHouseholdForm } from "../hooks/use-sub/use-form";

interface HouseholdFormProps {
  householdId?: string;
}

export default function HouseholdForm({ householdId }: HouseholdFormProps) {
  const t = useTranslations("household");
  const tg = useTranslations("general.common");

  const {
    form,
    isUpdate,
    isPending,
    handleSubmit,
    handleRemove,
    handleCancel,
  } = useHouseholdForm({ householdId });

  return (
    <Card>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <TextInput
            {...form.getInputProps("name")}
            label={t("name")}
            placeholder={t("name_placeholder")}
          />
          <Textarea
            {...form.getInputProps("description")}
            label={t("description")}
            autosize
            minRows={2}
          />
          <TextInput
            {...form.getInputProps("currency")}
            label={t("currency")}
            placeholder="KRW"
          />
          <TextInput
            {...form.getInputProps("startedAt")}
            label={t("started_at")}
            placeholder="YYYY-MM-DD"
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
