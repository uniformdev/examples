import React from "react";
import { setRequestLocale } from "next-intl/server";

import Composition from "@/components/composition";
import { getStaticParams } from "@/lib/uniform/utils";

export async function generateStaticParams() {
  return await getStaticParams();
}

type Props = {
  params: Promise<{ locale: string; path: Array<string> }>;
};

export default async function Home({ params }: Props) {
  const { locale, path } = await params;
  setRequestLocale(locale);
  return <Composition locale={locale} path={path.join("/")} />;
}

export const dynamic = "force-static";
