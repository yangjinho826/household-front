import { Center, Loader } from "@mantine/core";
import { Suspense } from "react";

import HouseholdSection from "_sections/household/household-section";

export const dynamic = "force-dynamic";

export default function HouseholdPage() {
  return (
    <Suspense
      fallback={
        <Center py="xl">
          <Loader />
        </Center>
      }
    >
      <HouseholdSection />
    </Suspense>
  );
}
