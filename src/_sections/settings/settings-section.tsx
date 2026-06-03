"use client";

import {
  Box,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronRight, IconLogout, IconUsers } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";

import { useAuthContext } from "_features/auth/context";
import { HouseholdSwitcher } from "_features/household/components/household-switcher";
import { useHouseholdStore } from "_features/household/store";
import { queryKeys } from "_constants/queries";

export default function SettingsSection() {
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const { user, actions, state } = useAuthContext();
  const [switcherOpened, switcher] = useDisclosure(false);
  const currentId = useHouseholdStore((s) => s.currentHouseholdId);
  const t = useTranslations("settings");
  const th = useTranslations("household");

  // 의식적 예외 — "한 페이지=한 endpoint" 원칙의 예외 1건.
  // household.list 는 가계부 전환 (HouseholdSwitcher) 용 전체 목록이라
  // settings overview (카운트 통계) 와 의미·캐시 수명이 다름. 묶지 않음.
  const { data: hData } = useSuspenseQuery(queryKeys.household.list());
  const { data: overviewRes } = useSuspenseQuery(
    queryKeys.settings.overview(),
  );

  const households = hData.body.data.items;
  const counts = overviewRes.body.data;
  const currentHousehold =
    households.find((h) => h.householdId === currentId) ?? households[0];

  const onLogout = async () => {
    try {
      await actions.logout();
    } catch {
      // 백엔드 호출 실패해도 mutationFn finally 에서 clearSession 실행됨 — 무시
    }
    // 풀 리로드 — (guest) layout 의 SSR 가드가 새 쿠키 상태로 평가되도록
    window.location.replace(`/${routeParams.locale}/login`);
  };

  const navTo = (path: string) =>
    router.push(`/${routeParams.locale}${path}`);

  return (
    <Stack gap="md">
      <Title order={3}>{t("title")}</Title>

      {/* 프로필 Hero — 통계 흡수 */}
      {user && (
        <Card
          p="xl"
          shadow="md"
          style={{
            background:
              "linear-gradient(160deg, var(--mantine-color-sage-0) 0%, var(--mantine-color-gray-0) 62%)",
          }}
        >
          <Group gap="md" wrap="nowrap">
            <Box
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "var(--mantine-color-sage-6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Text size="xl" fw={800} c="white">
                {user.name?.[0] ?? "U"}
              </Text>
            </Box>
            <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
              <Text size="lg" fw={800} truncate>
                {user.name}
              </Text>
              <Text size="xs" c="dimmed" truncate>
                {user.email}
              </Text>
            </Stack>
          </Group>

          <SimpleGrid
            cols={3}
            mt="lg"
            pt="lg"
            style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}
          >
            <Stat value={counts.accountCount} label={t("stat_accounts")} />
            <Stat
              value={counts.transactionCount}
              label={t("stat_transactions")}
            />
            <Stat value={counts.portfolioCount} label={t("stat_portfolios")} />
          </SimpleGrid>
        </Card>
      )}

      {/* 현재 가계부 */}
      <Stack gap={4}>
        <Text size="xs" fw={700} c="dimmed" px={8}>
          {t("current_household")}
        </Text>
        <Card p="xs">
          <Stack gap={0}>
            <UnstyledButton
              onClick={switcher.open}
              style={{ padding: 12, borderRadius: 12 }}
            >
              <Group gap={12}>
                <Box
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "var(--mantine-color-sage-0)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Text size="sm" fw={800} c="sage.6">
                    {currentHousehold?.name?.[0] ?? "H"}
                  </Text>
                </Box>
                <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" fw={700} truncate>
                    {currentHousehold?.name ?? "—"}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {currentHousehold?.role === "OWNER"
                      ? th("member.role_owner")
                      : th("member.role_member")}{" "}
                    · {t("total_count", { count: households.length })}
                  </Text>
                </Stack>
                <Text size="xs" fw={700} c="sage.6">
                  {t("switch")}
                </Text>
              </Group>
            </UnstyledButton>
            <SettingsRow
              label={t("household_manage")}
              onClick={() => navTo("/household")}
            />
            {currentHousehold && (
              <SettingsRow
                label={t("member_manage")}
                icon={IconUsers}
                onClick={() =>
                  navTo(`/household/${currentHousehold.householdId}/members`)
                }
              />
            )}
          </Stack>
        </Card>
      </Stack>

      <HouseholdSwitcher
        opened={switcherOpened}
        onClose={switcher.close}
      />

      {/* 관리 */}
      <Stack gap={4}>
        <Text size="xs" fw={700} c="dimmed" px={8}>
          {t("manage_section")}
        </Text>
        <Card p="xs">
          <Stack gap={0}>
            <SettingsRow
              label={t("category_manage")}
              value={t("count_suffix", { count: counts.categoryCount })}
              onClick={() => navTo("/category")}
            />
            <SettingsRow
              label={t("fixed_manage")}
              value={t("count_suffix", { count: counts.fixedCount })}
              onClick={() => navTo("/fixed")}
            />
            <SettingsRow
              label={t("account_manage")}
              value={t("count_suffix", { count: counts.accountCount })}
              onClick={() => navTo("/account")}
            />
          </Stack>
        </Card>
      </Stack>

      {/* 로그아웃 */}
      <Button
        variant="light"
        color="gray"
        size="md"
        leftSection={<IconLogout size={16} />}
        loading={state.isLoggingOut}
        disabled={state.isLoggingOut}
        onClick={onLogout}
      >
        {t("logout")}
      </Button>
    </Stack>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <Stack gap={2} align="center">
      <Text size="lg" fw={800}>
        {value}
      </Text>
      <Text size="xs" c="dimmed">
        {label}
      </Text>
    </Stack>
  );
}

function SettingsRow({
  label,
  value,
  icon: Icon,
  onClick,
}: {
  label: string;
  value?: string;
  icon?: React.ComponentType<{ size?: string | number; color?: string }>;
  onClick?: () => void;
}) {
  return (
    <UnstyledButton onClick={onClick} style={{ padding: 12, borderRadius: 12 }}>
      <Group justify="space-between">
        <Group gap={8}>
          {Icon && <Icon size={16} color="var(--mantine-color-gray-6)" />}
          <Text size="sm" fw={500}>
            {label}
          </Text>
        </Group>
        <Group gap={4}>
          {value && (
            <Text size="xs" c="dimmed">
              {value}
            </Text>
          )}
          <IconChevronRight size={14} color="var(--mantine-color-gray-5)" />
        </Group>
      </Group>
    </UnstyledButton>
  );
}
