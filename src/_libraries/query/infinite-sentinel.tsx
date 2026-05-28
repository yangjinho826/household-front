"use client";

import { Center, Loader } from "@mantine/core";
import { useEffect, useRef } from "react";

interface InfiniteSentinelProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  /** 화면 아래 더 일찍 트리거하려면 px. 기본 120 */
  rootMargin?: number;
}

/**
 * 무한 스크롤 sentinel — IntersectionObserver 로 뷰포트 진입 시 onLoadMore 호출.
 *
 * useInfiniteQuery 결과의 fetchNextPage 를 그대로 onLoadMore 로 넘기면 됨.
 */
export function InfiniteSentinel({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  rootMargin = 120,
}: InfiniteSentinelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      { rootMargin: `${rootMargin}px` },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore, rootMargin]);

  if (!hasNextPage) return null;

  return (
    <Center ref={ref} py="md">
      {isFetchingNextPage && <Loader size="sm" />}
    </Center>
  );
}
