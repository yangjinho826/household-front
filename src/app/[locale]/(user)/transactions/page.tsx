import { Suspense } from "react";

import { PageLoader } from "_features/common/components/page-loader";
import TransactionsSection from "_sections/transactions/transactions-section";

export const dynamic = "force-dynamic";

export default function TransactionsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <TransactionsSection />
    </Suspense>
  );
}
