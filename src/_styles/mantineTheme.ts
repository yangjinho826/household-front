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
// 색상 시스템 — Tailwind 500 시리즈 (채도 일관)
// primary green #22C55E. 의미 색 = info(수입)/danger(지출)/warning(주의)/purple(투자).
// 기존 toss* 키는 alias 재정렬 — 사용처 22곳 자동 반영.
// ============================================================

// linerGreen — Tailwind green (primary, success)
const linerGreen: MantineColorsTuple = [
  "#F0FDF4",
  "#DCFCE7",
  "#BBF7D0",
  "#86EFAC",
  "#4ADE80",
  "#22C55E",
  "#16A34A",
  "#15803D",
  "#166534",
  "#14532D",
];

const success: MantineColorsTuple = linerGreen;

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

// 회색 9단계 — 페이지 bg / 텍스트 회색 톤. 토스 회색 유지.
const grayScale: MantineColorsTuple = [
  "#F2F4F6",
  "#E5E8EB",
  "#D1D6DB",
  "#B0B8C1",
  "#9DA3AE",
  "#8B95A1",
  "#6B7684",
  "#4E5968",
  "#333D4B",
  "#191F28",
];

export const mantineTheme = createTheme({
  // primary = info (blue) — 시그니처 파랑. linerGreen 은 success/적립 의미로만 유지.
  primaryColor: "info",
  primaryShade: { light: 5, dark: 4 },
  autoContrast: true,

  fontFamily:
    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  fontFamilyMonospace:
    '"SF Mono", Pretendard, ui-monospace, Menlo, monospace',
  defaultRadius: "xl",

  colors: {
    linerGreen,
    success,
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

  shadows: {
    xs: "0 1px 2px rgba(0, 0, 0, 0.02)",
    sm: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
    md: "0 4px 6px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.02)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.04), 0 4px 6px rgba(0, 0, 0, 0.02)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.04), 0 10px 10px rgba(0, 0, 0, 0.02)",
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
      defaultProps: {
        radius: "xl",
        padding: "xl",
        shadow: "md",
        withBorder: false,
      },
      styles: {
        root: {
          letterSpacing: "-0.02em",
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
