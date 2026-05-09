"use client";

import {
  Card,
  Center,
  Group,
  Pagination,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useTranslations } from "next-intl";

import { useSampleContext } from "../context";
import { useSampleStore } from "../store";

export default function SampleTable() {
  const tg = useTranslations("general.common");
  const setEditType = useSampleStore((s) => s.setEditType);
  const {
    search: {
      result,
      params,
      actions: { handlePageChange },
    },
    detail: {
      actions: { getDetail },
    },
  } = useSampleContext();

  const items = result?.content ?? [];

  if (!items.length) {
    return (
      <Center py="xl">
        <Text c="dimmed">{tg("no_data")}</Text>
      </Center>
    );
  }

  const onClickRow = async (sampleId: string) => {
    await getDetail(sampleId);
    setEditType("read");
  };

  return (
    <Stack gap="sm">
      {items.map((it) => (
        <UnstyledButton
          key={it.sampleId}
          onClick={() => onClickRow(it.sampleId)}
        >
          <Card>
            <Stack gap={4}>
              <Text fw={700}>{it.sampleTitle}</Text>
              <Text size="sm" c="dimmed">
                {it.sampleEmail}
              </Text>
              <Text size="xs" c="dimmed">
                {it.sampleDate}
              </Text>
            </Stack>
          </Card>
        </UnstyledButton>
      ))}
      {result && result.totalPages > 1 && (
        <Group justify="center">
          <Pagination
            value={params.pageNo}
            total={result.totalPages}
            onChange={(p) => handlePageChange(p, params.listSize)}
          />
        </Group>
      )}
    </Stack>
  );
}
