"use client";

import { IconWallet } from "@tabler/icons-react";

import { TOKEN } from "_styles/design-tokens";

interface BrandLogoProps {
  /** 박스 한 변 크기 (기본 56) */
  size?: number;
}

/**
 * 가계부 앱 브랜드 로고 — primary 색 배경 + 흰색 IconWallet.
 *
 * 로그인/회원가입/온보딩 등 인증 화면 상단에 사용.
 * IconBox 와 의도가 다름: BrandLogo 는 불투명 100% 색 배경 + 흰 아이콘.
 */
export default function BrandLogo({ size = 56 }: BrandLogoProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.3),
        background: TOKEN.sage,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
      aria-label="가계부 로고"
    >
      <IconWallet size={Math.round(size * 0.5)} color="#FFFFFF" stroke={2.4} />
    </div>
  );
}
