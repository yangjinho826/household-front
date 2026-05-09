"use client";

import { AlertCircle, Trash2 } from "lucide-react";
import { C } from "_styles/design-tokens";

type ConfirmModalProps = {
  title: string;
  desc: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  confirmColor?: string;
};

export function ConfirmModal({
  title,
  desc,
  onCancel,
  onConfirm,
  confirmLabel = "삭제",
  confirmColor = C.red,
}: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6 fade-in"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
          style={{ background: confirmColor === C.red ? C.redLight : C.bg }}
        >
          {confirmColor === C.red ? (
            <Trash2 className="w-6 h-6" style={{ color: C.red }} strokeWidth={2.2} />
          ) : (
            <AlertCircle
              className="w-6 h-6"
              style={{ color: C.text }}
              strokeWidth={2.2}
            />
          )}
        </div>
        <h3
          className="text-base font-bold text-center mb-1"
          style={{ color: C.text }}
        >
          {title}
        </h3>
        <p className="text-xs text-center mb-5" style={{ color: C.textMuted }}>
          {desc}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-xl text-sm font-bold"
            style={{ background: C.bg, color: C.text }}
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-12 rounded-xl text-sm font-bold text-white"
            style={{ background: confirmColor }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
