import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Container,
  createTheme,
  type MantineColorsTuple,
  Modal,
  Notification,
  NumberInput,
  PasswordInput,
  rem,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";

// ============================================================
// 색상 시스템 — Warm Ledger (DESIGN.md)
// 브랜드 = sage. 의미색 = info(수입)/danger(지출)/positive(양수·수익)/warning(주의)/purple(투자).
// ============================================================

// sage — Warm Ledger 브랜드 (primary)
const sage: MantineColorsTuple = [
  "#F4F7F2",
  "#E6EDE2",
  "#CDDBC6",
  "#AFC4A4",
  "#93AC85",
  "#7C9473",
  "#647A5C",
  "#4F6149",
  "#3D4B39",
  "#2C3629",
];

// terracotta — Warm Ledger accent
const terracotta: MantineColorsTuple = [
  "#FCF4EF",
  "#F7E3D9",
  "#EFCBB8",
  "#E7B097",
  "#E5B197",
  "#D98E73",
  "#C2674A",
  "#A4543B",
  "#83432F",
  "#5F3122",
];

// positive — 양수/수익/상승/적립 (구 linerGreen #22C55E 대체)
const positive: MantineColorsTuple = [
  "#E7F3EC",
  "#C6E3D2",
  "#9FCFB2",
  "#73B88E",
  "#4E9F70",
  "#2F855A",
  "#266E4A",
  "#1F5A3D",
  "#184430",
  "#102E20",
];

// danger — Tailwind red (지출/위험)
const danger: MantineColorsTuple = [
  "#FEF2F2",
  "#FEE2E2",
  "#FECACA",
  "#FCA5A5",
  "#F87171",
  "#EF4444",
  "#DC2626",
  "#B91C1C",
  "#991B1B",
  "#7F1D1D",
];

// warning — Tailwind amber (주의/임박)
const warning: MantineColorsTuple = [
  "#FFFBEB",
  "#FEF3C7",
  "#FDE68A",
  "#FCD34D",
  "#FBBF24",
  "#F59E0B",
  "#D97706",
  "#B45309",
  "#92400E",
  "#78350F",
];

// info — Tailwind blue (수입/안내)
const info: MantineColorsTuple = [
  "#EFF6FF",
  "#DBEAFE",
  "#BFDBFE",
  "#93C5FD",
  "#60A5FA",
  "#3B82F6",
  "#2563EB",
  "#1D4ED8",
  "#1E40AF",
  "#1E3A8A",
];

// purple — Tailwind violet (보조 강조 / 포트폴리오)
const purple: MantineColorsTuple = [
  "#F5F3FF",
  "#EDE9FE",
  "#DDD6FE",
  "#C4B5FD",
  "#A78BFA",
  "#8B5CF6",
  "#7C3AED",
  "#6D28D9",
  "#5B21B6",
  "#4C1D95",
];

// 회색 9단계 — 웜그레이 (베이지끼, Warm Ledger)
const grayScale: MantineColorsTuple = [
  "#F7F4EF",
  "#EDE8E0",
  "#DDD5C9",
  "#C3B9A9",
  "#A99C8D",
  "#9C8F82",
  "#7A6F63",
  "#5A5149",
  "#423B34",
  "#3C3530",
];

