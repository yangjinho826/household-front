interface BrandLogoProps {
  /** 박스 한 변 크기 (기본 56) */
  size?: number;
}

/**
 * 가계부 앱 브랜드 마크 — 겹치는 세 원이 중앙 핵으로 수렴(여러 자산이 한곳으로 "모음").
 *
 * 로그인/회원가입/사이드바 등 브랜드 노출 지점에 사용.
 * 형상은 favicon(`public/icon.svg`)·앱 아이콘과 동일 — 바꿀 때 둘 다 갱신할 것.
 */
export default function BrandLogo({ size = 56 }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      role="img"
      aria-label="모음 로고"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="brandBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FAF6EF" />
          <stop offset="1" stopColor="#EFE7D6" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="512" height="512" rx="116" fill="url(#brandBg)" />
      <g>
        <circle cx="194" cy="208" r="98" fill="#7C9473" opacity="0.88" />
        <circle cx="318" cy="208" r="98" fill="#A6B89A" opacity="0.88" />
        <circle cx="256" cy="312" r="98" fill="#D4A95F" opacity="0.88" />
      </g>
      <circle cx="256" cy="244" r="44" fill="#566B4E" />
    </svg>
  );
}
