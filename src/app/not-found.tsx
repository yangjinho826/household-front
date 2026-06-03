import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function NotFound() {
  const t = await getTranslations("app");

  return (
    <html lang="ko">
      <body className="min-h-screen flex items-center justify-center bg-toss-bg">
        <div className="text-center">
          <p className="text-2xl font-extrabold text-toss-text">404</p>
          <p className="mt-2 text-sm text-toss-text-sub">{t("not_found")}</p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-bold text-toss-blue"
          >
            {t("go_home")}
          </Link>
        </div>
      </body>
    </html>
  );
}
