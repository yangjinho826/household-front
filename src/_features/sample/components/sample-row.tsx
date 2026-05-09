"use client";

import { ChevronRight } from "lucide-react";

import { C } from "_styles/design-tokens";
import type { Sample } from "../types";

type SampleRowProps = {
  sample: Sample;
  onClick: () => void;
};

export function SampleRow({ sample, onClick }: SampleRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 text-left"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate" style={{ color: C.text }}>
          {sample.title}
        </p>
        <p
          className="text-xs mt-0.5 truncate"
          style={{ color: C.textMuted }}
        >
          {sample.description}
        </p>
        <p
          className="text-[10px] mt-1 font-medium tabular-nums"
          style={{ color: C.textMuted }}
        >
          {sample.createdAt}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: C.textMuted }} />
    </button>
  );
}
