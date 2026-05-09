import { Center, Loader } from "@mantine/core";
import { Suspense } from "react";

import WealthSection from "_sections/wealth/wealth-section";

export const dynamic = "force-dynamic";

export default function WealthPage() {
  return (
    <Suspense
      fallback={
        <Center py="xl">
          <Loader />
        </Center>
      }
    >
      <WealthSection />
    </Suspense>
  );
}
