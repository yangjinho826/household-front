"use client";

import { Lock } from "lucide-react";
import { toast } from "sonner";

import { SettingsItem } from "_features/layout/components/settings-item";
import { C } from "_styles/design-tokens";

export function SettingsSecurity() {
  return (
    <div className="px-4 pt-4">
      <p className="text-xs font-bold px-2 mb-2" style={{ color: C.textMuted }}>
        보안
      </p>
      <div className="bg-white rounded-2xl p-2">
        <SettingsItem
          label="비밀번호 변경"
          icon={Lock}
          onClick={() => toast("비밀번호 변경 (구현 예정)")}
        />
      </div>
    </div>
  );
}
