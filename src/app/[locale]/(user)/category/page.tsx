import { Suspense } from "react";

import { PageLoader } from "_features/common/components/page-loader";
import CategorySection from "_sections/category/category-section";

export const dynamic = "force-dynamic";

export default function CategoryPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <CategorySection />
    </Suspense>
  );
}
