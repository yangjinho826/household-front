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
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#265A3A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="가계부" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      {/* 양옆 (데스크탑) bg 는 살짝 어두운 회색 — 모바일 박스를 시각적으로 분리. */}
      <body style={{ background: "#e5e8eb" }}>
        <NextIntlClientProvider messages={messages}>
          <MantineProviders>
            <QueryProvider>
              <SearchParamsProvider>
                {/* 모바일 우선 박스 — 데스크탑에선 가운데 정렬, 양옆 회색 노출.
                    448px 는 bottom-tab.tsx 와 동일 (시각 일관성). */}
                <main
                  style={{
                    margin: "0 auto",
                    width: "100%",
                    maxWidth: "var(--container-max)",
                    minHeight: "100dvh",
                    background: "#f2f4f6",
                  }}
                >
                  {children}
                </main>
              </SearchParamsProvider>
            </QueryProvider>
          </MantineProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
