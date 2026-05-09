"use client";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Fab } from "_features/layout/components/fab";
import { usePortfolioContext } from "_features/portfolio/context";
import { fmt } from "_utilities/fmt";
import { C } from "_styles/design-tokens";

/**
 * 포트폴리오 페이지 — 종목 목록 + FAB.
 */
export function PortfolioList() {
  const { portfolio } = usePortfolioContext();

  const onAdd = () => toast("종목 추가 (구현 예정)");
  const onDetail = (name: string) => toast(`${name} 상세 (구현 예정)`);

  return (
    <>
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold" style={{ color: C.text }}>
            보유 종목 ({portfolio.length})
          </h2>
          <button
            type="button"
            onClick={onAdd}
            className="text-xs font-semibold flex items-center gap-0.5"
            style={{ color: C.purple }}
          >
            <Plus className="w-3 h-3" /> 추가
          </button>
        </div>
        <div className="bg-white rounded-2xl p-2">
          {portfolio.map((p) => {
            const cost = p.quantity * p.avgPrice;
            const pf = p.currentValue - cost;
            const rate = cost ? (pf / cost) * 100 : 0;
            return (
              <button
                type="button"
                key={p.id}
                onClick={() => onDetail(p.name)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: C.text }}
                    >
                      {p.name}
                    </p>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: C.bg, color: C.textMuted }}
                    >
                      {p.broker}
                    </span>
                  </div>
                  <p
                    className="text-xs font-medium"
                    style={{ color: C.textMuted }}
                  >
                    {p.quantity}주
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className="text-sm font-bold tabular-nums"
                    style={{ color: C.text }}
                  >
                    {fmt(p.currentValue)}원
                  </p>
                  <p
                    className="text-xs font-bold tabular-nums"
                    style={{ color: pf >= 0 ? C.red : C.blue }}
                  >
                    {pf >= 0 ? "+" : ""}
                    {rate.toFixed(2)}%
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Fab onClick={onAdd} color={C.purple} />
    </>
  );
}
