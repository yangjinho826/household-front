import { Suspense } from "react";

import { PageLoader } from "_features/common/components/page-loader";
import AccountSection from "_sections/account/account-section";

export const dynamic = "force-dynamic";

export default function AccountPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AccountSection />
    </Suspense>
  );
}
