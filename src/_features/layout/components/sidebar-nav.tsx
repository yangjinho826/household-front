"use client";

import {
  Box,
  Group,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { queryKeys } from "_constants/queries";
import BrandLogo from "_features/auth/components/brand-logo";
import { HouseholdSwitcher } from "_features/household/components/household-switcher";
import { useHouseholdStore } from "_features/household/store";

import { TABS } from "./bottom-tab";

const WIDTH = 240;

/**
 * SidebarNav — 데스크탑(>=lg=1200) 전용 좌측 세로 nav.
 *
 * - 상단: 가계부 스위처 trigger (HouseholdSwitcher Drawer 연결)
 * - 본문: 4개 탭 (BottomTab 의 TABS 재사용)
 * - 휴대폰/패드(<lg) 에선 display: none (visibleFrom="lg")
 *
 * 데스크탑에선 BottomTab + AppHeader 가 hiddenFrom="lg" 로 숨겨지고
 * 이 컴포넌트가 두 역할 (가계부 스위처 + nav) 통합.
 */
export function SidebarNav() {
  const pathname = usePathname();
  const params = useParams<{ locale: string }>();
  const theme = useMantineTheme();
  const [opened, switcher] = useDisclosure(false);
  const t = useTranslations("nav");
  const th = useTranslations("household");
  const ta = useTranslations("auth");

  const currentId = useHouseholdStore((s) => s.currentHouseholdId);
  const { data: hData } = useSuspenseQuery(queryKeys.household.list());
  const households = hData.body.data.items;
  const currentHousehold =
    households.find((h) => h.householdId === currentId) ?? households[0];

  return (
    <>
      <Box
        component="aside"
        visibleFrom="lg"
        style={{
          width: WIDTH,
          flexShrink: 0,
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
          height: "100dvh",
          borderRight: `1px solid ${theme.colors.gray?.[2] ?? "#DDD5C9"}`,
          padding: "var(--mantine-spacing-md) var(--mantine-spacing-sm)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          background: theme.colors.gray?.[0] ?? "#F7F4EF",
        }}
      >
        {/* 앱 브랜드 마크 */}
        <Group gap={9} px={8} pt={2} pb={20} wrap="nowrap">
          <BrandLogo size={30} />
          <Text className="brand-wordmark" fw={700} style={{ fontSize: 20 }}>
            {ta("brand_name")}
          </Text>
        </Group>

        {/* 가계부 스위처 trigger */}
        <UnstyledButton
          onClick={switcher.open}
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <Stack gap={2}>
            <Group gap={6} wrap="nowrap">
              <Text size="md" fw={800} truncate>
                {currentHousehold?.name ?? th("list_title")}
              </Text>
              <IconChevronDown size={14} color={theme.colors.gray?.[5] ?? "#9C8F82"} />
            </Group>
            {households.length > 1 && (
              <Text size="xs" fw={500} c="dimmed">
                {th("managing", { count: households.length })}
              </Text>
            )}
          </Stack>
        </UnstyledButton>

        {/* 4개 탭 */}
        <Stack gap={2}>
          {TABS.map(({ id, icon: Icon, href, match }) => {
            const active = match(pathname);
            const color = active
              ? (theme.colors.sage?.[6] ?? "#647A5C")
              : (theme.colors.gray?.[6] ?? "#7A6F63");
            return (
              <UnstyledButton
                key={id}
                component={Link}
                href={`/${params.locale}${href === "/" ? "" : href}`}
                prefetch={false}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: active
                    ? (theme.colors.sage?.[1] ?? "#E6EDE2")
                    : "transparent",
                }}
              >
                <Group gap={12} wrap="nowrap">
                  <Icon size={20} color={color} stroke={active ? 2.5 : 2} />
                  <Text size="sm" fw={active ? 700 : 600} c={color}>
                    {t(id)}
                  </Text>
                </Group>
              </UnstyledButton>
            );
          })}
        </Stack>
      </Box>

      <HouseholdSwitcher opened={opened} onClose={switcher.close} />
    </>
  );
}
