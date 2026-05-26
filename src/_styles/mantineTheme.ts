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
// Liner-based Design System
// Primary green `#265A3A` 기준. 가계부의 긍정적 흐름(수입/저축) =
// 브랜드 가치라 success 와 primary 팔레트 통합.
// 기존 toss* 색상 키는 새 톤으로 alias — 사용처 22곳 자동 적용.
// ============================================================

const linerGreen: MantineColorsTuple = [
  "#F0F6F2",
  "#D9EADF",
  "#B4D3C1",
  "#8ABAA1",
  "#62A080",
  "#265A3A",
  "#1E4A2F",
  "#173924",
  "#10291A",
  "#09180F",
];

const success: MantineColorsTuple = linerGreen;

const danger: MantineColorsTuple = [
  "#FFF5F5",
  "#FFE3E3",
  "#FFC9C9",
  "#FFA8A8",
  "#FF8787",
  "#FF6B6B",
  "#FA5252",
  "#E03131",
  "#C92A2A",
  "#B02020",
];

const warning: MantineColorsTuple = [
  "#FFF9DB",
  "#FFF3BF",
  "#FFEC99",
  "#FFE066",
  "#FFD43B",
  "#FCC419",
  "#FAB005",
  "#F59F00",
  "#E67700",
  "#D9480F",
];

const info: MantineColorsTuple = [
  "#E7F5FF",
  "#D0EBFF",
  "#A5D8FF",
  "#74C0FC",
  "#4DABF7",
  "#339AF0",
  "#228BE6",
  "#1971C2",
  "#1864AB",
  "#183153",
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

// 기존 toss* 색상 키는 새 톤으로 alias.
// c="tossBlue.5" 같은 사용처(22곳)가 자동으로 새 톤을 받는다.
const tossBlue: MantineColorsTuple = info;
const tossRed: MantineColorsTuple = danger;
const tossGreen: MantineColorsTuple = success;
// 통일성 — 새 시스템에 보라 없음. 캄 블루(info) 와 매핑해 톤 일관성 유지.
const tossPurple: MantineColorsTuple = info;

export const mantineTheme = createTheme({
  primaryColor: "linerGreen",
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
    tossBlue,
    tossRed,
    tossGreen,
    tossPurple,
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
      h1: { fontSize: rem(48), lineHeight: "1.2", fontWeight: "700" },
      h2: { fontSize: rem(36), lineHeight: "1.3", fontWeight: "700" },
      h3: { fontSize: rem(28), lineHeight: "1.35", fontWeight: "600" },
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
