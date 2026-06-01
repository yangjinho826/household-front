"use client";

import { Stack } from "@mantine/core";
import { useTranslations } from "next-intl";

import SubHeader from "_features/layout/components/sub-header";
import PortfolioForm from "_features/portfolio/components/form";

interface PortfolioFormSectionProps {
  portfolioId?: string;
}

export default function PortfolioFormSection({
  portfolioId,
}: PortfolioFormSectionProps) {
  const t = useTranslations("portfolio");
  const isUpdate = Boolean(portfolioId);

  return (
    <Stack gap="md">
      <SubHeader
        title={isUpdate ? t("form_update_title") : t("form_create_title")}
      />
      <PortfolioForm portfolioId={portfolioId} />
    </Stack>
  );
}
