"use client";

import { useSampleContext } from "_features/sample/context";

import { SampleForm } from "./sample-form";

/**
 * SampleForm 의 마운트 wrapper — isFormOpen 일 때만 렌더 + key 로 재마운트.
 */
export function SampleFormModal() {
  const { isFormOpen, editingSample } = useSampleContext();
  if (!isFormOpen) return null;
  return <SampleForm key={editingSample?.id ?? "new"} />;
}
