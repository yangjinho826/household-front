import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "_libraries/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const LOCALES = routing.locales.join("|");

// 트랙② IA 재편: 포트폴리오 라우트를 invest 네임스페이스로 이동. 레거시 deep-link 흡수.
// localePrefix=always 라 모든 경로에 /ko·/en prefix 가 붙음 → prefix 포함해 매칭.
const LEGACY_PORTFOLIO = new RegExp(`^/(${LOCALES})/portfolio(/.*)?$`);
const LEGACY_WEALTH_SUB = new RegExp(`^/(${LOCALES})/wealth/(account|portfolio)(/.*)?$`);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const portfolio = pathname.match(LEGACY_PORTFOLIO);
  if (portfolio) {
    const url = request.nextUrl.clone();
    url.pathname = `/${portfolio[1]}/invest${portfolio[2] ?? ""}`;
    return NextResponse.redirect(url, 308);
  }

  const wealthSub = pathname.match(LEGACY_WEALTH_SUB);
  if (wealthSub) {
    const url = request.nextUrl.clone();
    url.pathname = `/${wealthSub[1]}/invest/${wealthSub[2]}${wealthSub[3] ?? ""}`;
    return NextResponse.redirect(url, 308);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|_reference|.*\\..*).*)"],
};
