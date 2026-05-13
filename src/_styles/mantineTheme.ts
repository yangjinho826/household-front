import {
  Button,
  Card,
  Container,
  createTheme,
  type MantineColorsTuple,
  Modal,
  Notification,
  NumberInput,
  PasswordInput,
  Select,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";

const tossBlue: MantineColorsTuple = [
  "#E8F3FF",
  "#D0E4FF",
  "#A8CCFF",
  "#7AAEFF",
  "#5293FF",
  "#3182F6",
  "#2872DC",
  "#1B64DA",
  "#1450B4",
  "#0D3B8A",
];

const tossRed: MantineColorsTuple = [
  "#FFE5E8",
  "#FFCED3",
  "#FFA8B0",
  "#FF818C",
  "#F95B68",
  "#F04452",
  "#D8313F",
  "#B62330",
  "#931823",
  "#700F18",
];

const tossGreen: MantineColorsTuple = [
  "#E6F7EE",
  "#C3EBD5",
  "#9EDDB9",
  "#74CC9A",
  "#4ABE7E",
  "#22C55E",
  "#1AAA50",
  "#138B40",
  "#0D6F33",
  "#085226",
];

const tossPurple: MantineColorsTuple = [
  "#F3F0FF",
  "#E5DEFF",
  "#CABDFF",
  "#AC95FE",
  "#9676FB",
  "#8B5CF6",
  "#774AE3",
  "#6238C7",
  "#4D2BA3",
  "#3A1F7F",
];

// 토스 회색 — Mantine `gray.*` 를 토스 회색으로 override
// gray.0=#F2F4F6 (페이지 bg) / gray.5=#8B95A1 (textMuted) / gray.7=#4E5968 (textSub) / gray.9=#191F28 (text)
const tossGray: MantineColorsTuple = [
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
  primaryColor: "tossBlue",
  primaryShade: 5,
  colors: {
    tossBlue,
    tossRed,
    tossGreen,
    tossPurple,
    gray: tossGray,
  },
  fontFamily:
    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  fontFamilyMonospace:
    '"SF Mono", Pretendard, ui-monospace, Menlo, monospace',
  defaultRadius: "md",
  components: {
    Button: Button.extend({
      defaultProps: {
        size: "md",
        radius: "lg",
      },
    }),
    Card: Card.extend({
      defaultProps: {
        radius: "xl",
        padding: "lg",
        withBorder: false,
        shadow: "xs",
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
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        variant: "filled",
        size: "md",
        radius: "md",
      },
    }),
    PasswordInput: PasswordInput.extend({
      defaultProps: {
        variant: "filled",
        size: "md",
        radius: "md",
      },
    }),
    NumberInput: NumberInput.extend({
      defaultProps: {
        variant: "filled",
        size: "md",
        radius: "md",
        hideControls: true,
      },
    }),
    Select: Select.extend({
      defaultProps: {
        variant: "filled",
        size: "md",
        radius: "md",
      },
    }),
    Textarea: Textarea.extend({
      defaultProps: {
        variant: "filled",
        size: "md",
        radius: "md",
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
  },
});
