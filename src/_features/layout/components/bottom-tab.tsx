"use client";

import { Box, UnstyledButton, useMantineTheme } from "@mantine/core";
import {
  IconChartBar,
  IconHome,
  IconTrendingUp,
  IconUser,
  IconWallet,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

export interface Tab {
  id: string;
  label: string;
  icon: typeof IconHome;
  href: string;
  match: (pathname: string) => boolean;
}

export const TABS: Tab[] = [
  {
    id: "home",
    label: "홈",
    icon: IconHome,
    href: "/",
    match: (p) => p === "/" || /^\/[a-z]{2}\/?$/.test(p),
  },
  {
    id: "transactions",
    label: "거래",
    icon: IconWallet,
    href: "/transactions",
    match: (p) => p.includes("/transactions"),
  },
  {
    id: "wealth",
    label: "자산",
    icon: IconChartBar,
    href: "/wealth",
    match: (p) => p.includes("/wealth"),
  },
  {
    id: "portfolio",
    label: "포트폴리오",
    icon: IconTrendingUp,
    href: "/invest",
    match: (p) => p.includes("/invest"),
  },
  {
    id: "settings",
    label: "내정보",
    icon: IconUser,
    href: "/settings",
    match: (p) => p.includes("/settings"),
  },
];

export function BottomTab() {
  const pathname = usePathname();
  const params = useParams<{ locale: string }>();
  const theme = useMantineTheme();

  return (
    <Box
      component="nav"
      hiddenFrom="lg"
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "var(--container-max)",
        background: "white",
        borderTop: `1px solid ${theme.colors.gray?.[1] ?? "#E5E8EB"}`,
        // iOS 홈 인디케이터 / Android 제스처 영역 보호
        paddingBottom: "var(--safe-bottom)",
        paddingLeft: "var(--safe-left)",
        paddingRight: "var(--safe-right)",
        // Drawer/Modal 기본 z-index(200대) 위 — 바텀시트 떠도 메뉴 항상 사용 가능
        zIndex: "var(--z-bottom-tab)" as React.CSSProperties["zIndex"],
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "var(--bottom-tab-h)",
        }}
      >
        {TABS.map(({ id, label, icon: Icon, href, match }) => {
          const active = match(pathname);
          const color = active
            ? (theme.colors.info?.[5] ?? "#3B82F6")
            : (theme.colors.gray?.[5] ?? "#8B95A1");
          return (
            <UnstyledButton
              key={id}
              component={Link}
              href={`/${params.locale}${href === "/" ? "" : href}`}
              prefetch={false}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                height: "100%",
              }}
            >
              <Icon size={20} color={color} stroke={active ? 2.5 : 2} />
              <Box
                component="span"
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color,
                }}
              >
                {label}
              </Box>
            </UnstyledButton>
          );
        })}
      </Box>
    </Box>
  );
}
