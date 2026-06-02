import { Container } from "@mantine/core";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { hasRefreshCookie } from "_libraries/auth/guard";

export default async function GuestLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (await hasRefreshCookie()) {
    redirect(`/${params.locale}`);
  }

  return (
    <Container
      size={448}
      px={0}
      mih="100dvh"
      style={{
        marginInline: "auto",
        display: "flex",
        flexDirection: "column",
        // 개선 B — 상단 따뜻한 그라데이션 → 본문 크림으로 페이드. hero/카드는 자체 패딩.
        background: "linear-gradient(180deg, #F3E6DA 0%, #FAF6EF 38%)",
      }}
    >
      {children}
    </Container>
  );
}
