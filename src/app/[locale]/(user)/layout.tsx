import { Center, Loader } from "@mantine/core";
import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";

import { OnboardingGuard } from "_features/auth/components/onboarding-guard";
import { ClientOnlyShell } from "_features/layout/client-only-shell";
import { UserShell } from "_features/layout/user-shell";
import { hasRefreshCookie } from "_libraries/auth/guard";
import { AuthProvider } from "_providers/auth-provider";

export default async function UserLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (!(await hasRefreshCookie())) {
    redirect(`/${params.locale}/login`);
  }

  return (
    <ClientOnlyShell>
      <AuthProvider>
        <UserShell>
          <Suspense
            fallback={
              <Center py="xl">
                <Loader />
              </Center>
            }
          >
            <OnboardingGuard>{children}</OnboardingGuard>
          </Suspense>
        </UserShell>
      </AuthProvider>
    </ClientOnlyShell>
  );
}
