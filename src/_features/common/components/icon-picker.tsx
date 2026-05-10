"use client";

import { SimpleGrid, Stack, Text, UnstyledButton } from "@mantine/core";

import DynamicIcon, {
  ICON_KEYS,
  type IconKey,
} from "./dynamic-icon";

interface IconPickerProps {
  value?: string | null;
  onChange?: (icon: IconKey) => void;
  label?: string;
}

export default function IconPicker({
  value,
  onChange,
  label,
}: IconPickerProps) {
  return (
    <Stack gap={6}>
      {label && (
        <Text size="sm" fw={500}>
          {label}
        </Text>
      )}
      <SimpleGrid cols={8} spacing={8}>
        {ICON_KEYS.map((key) => {
          const selected = value === key;
          return (
            <UnstyledButton
              key={key}
              onClick={() => onChange?.(key)}
              aria-label={key}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: selected
                  ? "var(--mantine-color-tossBlue-0)"
                  : "var(--mantine-color-gray-0)",
                border: selected
                  ? "2px solid var(--mantine-color-tossBlue-5)"
                  : "2px solid transparent",
              }}
            >
              <DynamicIcon
                name={key}
                size={18}
                stroke={2}
                color={
                  selected
                    ? "var(--mantine-color-tossBlue-5)"
                    : "var(--mantine-color-gray-7)"
                }
              />
            </UnstyledButton>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
