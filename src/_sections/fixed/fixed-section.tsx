"use client";

import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { queryKeys } from "_constants/queries";
import FixedSearch from "_features/fixed/components/search";
import FixedTable from "_features/fixed/components/table";
import { useFixedSearch } from "_features/fixed/hooks/use-sub/use-search";

export default function FixedSection() {
  const t = useTranslations("fixed");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const {
    searchform,
    onSearch,
    onReset,
    result,
    params,
    handlePageChange,
  } = useFixedSearch();

  const items = result?.content ?? [];
  const totalPages = result?.totalPages ?? 1;

  // 고정지출별 이번달 누적 사용액
  const { data: summary } = useQuery(queryKeys.fixed.monthlySummary());
  const usagesByFixed = summary?.body.data.usages;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>{t("list_title")}</Title>
        <ActionIcon
          size="lg"
          radius="xl"
          onClick={() => router.push(`/${routeParams.locale}/fixed/new`)}
          aria-label={t("add")}
        >
          <IconPlus size={18} />
        </ActionIcon>
      </Group>

      <FixedSearch form={searchform} onSearch={onSearch} onReset={onReset} />

      <FixedTable
        items={items}
        totalPages={totalPages}
        pageNo={params.pageNo}
        listSize={params.listSize}
        usagesByFixed={usagesByFixed}
        onClickRow={(id) =>
          router.push(`/${routeParams.locale}/fixed/${id}`)
        }
        onPageChange={handlePageChange}
      />
    </Stack>
  );
}
