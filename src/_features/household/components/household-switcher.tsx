"use client";

import { Check, Crown, Home, Plus, Users } from "lucide-react";
import { C } from "_styles/design-tokens";
import { useHouseholdContext } from "../context";

type HouseholdSwitcherProps = {
  onCreateNew?: () => void;
};

export function HouseholdSwitcher({ onCreateNew }: HouseholdSwitcherProps) {
  const {
    households,
    currentHouseholdId,
    setCurrentHouseholdId,
    setShowSwitcher,
    members,
    user,
  } = useHouseholdContext();

  const select = (id: string) => {
    setCurrentHouseholdId(id);
    setShowSwitcher(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end z-50 fade-in"
      onClick={() => setShowSwitcher(false)}
    >
      <div
        className="w-full max-w-md mx-auto bg-white rounded-t-3xl slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div
            className="w-10 h-1 rounded-full"
            style={{ background: C.borderStrong }}
          />
        </div>
        <div className="px-5 pb-2">
          <h2 className="text-base font-extrabold" style={{ color: C.text }}>
            가계부 선택
          </h2>
          <p className="text-xs font-medium mt-1" style={{ color: C.textMuted }}>
            관리 중인 가계부 {households.length}개
          </p>
        </div>

        <div className="px-3 py-2 max-h-96 overflow-y-auto">
          {households.map((h) => {
            const hMembers = members[h.id] ?? [];
            const myRole = hMembers.find((m) => m.user_id === user?.id)?.role;
            return (
              <button
                type="button"
                key={h.id}
                onClick={() => select(h.id)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: myRole === "owner" ? C.blueLight : C.purpleLight,
                  }}
                >
                  {myRole === "owner" ? (
                    <Home className="w-5 h-5" style={{ color: C.blue }} />
                  ) : (
                    <Users className="w-5 h-5" style={{ color: C.purple }} />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p
                      className="text-sm font-bold truncate"
                      style={{ color: C.text }}
                    >
                      {h.name}
                    </p>
                    {myRole === "owner" && (
                      <Crown
                        className="w-3 h-3 flex-shrink-0"
                        style={{ color: C.gold }}
                        fill={C.gold}
                      />
                    )}
                  </div>
                  <p
                    className="text-xs font-medium"
                    style={{ color: C.textMuted }}
                  >
                    {myRole === "owner" ? "소유자" : "멤버"} · {hMembers.length}명
                  </p>
                </div>
                {currentHouseholdId === h.id && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: C.blue }}
                  >
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div
          className="px-3 pb-6 pt-2 border-t"
          style={{ borderColor: C.border }}
        >
          <button
            type="button"
            onClick={() => {
              setShowSwitcher(false);
              onCreateNew?.();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: C.bg }}
            >
              <Plus className="w-5 h-5" style={{ color: C.textSub }} />
            </div>
            <span className="text-sm font-bold" style={{ color: C.text }}>
              새 가계부 만들기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
