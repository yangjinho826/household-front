"use client";

import { Button, Card, Group, NumberInput, Select, Stack, TextInput } from "@mantine/core";
import { useTranslations } from "next-intl";

import ColorPicker from "_features/common/components/color-picker";
import IconPicker from "_features/common/components/icon-picker";

import { useAccountForm } from "../hooks/use-sub/use-form";

interface AccountFormProps {
  accountId?: string; // 있으면 update, 없으면 create
}

export default function AccountForm({ accountId }: AccountFormProps) {
  const t = useTranslations("account");
  const tg = useTranslations("general.common");

  const { form, isUpdate, isPending, handleSubmit, handleRemove, handleCancel } =
    useAccountForm({ accountId });

  return (
    <Card>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <TextInput
            {...form.getInputProps("name")}
            label={t("name")}
            placeholder={t("name_placeholder")}
          />
          <Select
            {...form.getInputProps("accountType")}
            label={t("type")}
            data={[
              { value: "LIVING", label: t("type_living") },
              { value: "SAVINGS", label: t("type_savings") },
              { value: "INVESTMENT", label: t("type_investment") },
            ]}
          />
          <NumberInput
            {...form.getInputProps("startBalance")}
            label={t("balance")}
            placeholder={t("balance_placeholder")}
            thousandSeparator=","
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
          <Group grow mt="md">
            <Button type="button" variant="light" onClick={handleCancel} disabled={isPending}>
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
