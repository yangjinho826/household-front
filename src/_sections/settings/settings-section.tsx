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
import { IconChevronRight, IconLogout } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";

import { useAuthContext } from "_features/auth/context";
import { queryKeys } from "_constants/queries";
import { fmt } from "_utilities/fmt";

export default function SettingsSection() {
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const { user, actions } = useAuthContext();

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
  const currentHousehold = households[0];

  const onLogout = () => {
    actions.logout();
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
              onClick={() =>
                currentHousehold &&
                navTo(`/household/${currentHousehold.householdId}`)
              }
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
                    멤버 {currentHousehold?.memberCount ?? 0}명 · 전체{" "}
                    {households.length}개
                  </Text>
                </Stack>
                <IconChevronRight size={14} color="#8B95A1" />
              </Group>
            </UnstyledButton>
            <SettingsRow label="가계부 관리" onClick={() => navTo("/household")} />
          </Stack>
        </Card>
      </Stack>

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
  onClick,
}: {
  label: string;
  value?: string;
  onClick?: () => void;
}) {
  return (
    <UnstyledButton onClick={onClick} style={{ padding: 12, borderRadius: 12 }}>
      <Group justify="space-between">
        <Text size="sm" fw={500}>
          {label}
        </Text>
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
