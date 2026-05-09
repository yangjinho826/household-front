import { redirect } from "next/navigation";
import type { ReactNode } from "react";

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
    <AuthProvider>
      <UserShell>{children}</UserShell>
    </AuthProvider>
  );
}
