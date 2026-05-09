import type { ReactNode } from "react";

import { C } from "_styles/design-tokens";

/**
 * AuthShell — 게스트(비로그인) 영역의 모바일 컨테이너.
 *
 * 책임: 모바일 풀화면 (`max-w-md`) + 흰 배경.
 * 사용처: `app/[locale]/(guest)/layout.tsx` 가 마운트.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="max-w-md mx-auto min-h-screen relative"
      style={{ background: C.card }}
    >
      {children}
    </div>
  );
}
