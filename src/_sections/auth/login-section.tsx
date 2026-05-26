"use client";

import {
  // Anchor,  // 회원가입 링크 차단 시 미사용 — 재오픈 시 주석 풀기
  Button,
  // Group,   // 회원가입 링크 차단 시 미사용
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
// import Link from "next/link";  // 회원가입 링크 차단 시 미사용
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import BrandLogo from "_features/auth/components/brand-logo";
import { useAuthMutations } from "_features/auth/queries/use-mutations";

export default function LoginSection() {
  const t = useTranslations("auth");
  const tg = useTranslations("general.common");
  const router = useRouter();
  const params = useParams<{ locale: string }>();

  const { loginMutation } = useAuthMutations({
    onLoginError: (error) => {
      notifications.show({
        title: tg("notificationstitle"),
        message: error.errorMessage ?? t("login_failed"),
        color: "red",
      });
    },
  });

  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: {
      email: isEmail(t("email_format_message")),
      password: isNotEmpty(t("password_required_message")),
    },
  });

  const onSubmit = form.onSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync(values);
      notifications.show({
        title: tg("notificationstitle"),
        message: t("login_success"),
        color: "green",
      });
      router.push(`/${params.locale}`);
    } catch {
      // onLoginError 에서 처리됨
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="xl">
        <Stack gap="md">
          <BrandLogo />
          <Stack gap={4}>
            <Title
              order={2}
              fw={800}
              style={{
                whiteSpace: "pre-line",
                lineHeight: 1.3,
                fontSize: 32,
              }}
            >
              {t("welcome_title")}
            </Title>
            <Text size="sm" c="dimmed">
              {t("welcome_subtitle")}
            </Text>
          </Stack>
        </Stack>

        <Stack gap="sm">
          <TextInput
            {...form.getInputProps("email")}
            label={t("email")}
            placeholder={t("email_placeholder")}
          />
          <PasswordInput
            {...form.getInputProps("password")}
            label={t("password")}
            placeholder={t("password_placeholder")}
          />
        </Stack>

        <Stack gap="sm">
          <Button
            type="submit"
            fullWidth
            size="lg"
            radius="md"
            fw={700}
            loading={loginMutation.isPending}
          >
            {t("login_submit")}
          </Button>
          {/*
            회원가입 진입점 — 베타 단계에서 차단. 재오픈 시 주석만 풀면 됨.
            <Group justify="center" gap={6}>
              <Text size="xs" c="dimmed">
                {t("register_prompt")}
              </Text>
              <Anchor
                component={Link}
                href={`/${params.locale}/register`}
                size="xs"
                fw={700}
              >
                {t("register_link")}
              </Anchor>
            </Group>
          */}
        </Stack>
      </Stack>
    </form>
  );
}
