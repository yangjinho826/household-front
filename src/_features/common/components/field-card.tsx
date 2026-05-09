import type { ReactNode } from "react";
import { C } from "_styles/design-tokens";

type FieldCardProps = {
  label: string;
  children: ReactNode;
  required?: boolean;
  disabled?: boolean;
};

export function FieldCard({ label, children, required, disabled }: FieldCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-4"
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      <div className="flex items-center gap-1 mb-2">
        <p className="text-xs font-bold" style={{ color: C.textSub }}>
          {label}
        </p>
        {required && (
          <span className="text-xs font-bold" style={{ color: C.red }}>
            *
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
