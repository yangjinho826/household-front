"use client";

import { Center, Loader } from "@mantine/core";
import { useSyncExternalStore, type ReactNode } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * 자식 트리 전체를 client hydrate 후에만 마운트.
 *
 * 보호 라우트의 useSuspenseQuery 가 영원-pending promise(`api-fetch.ts` SSR 가드)
 * 를 throw 하면 React 18 streaming SSR 이 stream 을 닫지 않아 nginx 60초 후 504.
 * SSR 단계엔 Loader 만 송출, hydrate 후 children 마운트로 회로 차단.
 *
 * 보호 라우트라 SEO 영향 없음.
 */
export function ClientOnlyShell({ children }: { children: ReactNode }) {
  const isClient = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (!isClient) {
    return (
      <Center mih="100dvh">
        <Loader />
      </Center>
    );
  }

  return <>{children}</>;
}
