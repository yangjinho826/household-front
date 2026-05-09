import type { ReactNode } from "react";

import { AuthShell } from "_features/layout/auth-shell";

export default function GuestLayout({ children }: { children: ReactNode }) {
  return <AuthShell>{children}</AuthShell>;
}
