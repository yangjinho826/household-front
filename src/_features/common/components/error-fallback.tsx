"use client";

import {
  Button,
  Card,
  Center,
  Stack,
  Text,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect } from "react";

import { ApiResponseError } from "_libraries/fetch/api-response-error";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * App Router error.tsx 공용 폴백.
 * 백엔드 down (502/500) / 네트워크 오류 시 친화적 표시.
 */
export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  useEffect(() => {
    console.error("[ErrorBoundary]", error);
  }, [error]);

  const isApi = error instanceof ApiResponseError;
  const isServerDown = isApi && error.status >= 500;

  const title = isServerDown
    ? "서버에 연결할 수 없습니다"
    : isApi
      ? "요청을 처리하지 못했습니다"
      : "문제가 발생했습니다";

  const description = isServerDown
    ? "잠시 후 다시 시도해주세요."
    : isApi
      ? (error.errorMessage ?? "잠시 후 다시 시도해주세요.")
      : "예기치 못한 오류가 발생했습니다.";

  return (
    <Center mih="60dvh" px="md">
      <Card radius="xl" p="xl" w="100%">
        <Stack gap="md" align="center">
          <IconAlertCircle size={40} color="#F04452" stroke={2} />
          <Stack gap={4} align="center">
            <Text size="md" fw={700}>
              {title}
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              {description}
            </Text>
          </Stack>
          <Button onClick={reset} fullWidth>
            다시 시도
          </Button>
        </Stack>
      </Card>
    </Center>
  );
}
