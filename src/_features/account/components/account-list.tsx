"use client";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useAccountContext } from "_features/account/context";
import { Fab } from "_features/layout/components/fab";
import { fmt } from "_utilities/fmt";
import { getCategoryIcon } from "_utilities/icons";
import { C } from "_styles/design-tokens";

/**
 * 자산 페이지 — 통장 목록 + FAB.
 */
export function AccountList() {
  const { accounts } = useAccountContext();

  const onAdd = () => toast("통장 추가 (구현 예정)");
  const onDetail = (name: string) => toast(`${name} 상세 (구현 예정)`);

  return (
    <>
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold" style={{ color: C.text }}>
            통장 ({accounts.length})
          </h2>
          <button
            type="button"
            onClick={onAdd}
            className="text-xs font-semibold flex items-center gap-0.5"
            style={{ color: C.blue }}
          >
            <Plus className="w-3 h-3" /> 추가
          </button>
        </div>
        <div className="bg-white rounded-2xl p-2">
          {accounts.map((a) => {
            const Icon = getCategoryIcon(a.icon);
            return (
              <button
                type="button"
                key={a.id}
                onClick={() => onDetail(a.name)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-left"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: a.color + "20" }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: a.color }}
                    strokeWidth={2.2}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: C.text }}
                  >
                    {a.name}
                  </p>
                  <p
                    className="text-[10px] font-medium"
                    style={{ color: C.textMuted }}
                  >
                    {a.type}
                  </p>
                </div>
                <p
                  className="text-sm font-bold tabular-nums flex-shrink-0"
                  style={{ color: C.text }}
                >
                  {fmt(a.balance)}원
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <Fab onClick={onAdd} />
    </>
  );
}
