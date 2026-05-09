"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { BottomTab } from "_features/layout/components/bottom-tab";
import { HouseholdSwitcher } from "_features/household/components/household-switcher";
import { useHouseholdContext } from "_features/household/context";
import { C } from "_styles/design-tokens";

/**
 * UserShell — 보호된 사용자 영역의 모바일 컨테이너.
 *
 * 책임:
 * - 모바일 풀화면 컨테이너 (`max-w-md`)
 * - BottomTab 5탭 네비게이션
 * - 가계부 전환 모달 (showSwitcher 따라)
 * - 인증 가드 (user 없으면 /login redirect)
 *
 * 사용처: `app/[locale]/(user)/layout.tsx` 의 `<BudgetProvider>` 안에서 마운트.
 */
export function UserShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const { user, showSwitcher } = useHouseholdContext();

  useEffect(() => {
    if (!user) {
      router.replace(`/${params.locale}/login`);
    }
  }, [user, router, params.locale]);

  if (!user) return null;

  return (
    <div
      className="max-w-md mx-auto pb-24 min-h-screen relative fade-in"
      style={{ background: C.bg }}
    >
      {children}
      <BottomTab />
      {showSwitcher && <HouseholdSwitcher />}
    </div>
  );
}
