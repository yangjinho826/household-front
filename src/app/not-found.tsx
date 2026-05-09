import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="ko">
      <body className="min-h-screen flex items-center justify-center bg-toss-bg">
        <div className="text-center">
          <p className="text-2xl font-extrabold text-toss-text">404</p>
          <p className="mt-2 text-sm text-toss-text-sub">
            페이지를 찾을 수 없습니다.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-bold text-toss-blue"
          >
            처음으로
          </Link>
        </div>
      </body>
    </html>
  );
}
