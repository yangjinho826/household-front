"use client";

import { Plus } from "lucide-react";
import { C } from "_styles/design-tokens";

type FabProps = {
  onClick: () => void;
  color?: string;
};

export function Fab({ onClick, color = C.blue }: FabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-24 right-1/2 translate-x-[200px] w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-40"
      style={{ background: color, boxShadow: `0 8px 20px ${color}66` }}
    >
      <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
    </button>
  );
}
