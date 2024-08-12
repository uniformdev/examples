import React from "react";
import { unstable_setRequestLocale } from "next-intl/server";

import Composition from "@/components/composition";
import { getStaticParams } from "@/lib/uniform/utils";

export async function generateStaticParams() {
  return await getStaticParams();
}

type Props = {
  params: { locale: string; path: Array<string> };
};

export default function Home({ params: { locale, path } }: Props) {
  unstable_setRequestLocale(locale);
  return <Composition locale={locale} path={path.join("/")} />;
}

export const dynamic = "force-static";
