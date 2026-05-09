"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Home,
  TrendingUp,
  User as UserIcon,
  Wallet,
} from "lucide-react";
import { C } from "_styles/design-tokens";

type Tab = {
  id: string;
  label: string;
  icon: typeof Home;
  href: string;
  match: (pathname: string) => boolean;
};

const TABS: Tab[] = [
  {
    id: "home",
    label: "홈",
    icon: Home,
    href: "/",
    match: (p) => p === "/" || /^\/[a-z]{2}$/.test(p),
  },
  {
    id: "transactions",
    label: "거래",
    icon: Wallet,
    href: "/transactions",
    match: (p) => p.includes("/transactions"),
  },
  {
    id: "wealth",
    label: "자산",
    icon: BarChart3,
    href: "/wealth",
    match: (p) => p.includes("/wealth"),
  },
  {
    id: "portfolio",
    label: "포트폴리오",
    icon: TrendingUp,
    href: "/portfolio",
    match: (p) => p.includes("/portfolio"),
  },
  {
    id: "settings",
    label: "내정보",
    icon: UserIcon,
    href: "/settings",
    match: (p) => p.includes("/settings"),
  },
];

export function BottomTab() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t z-30"
      style={{ borderColor: C.borderStrong }}
    >
      <div className="flex justify-around items-center h-16">
        {TABS.map(({ id, label, icon: Icon, href, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={id}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 h-full"
            >
              <Icon
                className="w-5 h-5"
                style={{ color: active ? C.blue : C.textMuted }}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className="text-[10px] font-semibold"
                style={{ color: active ? C.blue : C.textMuted }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
