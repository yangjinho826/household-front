"use client";

import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { useHouseholdContext } from "_features/household/context";
import { C } from "_styles/design-tokens";

/**
 * 설정 페이지 — 사용자 프로필 카드.
 */
export function ProfileCard() {
  const { user } = useHouseholdContext();
  if (!user) return null;

  return (
    <div className="px-4 pt-4">
      <button
        type="button"
        onClick={() => toast("프로필 수정 (구현 예정)")}
        className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 hover:bg-gray-50"
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: C.blueLight }}
        >
          <span className="text-xl font-extrabold" style={{ color: C.blue }}>
            {user.name[0]}
          </span>
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-base font-bold truncate" style={{ color: C.text }}>
            {user.name}
          </p>
          <p className="text-xs font-medium truncate" style={{ color: C.textMuted }}>
            {user.email}
          </p>
        </div>
        <ChevronRight className="w-4 h-4" style={{ color: C.textMuted }} />
      </button>
    </div>
  );
}
