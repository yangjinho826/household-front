"use client";

import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

import HouseholdSearch from "_features/household/components/search";
import HouseholdTable from "_features/household/components/table";
import { useHouseholdSearch } from "_features/household/hooks/use-sub/use-search";
import { useHouseholdSheetStore } from "_features/household/store";

export default function HouseholdSection() {
  const t = useTranslations("household");
  const open = useHouseholdSheetStore((s) => s.open);
  const { searchform, onSearch, onReset, result } = useHouseholdSearch();

  const items = result?.items ?? [];

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>{t("list_title")}</Title>
        <ActionIcon
          size="lg"
          radius="xl"
          onClick={() => open()}
          aria-label={t("add")}
        >
          <IconPlus size={18} />
        </ActionIcon>
      </Group>

      <HouseholdSearch form={searchform} onSearch={onSearch} onReset={onReset} />

      <HouseholdTable items={items} onClickRow={(id) => open(id)} />
    </Stack>
  );
}
