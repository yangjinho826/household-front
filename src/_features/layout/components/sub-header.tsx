"use client";

import { ActionIcon, Group, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface SubHeaderProps {
  /** 페이지 제목 */
  title: string;
  /** true=router.back() 기본, string=router.push(href) */
  back?: true | string;
  /** 우측 액션 슬롯 (ActionIcon, Button 등) */
  right?: ReactNode;
}

/**
 * SubHeader — 풀페이지 sub-route 의 표준 상단.
 *
 * 인라인 `<Group> + <ActionIcon back> + <Title>` 패턴이 9곳에 중복돼 추출.
 * Title `order={4}` (20px, fw=800) 통일 — 토스 페이지 타이틀 표준.
 *
 * 사용:
 *   <SubHeader title="거래 추가" />
 *   <SubHeader title="멤버 관리" back="/settings" />
 *   <SubHeader title={name} right={<ActionIcon onClick={edit}><IconPencil/></ActionIcon>} />
 */
export default function SubHeader({ title, back = true, right }: SubHeaderProps) {
  const router = useRouter();

  const onBack = () => {
    if (typeof back === "string") router.push(back);
    else router.back();
  };

  return (
    <Group
      justify={right ? "space-between" : "flex-start"}
      align="center"
      wrap="nowrap"
    >
      <Group
        gap={4}
        align="center"
        wrap="nowrap"
        style={{ minWidth: 0, flex: right ? undefined : 1 }}
      >
        <ActionIcon variant="subtle" onClick={onBack} aria-label="back">
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title
          order={4}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
          }}
        >
          {title}
        </Title>
      </Group>
      {right}
    </Group>
  );
}
