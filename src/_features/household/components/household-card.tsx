"use client";

import { Crown, Home, Settings as SettingsIcon, Users } from "lucide-react";
import { toast } from "sonner";

import { useHouseholdContext } from "_features/household/context";
import { SettingsItem } from "_features/layout/components/settings-item";
import { C } from "_styles/design-tokens";

/**
 * 설정 페이지 — 현재 가계부 카드 + 가계부 설정/멤버 관리 SettingsItem.
 */
export function HouseholdCard() {
  const {
    currentHousehold,
    currentMembers,
    isOwner,
    setShowSwitcher,
    households,
  } = useHouseholdContext();

  return (
    <div className="px-4 pt-4">
      <p className="text-xs font-bold px-2 mb-2" style={{ color: C.textMuted }}>
        현재 가계부
      </p>
      <div className="bg-white rounded-2xl p-2">
        <button
          type="button"
          onClick={() => setShowSwitcher(true)}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-left"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: isOwner ? C.blueLight : C.purpleLight }}
          >
            {isOwner ? (
              <Home className="w-5 h-5" style={{ color: C.blue }} />
            ) : (
              <Users className="w-5 h-5" style={{ color: C.purple }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p
                className="text-sm font-bold truncate"
                style={{ color: C.text }}
              >
                {currentHousehold?.name}
              </p>
              {isOwner && (
                <Crown
                  className="w-3 h-3"
                  style={{ color: C.gold }}
                  fill={C.gold}
                />
              )}
            </div>
            <p className="text-xs font-medium" style={{ color: C.textMuted }}>
              {isOwner ? "소유자" : "멤버"} · {currentMembers.length}명 · 전체{" "}
              {households.length}개 가계부
            </p>
          </div>
          <span className="text-xs font-bold" style={{ color: C.blue }}>
            전환
          </span>
        </button>
        <SettingsItem
          label="가계부 설정"
          icon={SettingsIcon}
          onClick={() => toast("가계부 설정 (구현 예정)")}
        />
        <SettingsItem
          label="멤버 관리"
          icon={Users}
          value={`${currentMembers.length}명`}
          onClick={() => toast("멤버 관리 (구현 예정)")}
        />
      </div>
    </div>
  );
}
