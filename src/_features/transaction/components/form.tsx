"use client";

import {
  Button,
  Card,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useTranslations } from "next-intl";

import { useTransactionForm } from "../hooks/use-sub/use-form";

interface TransactionFormProps {
  transactionId?: string;
}

export default function TransactionForm({
  transactionId,
}: TransactionFormProps) {
  const t = useTranslations("transaction");
  const tg = useTranslations("general.common");

  const {
    form,
    isUpdate,
    isPending,
    handleSubmit,
    handleRemove,
    handleCancel,
  } = useTransactionForm({ transactionId });

  return (
    <Card>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <Select
            {...form.getInputProps("txType")}
            label={t("tx_type")}
            data={[
              { value: "expense", label: t("tx_type_expense") },
              { value: "income", label: t("tx_type_income") },
              { value: "transfer", label: t("tx_type_transfer") },
            ]}
          />
          <NumberInput
            {...form.getInputProps("amount")}
            label={t("amount")}
            thousandSeparator=","
          />
          <TextInput
            {...form.getInputProps("txDate")}
            label={t("tx_date")}
            placeholder="YYYY-MM-DD"
          />
          <Textarea
            {...form.getInputProps("memo")}
            label={t("memo")}
            placeholder={t("memo_placeholder")}
            autosize
            minRows={2}
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
