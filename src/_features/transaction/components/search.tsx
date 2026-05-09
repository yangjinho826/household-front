"use client";

import { Button, Group, Select, Stack, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useTranslations } from "next-intl";

import type { TransactionSearchRequestType } from "../types";

interface TransactionSearchProps {
  form: UseFormReturnType<
    TransactionSearchRequestType & { pageNo: number; listSize: number }
  >;
  onSearch: (values: TransactionSearchRequestType) => void;
  onReset: () => void;
}

export default function TransactionSearch({
  form,
  onSearch,
  onReset,
}: TransactionSearchProps) {
  const t = useTranslations("transaction");
  const tg = useTranslations("general.common");

  return (
    <form onSubmit={form.onSubmit(onSearch)}>
      <Stack gap="sm">
        <TextInput
          {...form.getInputProps("searchTerm")}
          label={t("search_term")}
          placeholder={t("search_term_placeholder")}
        />
        <Select
          {...form.getInputProps("txType")}
          label={t("tx_type")}
          placeholder={t("tx_type_placeholder")}
          data={[
            { value: "expense", label: t("tx_type_expense") },
            { value: "income", label: t("tx_type_income") },
            { value: "transfer", label: t("tx_type_transfer") },
          ]}
          clearable
        />
        <Group grow>
          <Button type="button" variant="light" onClick={onReset}>
            {tg("reset")}
          </Button>
          <Button type="submit">{tg("search")}</Button>
        </Group>
      </Stack>
    </form>
  );
}
