import type { ReactNode } from "react";
import { C } from "_styles/design-tokens";

export function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium" style={{ color: C.textMuted }}>
        {label}
      </span>
      <span className="text-sm font-semibold" style={{ color: C.text }}>
        {value}
      </span>
    </div>
  );
}
