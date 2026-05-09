import { Center, Loader } from "@mantine/core";
import { Suspense } from "react";

import SettingsSection from "_sections/settings/settings-section";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <Center py="xl">
          <Loader />
        </Center>
      }
    >
      <SettingsSection />
    </Suspense>
  );
}
