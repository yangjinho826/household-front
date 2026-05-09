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
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body style={{ background: "#f2f4f6" }}>
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
