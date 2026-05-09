"use client";

import { Fab } from "_features/layout/components/fab";
import { useSampleContext } from "_features/sample/context";

/**
 * 샘플 페이지 FAB — 새 샘플 생성 폼 열기.
 */
export function SampleFab() {
  const { openCreateForm } = useSampleContext();
  return <Fab onClick={openCreateForm} />;
}
