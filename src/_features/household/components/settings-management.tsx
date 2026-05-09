"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAccountContext } from "_features/account/context";
import { useCategoryContext } from "_features/category/context";
import { useFixedContext } from "_features/fixed/context";
import { SettingsItem } from "_features/layout/components/settings-item";
import { C } from "_styles/design-tokens";

/**
 * 설정 페이지 — 데이터 관리 (카테고리/고정지출/통장).
 */
export function SettingsManagement() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const { categories } = useCategoryContext();
  const { fixed } = useFixedContext();
  const { accounts } = useAccountContext();

  return (
    <div className="px-4 pt-4">
      <p className="text-xs font-bold px-2 mb-2" style={{ color: C.textMuted }}>
        관리
      </p>
      <div className="bg-white rounded-2xl p-2">
        <SettingsItem
          label="카테고리 관리"
          value={`${categories.length}개`}
          onClick={() => toast("카테고리 관리 (구현 예정)")}
        />
        <SettingsItem
          label="고정지출 관리"
          value={`${fixed.length}개`}
          onClick={() => toast("고정지출 관리 (구현 예정)")}
        />
        <SettingsItem
          label="통장 관리"
          value={`${accounts.length}개`}
          onClick={() => router.push(`/${params.locale}/wealth`)}
        />
      </div>
    </div>
  );
}
