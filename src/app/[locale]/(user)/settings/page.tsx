import { Suspense } from "react";

import { PageLoader } from "_features/common/components/page-loader";
import SettingsSection from "_sections/settings/settings-section";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SettingsSection />
    </Suspense>
  );
}
