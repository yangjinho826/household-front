import { Suspense } from "react";

import { PageLoader } from "_features/common/components/page-loader";
import WealthSection from "_sections/wealth/wealth-section";

export const dynamic = "force-dynamic";

export default function WealthPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <WealthSection />
    </Suspense>
  );
}
