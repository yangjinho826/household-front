"use client";

import { Stack } from "@mantine/core";

import SampleDetail from "_features/sample/components/detail";
import SampleSearch from "_features/sample/components/search";
import SampleTable from "_features/sample/components/table";
import { SampleProvider } from "_features/sample/context";

export default function SampleSection() {
  return (
    <SampleProvider>
      <Stack gap="md">
        <SampleSearch />
        <SampleTable />
        <SampleDetail />
      </Stack>
    </SampleProvider>
  );
}
