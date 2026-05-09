"use client";

import { useState } from "react";

import { FloatingInput } from "_features/common/components/floating-input";
import { C } from "_styles/design-tokens";

import { useSampleContext } from "../context";

/**
 * SampleForm — 생성/수정 통합 바텀시트.
 *
 * `SampleFormModal` 이 `isFormOpen && <SampleForm key={editingSample?.id ?? "new"} />` 식으로
 * 조건부 마운트 하므로 마운트마다 useState 초기값이 editingSample 로 새로 잡힘.
 */
export function SampleForm() {
  const { closeForm, editingSample, createSample, updateSample } =
    useSampleContext();

  const [title, setTitle] = useState(editingSample?.title ?? "");
  const [description, setDescription] = useState(
    editingSample?.description ?? "",
  );

  const valid = title.trim().length > 0;

  const submit = () => {
    if (!valid) return;
    if (editingSample) {
      updateSample({ id: editingSample.id, title, description });
    } else {
      createSample({ title, description });
    }
    closeForm();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end z-50 fade-in"
      onClick={closeForm}
    >
      <div
        className="w-full max-w-md mx-auto bg-white rounded-t-3xl slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div
            className="w-10 h-1 rounded-full"
            style={{ background: C.borderStrong }}
          />
        </div>

        <div className="px-5 pb-6">
          <h2 className="text-base font-extrabold mb-1" style={{ color: C.text }}>
            {editingSample ? "샘플 수정" : "새 샘플"}
          </h2>
          <p className="text-xs font-medium mb-5" style={{ color: C.textMuted }}>
            제목과 설명을 입력해주세요
          </p>

          <div className="space-y-3">
            <FloatingInput
              label="제목"
              value={title}
              onChange={setTitle}
              placeholder="예: 표준 모듈"
              autoFocus
              maxLength={50}
            />
            <FloatingInput
              label="설명"
              value={description}
              onChange={setDescription}
              placeholder="설명을 입력해주세요"
              maxLength={200}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              type="button"
              onClick={closeForm}
              className="h-12 rounded-xl text-sm font-bold"
              style={{ background: C.bg, color: C.text }}
            >
              취소
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!valid}
              className="h-12 rounded-xl text-sm font-bold text-white"
              style={{ background: C.blue, opacity: valid ? 1 : 0.4 }}
            >
              {editingSample ? "수정" : "저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
