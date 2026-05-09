"use client";

import { useState, type ReactNode } from "react";
import { C } from "_styles/design-tokens";

type FloatingInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  right?: ReactNode;
  autoFocus?: boolean;
  maxLength?: number;
};

export function FloatingInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  right,
  autoFocus,
  maxLength,
}: FloatingInputProps) {
  const [focus, setFocus] = useState(false);
  return (
    <div
      className="rounded-2xl px-4 py-3 transition-all"
      style={{
        background: C.bg,
        outline: focus ? `2px solid ${C.blue}` : "none",
      }}
    >
      <p
        className="text-[10px] font-bold mb-0.5"
        style={{ color: focus ? C.blue : C.textMuted }}
      >
        {label}
      </p>
      <div className="flex items-center">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          placeholder={placeholder}
          autoFocus={autoFocus}
          maxLength={maxLength}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="flex-1 text-base font-bold outline-none bg-transparent"
          style={{ color: C.text }}
        />
        {right}
      </div>
    </div>
  );
}
