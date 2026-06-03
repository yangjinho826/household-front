import { Suspense } from "react";

import { PageLoader } from "_features/common/components/page-loader";
import HouseholdSection from "_sections/household/household-section";

export const dynamic = "force-dynamic";

export default function HouseholdPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <HouseholdSection />
    </Suspense>
  );
}
