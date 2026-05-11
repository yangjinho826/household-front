"use client";

import {
  ActionIcon,
  Button,
  Card,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconArrowLeft,
  IconCrown,
  IconSearch,
  IconTrash,
  IconUserPlus,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

import { GetUserSearchByEmailApi } from "_features/auth/api";
import { useHouseholdMutations } from "_features/household/queries/use-mutations";
import { queryKeys } from "_constants/queries";
import { ApiResponseError } from "_libraries/fetch/api-response-error";
import { getErrorMessage } from "_libraries/fetch/error-message";
import { useTranslations } from "next-intl";

interface MembersSectionProps {
  householdId: string;
}

export default function MembersSection({ householdId }: MembersSectionProps) {
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const te = useTranslations("error");

  const { data: hData } = useSuspenseQuery(
    queryKeys.household.detail(householdId),
  );
  const { data: mData } = useSuspenseQuery(
    queryKeys.household.members(householdId),
  );

  const household = hData.body.data;
  const members = mData.body.data.content;
  const isOwner = household.role === "OWNER";

  const { addMemberMutation, removeMemberMutation } = useHouseholdMutations();

  const [email, setEmail] = useState("");
  const [searching, setSearching] = useState(false);

  const handleInvite = async () => {
    const target = email.trim();
    if (!target) return;

    setSearching(true);
    try {
      // 이메일로 user 검색
      const userRes = await GetUserSearchByEmailApi(target);
      const user = userRes.body.data;

      // 멤버 추가
      await addMemberMutation.mutateAsync({
        householdId,
        userId: user.id,
        role: "MEMBER",
      });

      notifications.show({
        title: "초대 완료",
        message: `${user.name} (${user.email}) 님을 추가했습니다`,
        color: "green",
      });
      setEmail("");
    } catch (error) {
      // 미가입 이메일 → 백엔드 NOT_FOUND (CM004)
      let message = getErrorMessage(error, te);
      if (error instanceof ApiResponseError && error.errorCode === "CM004") {
        message = "해당 이메일로 가입된 사용자가 없습니다";
      }
      notifications.show({
        title: "초대 실패",
        message,
        color: "red",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleRemove = async (memberId: string, memberName: string) => {
    if (!confirm(`${memberName} 님을 가계부에서 제거할까요?`)) return;
    try {
      await removeMemberMutation.mutateAsync({ householdId, memberId });
      notifications.show({
        title: "제거 완료",
        message: `${memberName} 님을 제거했습니다`,
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "제거 실패",
        message: getErrorMessage(error, te),
        color: "red",
      });
    }
  };

  return (
    <Stack gap="md">
      <Group gap={8}>
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() =>
            router.push(`/${routeParams.locale}/settings`)
          }
          aria-label="back"
        >
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title order={3}>멤버 관리</Title>
      </Group>

      <Text size="xs" c="dimmed" px={4}>
        {household.name} · 멤버 {members.length}명
      </Text>

      {/* 멤버 초대 — owner 만 */}
      {isOwner && (
        <Card radius="lg">
          <Stack gap="sm">
            <Text size="sm" fw={700}>
              멤버 초대
            </Text>
            <Text size="xs" c="dimmed">
              가입한 사용자의 이메일을 입력해주세요
            </Text>
            <Group gap={8} wrap="nowrap">
              <TextInput
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                placeholder="email@example.com"
                type="email"
                leftSection={<IconSearch size={14} />}
                style={{ flex: 1 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleInvite();
                }}
              />
              <Button
                leftSection={<IconUserPlus size={14} />}
                onClick={handleInvite}
                loading={searching || addMemberMutation.isPending}
                disabled={!email.trim()}
              >
                초대
              </Button>
            </Group>
          </Stack>
        </Card>
      )}

      {/* 멤버 리스트 */}
      <Card radius="lg" p="xs">
        <Stack gap={0}>
          {members.map((m) => {
            const isMemberOwner = m.role === "OWNER";
            const canRemove = isOwner && !isMemberOwner;
            return (
              <Group
                key={m.memberId}
                gap={12}
                wrap="nowrap"
                style={{ padding: 12 }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    background: isMemberOwner
                      ? "var(--mantine-color-tossBlue-0)"
                      : "var(--mantine-color-gray-1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Text
                    size="sm"
                    fw={800}
                    c={isMemberOwner ? "tossBlue.5" : undefined}
                  >
                    {m.userName?.[0] ?? "?"}
                  </Text>
                </div>
                <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                  <Group gap={6} wrap="nowrap">
                    <Text size="sm" fw={700} truncate>
                      {m.userName ?? "(이름 없음)"}
                    </Text>
                    {isMemberOwner && (
                      <IconCrown
                        size={12}
                        color="#F59E0B"
                        fill="#F59E0B"
                        style={{ flexShrink: 0 }}
                      />
                    )}
                  </Group>
                  <Text size="xs" c="dimmed" truncate>
                    {m.userEmail ?? "—"}
                  </Text>
                </Stack>
                {canRemove ? (
                  <UnstyledButton
                    onClick={() =>
                      handleRemove(m.memberId, m.userName ?? "이 멤버")
                    }
                    style={{ padding: 6, borderRadius: 8 }}
                  >
                    <IconTrash size={16} color="#F04452" />
                  </UnstyledButton>
                ) : (
                  <Text size="10px" fw={700} c="dimmed">
                    {isMemberOwner ? "소유자" : "멤버"}
                  </Text>
                )}
              </Group>
            );
          })}
        </Stack>
      </Card>
    </Stack>
  );
}
