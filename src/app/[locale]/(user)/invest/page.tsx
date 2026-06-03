import { Suspense } from "react";

import { PageLoader } from "_features/common/components/page-loader";
import PortfolioSection from "_sections/invest/portfolio-section";

export const dynamic = "force-dynamic";

export default function PortfolioPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <PortfolioSection />
    </Suspense>
  );
}
