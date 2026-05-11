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

interface Tab {
  id: string;
  label: string;
  icon: typeof IconHome;
  href: string;
  match: (pathname: string) => boolean;
}

const TABS: Tab[] = [
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
    href: "/portfolio",
    match: (p) => p.includes("/portfolio"),
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
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 448,
        background: "white",
        borderTop: `1px solid ${theme.colors.gray?.[1] ?? "#E5E8EB"}`,
        zIndex: 30,
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: 64,
        }}
      >
        {TABS.map(({ id, label, icon: Icon, href, match }) => {
          const active = match(pathname);
          const color = active
            ? (theme.colors.tossBlue?.[5] ?? "#3182F6")
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
