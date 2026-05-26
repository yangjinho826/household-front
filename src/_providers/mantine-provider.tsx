"use client";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import type { PropsWithChildren } from "react";

import { mantineTheme } from "_styles/mantineTheme";

export function MantineProviders({ children }: PropsWithChildren) {
  return (
    <MantineProvider theme={mantineTheme}>
      <Notifications position="top-center" />
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
}
