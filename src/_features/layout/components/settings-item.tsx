"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { C } from "_styles/design-tokens";

type SettingsItemProps = {
  label: string;
  value?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  danger?: boolean;
  accent?: boolean;
  disabled?: boolean;
};

export function SettingsItem({
  label,
  value,
  onClick,
  icon: Icon,
  danger,
  accent,
  disabled,
}: SettingsItemProps) {
  const color = danger ? C.red : accent ? C.blue : C.text;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 disabled:hover:bg-transparent"
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" style={{ color }} />}
        <span className="text-sm font-bold" style={{ color }}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {value && (
          <span
            className="text-xs font-medium"
            style={{ color: C.textMuted }}
          >
            {value}
          </span>
        )}
        {onClick && !danger && !accent && (
          <ChevronRight className="w-4 h-4" style={{ color: C.textMuted }} />
        )}
      </div>
    </button>
  );
}
