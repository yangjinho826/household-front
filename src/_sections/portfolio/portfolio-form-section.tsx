"use client";

import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import PortfolioForm from "_features/portfolio/components/form";

interface PortfolioFormSectionProps {
  portfolioId?: string;
}

export default function PortfolioFormSection({
  portfolioId,
}: PortfolioFormSectionProps) {
  const t = useTranslations("portfolio");
  const router = useRouter();
  const isUpdate = Boolean(portfolioId);

  return (
    <Stack gap="md">
      <Group align="center">
        <ActionIcon
          variant="subtle"
          onClick={() => router.back()}
          aria-label="back"
        >
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title order={4}>
          {isUpdate ? t("form_update_title") : t("form_create_title")}
        </Title>
      </Group>

      <PortfolioForm portfolioId={portfolioId} />
    </Stack>
  );
}
