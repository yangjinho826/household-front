"use client";

import { Button, Group, Stack, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useTranslations } from "next-intl";

import type { HouseholdSearchRequestType } from "../types";

interface HouseholdSearchProps {
  form: UseFormReturnType<
    HouseholdSearchRequestType & { pageNo: number; listSize: number }
  >;
  onSearch: (values: HouseholdSearchRequestType) => void;
  onReset: () => void;
}

export default function HouseholdSearch({
  form,
  onSearch,
  onReset,
}: HouseholdSearchProps) {
  const t = useTranslations("household");
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
