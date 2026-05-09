import { Center, Loader } from "@mantine/core";
import { Suspense } from "react";

import SampleSection from "_sections/sample/sample-section";

export const dynamic = "force-dynamic";

export default function SamplePage() {
  return (
    <Suspense
      fallback={
        <Center py="xl">
          <Loader />
        </Center>
      }
    >
      <SampleSection />
    </Suspense>
  );
}
