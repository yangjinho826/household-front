/* eslint-disable @next/next/no-head-element */
import { ColorSchemeScript } from "@mantine/core";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { ReactNode } from "react";

import { MantineProviders } from "_providers/mantine-provider";
import { QueryProvider } from "_providers/query-provider";
import { SearchParamsProvider } from "_providers/search-params-provider";

/**
 * BaseLayout — `<html><body>` + 글로벌 Provider 통합.
 *
 * Provider 순서 (bims 동일):
 * NextIntl → Mantine(+Modals+Notifications) → ReactQuery → SearchParams(nuqs)
 *
 * `data-mantine-color-scheme="light"` 로 light-only 강제.
 */
export async function BaseLayout({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} data-mantine-color-scheme="light">
      <head>
        <ColorSchemeScript />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        {/* 브랜드 워드마크 전용 세리프 (Noto Serif KR) — 로고/브랜드명에만 사용 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@600;700&display=swap"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="가계부" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      {/* 양옆 bg 는 살짝 어두운 회색 — 박스를 시각적으로 분리.
          박스 max-width / bg / minHeight 는 각 layout (UserShell / GuestLayout) 책임. */}
      <body style={{ background: "#e5e8eb" }}>
        <NextIntlClientProvider messages={messages}>
          <MantineProviders>
            <QueryProvider>
              <SearchParamsProvider>{children}</SearchParamsProvider>
            </QueryProvider>
          </MantineProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
