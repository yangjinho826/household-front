"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { ApiResponseError } from "_libraries/fetch/api-response-error";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              // 401/403 등 인증 에러는 retry 무의미 — 즉시 stop
              if (error instanceof ApiResponseError) {
                if (error.status === 401 || error.status === 403) return false;
              }
              // 그 외 에러는 1회만 retry (default 3회는 부담)
              return failureCount < 1;
            },
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
