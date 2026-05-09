"use client";

import { Bell, ChevronDown, Users } from "lucide-react";

import { C } from "_styles/design-tokens";

import { useHouseholdContext } from "../context";

/**
 * 홈 화면 상단 — 가계부 스위처 + 알림.
 */
export function HouseholdHeader() {
  const { currentHousehold, setShowSwitcher, currentMembers } = useHouseholdContext();

  return (
    <div className="px-4 pt-4 pb-3 bg-white">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowSwitcher(true)}
          className="flex items-center gap-1.5 -ml-1 px-2 py-1.5 rounded-xl hover:bg-gray-50"
        >
          <h1 className="text-lg font-extrabold" style={{ color: C.text }}>
            {currentHousehold?.name}
          </h1>
          <ChevronDown className="w-4 h-4" style={{ color: C.textMuted }} />
          {currentMembers.length > 1 && (
            <div
              className="ml-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
              style={{ background: C.bg }}
            >
              <Users className="w-3 h-3" style={{ color: C.textSub }} />
              <span
                className="text-[10px] font-bold"
                style={{ color: C.textSub }}
              >
                {currentMembers.length}
              </span>
            </div>
          )}
        </button>
        <button
          type="button"
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: C.bg }}
        >
          <Bell className="w-4 h-4" style={{ color: C.textSub }} />
        </button>
      </div>
    </div>
  );
}
