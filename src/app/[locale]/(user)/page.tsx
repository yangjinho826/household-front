import { Center, Loader } from "@mantine/core";
import { Suspense } from "react";

import HomeSection from "_sections/home/home-section";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <Center py="xl">
          <Loader />
        </Center>
      }
    >
      <HomeSection />
    </Suspense>
  );
}
