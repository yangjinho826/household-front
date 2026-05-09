import { Center, Loader } from "@mantine/core";
import { Suspense } from "react";

import TransactionsSection from "_sections/transactions/transactions-section";

export const dynamic = "force-dynamic";

export default function TransactionsPage() {
  return (
    <Suspense
      fallback={
        <Center py="xl">
          <Loader />
        </Center>
      }
    >
      <TransactionsSection />
    </Suspense>
  );
}
