"use client";

import { ConfirmModal } from "_features/common/components/confirm-modal";
import { Row } from "_features/common/components/row";
import { C } from "_styles/design-tokens";

import { useSampleContext } from "../context";

export function SampleDetail() {
  const {
    isDetailOpen,
    selectedSample,
    closeDetail,
    openEditForm,
    deleteSample,
    confirmDelete,
    setConfirmDelete,
  } = useSampleContext();

  if (!isDetailOpen || !selectedSample) return null;

  const handleDelete = () => {
    deleteSample(selectedSample.id);
    setConfirmDelete(false);
    closeDetail();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 flex items-end z-50 fade-in"
        onClick={closeDetail}
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
            <h2 className="text-base font-extrabold mb-4" style={{ color: C.text }}>
              {selectedSample.title}
            </h2>

            <div className="bg-white rounded-2xl space-y-3 mb-5">
              <Row label="설명" value={selectedSample.description || "-"} />
              <Row label="등록일" value={selectedSample.createdAt} />
              <Row label="ID" value={selectedSample.id} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => openEditForm(selectedSample)}
                className="h-12 rounded-xl text-sm font-bold"
                style={{ background: C.bg, color: C.text }}
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="h-12 rounded-xl text-sm font-bold text-white"
                style={{ background: C.red }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmModal
          title="샘플을 삭제할까요?"
          desc="삭제하면 복구할 수 없어요"
          onCancel={() => setConfirmDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
