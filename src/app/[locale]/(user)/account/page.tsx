import { Center, Loader } from "@mantine/core";
import { Suspense } from "react";

import AccountSection from "_sections/account/account-section";

export const dynamic = "force-dynamic";

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <Center py="xl">
          <Loader />
        </Center>
      }
    >
      <AccountSection />
    </Suspense>
  );
}