export const mantineTheme = createTheme({
  // primary = sage (브랜드). 수입 등 의미색은 c="info" 명시로 분리 (브랜드색 ≠ 의미색).
  primaryColor: "sage",
  primaryShade: { light: 6, dark: 4 },
  autoContrast: true,

  fontFamily:
    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  fontFamilyMonospace:
    '"SF Mono", Pretendard, ui-monospace, Menlo, monospace',
  defaultRadius: "xl",

  colors: {
    sage,
    terracotta,
    positive,
    danger,
    warning,
    info,
    purple,
    gray: grayScale,
  },

  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(12),
    lg: rem(16),
    xl: rem(24),
    "2xl": rem(32),
    "3xl": rem(48),
    "4xl": rem(64),
  },

  radius: {
    xs: rem(2),
    sm: rem(4),
    md: rem(8),
    lg: rem(12),
    xl: rem(16),
    "2xl": rem(20),
    "3xl": rem(24),
    full: rem(9999),
  },

  // 갈색 톤 그림자 — 종이 질감 (Warm Ledger)
  shadows: {
    xs: "0 1px 2px rgba(120, 100, 70, 0.04)",
    sm: "0 2px 6px rgba(120, 100, 70, 0.06)",
    md: "0 6px 16px rgba(120, 100, 70, 0.08)",
    lg: "0 12px 28px rgba(120, 100, 70, 0.10)",
    xl: "0 20px 40px rgba(120, 100, 70, 0.12)",
  },

  fontSizes: {
    xs: rem(12),
    sm: rem(13),
    md: rem(16),
    lg: rem(20),
    xl: rem(28),
  },

  lineHeights: {
    xs: "1.4",
    sm: "1.5",
    md: "1.5",
    lg: "1.4",
    xl: "1.35",
  },

  headings: {
    fontFamily: "Pretendard, sans-serif",
    fontWeight: "700",
    sizes: {
      h1: { fontSize: rem(40), lineHeight: "1.2", fontWeight: "700" },
      h2: { fontSize: rem(32), lineHeight: "1.3", fontWeight: "700" },
      h3: { fontSize: rem(24), lineHeight: "1.35", fontWeight: "600" },
      h4: { fontSize: rem(20), lineHeight: "1.4", fontWeight: "600" },
    },
  },

  components: {
    Button: Button.extend({
      defaultProps: {
        radius: "full",
        size: "md",
      },
      // Mantine v8 vars 콜백 — size별 정확한 픽셀 강제 (36/44/52)
      vars: (_theme, props) => {
        const sizes = {
          sm: { h: rem(36), px: rem(16), fz: rem(13) },
          md: { h: rem(44), px: rem(20), fz: rem(16) },
          lg: { h: rem(52), px: rem(24), fz: rem(16) },
        } as const;
        const sizeKey =
          typeof props.size === "string" && props.size in sizes
            ? (props.size as keyof typeof sizes)
            : "md";
        const config = sizes[sizeKey];
        return {
          root: {
            "--button-height": config.h,
            "--button-padding-x": config.px,
            "--button-fz": config.fz,
          },
        };
      },
      styles: {
        root: {
          letterSpacing: "-0.02em",
          fontWeight: 600,
        },
      },
    }),
    Card: Card.extend({
      // sub 카드 기본값 — Warm Ledger 큰 라운드(3xl=24).
      // hero 카드 (페이지 주인공) 는 사용처에서 p="xl" shadow="md" 명시로 위계 분리.
      defaultProps: {
        radius: "3xl",
        padding: "lg",
        shadow: "xs",
        withBorder: true,
      },
      styles: {
        root: {
          letterSpacing: "-0.02em",
          // 크림 배경(#faf6ef)과 카드(#fffdf9) 명도차가 작아 경계가 흐림 →
          // 웜톤 옅은 테두리로 네모 박스 구분 (배경색은 유지)
          borderColor: "var(--mantine-color-gray-2)",
        },
      },
    }),
    Container: Container.extend({
      defaultProps: {
        px: 0,
      },
    }),
    Title: Title.extend({
      defaultProps: {
        fw: 800,
      },
      styles: {
        root: {
          letterSpacing: "-0.02em",
        },
      },
    }),
    Text: Text.extend({
      defaultProps: {
        size: "md",
      },
      styles: {
        root: {
          letterSpacing: "-0.02em",
        },
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        variant: "filled",
        size: "md",
        radius: "lg",
      },
      vars: () => ({
        wrapper: {
          "--input-height": rem(44),
        },
      }),
      styles: {
        input: {
          letterSpacing: "-0.02em",
        },
      },
    }),
    PasswordInput: PasswordInput.extend({
      defaultProps: {
        variant: "filled",
        size: "md",
        radius: "lg",
      },
      vars: () => ({
        wrapper: {
          "--input-height": rem(44),
        },
        root: {},
      }),
      styles: {
        input: {
          letterSpacing: "-0.02em",
        },
      },
    }),
    NumberInput: NumberInput.extend({
      defaultProps: {
        variant: "filled",
        size: "md",
        radius: "lg",
        hideControls: true,
        thousandSeparator: ",",
      },
      vars: () => ({
        wrapper: {
          "--input-height": rem(44),
        },
        controls: {},
      }),
      styles: {
        input: {
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
        },
      },
    }),
    Select: Select.extend({
      defaultProps: {
        variant: "filled",
        size: "md",
        radius: "lg",
      },
      vars: () => ({
        wrapper: {
          "--input-height": rem(44),
        },
      }),
      styles: {
        input: {
          letterSpacing: "-0.02em",
        },
      },
    }),
    Textarea: Textarea.extend({
      defaultProps: {
        variant: "filled",
        size: "md",
        radius: "lg",
      },
      styles: {
        input: {
          letterSpacing: "-0.02em",
        },
      },
    }),
    DateInput: DateInput.extend({
      defaultProps: {
        variant: "filled",
        size: "md",
        radius: "lg",
        // 바텀시트(Drawer) 안에서 달력 popover 가 컨테이너에 잘리던 문제 →
        // 포털로 body 직속 렌더 + Drawer(zIndex 200) 위로 올림 (거래 추가/매매 폼 공통)
        popoverProps: { withinPortal: true, zIndex: 1100 },
      },
    }),
    Modal: Modal.extend({
      defaultProps: {
        centered: true,
        radius: "xl",
        padding: "lg",
      },
    }),
    Notification: Notification.extend({
      defaultProps: {
        radius: "lg",
        withBorder: false,
      },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        radius: "full",
        variant: "subtle",
      },
    }),
    Badge: Badge.extend({
      defaultProps: {
        radius: "full",
      },
      styles: {
        root: {
          letterSpacing: "-0.01em",
          fontWeight: 600,
        },
      },
    }),
  },
});
