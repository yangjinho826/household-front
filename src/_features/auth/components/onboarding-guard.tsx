"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { queryKeys } from "_constants/queries";
import { PageLoader } from "_features/common/components/page-loader";
import { useHouseholdStore } from "_features/household/store";

/**
 * - 가계부 0개 = 신규 가입자 → /onboarding/household 강제 redirect
 * - 가계부 1개+ + onboarding 페이지 → / 로 redirect (반대 가드)
 * - 가계부 1개+ → 첫 가계부 ID 를 zustand store 에 저장 (X-Household-Id 헤더 인터셉터가 사용)
 *
 * Suspense boundary 가 부모에 있어야 함 (useSuspenseQuery).
 * client-only 마운트는 상위 `ClientOnlyShell` 이 보장.
 */
export function OnboardingGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const pathname = usePathname();

  const { data } = useSuspenseQuery(queryKeys.household.list());
  const items = data.body.data.items;
  const count = data.body.data.totalCount ?? items.length;
  const isOnboarding = pathname.includes("/onboarding/household");

  // 첫 가계부 ID 를 store 에 hydrate (X-Household-Id 헤더 자동 첨부용)
  useEffect(() => {
    if (items.length === 0) return;
    const current = useHouseholdStore.getState().currentHouseholdId;
    const exists = items.some((h) => h.householdId === current);
    if (!exists) {
      const first = items[0];
      if (first) {
        useHouseholdStore.setState({ currentHouseholdId: first.householdId });
      }
    }
  }, [items]);

  useEffect(() => {
    if (count === 0 && !isOnboarding) {
      router.replace(`/${params.locale}/onboarding/household`);
      return;
    }
    if (count > 0 && isOnboarding) {
      router.replace(`/${params.locale}`);
    }
  }, [count, isOnboarding, router, params.locale]);

  // redirect 가 effect 단계라 children 이 먼저 마운트되면, 가계부 ID 없는 상태로
  // 자식 페이지의 useSuspenseQuery 들이 호출되어 throw → ErrorBoundary 발동.
  // render 단계에서 미리 차단.
  const shouldRedirect =
    (count === 0 && !isOnboarding) || (count > 0 && isOnboarding);
  if (shouldRedirect) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
