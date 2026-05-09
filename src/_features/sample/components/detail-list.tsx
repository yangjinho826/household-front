"use client";

import { Stack, Text } from "@mantine/core";

import { useSampleContext } from "../context";

export default function SampleDetailList() {
  const {
    search: { result },
  } = useSampleContext();
  const items = result?.content ?? [];

  return (
    <Stack gap="xs">
      {items.map((it) => (
        <Text key={it.sampleId} size="sm">
          {it.sampleTitle}
        </Text>
      ))}
    </Stack>
  );
}
