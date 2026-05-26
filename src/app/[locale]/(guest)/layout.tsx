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
      px="md"
      py="xl"
      bg="white"
      mih="100dvh"
      style={{ marginLeft: "auto", marginRight: "auto" }}
    >
      {children}
    </Container>
  );
}
