"use client";

import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Stack,
  Text,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { ApiResponseError } from "_libraries/fetch/api-response-error";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * App Router error.tsx 공용 폴백.
 * 백엔드 down (502/500) / 네트워크 오류 시 친화적 표시.
 *
 * position: fixed 로 viewport 전체 덮음 — 어느 error boundary 가 잡든
 * (UserShell 안에 들어가도) AppHeader / BottomTab 까지 가리고 로그인 화면처럼
 * 단독 모바일 화면으로 표시.
 */
export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  const queryClient = useQueryClient();
  const t = useTranslations("error");

  useEffect(() => {
    console.error("[ErrorBoundary]", error);
  }, [error]);

  const isApi = error instanceof ApiResponseError;
  const isServerDown = isApi && error.status >= 500;

  const title = isServerDown
    ? t("fallback_server_down")
    : isApi
      ? t("fallback_api")
      : t("fallback_generic");

  const description = isServerDown
    ? t("fallback_retry_later")
    : isApi
      ? (error.errorMessage ?? t("fallback_retry_later"))
      : t("fallback_unexpected");

  return (
    <Box
      pos="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="gray.0"
      style={{ zIndex: 1000, overflow: "auto" }}
    >
      <Container size={448} bg="white" mih="100dvh" px="md">
        <Center mih="100dvh">
          <Card radius="xl" p="xl" w="100%" bg="white">
            <Stack gap="md" align="center">
              <IconAlertCircle size={40} color="#EF4444" stroke={2} />
              <Stack gap={4} align="center">
                <Text size="md" fw={700}>
                  {title}
                </Text>
                <Text size="sm" c="dimmed" ta="center">
                  {description}
                </Text>
              </Stack>
              <Button
                onClick={() => {
                  // 캐시된 에러 query state 를 비워야 재마운트 시 fresh fetch.
                  // reset() 만으로는 TanStack Query 캐시가 그대로라 같은 에러 재현됨.
                  queryClient.resetQueries();
                  reset();
                }}
                fullWidth
              >
                {t("fallback_retry")}
              </Button>
            </Stack>
          </Card>
        </Center>
      </Container>
    </Box>
  );
}
