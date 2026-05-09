import { Center, Loader } from "@mantine/core";
import { Suspense } from "react";

import FixedSection from "_sections/fixed/fixed-section";

export const dynamic = "force-dynamic";

export default function FixedPage() {
  return (
    <Suspense
      fallback={
        <Center py="xl">
          <Loader />
        </Center>
      }
    >
      <FixedSection />
    </Suspense>
  );
}
