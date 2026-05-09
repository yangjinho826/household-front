"use client";

import { Button, Group, Stack, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useTranslations } from "next-intl";

import type { PortfolioSearchRequestType } from "../types";

interface PortfolioSearchProps {
  form: UseFormReturnType<
    PortfolioSearchRequestType & { pageNo: number; listSize: number }
  >;
  onSearch: (values: PortfolioSearchRequestType) => void;
  onReset: () => void;
}

export default function PortfolioSearch({
  form,
  onSearch,
  onReset,
}: PortfolioSearchProps) {
  const t = useTranslations("portfolio");
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
