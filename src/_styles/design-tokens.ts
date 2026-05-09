export const C = {
  blue: "#3182F6",
  blueLight: "#E8F3FF",
  blueDark: "#1B64DA",

  red: "#F04452",
  redLight: "#FFE5E8",
  green: "#22C55E",
  purple: "#8B5CF6",
  purpleLight: "#F3F0FF",
  gold: "#F59E0B",

  bg: "#F2F4F6",
  card: "#FFFFFF",
  border: "#F2F4F6",
  borderStrong: "#E5E8EB",

  text: "#191F28",
  textSub: "#4E5968",
  textMuted: "#8B95A1",
} as const;

export type DesignColor = keyof typeof C;
