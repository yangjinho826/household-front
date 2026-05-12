"use client";

import {
  Anchor,
  Button,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
      <Stack gap="md">
        <Title order={2}>{t("login_title")}</Title>
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
        <Button type="submit" fullWidth loading={loginMutation.isPending}>
          {t("login_submit")}
        </Button>
        <Anchor component={Link} href="/register" size="sm" ta="center">
          {t("register_link")}
        </Anchor>
      </Stack>
    </form>
  );
}
