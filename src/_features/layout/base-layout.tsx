import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

import { Toaster } from "_libraries/ui/sonner";
import { QueryProvider } from "_providers/query-provider";

/**
 * BaseLayout — `<html><body>` + 글로벌 Provider 통합.
 *
 * `app/[locale]/layout.tsx` 가 1줄로 마운트.
 * 글로벌(NextIntl, Query, Toaster) 만 여기. 도메인 Provider 는 각 (group)/layout 또는 section 안에서.
 */
export function BaseLayout({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <QueryProvider>{children}</QueryProvider>
          <Toaster position="top-center" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
