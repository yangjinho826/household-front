"use client";

import { FlaskConical } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { SettingsItem } from "_features/layout/components/settings-item";
import { C } from "_styles/design-tokens";

/**
 * 설정 페이지 — 개발자 섹션 (샘플 모듈 진입점).
 * 백엔드 연동 후 삭제 가능.
 */
export function SampleSettingsLink() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();

  return (
    <div className="px-4 pt-4">
      <p className="text-xs font-bold px-2 mb-2" style={{ color: C.textMuted }}>
        개발자
      </p>
      <div className="bg-white rounded-2xl p-2">
        <SettingsItem
          label="샘플 (표준 모듈)"
          icon={FlaskConical}
          onClick={() => router.push(`/${params.locale}/sample`)}
        />
      </div>
    </div>
  );
}
