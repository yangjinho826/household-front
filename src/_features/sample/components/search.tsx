"use client";

import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useTranslations } from "next-intl";

import { useSampleContext } from "../context";

export default function SampleSearch() {
  const t = useTranslations("sample");
  const tg = useTranslations("general.common");
  const {
    search: {
      form,
      actions: { onSearch, onReset },
    },
  } = useSampleContext();

  return (
    <form onSubmit={form.onSubmit(onSearch)}>
      <Stack gap="sm">
        <TextInput
          {...form.getInputProps("searchTerm")}
          label={t("search_term")}
          placeholder={t("search_term_placeholder")}
        />
        <TextInput
          {...form.getInputProps("sampleEmail")}
          label={t("email")}
          placeholder={t("email_placeholder")}
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
