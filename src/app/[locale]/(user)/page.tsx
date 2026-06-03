import { Suspense } from "react";

import { PageLoader } from "_features/common/components/page-loader";
import HomeSection from "_sections/home/home-section";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <HomeSection />
    </Suspense>
  );
}
