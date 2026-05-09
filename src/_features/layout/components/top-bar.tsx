"use client";

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { C } from "_styles/design-tokens";

type TopBarProps = {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
};

export function TopBar({ title, onBack, right }: TopBarProps) {
  const router = useRouter();
  const handleBack = onBack ?? (() => router.back());

  return (
    <div
      className="sticky top-0 bg-white z-20 border-b"
      style={{ borderColor: C.border }}
    >
      <div className="flex items-center justify-between px-4 h-14">
        <button
          type="button"
          onClick={handleBack}
          className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" style={{ color: C.text }} />
        </button>
        <h1 className="text-base font-bold" style={{ color: C.text }}>
          {title}
        </h1>
        <div className="w-10 flex justify-end">{right}</div>
      </div>
    </div>
  );
}
