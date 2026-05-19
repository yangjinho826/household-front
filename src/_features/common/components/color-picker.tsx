"use client";

import { Group, Stack, Text, UnstyledButton } from "@mantine/core";

import { TOKEN } from "_styles/design-tokens";

const COLORS = [
  TOKEN.blue, // 토스 블루
  TOKEN.green, // 토스 그린
  TOKEN.red, // 토스 레드
  TOKEN.purple, // 토스 퍼플
  TOKEN.yellow, // 옐로우
  TOKEN.orange, // 오렌지
  "#FF6B6B", // 레드 라이트
  "#4ECDC4", // 민트
  "#FFE66D", // 옐로우 라이트
  "#95E1D3", // 그린 라이트
  "#0046FF", // 신한 블루
  "#8B95A1", // 그레이
];

interface ColorPickerProps {
  value?: string | null;
  onChange?: (color: string) => void;
  label?: string;
}

export default function ColorPicker({
  value,
  onChange,
  label,
}: ColorPickerProps) {
  return (
    <Stack gap={6}>
      {label && (
        <Text size="sm" fw={500}>
          {label}
        </Text>
      )}
      <Group gap={8}>
        {COLORS.map((c) => {
          const selected = value === c;
          return (
            <UnstyledButton
              key={c}
              onClick={() => onChange?.(c)}
              aria-label={c}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                background: c,
                border: selected
                  ? "2px solid var(--mantine-color-gray-9)"
                  : "2px solid transparent",
                outline: selected ? "2px solid white" : "none",
                outlineOffset: -4,
              }}
            />
          );
        })}
      </Group>
    </Stack>
  );
}
