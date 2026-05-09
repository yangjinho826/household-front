"use client";

import { Button, Group, Select, Stack, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useTranslations } from "next-intl";

import type { CategorySearchRequestType } from "../types";

interface CategorySearchProps {
  form: UseFormReturnType<
    CategorySearchRequestType & { pageNo: number; listSize: number }
  >;
  onSearch: (values: CategorySearchRequestType) => void;
  onReset: () => void;
}

export default function CategorySearch({
  form,
  onSearch,
  onReset,
}: CategorySearchProps) {
  const t = useTranslations("category");
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
          {...form.getInputProps("kind")}
          label={t("kind")}
          placeholder={t("kind_placeholder")}
          data={[
            { value: "expense", label: t("kind_expense") },
            { value: "income", label: t("kind_income") },
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
