import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BaseLayout } from "_features/layout/base-layout";
import { routing } from "_libraries/i18n/routing";

export const metadata: Metadata = {
  title: "모음",
  description: "내 자산을 한곳에 — 주식·가계부 관리",
  icons: {
    icon: "/icon.svg",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return <BaseLayout locale={locale}>{children}</BaseLayout>;
}
