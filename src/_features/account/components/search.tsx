"use client";

import { Button, Group, Select, Stack, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useTranslations } from "next-intl";

import type {
  AccountSearchRequestType,
} from "../types";

interface AccountSearchProps {
  form: UseFormReturnType<AccountSearchRequestType & { pageNo: number; listSize: number }>;
  onSearch: (values: AccountSearchRequestType) => void;
  onReset: () => void;
}

export default function AccountSearch({
  form,
  onSearch,
  onReset,
}: AccountSearchProps) {
  const t = useTranslations("account");
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
          {...form.getInputProps("accountType")}
          label={t("type")}
          placeholder={t("type_placeholder")}
          data={[
            { value: "LIVING", label: t("type_living") },
            { value: "SAVINGS", label: t("type_savings") },
            { value: "INVESTMENT", label: t("type_investment") },
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
