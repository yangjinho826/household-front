import { redirect } from "next/navigation";

// 베타 단계에서 신규 회원가입 차단. /register 직접 진입 시 /login 으로.
// 재오픈 시 아래 코드 복원:
//   import RegisterSection from "_sections/auth/register-section";
//   export default function RegisterPage() { return <RegisterSection />; }
export default function RegisterPage({
  params,
}: {
  params: { locale: string };
}) {
  redirect(`/${params.locale}/login`);
}
