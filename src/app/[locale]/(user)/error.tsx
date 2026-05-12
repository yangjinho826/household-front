"use client";

import { ErrorFallback } from "_features/common/components/error-fallback";

export default function UserSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorFallback error={error} reset={reset} />;
}
