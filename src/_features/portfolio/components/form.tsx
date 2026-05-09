"use client";

import {
  Button,
  Card,
  Group,
  NumberInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useTranslations } from "next-intl";

import { usePortfolioForm } from "../hooks/use-sub/use-form";

interface PortfolioFormProps {
  portfolioId?: string;
}

export default function PortfolioForm({ portfolioId }: PortfolioFormProps) {
  const t = useTranslations("portfolio");
  const tg = useTranslations("general.common");

  const {
    form,
    isUpdate,
    isPending,
    handleSubmit,
    handleRemove,
    handleCancel,
  } = usePortfolioForm({ portfolioId });

  return (
    <Card>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <TextInput
            {...form.getInputProps("ticker")}
            label={t("ticker")}
            placeholder={t("ticker_placeholder")}
          />
          <TextInput
            {...form.getInputProps("symbol")}
            label={t("symbol")}
            placeholder="005930"
          />
          <NumberInput
            {...form.getInputProps("quantity")}
            label={t("quantity")}
          />
          <NumberInput
            {...form.getInputProps("avgPrice")}
            label={t("avg_price")}
            thousandSeparator=","
          />
          <NumberInput
            {...form.getInputProps("currentValue")}
            label={t("current_value")}
            thousandSeparator=","
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
