import { PropsWithChildren } from "react";
import { UniformContext } from "@uniformdev/canvas-next-rsc";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import "./globals.css";

export default function RootLayout({ children }: PropsWithChildren) {
  const locale = useLocale();
  const t = useTranslations("Global");

  return (
    <html lang={locale}>
      <body>
        <header className="flex gap-2 justify-end px-8 text-sm">
          <Link href={`/${locale}`} className="self-start flex-1 text-blue-700">
            {t("homeLink")}
          </Link>
          <Locale name="English" code="en" currentLocale={locale} />
          <Locale name="Deutsch" code="de" currentLocale={locale} />
          <Locale name="日本語" code="ja" currentLocale={locale} />
        </header>
        <main>
          <UniformContext>{children}</UniformContext>
        </main>
      </body>
    </html>
  );
}

function Locale({
  name,
  code,
  currentLocale,
}: {
  name: string;
  code: string;
  currentLocale: string;
}) {
  return <Link href={`/${code}`}> {name} </Link>;
}
