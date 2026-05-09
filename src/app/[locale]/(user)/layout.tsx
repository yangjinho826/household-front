import type { ReactNode } from "react";

import { UserShell } from "_features/layout/user-shell";
import { BudgetProviders } from "_providers/budget-providers";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <BudgetProviders>
      <UserShell>{children}</UserShell>
    </BudgetProviders>
  );
}
