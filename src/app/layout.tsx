// app/[locale]/layout.tsx 가 실제 html/body 를 만든다 (next-intl 가이드 패턴).
// 이 root layout 은 not-found 와 함께 가기 위한 passthrough.
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
