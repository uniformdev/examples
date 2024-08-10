import React from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export const Header = () => {
  const locale = useLocale();
  const t = useTranslations("Global");

  return (
    <>
      <Link href={`/${locale}`} className="self-start flex-1 text-blue-700">
        {t("homeLink")}
      </Link>
      <header className="navigation">
        <LocaleLink name="English" code="en" currentLocale={locale} />
        <LocaleLink name="Deutsch" code="de" currentLocale={locale} />
        <LocaleLink name="日本語" code="ja" currentLocale={locale} />
      </header>
    </>
  );
};

function LocaleLink({
  name,
  code,
  currentLocale,
}: {
  name: string;
  code: string;
  currentLocale: string;
}) {
  return (
    <Link className={currentLocale === code ? "active" : ""} href={`/${code}`}>
      {` ${name} `}
    </Link>
  );
}

export default Header;
