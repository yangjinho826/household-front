"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { C } from "_styles/design-tokens";

export type SelectOption = {
  label: string;
  value: string;
};

type FieldSelectProps = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

export function FieldSelect({ label, value, options, onChange }: FieldSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="bg-white rounded-2xl p-4">
      <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>
        {label}
      </p>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between"
      >
        <span className="text-sm font-semibold" style={{ color: C.text }}>
          {selected?.label ?? "선택"}
        </span>
        <ChevronDown
          className="w-4 h-4 transition-transform"
          style={{
            color: C.textMuted,
            transform: open ? "rotate(180deg)" : "none",
          }}
        />
      </button>
      {open && (
        <div
          className="mt-3 -mx-2 overflow-hidden rounded-xl"
          style={{ border: `1px solid ${C.border}` }}
        >
          {options.map((o) => (
            <button
              type="button"
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className="w-full px-3 py-2.5 text-left text-sm font-semibold hover:bg-gray-50 flex items-center justify-between"
              style={{ color: o.value === value ? C.blue : C.text }}
            >
              <span>{o.label}</span>
              {o.value === value && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FieldSelectCard({ label, value, options, onChange }: FieldSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="bg-white rounded-2xl p-4">
      <p className="text-xs font-bold mb-2" style={{ color: C.textSub }}>
        {label}
      </p>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between"
      >
        <span className="text-base font-bold" style={{ color: C.text }}>
          {selected?.label}
        </span>
        <ChevronDown
          className="w-4 h-4 transition-transform"
          style={{
            color: C.textMuted,
            transform: open ? "rotate(180deg)" : "none",
          }}
        />
      </button>
      {open && (
        <div
          className="mt-3 -mx-2 overflow-hidden rounded-xl border"
          style={{ borderColor: C.border }}
        >
          {options.map((o) => (
            <button
              type="button"
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className="w-full px-3 py-3 text-left text-sm font-bold hover:bg-gray-50 flex items-center justify-between"
              style={{ color: o.value === value ? C.blue : C.text }}
            >
              <span>{o.label}</span>
              {o.value === value && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
