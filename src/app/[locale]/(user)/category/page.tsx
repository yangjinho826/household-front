import { Center, Loader } from "@mantine/core";
import { Suspense } from "react";

import CategorySection from "_sections/category/category-section";

export const dynamic = "force-dynamic";

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <Center py="xl">
          <Loader />
        </Center>
      }
    >
      <CategorySection />
    </Suspense>
  );
}
