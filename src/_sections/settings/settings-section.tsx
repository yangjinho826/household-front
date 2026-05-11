"use client";

import {
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
import { useRouter, useParams } from "next/navigation";

import { useAuthContext } from "_features/auth/context";
import { HouseholdSwitcher } from "_features/household/components/household-switcher";
import { useHouseholdStore } from "_features/household/store";
import { queryKeys } from "_constants/queries";
import { fmt } from "_utilities/fmt";

export default function SettingsSection() {
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const { user, actions } = useAuthContext();
  const [switcherOpened, switcher] = useDisclosure(false);
  const currentId = useHouseholdStore((s) => s.currentHouseholdId);

  const { data: hData } = useSuspenseQuery(
    queryKeys.household.list({ pageNo: 1, listSize: 100 }),
  );
  const { data: aData } = useSuspenseQuery(
    queryKeys.account.list({ pageNo: 1, listSize: 100 }),
  );
  const { data: cData } = useSuspenseQuery(
    queryKeys.category.list({ pageNo: 1, listSize: 100 }),
  );
  const { data: fData } = useSuspenseQuery(
    queryKeys.fixed.list({ pageNo: 1, listSize: 100 }),
  );
  const { data: tData } = useSuspenseQuery(
    queryKeys.transaction.list({ pageNo: 1, listSize: 100 }),
  );
  const { data: pData } = useSuspenseQuery(
    queryKeys.portfolio.list({ pageNo: 1, listSize: 100 }),
  );

  const households = hData.body.data.content;
  const accounts = aData.body.data.content;
  const categories = cData.body.data.content;
  const fixedItems = fData.body.data.content;
  const txns = tData.body.data.content;
  const portfolio = pData.body.data.content;
  const totalFixed = fixedItems.reduce((sum, f) => sum + f.amount, 0);
  const currentHousehold =
    households.find((h) => h.householdId === currentId) ?? households[0];

  const onLogout = () => {
    actions.logout();
    // logoutMutation 의 mutationFn 이 finally 에서 clearSession 호출 — 즉시 redirect 안전
    router.replace(`/${routeParams.locale}/login`);
  };

  const navTo = (path: string) =>
    router.push(`/${routeParams.locale}${path}`);

  return (
    <Stack gap="md">
      <Title order={3}>내정보</Title>

      {/* 사용자 카드 */}
      {user && (
        <Card radius="lg" p="md">
          <Group gap="md">
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                background: "var(--mantine-color-tossBlue-0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Text size="xl" fw={800} c="tossBlue.5">
                {user.name?.[0] ?? "U"}
              </Text>
            </div>
            <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
              <Text fw={700} truncate>
                {user.name}
              </Text>
              <Text size="xs" c="dimmed" truncate>
                {user.email}
              </Text>
            </Stack>
          </Group>
        </Card>
      )}

      {/* 현재 가계부 */}
      <Stack gap={4}>
        <Text size="xs" fw={700} c="dimmed" px={8}>
          현재 가계부
        </Text>
        <Card radius="lg" p="xs">
          <Stack gap={0}>
            <UnstyledButton
              onClick={switcher.open}
              style={{ padding: 12, borderRadius: 12 }}
            >
              <Group gap={12}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "var(--mantine-color-tossBlue-0)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Text size="sm" fw={800} c="tossBlue.5">
                    {currentHousehold?.name?.[0] ?? "H"}
                  </Text>
                </div>
                <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" fw={700} truncate>
                    {currentHousehold?.name ?? "—"}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {currentHousehold?.role === "OWNER" ? "소유자" : "멤버"} ·
                    전체 {households.length}개
                  </Text>
                </Stack>
                <Text size="xs" fw={700} c="tossBlue.5">
                  전환
                </Text>
              </Group>
            </UnstyledButton>
            <SettingsRow label="가계부 관리" onClick={() => navTo("/household")} />
            {currentHousehold && (
              <SettingsRow
                label="멤버 관리"
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

      {/* 통계 */}
      <SimpleGrid cols={3} spacing="sm">
        <Card radius="lg" p="sm" ta="center">
          <Text size="lg" fw={800}>
            {accounts.length}
          </Text>
          <Text size="10px" fw={500} c="dimmed">
            통장
          </Text>
        </Card>
        <Card radius="lg" p="sm" ta="center">
          <Text size="lg" fw={800}>
            {txns.length}
          </Text>
          <Text size="10px" fw={500} c="dimmed">
            거래
          </Text>
        </Card>
        <Card radius="lg" p="sm" ta="center">
          <Text size="lg" fw={800}>
            {portfolio.length}
          </Text>
          <Text size="10px" fw={500} c="dimmed">
            종목
          </Text>
        </Card>
      </SimpleGrid>

      {/* 데이터 관리 */}
      <Stack gap={4}>
        <Text size="xs" fw={700} c="dimmed" px={8}>
          관리
        </Text>
        <Card radius="lg" p="xs">
          <Stack gap={0}>
            <SettingsRow
              label="카테고리 관리"
              value={`${categories.length}개`}
              onClick={() => navTo("/category")}
            />
            <SettingsRow
              label="고정지출 관리"
              value={`월 ${fmt(totalFixed)}원`}
              onClick={() => navTo("/fixed")}
            />
            <SettingsRow
              label="통장 관리"
              value={`${accounts.length}개`}
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
        onClick={onLogout}
      >
        로그아웃
      </Button>
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
          {Icon && <Icon size={16} color="#4E5968" />}
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
          <IconChevronRight size={14} color="#8B95A1" />
        </Group>
      </Group>
    </UnstyledButton>
  );
}
