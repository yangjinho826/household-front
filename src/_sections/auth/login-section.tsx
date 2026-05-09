"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { FloatingInput } from "_features/common/components/floating-input";
import { C } from "_styles/design-tokens";
import { useHouseholdStore } from "_features/household/store";
import { INITIAL_USER } from "_features/household/mock";

export function LoginSection() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const setUser = useHouseholdStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const valid = email.includes("@") && password.length >= 6;

  const onLogin = () => {
    setUser(INITIAL_USER);
    router.push(`/${params.locale}`);
  };

  return (
    <div
      className="min-h-screen flex flex-col fade-in"
      style={{ background: C.card }}
    >
      <div className="flex-1 px-6 pt-16">
        <div className="mb-12">
          <div
            className="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center"
            style={{ background: C.blue }}
          >
            <span className="text-white text-xl font-extrabold">₩</span>
          </div>
          <h1
            className="text-2xl font-extrabold leading-tight"
            style={{ color: C.text }}
          >
            안녕하세요!
            <br />
            가계부에 오신 걸 환영해요
          </h1>
          <p className="text-sm font-medium mt-2" style={{ color: C.textMuted }}>
            이메일로 시작하기
          </p>
        </div>

        <div className="space-y-3">
          <FloatingInput
            label="이메일"
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="example@email.com"
          />
          <FloatingInput
            label="비밀번호"
            value={password}
            onChange={setPassword}
            type={showPw ? "text" : "password"}
            placeholder="6자 이상"
            right={
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="p-1"
              >
                {showPw ? (
                  <EyeOff className="w-4 h-4" style={{ color: C.textMuted }} />
                ) : (
                  <Eye className="w-4 h-4" style={{ color: C.textMuted }} />
                )}
              </button>
            }
          />
        </div>

        <Link
          href={`/${params.locale}/forgot-password`}
          className="mt-3 inline-block text-xs font-semibold"
          style={{ color: C.textMuted }}
        >
          비밀번호를 잊어버리셨나요?
        </Link>
      </div>

      <div className="px-6 pb-8 pt-4 bg-white">
        <button
          type="button"
          disabled={!valid}
          onClick={onLogin}
          className="w-full h-14 rounded-2xl text-base font-bold text-white"
          style={{ background: C.blue, opacity: valid ? 1 : 0.4 }}
        >
          로그인
        </button>
        <div className="flex items-center justify-center gap-1 mt-4 text-xs">
          <span style={{ color: C.textMuted }}>처음 오셨어요?</span>
          <Link
            href={`/${params.locale}/register`}
            className="font-bold"
            style={{ color: C.blue }}
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
