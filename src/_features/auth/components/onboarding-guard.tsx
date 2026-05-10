"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { queryKeys } from "_constants/queries";
import { useHouseholdStore } from "_features/household/store";

/**
 * - 가계부 0개 = 신규 가입자 → /onboarding/household 강제 redirect
 * - 가계부 1개+ + onboarding 페이지 → / 로 redirect (반대 가드)
 * - 가계부 1개+ → 첫 가계부 ID 를 zustand store 에 저장 (X-Household-Id 헤더 인터셉터가 사용)
 *
 * Suspense boundary 가 부모에 있어야 함 (useSuspenseQuery).
 */
export function OnboardingGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const pathname = usePathname();

  // 더 큰 listSize 로 받아서 첫 가계부 ID hydrate (1 만 받으면 totalPages 도 1, 그래도 currentHouseholdId 잡으려면 listSize 충분히)
  const { data } = useSuspenseQuery(
    queryKeys.household.list({ pageNo: 1, listSize: 100 }),
  );
  const items = data.body.data.content;
  const count = data.body.data.totalElements ?? items.length;
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

  return <>{children}</>;
}
