import { Suspense } from "react";

import { PageLoader } from "_features/common/components/page-loader";
import FixedSection from "_sections/fixed/fixed-section";

export const dynamic = "force-dynamic";

export default function FixedPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <FixedSection />
    </Suspense>
  );
}
