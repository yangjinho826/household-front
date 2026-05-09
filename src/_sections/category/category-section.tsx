"use client";

import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import CategorySearch from "_features/category/components/search";
import CategoryTable from "_features/category/components/table";
import { useCategorySearch } from "_features/category/hooks/use-sub/use-search";

export default function CategorySection() {
  const t = useTranslations("category");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const {
    searchform,
    onSearch,
    onReset,
    result,
    params,
    handlePageChange,
  } = useCategorySearch();

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

      <CategorySearch form={searchform} onSearch={onSearch} onReset={onReset} />

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
