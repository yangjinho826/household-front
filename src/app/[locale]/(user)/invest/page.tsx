import { Center, Loader } from "@mantine/core";
import { Suspense } from "react";

import PortfolioSection from "_sections/invest/portfolio-section";

export const dynamic = "force-dynamic";

export default function PortfolioPage() {
  return (
    <Suspense
      fallback={
        <Center py="xl">
          <Loader />
        </Center>
      }
    >
      <PortfolioSection />
    </Suspense>
  );
}
