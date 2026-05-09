"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Eye, EyeOff, Home } from "lucide-react";

import { FloatingInput } from "_features/common/components/floating-input";
import { RuleCheck } from "_features/common/components/rule-check";
import { TopBar } from "_features/layout/components/top-bar";
import { useHouseholdStore } from "_features/household/store";
import { INITIAL_USER } from "_features/household/mock";
import { C } from "_styles/design-tokens";

const TITLES: Record<number, { t: string; s: string }> = {
  1: { t: "이메일을\n입력해주세요", s: "로그인할 때 사용할 이메일" },
  2: { t: "비밀번호를\n설정해주세요", s: "6자 이상, 영문 + 숫자 조합" },
  3: { t: "이름을\n알려주세요", s: "가계부에 표시될 이름" },
};

export function RegisterSection() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const setUser = useHouseholdStore((s) => s.setUser);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPw, setShowPw] = useState(false);

  const validMap: Record<number, boolean> = {
    1: email.includes("@") && email.includes("."),
    2: password.length >= 6,
    3: name.length >= 1,
  };
  const valid = validMap[step] ?? false;
  const title = TITLES[step];

  const onBack = () => {
    if (step > 1) setStep(step - 1);
    else router.push(`/${params.locale}/login`);
  };

  const onNext = () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setUser({ ...INITIAL_USER, email, name });
    router.push(`/${params.locale}`);
  };

  return (
    <div
      className="min-h-screen flex flex-col fade-in"
      style={{ background: C.card }}
    >
      <TopBar title="" onBack={onBack} />
      <div className="h-1 bg-gray-100">
        <div
          className="h-full transition-all"
          style={{ width: `${(step / 3) * 100}%`, background: C.blue }}
        />
      </div>

      <div className="flex-1 px-6 pt-12">
        <h1
          className="text-2xl font-extrabold leading-tight whitespace-pre-line"
          style={{ color: C.text }}
        >
          {title?.t}
        </h1>
        <p
          className="text-sm font-medium mt-2 mb-10"
          style={{ color: C.textMuted }}
        >
          {title?.s}
        </p>

        {step === 1 && (
          <FloatingInput
            label="이메일"
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="example@email.com"
            autoFocus
          />
        )}
        {step === 2 && (
          <>
            <FloatingInput
              label="비밀번호"
              value={password}
              onChange={setPassword}
              type={showPw ? "text" : "password"}
              placeholder="6자 이상"
              autoFocus
              right={
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="p-1"
                >
                  {showPw ? (
                    <EyeOff
                      className="w-4 h-4"
                      style={{ color: C.textMuted }}
                    />
                  ) : (
                    <Eye className="w-4 h-4" style={{ color: C.textMuted }} />
                  )}
                </button>
              }
            />
            <div className="mt-4 space-y-2">
              <RuleCheck ok={password.length >= 6} text="6자 이상" />
              <RuleCheck ok={/[a-zA-Z]/.test(password)} text="영문 포함" />
              <RuleCheck ok={/\d/.test(password)} text="숫자 포함" />
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <FloatingInput
              label="이름"
              value={name}
              onChange={setName}
              placeholder="진호"
              autoFocus
              maxLength={20}
            />
            <div
              className="rounded-2xl p-4 mt-6"
              style={{ background: C.bg }}
            >
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: C.textSub }}
              >
                가입 후 자동으로 만들어져요
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: C.blueLight }}
                >
                  <Home className="w-4 h-4" style={{ color: C.blue }} />
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: C.text }}
                >
                  {name || "내"} 가계부
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="px-6 pb-8 pt-4 bg-white">
        <button
          type="button"
          disabled={!valid}
          onClick={onNext}
          className="w-full h-14 rounded-2xl text-base font-bold text-white"
          style={{ background: C.blue, opacity: valid ? 1 : 0.4 }}
        >
          {step === 3 ? "가입 완료" : "다음"}
        </button>
      </div>
    </div>
  );
}
