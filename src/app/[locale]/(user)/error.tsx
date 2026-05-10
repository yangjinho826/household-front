"use client";

import { useRouter, useParams } from "next/navigation";

import { useAuthContext } from "_features/auth/context";
import { ErrorFallback } from "_features/common/components/error-fallback";

export default function UserSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const { actions } = useAuthContext();

  const handleLogout = () => {
    actions.logout();
    router.replace(`/${params.locale}/login`);
  };

  return (
    <ErrorFallback
      error={error}
      reset={reset}
      secondaryAction={{ label: "로그아웃", onClick: handleLogout }}
    />
  );
}
