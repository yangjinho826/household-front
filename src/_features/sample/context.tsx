"use client";

import { createContext, ReactNode, useContext } from "react";
import { useSample } from "./hooks/use-sample";

// 1. 타입을 먼저 정의 (ReturnType 뒤에 명확히 붙여줌)
type SampleContextType = ReturnType<typeof useSample>;

// 2. Context 객체 생성 (초기값 null)
// 여기서 에러가 난다면 타입을 <SampleContextType | null> 로 확실히 지정했는지 보세요.
const SampleContext = createContext<SampleContextType | null>(null);

// 3. Provider 컴포넌트
export const SampleProvider = ({ children }: { children: ReactNode }) => {
  const sampleData = useSample();

  return (
    // 'SampleContext' 뒤에 .Provider 가 붙어야 합니다.
    <SampleContext.Provider value={sampleData}>
      {children}
    </SampleContext.Provider>
  );
};

// 4. Hook 정의
export const useSampleContext = () => {
  const context = useContext(SampleContext);
  if (!context) {
    throw new Error("useSampleContext must be used within a SampleProvider");
  }
  return context;
};
