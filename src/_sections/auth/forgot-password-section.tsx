"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mail } from "lucide-react";

import { FloatingInput } from "_features/common/components/floating-input";
import { TopBar } from "_features/layout/components/top-bar";
import { C } from "_styles/design-tokens";

export function ForgotPasswordSection() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const goBack = () => router.push(`/${params.locale}/login`);

  if (sent) {
    return (
      <div
        className="min-h-screen flex flex-col fade-in"
        style={{ background: C.card }}
      >
        <TopBar title="" onBack={goBack} />
        <div className="flex-1 px-6 pt-16">
          <div
            className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center"
            style={{ background: C.blueLight }}
          >
            <Mail className="w-7 h-7" style={{ color: C.blue }} />
          </div>
          <h1
            className="text-2xl font-extrabold leading-tight"
            style={{ color: C.text }}
          >
            메일을 확인해주세요
          </h1>
          <p className="text-sm font-medium mt-3" style={{ color: C.textSub }}>
            <span className="font-bold" style={{ color: C.text }}>
              {email}
            </span>
            으로
            <br />
            비밀번호 재설정 링크를 보냈어요
          </p>
          <p className="text-xs mt-6" style={{ color: C.textMuted }}>
            메일이 오지 않으면 스팸함도 확인해주세요
          </p>
        </div>
        <div className="px-6 pb-8">
          <button
            type="button"
            onClick={goBack}
            className="w-full h-14 rounded-2xl text-base font-bold text-white"
            style={{ background: C.blue }}
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col fade-in"
      style={{ background: C.card }}
    >
      <TopBar title="" onBack={goBack} />
      <div className="flex-1 px-6 pt-12">
        <h1
          className="text-2xl font-extrabold leading-tight"
          style={{ color: C.text }}
        >
          비밀번호를
          <br />
          잊어버리셨나요?
        </h1>
        <p
          className="text-sm font-medium mt-2 mb-10"
          style={{ color: C.textMuted }}
        >
          가입한 이메일로 재설정 링크를 보내드릴게요
        </p>
        <FloatingInput
          label="이메일"
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="example@email.com"
          autoFocus
        />
      </div>
      <div className="px-6 pb-8 pt-4 bg-white">
        <button
          type="button"
          disabled={!email.includes("@")}
          onClick={() => setSent(true)}
          className="w-full h-14 rounded-2xl text-base font-bold text-white"
          style={{
            background: C.blue,
            opacity: email.includes("@") ? 1 : 0.4,
          }}
        >
          재설정 링크 받기
        </button>
      </div>
    </div>
  );
}
