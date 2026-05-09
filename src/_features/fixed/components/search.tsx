"use client";

import { Button, Group, Stack, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useTranslations } from "next-intl";

import type { FixedSearchRequestType } from "../types";

interface FixedSearchProps {
  form: UseFormReturnType<
    FixedSearchRequestType & { pageNo: number; listSize: number }
  >;
  onSearch: (values: FixedSearchRequestType) => void;
  onReset: () => void;
}

export default function FixedSearch({
  form,
  onSearch,
  onReset,
}: FixedSearchProps) {
  const t = useTranslations("fixed");
  const tg = useTranslations("general.common");

  return (
    <form onSubmit={form.onSubmit(onSearch)}>
      <Stack gap="sm">
        <TextInput
          {...form.getInputProps("searchTerm")}
          label={t("search_term")}
          placeholder={t("search_term_placeholder")}
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
