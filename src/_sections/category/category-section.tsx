"use client";

import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import CategoryTable from "_features/category/components/table";
import { useCategorySearch } from "_features/category/hooks/use-sub/use-search";
import type { CategoryKind } from "_features/category/types";
import FilterChip from "_features/common/components/filter-chip";
import { useEnumOptions } from "_features/enum/queries/use-query";

export default function CategorySection() {
  const t = useTranslations("category");
  const tKind = useTranslations("enum.category-kind");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const {
    kind,
    setKind,
    result,
    params,
    handlePageChange,
  } = useCategorySearch();

  const { data: kindData } = useEnumOptions("category-kind");
  const kinds = kindData.body.data as CategoryKind[];

  const items = result?.content ?? [];
  const totalPages = result?.totalPages ?? 1;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>{t("list_title")}</Title>
        <ActionIcon
          size="lg"
          radius="xl"
          onClick={() => router.push(`/${routeParams.locale}/category/new`)}
          aria-label={t("add")}
        >
          <IconPlus size={18} />
        </ActionIcon>
      </Group>

      <Group gap="xs">
        <FilterChip
          label="전체"
          active={kind === undefined}
          onClick={() => setKind(undefined)}
        />
        {kinds.map((k) => (
          <FilterChip
            key={k}
            label={tKind(k)}
            active={kind === k}
            onClick={() => setKind(k)}
          />
        ))}
      </Group>

      <CategoryTable
        items={items}
        totalPages={totalPages}
        pageNo={params.pageNo}
        listSize={params.listSize}
        onClickRow={(id) =>
          router.push(`/${routeParams.locale}/category/${id}`)
        }
        onPageChange={handlePageChange}
      />
    </Stack>
  );
}
