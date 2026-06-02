"use client";

import {
  ActionIcon,
  Group,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconSettings } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams, usePathname, useRouter } from "next/navigation";

import { queryKeys } from "_constants/queries";
import { HouseholdSwitcher } from "_features/household/components/household-switcher";
import { useHouseholdStore } from "_features/household/store";

/**
 * 전역 상단 헤더 — UserShell 의 sticky 영역.
 *
 * 좌측: 가계부 스위처 trigger (가계부 이름 + 화살표 + 멤버 수 badge)
 * 우측: 설정 빠른 링크 (현재 위치가 /settings 이면 숨김)
 */
export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ locale: string }>();
  const currentId = useHouseholdStore((s) => s.currentHouseholdId);
  const [opened, switcher] = useDisclosure(false);
  const t = useTranslations("household");

  const { data: hData } = useSuspenseQuery(queryKeys.household.list());
  const households = hData.body.data.items;
  const currentHousehold =
    households.find((h) => h.householdId === currentId) ?? households[0];

  const isSettings = pathname?.endsWith("/settings");

  return (
    <>
      <Group
        justify="space-between"
        align="center"
        wrap="nowrap"
        hiddenFrom="lg"
        px="md"
        pb="xs"
        bg="gray.0"
        style={{
          position: "sticky",
          top: 0,
          zIndex: "var(--z-app-header)" as React.CSSProperties["zIndex"],
          // 노치/상태바 영역 흡수 — paddingTop 으로 콘텐츠가 노치 아래로 내려옴
          paddingTop: "calc(var(--safe-top) + var(--mantine-spacing-xs))",
          minHeight: "calc(var(--app-header-h) + var(--safe-top))",
          borderBottom: "1px solid var(--mantine-color-gray-2)",
          marginLeft: "calc(var(--mantine-spacing-md) * -1)",
          marginRight: "calc(var(--mantine-spacing-md) * -1)",
          marginTop: "calc(var(--mantine-spacing-xl) * -1)",
        }}
      >
        <UnstyledButton
          onClick={switcher.open}
          style={{ padding: "4px 8px", borderRadius: 12, minWidth: 0, flex: 1 }}
        >
          <Group gap={6} wrap="nowrap">
            <Text size="lg" fw={800} truncate>
              {currentHousehold?.name ?? t("list_title")}
            </Text>
            <IconChevronDown size={16} color="var(--mantine-color-gray-5)" />
            {households.length > 1 && (
              <Text
                size="10px"
                fw={700}
                c="dimmed"
                px={6}
                py={2}
                style={{
                  background: "var(--mantine-color-gray-1)",
                  borderRadius: 999,
                }}
              >
                {households.length}
              </Text>
            )}
          </Group>
        </UnstyledButton>

        {!isSettings && (
          <Tooltip label="설정" withArrow position="bottom">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              radius="xl"
              onClick={() => router.push(`/${params.locale}/settings`)}
              aria-label="설정"
            >
              <IconSettings size={20} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>

      <HouseholdSwitcher opened={opened} onClose={switcher.close} />
    </>
  );
}
