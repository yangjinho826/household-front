"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LogOut, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmModal } from "_features/common/components/confirm-modal";
import { SettingsItem } from "_features/layout/components/settings-item";
import { useHouseholdContext } from "_features/household/context";
import { C } from "_styles/design-tokens";

/**
 * 설정 페이지 — 로그아웃 / 계정 삭제 (위험 영역).
 */
export function SettingsAccount() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const { setUser } = useHouseholdContext();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const onLogout = () => {
    setUser(null);
    router.replace(`/${params.locale}/login`);
  };

  return (
    <>
      <div className="px-4 pt-4">
        <div className="bg-white rounded-2xl p-2">
          <SettingsItem
            label="로그아웃"
            icon={LogOut}
            onClick={() => setConfirmLogout(true)}
          />
          <SettingsItem
            label="계정 삭제"
            icon={Trash2}
            danger
            onClick={() => toast("계정 삭제 (구현 예정)")}
          />
        </div>
      </div>

      {confirmLogout && (
        <ConfirmModal
          title="로그아웃할까요?"
          desc="다시 로그인해야 사용할 수 있어요"
          confirmLabel="로그아웃"
          confirmColor={C.text}
          onCancel={() => setConfirmLogout(false)}
          onConfirm={onLogout}
        />
      )}
    </>
  );
}
