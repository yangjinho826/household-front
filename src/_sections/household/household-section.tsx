"use client";

import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import HouseholdSearch from "_features/household/components/search";
import HouseholdTable from "_features/household/components/table";
import { useHouseholdSearch } from "_features/household/hooks/use-sub/use-search";

export default function HouseholdSection() {
  const t = useTranslations("household");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const {
    searchform,
    onSearch,
    onReset,
    result,
    params,
    handlePageChange,
  } = useHouseholdSearch();

  const items = result?.content ?? [];
  const totalPages = result?.totalPages ?? 1;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>{t("list_title")}</Title>
        <ActionIcon
          size="lg"
          radius="xl"
          onClick={() => router.push(`/${routeParams.locale}/household/new`)}
          aria-label={t("add")}
        >
          <IconPlus size={18} />
        </ActionIcon>
      </Group>

      <HouseholdSearch form={searchform} onSearch={onSearch} onReset={onReset} />

      <HouseholdTable
        items={items}
        totalPages={totalPages}
        pageNo={params.pageNo}
        listSize={params.listSize}
        onClickRow={(id) =>
          router.push(`/${routeParams.locale}/household/${id}`)
        }
        onPageChange={handlePageChange}
      />
    </Stack>
  );
}
